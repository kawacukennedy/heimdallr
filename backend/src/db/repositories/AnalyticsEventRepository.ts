import { Repository } from '../Repository';
import { AnalyticsEventEntity } from '../entities/AnalyticsEvent';

export class AnalyticsEventRepository extends Repository<AnalyticsEventEntity> {
    protected EntityClass = AnalyticsEventEntity;

    async findByTypeSince(since: string): Promise<AnalyticsEventEntity[]> {
        return this.createQuery()
            .where('created_at', 'gte', since)
            .getResultList();
    }

    async createEvent(eventType: string, payload?: any): Promise<AnalyticsEventEntity> {
        const event = new AnalyticsEventEntity();
        event.eventType = eventType;
        event.payload = payload || {};
        return this.save(event);
    }
}
