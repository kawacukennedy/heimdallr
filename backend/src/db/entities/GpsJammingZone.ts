import { BaseEntity } from './BaseEntity';

export class GpsJammingZoneEntity extends BaseEntity {
    bounds!: any; // GeoJSON polygon
    severity!: number; // 0-1 scale
    affectedAircraft!: number;
    avgNacp!: number;
    avgNic!: number;
    detectedAt?: string;
    expiresAt?: string;
    active!: boolean;

    get tableName(): string { return 'gps_jamming_zones'; }

    get columnMap(): Record<string, string> {
        return {
            id: 'id',
            bounds: 'bounds',
            severity: 'severity',
            affectedAircraft: 'affected_aircraft',
            avgNacp: 'avg_nacp',
            avgNic: 'avg_nic',
            detectedAt: 'detected_at',
            expiresAt: 'expires_at',
            active: 'active',
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        };
    }
}
