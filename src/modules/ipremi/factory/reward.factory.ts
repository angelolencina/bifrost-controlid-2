import { BookingParsedDto } from '../../../dto/booking-parsed.dto';
import { RewardDto } from '../../../dto/reward.dto';
import { BookingRewardDto } from '../dto/booking-reward.dto';

export const factoryReward = (
  bookingParsed: BookingRewardDto,
  rewardType: string,
): RewardDto => {
  return new RewardDto({
    booking_uuid: bookingParsed.uuid,
    event: bookingParsed.event,
    action: bookingParsed.action,
    reward_type: rewardType,
    email: bookingParsed.email,
    person: bookingParsed.person,
    place: bookingParsed.place,
    state: bookingParsed.state,
  });
};
