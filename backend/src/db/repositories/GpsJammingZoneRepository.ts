import { Repository } from '../Repository';
import { GpsJammingZoneEntity } from '../entities/GpsJammingZone';

export class GpsJammingZoneRepository extends Repository<GpsJammingZoneEntity> {
    protected EntityClass = GpsJammingZoneEntity;

    async findActive(): Promise<GpsJammingZoneEntity[]> {
        return this.createQuery()
            .where('active', 'eq', true)
            .orderBy('detected_at', false)
            .getResultList();
    }

    async deactivateExpired(): Promise<void> {
        const client = this.em.getClient();
        const now = new Date().toISOString();
        await client
            .from('gps_jamming_zones')
            .update({ active: false })
            .lt('expires_at', now)
            .eq('active', true);
    }
}
