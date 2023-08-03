import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index(
  'idx_logs_idUser_idArea_event_time',
  ['idUser', 'idArea', 'event', 'time'],
  {},
)
@Index('idx_logs_idDevice_event', ['idDevice', 'event'], {})
@Index('idx_logs_time', ['time'], {})
@Index(
  'idx_logs_idUser_idDevice_idArea_time',
  ['idUser', 'idDevice', 'idArea', 'time'],
  {},
)
@Entity('logs', { schema: 'acesso' })
export class Logs {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column('bigint', { name: 'idDevice' })
  idDevice: string;

  @Column('varchar', { name: 'deviceName', nullable: true, length: 50 })
  deviceName: string | null;

  @Column('bigint', { name: 'idLogDevice' })
  idLogDevice: string;

  @Column('bigint', { name: 'ResetCount' })
  resetCount: string;

  @Column('datetime', { name: 'timeInicioAutorizacao' })
  timeInicioAutorizacao: Date;

  @Column('datetime', { name: 'time' })
  time: Date;

  @Column('int', { name: 'event' })
  event: number;

  @Column('bigint', { name: 'idArea' })
  idArea: string;

  @Column('varchar', { name: 'area', nullable: true, length: 50 })
  area: string | null;

  @Column('boolean', { name: 'isVehicle', nullable: true })
  isVehicle: boolean | null;

  @Column('bigint', { name: 'idParking', nullable: true })
  idParking: string | null;

  @Column('bigint', { name: 'idAccessRule' })
  idAccessRule: string;

  @Column('int', { name: 'idCause' })
  idCause: number;

  @Column('int', { name: 'idAttEvent', nullable: true })
  idAttEvent: number | null;

  @Column('int', { name: 'reader' })
  reader: number;

  @Column('int', { name: 'Quality' })
  quality: number;

  @Column('int', { name: 'CalcVar', nullable: true })
  calcVar: number | null;

  @Column('int', { name: 'Score' })
  score: number;

  @Column('int', { name: 'Score2' })
  score2: number;

  @Column('int', { name: 'confidence', nullable: true })
  confidence: number | null;

  @Column('int', { name: 'CPU', nullable: true })
  cpu: number | null;

  @Column('int', { name: 'TotalTime' })
  totalTime: number;

  @Column('int', { name: 'identificationTime', nullable: true })
  identificationTime: number | null;

  @Column('int', { name: 'identificationCount', nullable: true })
  identificationCount: number | null;

  @Column('bigint', { name: 'idUser' })
  idUser: string;

  @Column('varchar', { name: 'userName', nullable: true, length: 200 })
  userName: string | null;

  @Column('varchar', { name: 'visitedCompany', nullable: true, length: 200 })
  visitedCompany: string | null;

  @Column('bigint', { name: 'idVehicle', nullable: true })
  idVehicle: string | null;

  @Column('varchar', { name: 'vehicPlate', nullable: true, length: 50 })
  vehicPlate: string | null;

  @Column('varchar', { name: 'info', nullable: true, length: 500 })
  info: string | null;

  @Column('varchar', { name: 'accessInfo', nullable: true, length: 4000 })
  accessInfo: string | null;

  @Column('int', { name: 'loadByDeviceIdTime', nullable: true })
  loadByDeviceIdTime: number | null;

  @Column('int', { name: 'deleteCardsTime', nullable: true })
  deleteCardsTime: number | null;

  @Column('int', { name: 'loadUserTime', nullable: true })
  loadUserTime: number | null;

  @Column('int', { name: 'verifyPasswordTime', nullable: true })
  verifyPasswordTime: number | null;

  @Column('int', { name: 'selectLogTime', nullable: true })
  selectLogTime: number | null;

  @Column('int', { name: 'canAccessTime', nullable: true })
  canAccessTime: number | null;

  @Column('int', { name: 'canAccess2Time', nullable: true })
  canAccess2Time: number | null;

  @Column('int', { name: 'loadAreasTime', nullable: true })
  loadAreasTime: number | null;

  @Column('int', { name: 'adeDisableTime', nullable: true })
  adeDisableTime: number | null;

  @Column('int', { name: 'loadPhotoTime', nullable: true })
  loadPhotoTime: number | null;

  @Column('int', { name: 'matchByImageTime', nullable: true })
  matchByImageTime: number | null;

  @Column('int', { name: 'selectGroupAccessRulesTime', nullable: true })
  selectGroupAccessRulesTime: number | null;

  @Column('int', { name: 'selectTypeAccessRulesTime', nullable: true })
  selectTypeAccessRulesTime: number | null;

  @Column('int', { name: 'selectUserAccessRulesTime', nullable: true })
  selectUserAccessRulesTime: number | null;

  @Column('varchar', { name: 'identificationName', nullable: true, length: 50 })
  identificationName: string | null;

  @Column('bigint', { name: 'idLogTypeAtDevice', nullable: true })
  idLogTypeAtDevice: string | null;

  @Column('bigint', { name: 'idCreditType', nullable: true })
  idCreditType: string | null;

  @Column('int', { name: 'creditSubtractTime', nullable: true })
  creditSubtractTime: number | null;

  @Column('int', { name: 'creditAnalysisTime', nullable: true })
  creditAnalysisTime: number | null;

  @Column('int', { name: 'creditLogsTime', nullable: true })
  creditLogsTime: number | null;

  @Column('int', { name: 'creditBalanceTime', nullable: true })
  creditBalanceTime: number | null;

  @Column('bigint', { name: 'idOperator', nullable: true })
  idOperator: string | null;

  @Column('varchar', { name: 'authOperator', nullable: true, length: 50 })
  authOperator: string | null;

  @Column('datetime', { name: 'DtLockedByRandomInspect', nullable: true })
  dtLockedByRandomInspect: Date | null;

  @Column('datetime', { name: 'DtRandomInspectDone', nullable: true })
  dtRandomInspectDone: Date | null;

  @Column('int', { name: 'functionDetail', nullable: true })
  functionDetail: number | null;

  @Column('bigint', { name: 'visitedIdGroup', nullable: true })
  visitedIdGroup: string | null;

  @Column('varchar', { name: 'visitedGroupName', nullable: true, length: 200 })
  visitedGroupName: string | null;

  @Column('bigint', { name: 'visitedIdUser', nullable: true })
  visitedIdUser: string | null;

  @Column('varchar', { name: 'visitedUserName', nullable: true, length: 100 })
  visitedUserName: string | null;

  @Column('int', { name: 'coluna1', nullable: true })
  coluna1: number | null;

  @Column('int', { name: 'coluna2', nullable: true })
  coluna2: number | null;

  @Column('int', { name: 'innovatricsExtractTime', nullable: true })
  innovatricsExtractTime: number | null;

  @Column('int', { name: 'innovatricsFindTime', nullable: true })
  innovatricsFindTime: number | null;

  @Column('int', { name: 'relay', nullable: true })
  relay: number | null;

  @Column('bigint', { name: 'idUserEscort', nullable: true })
  idUserEscort: string | null;

  @Column('bigint', { name: 'receivedCardNumber', nullable: true })
  receivedCardNumber: string | null;

  @Column('bigint', { name: 'CardNumberConvertedByConfig', nullable: true })
  cardNumberConvertedByConfig: string | null;
}
