import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('loginattemptlogs', { schema: 'acesso' })
export class Loginattemptlogs {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column('varchar', { name: 'username', nullable: true, length: 50 })
  username: string | null;

  @Column('datetime', { name: 'attemptDate' })
  attemptDate: Date;

  @Column('varchar', { name: 'reason', nullable: true, length: 50 })
  reason: string | null;
}
