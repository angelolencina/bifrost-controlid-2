import { Inject, Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BookingWebhookDto } from '../../dto/booking-webhook.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookingEntity } from '../../entities/booking.entity';
import { getStartOfDay } from '../../utils/get-start-of-the-day.util';
import { getEndOfDay } from '../../utils/get-end-of-the-day.util';
import { factoryReward } from './factory/reward.factory';

import { parseBookingReward } from './utils/parse-booking-reward.util';
import { BookingRewardDto } from './dto/booking-reward.dto';
import { RewardRepository } from './repositories/reward.repository';
import { IPREMI_CONFIG_OPTIONS } from './constants/ipremi-options.constant';
import { IpremiDto } from './dto/ipremi.dto';
import { DeskbeeService } from '../../deskbee/deskbee.service';

const EVENT_CHECK_IN = 'checkin';

//Types of awards
const BEFOREHAND_BOOKING = 'beforehand_booking';
const BY_CHECK_IN = 'by_check_in';

@Injectable()
export class IpremiService {
  public logger = new Logger('IpremiService');
  constructor(
    @Inject(IPREMI_CONFIG_OPTIONS)
    private options: IpremiDto,
    @InjectRepository(BookingEntity)
    private bookingRepository: Repository<BookingEntity>,
    private readonly deskbeeService: DeskbeeService,
    private readonly rewardRepo: RewardRepository,
  ) {}
  @OnEvent('booking')
  async handleBooking(bookingWebhook: BookingWebhookDto) {
    const {
      bankAccountId,
      profileId,
      limitToGroupsDeskbee,
      deskbeeGroupUuids,
      isActive,
    } = this.options || {};

    if (!bankAccountId || !profileId || !isActive) return;

    const { email } = bookingWebhook.included.person;
    const userGroups = await this.getUserGroups(email);
    bookingWebhook.included.person.groups = userGroups;

    const isLimitedToGroup =
      limitToGroupsDeskbee &&
      userGroups?.some((uuid: string) => deskbeeGroupUuids?.includes(uuid));

    this.logger.log(
      `Booking event: ${bookingWebhook.event} action: ${bookingWebhook.resource.action}`,
    );

    const bookingParsed = parseBookingReward(bookingWebhook);
    await this.upsertBooking(bookingParsed);

    if ((!limitToGroupsDeskbee || isLimitedToGroup) && isActive) {
      this.processBookingReward(bookingParsed);
    }
  }

  @OnEvent('checkin')
  async handleCheckin(bookingWebhook: BookingWebhookDto) {
    if (this.options?.bankAccountId && this.options?.profileId) {
      const bookingParsed = parseBookingReward(bookingWebhook);
      await this.bookingRepository
        .upsert([bookingParsed.toJson()], ['uuid', 'event', 'email'])
        .then(() => {
          this.logger.log(
            `${bookingParsed.event} : ${bookingParsed.uuid} action: ${bookingParsed.action} Saved!`,
          );
        });

      if (
        bookingParsed.action === EVENT_CHECK_IN &&
        bookingParsed.action === 'checkin'
      ) {
        this.processCheckInReward(bookingParsed);
      }
    }
  }

  async processCheckInReward(webhookEvent: BookingRewardDto) {
    const isRewardAwarded = await this.isCheckWasAwarded(
      webhookEvent.uuid,
      webhookEvent.email,
    );
    if (!isRewardAwarded) {
      this.logger.log(
        `process reward email: ${webhookEvent.email} by ${BY_CHECK_IN}`,
      );
      return this.rewardRepo.saveOrUpdate(
        factoryReward(webhookEvent, BY_CHECK_IN),
      );
    }
    this.logger.log(
      `process reward: checking booking ${webhookEvent.uuid} by ${webhookEvent.email}  doesn't follow the rules`,
    );
  }

  async processBookingReward(webhookEvent: BookingRewardDto) {
    if (webhookEvent.isNew() && webhookEvent.isBeforehand()) {
      this.logger.log(
        `process reward email: ${webhookEvent.email} by ${BEFOREHAND_BOOKING}`,
      );
      return this.rewardRepo.saveOrUpdate(
        factoryReward(webhookEvent, BEFOREHAND_BOOKING),
      );
    }
    if (webhookEvent.isDeleted()) {
      this.logger.log(
        `process reward email: ${webhookEvent.email} Remove point`,
      );
      return this.rewardRepo.removePoint(webhookEvent.uuid);
    }
    this.logger.log(
      `process reward: booking ${webhookEvent.uuid} by ${webhookEvent.email}  doesn't follow the rules`,
    );
  }

  async isCheckWasAwarded(bookingUuid: string, email: string) {
    const startOfTheDay = getStartOfDay();
    const endOfTheDay = getEndOfDay();
    return this.rewardRepo
      .createQueryBuilder('bookings')
      .where(
        'booking_uuid = :uuid and event = :event and email = :email and action = :action',
        {
          uuid: bookingUuid,
          event: EVENT_CHECK_IN,
          email: email,
          action: EVENT_CHECK_IN,
        },
      )
      .orWhere(
        'email = :email and created_at between :end AND :start and action = :action',
        {
          start: startOfTheDay,
          email: email,
          end: endOfTheDay,
          action: EVENT_CHECK_IN,
        },
      )
      .getExists();
  }

  getUserGroups(email: string) {
    return this.deskbeeService.getUserGroups(email);
  }

  async upsertBooking(bookingParsed: BookingRewardDto) {
    return this.bookingRepository
      .upsert([bookingParsed.toJson()], ['uuid', 'event', 'email'])
      .then(() => {
        this.logger.log(
          `${bookingParsed.event} : ${bookingParsed.uuid} action: ${bookingParsed.action} Saved!`,
        );
      });
  }
}
