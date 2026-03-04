import { Repository } from '../Repository';
import { ShipEntity } from '../entities/Ship';

export class ShipRepository extends Repository<ShipEntity> {
    protected EntityClass = ShipEntity;

    async findByMmsi(mmsi: string): Promise<ShipEntity | null> {
        return this.createQuery()
            .where('mmsi', 'eq', mmsi)
            .getSingleResult();
    }

    async findInBounds(south: number, west: number, north: number, east: number): Promise<ShipEntity[]> {
        return this.createQuery()
            .where('lat', 'gte', south)
            .where('lat', 'lte', north)
            .where('lon', 'gte', west)
            .where('lon', 'lte', east)
            .getResultList();
    }

    async upsertFromAIS(shipData: Partial<ShipEntity>): Promise<ShipEntity> {
        const ship = new ShipEntity();
        Object.assign(ship, shipData);
        return this.saveOrUpdate(ship);
    }
}
