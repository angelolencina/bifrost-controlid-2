import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('alarmlogs', { schema: 'acesso' })
export class Alarmlogs {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column('bigint', { name: 'idDevice' })
  idDevice: string;

  @Column('bigint', { name: 'idAtDevice' })
  idAtDevice: string;

  @Column('int', { name: 'idEvent' })
  idEvent: number;

  @Column('int', { name: 'idCause' })
  idCause: number;

  @Column('bigint', { name: 'idUser' })
  idUser: string;

  @Column('bigint', { name: 'time' })
  time: string;

  @Column('datetime', { name: 'time2' })
  time2: Date;
}
