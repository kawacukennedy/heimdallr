import { BaseEntity } from './BaseEntity';

export class ProfileEntity extends BaseEntity {
    displayName?: string;
    favoriteLayers?: string[];
    defaultShader?: string;
    bookmarks?: any;
    settings?: any;

    get tableName(): string { return 'profiles'; }

    get columnMap(): Record<string, string> {
        return {
            id: 'id',
            displayName: 'display_name',
            favoriteLayers: 'favorite_layers',
            defaultShader: 'default_shader',
            bookmarks: 'bookmarks',
            settings: 'settings',
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        };
    }
}
