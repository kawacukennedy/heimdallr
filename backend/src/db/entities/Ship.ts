import { BaseEntity } from './BaseEntity';

export class ShipEntity extends BaseEntity {
    mmsi!: string;
    name?: string;
    shipType?: string;
    lat!: number;
    lon!: number;
    heading?: number;
    speed?: number;
    course?: number;
    destination?: string;
    eta?: string;
    flag?: string;
    length?: number;
    width?: number;
    draught?: number;
    aisTimestamp?: string;

    get tableName(): string { return 'ships'; }

    get columnMap(): Record<string, string> {
        return {
            id: 'id',
            mmsi: 'mmsi',
            name: 'name',
            shipType: 'ship_type',
            lat: 'lat',
            lon: 'lon',
            heading: 'heading',
            speed: 'speed',
            course: 'course',
            destination: 'destination',
            eta: 'eta',
            flag: 'flag',
            length: 'length',
            width: 'width',
            draught: 'draught',
            aisTimestamp: 'ais_timestamp',
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        };
    }
}
