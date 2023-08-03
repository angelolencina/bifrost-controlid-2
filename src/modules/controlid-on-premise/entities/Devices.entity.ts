import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Devicerelays } from './Devicerelays.entity';

@Entity('devices', { schema: 'acesso' })
export class Devices {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column('varchar', { name: 'name', nullable: true, length: 50 })
  name: string | null;

  @Column('varchar', { name: 'host', nullable: true, length: 50 })
  host: string | null;

  @Column('int', { name: 'port' })
  port: number;

  @Column('boolean', { name: 'ssl' })
  ssl: boolean;

  @Column('varchar', { name: 'user', nullable: true, length: 50 })
  user: string | null;

  @Column('varchar', { name: 'password', nullable: true, length: 50 })
  password: string | null;

  @Column('int', { name: 'model' })
  model: number;

  @Column('boolean', { name: 'beep' })
  beep: boolean;

  @Column('varchar', { name: 'leds', nullable: true, length: 50 })
  leds: string | null;

  @Column('int', { name: 'gatewayMode' })
  gatewayMode: number;

  @Column('int', { name: 'operationMode' })
  operationMode: number;

  @Column('boolean', { name: 'antiPassback' })
  antiPassback: boolean;

  @Column('boolean', { name: 'dailyReset' })
  dailyReset: boolean;

  @Column('boolean', { name: 'vehicleControl' })
  vehicleControl: boolean;

  @Column('int', { name: 'bellRelay' })
  bellRelay: number;

  @Column('boolean', { name: 'urn' })
  urn: boolean;

  @Column('varchar', { name: 'serial', nullable: true, length: 20 })
  serial: string | null;

  @Column('varchar', { name: 'versao', nullable: true, length: 10 })
  versao: string | null;

  @Column('varchar', { name: 'camera', nullable: true, length: 50 })
  camera: string | null;

  @Column('varchar', { name: 'impressora', nullable: true, length: 50 })
  impressora: string | null;

  @Column('datetime', { name: 'lastDate', nullable: true })
  lastDate: Date | null;

  @Column('varchar', { name: 'status', nullable: true, length: 100 })
  status: string | null;

  @Column('boolean', { name: 'panicCard' })
  panicCard: boolean;

  @Column('datetime', { name: 'dateLastLog', nullable: true })
  dateLastLog: Date | null;

  @Column('datetime', { name: 'dateLastOnline', nullable: true })
  dateLastOnline: Date | null;

  @Column('boolean', { name: 'isCurrentlyOnline' })
  isCurrentlyOnline: boolean;

  @Column('boolean', { name: 'disableAntiPassback' })
  disableAntiPassback: boolean;

  @Column('boolean', { name: 'disableUsb' })
  disableUsb: boolean;

  @Column('boolean', { name: 'keepUserImages' })
  keepUserImages: boolean;

  @Column('int', { name: 'ResetCount' })
  resetCount: number;

  @Column('bigint', { name: 'parentDeviceId', nullable: true })
  parentDeviceId: string | null;

  @Column('bigint', { name: 'entryChildDeviceId', nullable: true })
  entryChildDeviceId: string | null;

  @Column('int', { name: 'maskDetectionEnabled', nullable: true })
  maskDetectionEnabled: number | null;

  @Column('bigint', { name: 'identificationDistance', nullable: true })
  identificationDistance: string | null;

  @Column('bigint', { name: 'ledIntensity', nullable: true })
  ledIntensity: string | null;

  @Column('int', { name: 'ledActivationThreshold', nullable: true })
  ledActivationThreshold: number | null;

  @Column('bigint', { name: 'sameFaceDetectionInterval', nullable: true })
  sameFaceDetectionInterval: string | null;

  @Column('boolean', { name: 'limitIdentificationArea', nullable: true })
  limitIdentificationArea: boolean | null;

  @Column('boolean', { name: 'strictLiveness', nullable: true })
  strictLiveness: boolean | null;

  @Column('boolean', { name: 'vehicleDetection', nullable: true })
  vehicleDetection: boolean | null;

  @Column('int', { name: 'rtspPort', nullable: true })
  rtspPort: number | null;

  @Column('varchar', { name: 'rtspUsername', nullable: true, length: 50 })
  rtspUsername: string | null;

  @Column('varchar', { name: 'rtspPassword', nullable: true, length: 50 })
  rtspPassword: string | null;

  @Column('int', { name: 'rtspCamera', nullable: true })
  rtspCamera: number | null;

  @Column('int', { name: 'onvifPort', nullable: true })
  onvifPort: number | null;

  @Column('int', { name: 'rtspVideoWidth', nullable: true })
  rtspVideoWidth: number | null;

  @Column('int', { name: 'rtspVideoHeight', nullable: true })
  rtspVideoHeight: number | null;

  @Column('varchar', { name: 'rtspCodec', nullable: true, length: 50 })
  rtspCodec: string | null;

  @Column('int', { name: 'inputMode' })
  inputMode: number;

  @Column('bigint', { name: 'idLastLogContingency' })
  idLastLogContingency: string;

  @Column('varchar', { name: 'language', nullable: true, length: 20 })
  language: string | null;

  @Column('int', { name: 'lastNsr', nullable: true })
  lastNsr: number | null;

  @Column('int', { name: 'operationModeVisitor' })
  operationModeVisitor: number;

  @Column('bigint', { name: 'idIdentificationMode', nullable: true })
  idIdentificationMode: string | null;

  @Column('int', { name: 'coluna1', nullable: true })
  coluna1: number | null;

  @OneToMany(() => Devicerelays, (devicerelays) => devicerelays.idDevice2)
  devicerelays: Devicerelays[];
}
