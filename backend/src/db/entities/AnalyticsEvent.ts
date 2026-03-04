import { BaseEntity } from './BaseEntity';

export class AnalyticsEventEntity extends BaseEntity {
    userId?: string;
    eventType!: string;
    payload?: any;

    get tableName(): string { return 'analytics_events'; }

    get columnMap(): Record<string, string> {
        return {
            id: 'id',
            userId: 'user_id',
            eventType: 'event_type',
            payload: 'payload',
            createdAt: 'created_at',
        };
    }
}
