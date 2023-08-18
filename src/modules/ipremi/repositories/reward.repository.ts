import { IsNull, MoreThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { RewardEntity } from '../entities/reward.entity';
import { RewardDto } from '../../../dto/reward.dto';

const EVENT_BOOKING = 'booking';
const ACTION_DELETED = 'deleted';
@Injectable()
export class RewardRepository extends Repository<RewardEntity> {
  public logger = new Logger('RewardRepository');
  constructor(
    @InjectRepository(RewardEntity)
    private rewardRepo: Repository<RewardEntity>,
  ) {
    super(rewardRepo.target, rewardRepo.manager, rewardRepo.queryRunner);
  }

  saveOrUpdate(reward: RewardDto): Promise<any> {
    return this.rewardRepo.upsert(
      [reward.toJson()],
      ['booking_uuid', 'event', 'action', 'email'],
    );
  }

  async removePoint(booking_uuid: string): Promise<any> {
    const reward = await this.rewardRepo.findOne({
      where: {
        booking_uuid,
        event: EVENT_BOOKING,
        awarded_points: MoreThan(0),
      },
    });
    if (reward) {
      reward.awarded_points = 0;
      reward.reward_type = ACTION_DELETED;
      return this.rewardRepo.save(reward);
    }
  }

  getRewardsToRegisterUsers(): Promise<RewardEntity[]> {
    return this.rewardRepo
      .createQueryBuilder()
      .where('user_id IS NULL')
      .groupBy('email')
      .getMany();
  }
}
