import { Repository } from '../Repository';
import { HistoricalPositionEntity } from '../entities/HistoricalPosition';

export class HistoricalPositionRepository extends Repository<HistoricalPositionEntity> {
    protected EntityClass = HistoricalPositionEntity;

    async findByTimeRange(startTime: string, endTime: string, entityType?: string): Promise<HistoricalPositionEntity[]> {
        let query = this.createQuery()
            .where('recorded_at', 'gte', startTime)
            .where('recorded_at', 'lte', endTime)
            .orderBy('recorded_at');

        if (entityType) {
            query = query.where('entity_type', 'eq', entityType);
        }

        return query.getResultList();
    }

    async findByEntityId(entityId: string, limit = 1000): Promise<HistoricalPositionEntity[]> {
        return this.createQuery()
            .where('entity_id', 'eq', entityId)
            .orderBy('recorded_at')
            .limit(limit)
            .getResultList();
    }

    async bulkInsert(positions: Array<Partial<HistoricalPositionEntity>>): Promise<void> {
        const client = this.em.getClient();
        const rows = positions.map(p => ({
            entity_type: p.entityType,
            entity_id: p.entityId,
            lat: p.lat,
            lon: p.lon,
            alt: p.alt,
            heading: p.heading,
            speed: p.speed,
            metadata: p.metadata,
            recorded_at: p.recordedAt || new Date().toISOString(),
        }));
        await client.from('historical_positions').insert(rows);
    }

    async deleteOlderThan(date: string): Promise<void> {
        const client = this.em.getClient();
        await client.from('historical_positions').delete().lt('recorded_at', date);
    }
}
