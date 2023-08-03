import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('configfields', { schema: 'acesso' })
export class Configfields {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'Id' })
  id: string;

  @Column('boolean', { name: 'Required' })
  required: boolean;

  @Column('boolean', { name: 'ExpiresUser' })
  expiresUser: boolean;

  @Column('varchar', { name: 'TypeField', nullable: true, length: 4000 })
  typeField: string | null;

  @Column('varchar', { name: 'LengthField', nullable: true, length: 50 })
  lengthField: string | null;

  @Column('varchar', { name: 'GroupScreen', nullable: true, length: 50 })
  groupScreen: string | null;

  @Column('varchar', { name: 'Label', nullable: true, length: 50 })
  label: string | null;

  @Column('varchar', { name: 'Language', nullable: true, length: 50 })
  language: string | null;
}
