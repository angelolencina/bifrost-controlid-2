import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BookingWebhookDto } from '../../dto/booking-webhook.dto';
import { parseBooking } from '../../utils/parse-booking.util';
import { DeskbeeService } from '../../deskbee/deskbee.service';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { BookingEntity } from '../../entities/booking.entity';
import { BookingParsedDto } from '../../dto/booking-parsed.dto';
import { RewardEntity } from './entities/reward.entity';
import { getStartOfDay } from '../../utils/get-start-of-the-day.util';
import { getEndOfDay } from '../../utils/get-end-of-the-day.util';
import { factoryReward } from './factory/reward.factory';
import * as moment from 'moment';
import { ApiIpremi } from './api/ipremi.api.config';

const EVENT_CHECK_IN = 'checkin';
const EVENT_BOOKING = 'booking';
const ACTION_CREATED = 'created';
const ACTION_UPDATED = 'updated';
const ACTION_DELETED = 'deleted';
//Types of awards
const BEFOREHAND_BOOKING = 'beforehand_booking';
const AWARD_WINNING = 'award_winning';
const BY_CHECK_IN = 'by_check_in';

@Injectable()
export class IpremiService {
  public logger = new Logger('IpremiService');
  constructor(
    private readonly deskbeeService: DeskbeeService,
    private readonly apiIpremi: ApiIpremi,
    @InjectRepository(BookingEntity)
    private bookingRepository: Repository<BookingEntity>,
    @InjectRepository(RewardEntity)
    private rewardRepository: Repository<RewardEntity>,
  ) {}
  @OnEvent('booking')
  async handleBooking(bookingWebhook: BookingWebhookDto) {
    this.logger.log(
      `Booking event: ${bookingWebhook.event} action: ${bookingWebhook}`,
    );
    const bookingParsed = parseBooking(bookingWebhook);
    await this.bookingRepository
      .upsert([bookingParsed.toSaveObject()], ['uuid', 'event', 'email'])
      .then(() => {
        this.logger.log(
          `${bookingParsed.event} : ${bookingParsed.uuid} action: ${bookingParsed.action} Saved!`,
        );
      });
    this.processBookingReward(bookingParsed);
  }

  @OnEvent('checkin')
  async handleCheckin(bookingWebhook: BookingWebhookDto) {
    const bookingParsed = parseBooking(bookingWebhook);
    await this.bookingRepository
      .upsert([bookingParsed.toSaveObject()], ['uuid', 'event', 'email'])
      .then(() => {
        this.logger.log(
          `${bookingParsed.event} : ${bookingParsed.uuid} action: ${bookingParsed.action} Saved!`,
        );
      });
    this.processCheckInReward(bookingParsed);
  }

  async processCheckInReward(webhookEvent: BookingParsedDto) {
    if (webhookEvent.event !== EVENT_CHECK_IN) {
      return;
    }
    const isRewardAwarded = await this.isCheckInExists(
      webhookEvent.uuid,
      webhookEvent.email,
    );
    this.logger.log(
      `process reward email: ${webhookEvent.email} was reward previous awarded?: ${isRewardAwarded}`,
    );
    if (!isRewardAwarded) {
      const reward = factoryReward(webhookEvent, BY_CHECK_IN);
      return this.rewardRepository
        .upsert([reward.toJson()], ['booking_uuid', 'event', 'action', 'email'])
        .then(() => {
          this.logger.log(`Reward to ${reward.email} saved!`);
        });
    }
  }

  async processBookingReward(webhookEvent: BookingParsedDto) {
    if (webhookEvent.event !== EVENT_BOOKING) {
      return;
    }
    const isNew = webhookEvent.action === ACTION_CREATED;
    const bookingSaved = await this.bookingRepository.findOne({where: {uuid: webhookEvent.uuid}});
    console.log(bookingSaved);
    const isBeforehand =
      !!isNew && moment().diff(moment(webhookEvent.start_date), 'days') >= 2;
    if (webhookEvent.action === ACTION_CREATED && isBeforehand) {
      this.logger.log(
        `process reward email: ${webhookEvent.email} by ${BEFOREHAND_BOOKING}`,
      );
      const reward = factoryReward(webhookEvent, BEFOREHAND_BOOKING);
      return this.rewardRepository
        .upsert([reward.toJson()], ['booking_uuid', 'event', 'action', 'email'])
        .then(() => {
          this.logger.log(`Reward to ${reward.email} saved!`);
        });
    }
    if (webhookEvent.action === ACTION_DELETED) {
      const existReward = await this.rewardRepository.findOne({
        where: {
          booking_uuid: webhookEvent.uuid,
          event: EVENT_BOOKING,
          awarded_points: MoreThan(0),
        },
      });
      if (existReward) {
        existReward.awarded_points = 0;
        existReward.reward_type = ACTION_DELETED;
        return this.rewardRepository.save(existReward);
      }
    }
  }

  async isCheckInExists(bookingUuid: string, email: string) {
    const startOfTheDay = getStartOfDay();
    const endOfTheDay = getEndOfDay();
    return this.bookingRepository
      .createQueryBuilder('bookings')
      .where(
        'uuid = :uuid and event = :event and email = :email and action = :action',
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
}
