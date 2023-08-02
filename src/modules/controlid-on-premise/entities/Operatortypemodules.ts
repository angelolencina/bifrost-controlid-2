import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('operatortypemodules', { schema: 'acesso' })
export class Operatortypemodules {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column('bigint', { name: 'idOperatorType' })
  idOperatorType: string;

  @Column('int', { name: 'idModule' })
  idModule: number;

  @Column('int', { name: 'idPermission' })
  idPermission: number;

  @Column('int', { name: 'id2', nullable: true })
  id2: number | null;
}
