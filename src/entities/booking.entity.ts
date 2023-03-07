import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('booking')
export class BookingEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({})
  @Index({ unique: true })
  uuid: string;

  @Column()
  start_date: string;

  @Column()
  end_date: string;

  @Column({ nullable: true })
  tolerance?: string;

  @Column()
  state: string;

  @Column()
  action: string;

  @Column()
  person: string;

  @Column()
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
