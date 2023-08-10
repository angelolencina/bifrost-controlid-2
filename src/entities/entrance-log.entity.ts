import {
  Column,
  CreateDateColumn,
  Entity,
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

  @Column()
  device_name: string;

  @Column()
  reader: number;

  @Column()
  id_area: number;

  @Column()
  area: string;

  @Column()
  event: number;

  @CreateDateColumn()
  created_at: Date;
}
