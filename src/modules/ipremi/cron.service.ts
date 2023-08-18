import { Inject, Injectable, Logger } from '@nestjs/common';

import { RewardRepository } from './repositories/reward.repository';
import { SchedulerRegistry } from '@nestjs/schedule';
import { RewardEntity } from './entities/reward.entity';
import { ApiIpremi } from './api/ipremi.api.config';
import { IpremiDto } from './dto/ipremi.dto';
import { IPREMI_CONFIG_OPTIONS } from './constants/ipremi-options.constant';
import { sendDataFactory } from './factory/send-data.factory';
import { convertToDatabaseFormat } from './utils/convert-to-database-format.util';
import { IpremiUserEntity } from './entities/ipremi-user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ParticipantDataDto } from './dto/participant-data.dto';
import { CronJob } from 'cron';

@Injectable()
export class CronService {
  public logger = new Logger('ipremi-cron-service');
  constructor(
    @Inject(IPREMI_CONFIG_OPTIONS)
    private options: IpremiDto,
    private readonly rewardRepo: RewardRepository,
    @InjectRepository(IpremiUserEntity)
    private userRepo: Repository<IpremiUserEntity>,
    private api: ApiIpremi,
    private schedulerRegistry: SchedulerRegistry,
  ) {
    this.init();
  }

  init() {
    if (this.options?.bankAccountId && this.options?.profileId) {
      this.logger.verbose('Ipremi Module Active!');
      this.addCronJob('registerUserIpremi', 30);
    }
  }

  addCronJob(name: string, minute: number) {
    const job = new CronJob(`0 */${minute} * * * *`, () => {
      this.registerUserIpremi();
      this.logger.warn(`time (${30}) minutes for job ${name} to run!`);
    });
    this.schedulerRegistry.addCronJob(name, job);
    job.start();
    this.logger.warn(`job ${name} added for each hour at ${minute} minutes!`);
  }

  async getUsersToRegister() {
    return await this.rewardRepo.getRewardsToRegisterUsers();
  }

  async registerUserIpremi() {
    const { enterpriseId, profileId } = this.options;
    const rewards: RewardEntity[] = await this.getUsersToRegister();
    this.logger.warn(`rewards to register: ${rewards.length}`);
    for (const reward of rewards) {
      try {
        const sendData = sendDataFactory({
          enterpriseId,
          profileId,
          person: reward.person,
        });
        const participantData = await this.api.sendParticipantData(
          sendData.toJson(),
        );

        const user = await this.userRepo.findOne({
          where: {
            email: reward.email,
          },
        });
        if (user) {
          reward.user = user;
          await this.rewardRepo.save(reward);
        }
        if (!user) {
          const user = await this.userRepo.save(
            this.userRepo.create({
              participant_id: participantData.ParticipantID,
              participant_token: participantData.ParticipantToken,
              participant_token_valid_through_date: convertToDatabaseFormat(
                participantData.ParticipantTokenValidThroughDate,
              ),
              email: reward.email,
              user_uuid: reward.person.uuid,
            }),
          );
          reward.user = user;
          await this.rewardRepo.save(reward);
        }
      } catch (error) {
        this.logger.error(error);
      }
    }
  }

  async processRewards(
    rewards: RewardEntity[],
    enterpriseId: number,
    profileId: number,
  ) {
    for (const reward of rewards) {
      try {
        await this.processReward(reward, enterpriseId, profileId);
      } catch (error) {
        this.logger.error(error);
      }
    }
  }

  async processReward(
    reward: RewardEntity,
    enterpriseId: number,
    profileId: number,
  ) {
    const sendData = sendDataFactory({
      enterpriseId,
      profileId,
      person: reward.person,
    });
    const participantData = await this.api.sendParticipantData(
      sendData.toJson(),
    );

    const user = await this.findOrCreateUser(reward, participantData);
    reward.user = user;
    await this.rewardRepo.save(reward);
  }

  async findOrCreateUser(
    reward: RewardEntity,
    participantData: ParticipantDataDto,
  ) {
    let user = await this.userRepo.findOne({ where: { email: reward.email } });

    if (!user) {
      user = await this.userRepo.create({
        participant_id: participantData.ParticipantID,
        participant_token: participantData.ParticipantToken,
        participant_token_valid_through_date: convertToDatabaseFormat(
          participantData.ParticipantTokenValidThroughDate,
        ),
        email: reward.email,
        user_uuid: reward.person.uuid,
      });
      await this.userRepo.save(user);
    }

    return user;
  }
}
