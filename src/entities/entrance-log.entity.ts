import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('entranceLogs')
export class EntranceLogEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  id_device: number;

  @Column({ nullable: true })
  @Index({ unique: true })
  log_id: number;

  @Column()
  device_name: string;

  @Column({ nullable: true })
  reader: number;

  @Column({ nullable: true })
  id_area: number;

  @Column({ nullable: true })
  area: string;

  @Column({ nullable: true })
  event: string;

  @Column({ nullable: true })
  event_description: string;

  @CreateDateColumn()
  created_at: Date;
}
