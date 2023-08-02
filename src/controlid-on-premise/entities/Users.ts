import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Usergroups } from './Usergroups';
import { Templates } from './Templates';
import { Useridentificationrules } from './Useridentificationrules';
import { Cards } from './Cards';

@Index('idx_users_idType', ['idType'], {})
@Index('idx_users_contingency', ['contingency'], {})
@Index('idx_users_idArea', ['idArea'], {})
@Entity('users', { schema: 'acesso' })
export class Users {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column('varchar', { name: 'name', nullable: true, length: 100 })
  name: string | null;

  @Column('varchar', { name: 'registration', nullable: true, length: 50 })
  registration: string | null;

  @Column('bigint', { name: 'pis' })
  pis: string;

  @Column('bigint', { name: 'senha' })
  senha: string;

  @Column('varchar', { name: 'barras', nullable: true, length: 50 })
  barras: string | null;

  @Column('varchar', { name: 'cpf', nullable: true, length: 50 })
  cpf: string | null;

  @Column('varchar', { name: 'rg', nullable: true, length: 50 })
  rg: string | null;

  @Column('varchar', { name: 'phone', nullable: true, length: 50 })
  phone: string | null;

  @Column('varchar', { name: 'email', nullable: true, length: 100 })
  email: string | null;

  @Column('varchar', { name: 'emailAcesso', nullable: true, length: 2000 })
  emailAcesso: string | null;

  @Column('varchar', { name: 'hash', nullable: true, length: 100 })
  hash: string | null;

  @Column('varchar', { name: 'salt', nullable: true, length: 50 })
  salt: string | null;

  @Column('bit', { name: 'admin' })
  admin: boolean;

  @Column('bit', { name: 'inativo' })
  inativo: boolean;

  @Column('bit', { name: 'contingency' })
  contingency: boolean;

  @Column('bit', { name: 'deleted' })
  deleted: boolean;

  @Column('bigint', { name: 'idDevice', nullable: true })
  idDevice: string | null;

  @Column('bigint', { name: 'photoTimestamp', nullable: true })
  photoTimestamp: string | null;

  @Column('int', { name: 'photoIdFaceState', nullable: true })
  photoIdFaceState: number | null;

  @Column('bit', { name: 'photoDeleted', nullable: true })
  photoDeleted: boolean | null;

  @Column('bit', { name: 'canUseFacial' })
  canUseFacial: boolean;

  @Column('varchar', { name: 'endereco', nullable: true, length: 50 })
  endereco: string | null;

  @Column('varchar', { name: 'bairro', nullable: true, length: 50 })
  bairro: string | null;

  @Column('varchar', { name: 'cidade', nullable: true, length: 50 })
  cidade: string | null;

  @Column('varchar', { name: 'cep', nullable: true, length: 50 })
  cep: string | null;

  @Column('varchar', { name: 'cargo', nullable: true, length: 50 })
  cargo: string | null;

  @Column('datetime', { name: 'admissao', nullable: true })
  admissao: Date | null;

  @Column('varchar', { name: 'telefone', nullable: true, length: 50 })
  telefone: string | null;

  @Column('varchar', { name: 'ramal', nullable: true, length: 50 })
  ramal: string | null;

  @Column('varchar', { name: 'pai', nullable: true, length: 50 })
  pai: string | null;

  @Column('varchar', { name: 'mae', nullable: true, length: 50 })
  mae: string | null;

  @Column('datetime', { name: 'nascimento', nullable: true })
  nascimento: Date | null;

  @Column('varchar', { name: 'sexo', nullable: true, length: 50 })
  sexo: string | null;

  @Column('varchar', { name: 'estadoCivil', nullable: true, length: 50 })
  estadoCivil: string | null;

  @Column('varchar', { name: 'nacionalidade', nullable: true, length: 50 })
  nacionalidade: string | null;

  @Column('varchar', { name: 'naturalidade', nullable: true, length: 50 })
  naturalidade: string | null;

  @Column('bigint', { name: 'idResponsavel', nullable: true })
  idResponsavel: string | null;

  @Column('varchar', { name: 'responsavelNome', nullable: true, length: 100 })
  responsavelNome: string | null;

  @Column('varchar', { name: 'veiculo_marca', nullable: true, length: 50 })
  veiculoMarca: string | null;

  @Column('varchar', { name: 'veiculo_modelo', nullable: true, length: 50 })
  veiculoModelo: string | null;

  @Column('varchar', { name: 'veiculo_cor', nullable: true, length: 50 })
  veiculoCor: string | null;

  @Column('varchar', { name: 'veiculo_placa', nullable: true, length: 50 })
  veiculoPlaca: string | null;

  @Column('int', { name: 'idType' })
  idType: number;

  @Column('datetime', { name: 'dateLimit', nullable: true })
  dateLimit: Date | null;

  @Column('bit', { name: 'expireOnDateLimit' })
  expireOnDateLimit: boolean;

  @Column('varchar', { name: 'visitorCompany', nullable: true, length: 100 })
  visitorCompany: string | null;

  @Column('bit', { name: 'blackList' })
  blackList: boolean;

  @Column('datetime', { name: 'dateStartLimit', nullable: true })
  dateStartLimit: Date | null;

  @Column('bigint', { name: 'pisAnterior', nullable: true })
  pisAnterior: string | null;

  @Column('varchar', { name: 'comments', nullable: true, length: 500 })
  comments: string | null;

  @Column('bit', { name: 'allowParkingSpotCompany', nullable: true })
  allowParkingSpotCompany: boolean | null;

  @Column('bigint', { name: 'idArea' })
  idArea: string;

  @Column('datetime', { name: 'dataLastLog', nullable: true })
  dataLastLog: Date | null;

  @Column('datetime', { name: 'timeOfRegistration', nullable: true })
  timeOfRegistration: Date | null;

  @Column('varchar', { name: 'objectGuid', nullable: true, length: 50 })
  objectGuid: string | null;

  @OneToMany(() => Usergroups, (usergroups) => usergroups.idUser2)
  usergroups: Usergroups[];

  @OneToMany(() => Templates, (templates) => templates.idUser2)
  templates: Templates[];

  @OneToMany(
    () => Useridentificationrules,
    (useridentificationrules) => useridentificationrules.idUser2,
  )
  useridentificationrules: Useridentificationrules[];

  @OneToMany(() => Cards, (cards) => cards.idUser2)
  cards: Cards[];
}
