import { BaseEntity } from './BaseEntity';

export class RoadNetworkEntity extends BaseEntity {
    city!: string;
    way!: any;
    highwayType?: string;
    name?: string;
    interpolatedPoints?: any;

    get tableName(): string { return 'road_networks'; }

    get columnMap(): Record<string, string> {
        return {
            id: 'id',
            city: 'city',
            way: 'way',
            highwayType: 'highway_type',
            name: 'name',
            interpolatedPoints: 'interpolated_points',
            createdAt: 'created_at',
        };
    }
}
