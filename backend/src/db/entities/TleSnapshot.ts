import { BaseEntity } from './BaseEntity';

export class TleSnapshotEntity extends BaseEntity {
    fetchedAt?: string;
    tleData!: any;
    satelliteCount?: number;

    get tableName(): string { return 'tle_snapshots'; }

    get columnMap(): Record<string, string> {
        return {
            id: 'id',
            fetchedAt: 'fetched_at',
            tleData: 'tle_data',
            satelliteCount: 'satellite_count',
        };
    }
}
