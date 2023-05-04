import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('configurations')
export class ConfigurationEntity {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column({ type: 'simple-json', nullable: true })
  credential: string;

  @Column()
  @Index({ unique: true })
  account: string;

  @Column({ nullable: true })
  token?: string;

  @Column({ type: 'datetime', nullable: true })
  token_expires_in?: string;

  @UpdateDateColumn()
  updated_at: string;

  @CreateDateColumn()
  created_at: string;
}
