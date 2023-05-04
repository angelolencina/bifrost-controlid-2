// import { Inject, Logger } from '@nestjs/common';
// import { OnEvent } from '@nestjs/event-emitter';
// import { SchedulerRegistry } from '@nestjs/schedule';
// import { InjectRepository } from '@nestjs/typeorm';
// import { CronJob } from 'cron';
// import { BookingWebhookDto } from '../dtos/booking-webhook.dto';
// import IntegrationInterface from '../interfaces/integration.interface';
// import { ApiDeskbee } from '../apis/deskbee.api';
// import { IsNull, LessThan, Repository } from 'typeorm';
// import { parseBooking } from '../utils/parse-booking.util';
// import { BookingParsedDto } from '../dtos/booking-parsed.dto';
// import { MYSQL_CONTROLID_CONNECTION } from '../database/db.constants';
// import { ApiOmni } from '../apis/omni.api';
// import { BookingEntity } from '../entities/booking.entity';
// import { AppService } from '../app.service';
// import { EntranceDto } from '../dtos/entrance.dto';
// import { formatDateToDatabase } from '../utils/format-date.util';
// import { setDateToLocal } from '../utils/set-date-to-local.util';
// import { isToday } from '../utils/is-today.util';
// import { addDaysTodate } from '../utils/add-days-to-date';
// import OmniRepositoryInterface from '../interfaces/omni-repository.interface';

// export class OmniPlugin implements IntegrationInterface {
//   public logger = new Logger('omniPlugin');
//   public jobAccessControl: any;
//   public jobAutomatedCheckIn: any;
//   public jobGenerateQrCode: any;
//   public accessControl: boolean = process.env.ACCESS_CONTROL === 'true';
//   public automatedCheckIn: boolean = process.env.AUTOMATED_CHECKIN === 'true';
//   public generateUserQrCode: boolean =
//     process.env.GENERATE_USER_QRCODE === 'true';
//   constructor(
//     @InjectRepository(BookingEntity)
//     private bookingRepository: Repository<BookingEntity>,
//     private readonly appService: AppService,
//     private schedulerRegistry: SchedulerRegistry,
//     @Inject(MYSQL_CONTROLID_CONNECTION)
//     private readonly mysqlConnection: any,
//     private readonly omniRepository: OmniRepositoryInterface,
//     private apiDeskbee: ApiDeskbee,
//     private readonly apiOmni: ApiOmni,
//   ) {
//     if (this.accessControl) {
//       this.addCronJob('accessControl', '0');
//     }
//     if (this.automatedCheckIn) {
//       this.addCronJob('automatedCheckIn', '*/30');
//     }
//     if (this.generateUserQrCode) {
//       this.addCronJob('generateUserQrCode', '*/30');
//     }
//   }

//   @OnEvent('booking')
//   async handleBooking(bookingWebhook: BookingWebhookDto) {
//     if (this.accessControl) {
//       this.logger.log(
//         `Booking : ${bookingWebhook.resource.uuid} - ${bookingWebhook.included.status.name} - ${bookingWebhook.included.person.email}`,
//       );
//       const booking = await this.apiDeskbee.getBookingByUuid(
//         bookingWebhook.resource.uuid,
//       );
//       if (booking) {
//         this.handleAccessControl(parseBooking(booking, bookingWebhook));
//       }
//     }
//   }

//   async handleAccessControl(booking: BookingParsedDto) {
//     if (booking.state === 'deleted' || booking.state === 'fall') {
//       const _bookingSaved = await this.bookingRepository.findOne({
//         where: { uuid: booking.uuid },
//       });
//       if (_bookingSaved) {
//         await this.removeReserveFromOmni(
//           _bookingSaved.place.uuid,
//           _bookingSaved.external_id,
//         );
//       }

//       booking.setSync(new Date());
//     } else if (isToday(new Date(booking.start_date))) {
//       await this.controlidRepository.unblockUserAccessPerLimitDate(booking);
//       booking.setSync(new Date());
//     }
//     this.bookingRepository.upsert([booking.toJson()], ['uuid']).then(() => {
//       this.logger.log(`Booking : ${booking.uuid} Saved!`);
//     });
//     this.apiControlid.syncAll();
//   }

//   async removeReserveFromOmni(placeUuid: string, externalId: number) {}

//   addCronJob(name: string, seconds: string) {
//     if (name === 'automatedCheckIn') {
//       const job = new CronJob(`${seconds} * * * * *`, () => {
//         this.automateCheckIn();
//         this.logger.warn(`time (${seconds}) for job ${name} to run!`);
//       });
//       this.schedulerRegistry.addCronJob(name, job);
//       job.start();
//       this.logger.warn(
//         `job ${name} added for each minute at ${seconds} seconds!`,
//       );
//     }

//     if (name === 'generateUserQrCode') {
//       const job = new CronJob(`${seconds} * * * * *`, () => {
//         this.logger.warn(`time (${seconds}) for job ${name} to run!`);
//       });
//       this.schedulerRegistry.addCronJob(name, job);
//       job.start();
//       this.logger.warn(
//         `job ${name} added for each minute at ${seconds} seconds!`,
//       );
//     }
//   }
// }
