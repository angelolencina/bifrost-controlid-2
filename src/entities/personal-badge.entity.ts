import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('personal_badges')
export class PersonalBadgeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  code: string;

  @Column()
  @Index()
  email: string;

  @Column({ nullable: true })
  @Index()
  sync_date?: string;

  @CreateDateColumn()
  created_at: string;
}
