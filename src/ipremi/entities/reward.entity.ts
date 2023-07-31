import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('rewards')
export class RewardEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  @Index({ unique: true })
  booking_uuid: string;

  @Column()
  state: string;

  @Column({ nullable: true })
  @Index()
  participant_id?: number;

  @Column({ nullable: true, type: 'uuid' })
  @Index()
  participant_token?: string;

  @Column({ nullable: true, type: 'datetime' })
  participant_token_valid_through_date?: string;

  @Column()
  action: string;

  @Column({ type: 'simple-json' })
  person: string;

  @Column()
  awarded_points: number;

  @Column({ type: 'simple-json' })
  place: string;

  @Column({ nullable: true })
  sync_date?: string;

  @UpdateDateColumn()
  updated_at: string;

  @CreateDateColumn()
  created_at: string;

  @DeleteDateColumn({ nullable: true })
  deleted_at?: string;
}
