import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('billings')
export class BillingRecord {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    paymentId: string;

    @Column()
    transactionType: 'deposit' | 'transfer';

    @Column()
    fromUserId: string;

    @Column({type: "varchar", nullable: true })
    toUserId: string | null;

    @Column('decimal', { precision: 10, scale: 2 })
    amount: number;

    @Column()
    reference: string;

    @Column({ default: 'pending' })
    status: 'completed' | 'pending' | 'failed'

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
}