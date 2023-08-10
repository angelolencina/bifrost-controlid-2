import { Repository } from 'typeorm';
import { BookingEntity } from '../../entities/booking.entity';

export class BookingRepository extends Repository<BookingEntity> {}
