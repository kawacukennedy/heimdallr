import { Repository } from '../Repository';
import { RoadNetworkEntity } from '../entities/RoadNetwork';

export class RoadNetworkRepository extends Repository<RoadNetworkEntity> {
    protected EntityClass = RoadNetworkEntity;

    async findByCity(city: string): Promise<RoadNetworkEntity[]> {
        return this.createQuery()
            .where('city', 'eq', city)
            .getResultList();
    }

    async existsForCity(city: string): Promise<boolean> {
        const results = await this.createQuery()
            .select('id')
            .where('city', 'eq', city)
            .limit(1)
            .getResultList();
        return results.length > 0;
    }
}
