import { Repository } from '../Repository';
import { TleSnapshotEntity } from '../entities/TleSnapshot';

export class TleSnapshotRepository extends Repository<TleSnapshotEntity> {
    protected EntityClass = TleSnapshotEntity;

    async findLatest(): Promise<TleSnapshotEntity | null> {
        return this.createQuery()
            .orderBy('fetched_at', false)
            .limit(1)
            .getSingleResult();
    }

    async deleteOlderThan(date: string): Promise<void> {
        const client = this.em.getClient();
        await client.from('tle_snapshots').delete().lt('fetched_at', date);
    }
}
