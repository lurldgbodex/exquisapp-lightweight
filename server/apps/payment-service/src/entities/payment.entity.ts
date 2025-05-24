import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('payments')
export class Payment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    paidBy: string;

    @Column({ type: 'varchar', nullable: true })
    paidTo: string | null;

    @Column('decimal', { precision: 10, scale: 2 })
    amount: number;

    @Column({ default: 'pending'})
    status: 'pending' | 'completed' | 'failed';

    @Column()
    type: 'deposit' | 'transfer';

    @Column()
    reference: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
}