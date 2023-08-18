import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RewardEntity } from './reward.entity';

@Entity('ipremi_users')
@Index(['email', 'user_uuid'], { unique: true })
export class IpremiUserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  user_uuid: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  @Index()
  participant_id?: number;

  @Column({ nullable: true, type: 'uuid' })
  @Index()
  participant_token?: string;

  @Column({ nullable: true, type: 'datetime' })
  participant_token_valid_through_date?: Date;

  @OneToMany(() => RewardEntity, (reward) => reward.user, { nullable: true })
  rewards: RewardEntity[];

  @UpdateDateColumn()
  updated_at: Date;

  @CreateDateColumn()
  created_at: Date;
}
