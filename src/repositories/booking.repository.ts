import { EntityRepository, Repository } from 'typeorm';
import { BookingEntity } from '../entities/booking.entity';
import { BookingParsedDto } from '../dtos/booking-parsed.dto';

@EntityRepository(BookingEntity)
export class BookingRepository extends Repository<BookingEntity> {
  saveBooking(booking: BookingParsedDto) {
    return this.save(booking.toJson());
  }
}
