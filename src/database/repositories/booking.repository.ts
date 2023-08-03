import { DataSource, Repository } from 'typeorm';
import { BookingEntity } from '../../entities/booking.entity';
import { formatDateToDatabase } from '../../utils/format-date.util';

export class BookingRepository extends Repository<BookingEntity> {}
