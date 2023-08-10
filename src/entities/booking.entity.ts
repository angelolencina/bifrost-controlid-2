import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Person } from '../dto/person.dto';
import { Place } from '../dto/place.dto';
import { Tolerance } from '../dto/tolerance.dto';

@Entity('bookings')
@Index(['uuid', 'event', 'email'], { unique: true })
export class BookingEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  uuid: string;

  @Column()
  event: string;

  @Column()
  start_date: Date;

  @Column()
  end_date: Date;

  @Column({ type: 'simple-json', nullable: true })
  tolerance?: Tolerance;

  @Column()
  state: string;

  @Column()
  action: string;

  @Column()
  email: string;

  @Column({ type: 'simple-json', nullable: true })
  person: Person;

  @Column({ nullable: true })
  external_id: string;

  @Column({ type: 'simple-json', nullable: true })
  place: Place;

  @Column({ nullable: true })
  sync_date?: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @DeleteDateColumn({ nullable: true })
  deleted_at?: Date;
}
