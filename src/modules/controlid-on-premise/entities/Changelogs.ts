import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('changelogs', { schema: 'acesso' })
export class Changelogs {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id_Log' })
  idLog: string;

  @Column('bigint', { name: 'id_User' })
  idUser: string;

  @Column('varchar', { name: 'operatorName', nullable: true, length: 50 })
  operatorName: string | null;

  @Column('varchar', { name: 'Tabela', nullable: true, length: 50 })
  tabela: string | null;

  @Column('bigint', { name: 'id_Tabela' })
  idTabela: string;

  @Column('bigint', { name: 'Tipo' })
  tipo: string;

  @Column('datetime', { name: 'Data' })
  data: Date;

  @Column('varchar', { name: 'Log_Tag', nullable: true, length: 250 })
  logTag: string | null;

  @Column('text', { name: 'Log', nullable: true })
  log: string | null;

  @Column('varchar', { name: 'oldValue', nullable: true, length: 8000 })
  oldValue: string | null;

  @Column('varchar', { name: 'newValue', nullable: true, length: 8000 })
  newValue: string | null;
}
