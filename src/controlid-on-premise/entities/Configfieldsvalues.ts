import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('idx_configfieldsvalues_idrecord', ['idRecord'], {})
@Entity('configfieldsvalues', { schema: 'acesso' })
export class Configfieldsvalues {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'Id' })
  id: string;

  @Column('bigint', { name: 'IdConfigField', nullable: true })
  idConfigField: string | null;

  @Column('bigint', { name: 'IdRecord', nullable: true })
  idRecord: string | null;

  @Column('varchar', { name: 'FieldText', nullable: true, length: 200 })
  fieldText: string | null;

  @Column('int', { name: 'coluna1', nullable: true })
  coluna1: number | null;
}
