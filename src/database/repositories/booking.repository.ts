import { DataSource, Repository } from 'typeorm';
import { BookingEntity } from '../../entities/booking.entity';
import { formatDateToDatabase } from '../../utils/format-date.util';

export class BookingRepository extends Repository<BookingEntity> {

  setSync(uuid: string) {
    return this.update(
      { uuid },
      { sync_date: formatDateToDatabase(new Date()) },
    );
  }
  persistBooking(booking: BookingEntity) {
    console.log('persinstiong booking', booking);
  }
}
