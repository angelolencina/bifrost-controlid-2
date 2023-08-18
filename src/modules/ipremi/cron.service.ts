import { Inject, Injectable, Logger } from '@nestjs/common';

import { RewardRepository } from './repositories/reward.repository';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { RewardEntity } from './entities/reward.entity';
import { ApiIpremi } from './api/ipremi.api.config';
import { IpremiDto } from './dto/ipremi.dto';
import { IPREMI_CONFIG_OPTIONS } from './constants/ipremi-options.constant';
import { sendDataFactory } from './factory/send-data.factory';
import { convertToDatabaseFormat } from './utils/convert-to-database-format.util';

@Injectable()
export class CronService {
  public logger = new Logger('ipremi-cron-service');
  constructor(
    @Inject(IPREMI_CONFIG_OPTIONS) private options: IpremiDto,
    private readonly rewardRepo: RewardRepository,
    private api: ApiIpremi,
  ) {}

  async getUsersToRegister() {
    return await this.rewardRepo.getRewardsToRegisterUsers();
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
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

        // this.rewardRepo.update(reward.id, {
        //   participant_id: participantData.ParticipantID,
        //   participant_token: participantData.ParticipantToken,
        //   participant_token_valid_through_date: convertToDatabaseFormat(
        //     participantData.ParticipantTokenValidThroughDate,
        //   ),
        // });
      } catch (error) {
        this.logger.error(error);
      }
    }
  }
}
