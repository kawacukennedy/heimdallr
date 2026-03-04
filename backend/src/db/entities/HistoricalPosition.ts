import { BaseEntity } from './BaseEntity';

export class HistoricalPositionEntity extends BaseEntity {
    entityType!: 'flight' | 'military' | 'ship' | 'satellite';
    entityId!: string;
    lat!: number;
    lon!: number;
    alt!: number;
    heading?: number;
    speed?: number;
    metadata?: any;
    recordedAt!: string;

    get tableName(): string { return 'historical_positions'; }

    get columnMap(): Record<string, string> {
        return {
            id: 'id',
            entityType: 'entity_type',
            entityId: 'entity_id',
            lat: 'lat',
            lon: 'lon',
            alt: 'alt',
            heading: 'heading',
            speed: 'speed',
            metadata: 'metadata',
            recordedAt: 'recorded_at',
            createdAt: 'created_at',
        };
    }
}
