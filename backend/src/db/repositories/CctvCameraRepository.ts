import { Repository } from '../Repository';
import { CctvCameraEntity } from '../entities/CctvCamera';

export class CctvCameraRepository extends Repository<CctvCameraEntity> {
    protected EntityClass = CctvCameraEntity;

    async findByCity(city: string): Promise<CctvCameraEntity[]> {
        return this.createQuery()
            .where('city', 'ilike', `%${city}%`)
            .orderBy('city')
            .getResultList();
    }

    async findAllOrdered(): Promise<CctvCameraEntity[]> {
        return this.createQuery()
            .orderBy('city')
            .getResultList();
    }
}
