import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Person } from '../../../dto/person.dto';
import { Place } from '../../../dto/place.dto';
import { IpremiUserEntity } from './ipremi-user.entity';

@Entity('rewards')
@Index(['booking_uuid', 'event', 'action', 'email'], { unique: true })
export class RewardEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  booking_uuid: string;

  @Column()
  event: string;

  @Column()
  state: string;

  @Column()
  action: string;

  @ManyToOne(() => IpremiUserEntity, (user) => user.rewards, {
    cascade: true,
    nullable: true,
  })
  user: IpremiUserEntity;

  @Column()
  email: string;

  @Column({ type: 'simple-json' })
  person: Person;

  @Column()
  awarded_points: number;

  @Column()
  reward_type: string;

  @Column({ type: 'simple-json' })
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
