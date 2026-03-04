import { BaseEntity } from './BaseEntity';

export class CctvCameraEntity extends BaseEntity {
    sourceUrl!: string;
    heading!: number;
    pitch!: number;
    city?: string;
    label?: string;
    location?: any;

    get tableName(): string { return 'cctv_cameras'; }

    get columnMap(): Record<string, string> {
        return {
            id: 'id',
            sourceUrl: 'source_url',
            heading: 'heading',
            pitch: 'pitch',
            city: 'city',
            label: 'label',
            location: 'location',
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        };
    }
}
