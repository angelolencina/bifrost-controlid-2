import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Devices } from './Devices.entity';

@Index('fkRelays', ['idDevice'], {})
@Entity('devicerelays', { schema: 'acesso' })
export class Devicerelays {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column('bigint', { name: 'idDevice' })
  idDevice: string;

  @Column('int', { name: 'reader' })
  reader: number;

  @Column('int', { name: 'relay' })
  relay: number;

  @Column('int', { name: 'timeout' })
  timeout: number;

  @Column('bigint', { name: 'idAreaFrom' })
  idAreaFrom: string;

  @Column('bigint', { name: 'idAreaTo' })
  idAreaTo: string;

  @Column('int', { name: 'vehicleInOut' })
  vehicleInOut: number;

  @Column('bigint', { name: 'idParking', nullable: true })
  idParking: string | null;

  @Column('bit', { name: 'urn' })
  urn: boolean;

  @Column('varchar', { name: 'interlocks', nullable: true, length: 50 })
  interlocks: string | null;

  @Column('varchar', { name: 'doorSensor', nullable: true, length: 50 })
  doorSensor: string | null;

  @Column('varchar', { name: 'doorSensorNo', nullable: true, length: 50 })
  doorSensorNo: string | null;

  @Column('varchar', { name: 'buttonHole', nullable: true, length: 50 })
  buttonHole: string | null;

  @Column('varchar', { name: 'buttonHoleNo', nullable: true, length: 50 })
  buttonHoleNo: string | null;

  @Column('bit', { name: 'allowVisitorMainReader' })
  allowVisitorMainReader: boolean;

  @Column('bit', { name: 'unbindCardMainReader' })
  unbindCardMainReader: boolean;

  @ManyToOne(() => Devices, (devices) => devices.devicerelays, {
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'idDevice', referencedColumnName: 'id' }])
  idDevice2: Devices;
}
