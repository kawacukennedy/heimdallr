/**
 * Repository — Generic repository base class providing standard CRUD operations.
 * Follows Hibernate/Spring Data JPA repository pattern.
 */
import { BaseEntity } from './entities/BaseEntity';
import { EntityManager, getEntityManager, QueryBuilder } from './EntityManager';

export abstract class Repository<T extends BaseEntity> {
    protected em: EntityManager;
    protected abstract EntityClass: new () => T;

    constructor() {
        this.em = getEntityManager();
    }

    /** Find entity by ID. */
    async findById(id: string): Promise<T | null> {
        return this.em.find(this.EntityClass, id);
    }

    /** Find all entities. */
    async findAll(): Promise<T[]> {
        return this.em.createQuery(this.EntityClass).getResultList();
    }

    /** Save (insert) a new entity. */
    async save(entity: T): Promise<T> {
        return this.em.persist(entity);
    }

    /** Save or update an entity. */
    async saveOrUpdate(entity: T): Promise<T> {
        return this.em.merge(entity);
    }

    /** Delete an entity. */
    async delete(entity: T): Promise<void> {
        return this.em.remove(entity);
    }

    /** Delete by ID. */
    async deleteById(id: string): Promise<void> {
        const entity = await this.findById(id);
        if (entity) await this.em.remove(entity);
    }

    /** Create a query builder for custom queries. */
    createQuery(): QueryBuilder<T> {
        return this.em.createQuery(this.EntityClass);
    }

    /** Count all entities. */
    async count(): Promise<number> {
        const results = await this.findAll();
        return results.length;
    }
}
