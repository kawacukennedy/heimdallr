/**
 * EntityManager — Hibernate-style session manager wrapping Supabase client.
 * Provides persist(), merge(), remove(), find(), and createQuery() operations.
 */
import { getSupabaseClient } from '../config/supabase';
import { BaseEntity } from './entities/BaseEntity';
import type { SupabaseClient } from '@supabase/supabase-js';

export interface QueryOptions {
    orderBy?: { column: string; ascending?: boolean };
    limit?: number;
    offset?: number;
}

export interface WhereClause {
    column: string;
    operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'ilike' | 'in' | 'is';
    value: any;
}

export class EntityManager {
    private supabase: SupabaseClient;

    constructor() {
        this.supabase = getSupabaseClient();
    }

    /** Get the raw Supabase client for advanced queries. */
    getClient(): SupabaseClient {
        return this.supabase;
    }

    /**
     * Persist (insert) a new entity.
     */
    async persist<T extends BaseEntity>(entity: T): Promise<T> {
        entity.prePersist();
        const row = entity.toRow();

        const { data, error } = await this.supabase
            .from(entity.tableName)
            .insert(row)
            .select()
            .single();

        if (error) throw new Error(`[EntityManager] persist failed on ${entity.tableName}: ${error.message}`);

        // Hydrate entity with returned data (e.g., generated id)
        if (data) {
            const colMap = entity.columnMap;
            const reverseMap: Record<string, string> = {};
            for (const [prop, col] of Object.entries(colMap)) {
                reverseMap[col] = prop;
            }
            for (const [key, value] of Object.entries(data)) {
                const prop = reverseMap[key] || key;
                (entity as any)[prop] = value;
            }
        }

        return entity;
    }

    /**
     * Merge (upsert) an entity — inserts if not found, updates if exists.
     */
    async merge<T extends BaseEntity>(entity: T): Promise<T> {
        entity.preUpdate();
        const row = entity.toRow();

        const { data, error } = await this.supabase
            .from(entity.tableName)
            .upsert(row)
            .select()
            .single();

        if (error) throw new Error(`[EntityManager] merge failed on ${entity.tableName}: ${error.message}`);
        return entity;
    }

    /**
     * Remove an entity by id.
     */
    async remove<T extends BaseEntity>(entity: T): Promise<void> {
        const { error } = await this.supabase
            .from(entity.tableName)
            .delete()
            .eq('id', entity.id);

        if (error) throw new Error(`[EntityManager] remove failed on ${entity.tableName}: ${error.message}`);
    }

    /**
     * Find an entity by ID.
     */
    async find<T extends BaseEntity>(
        EntityClass: new () => T,
        id: string
    ): Promise<T | null> {
        const instance = new EntityClass();
        const { data, error } = await this.supabase
            .from(instance.tableName)
            .select('*')
            .eq('id', id)
            .single();

        if (error || !data) return null;
        return (EntityClass as any).fromRow(data);
    }

    /**
     * Create a query builder for an entity type.
     */
    createQuery<T extends BaseEntity>(
        EntityClass: new () => T
    ): QueryBuilder<T> {
        return new QueryBuilder<T>(this.supabase, EntityClass);
    }
}

/**
 * QueryBuilder — fluent query builder for entity queries.
 */
export class QueryBuilder<T extends BaseEntity> {
    private supabase: SupabaseClient;
    private EntityClass: new () => T;
    private tableName: string;
    private selectColumns = '*';
    private whereClauses: WhereClause[] = [];
    private options: QueryOptions = {};

    constructor(supabase: SupabaseClient, EntityClass: new () => T) {
        this.supabase = supabase;
        this.EntityClass = EntityClass;
        this.tableName = new EntityClass().tableName;
    }

    select(columns: string): this {
        this.selectColumns = columns;
        return this;
    }

    where(column: string, operator: WhereClause['operator'], value: any): this {
        this.whereClauses.push({ column, operator, value });
        return this;
    }

    orderBy(column: string, ascending = true): this {
        this.options.orderBy = { column, ascending };
        return this;
    }

    limit(n: number): this {
        this.options.limit = n;
        return this;
    }

    offset(n: number): this {
        this.options.offset = n;
        return this;
    }

    async getResultList(): Promise<T[]> {
        let query = this.supabase.from(this.tableName).select(this.selectColumns);

        for (const clause of this.whereClauses) {
            query = (query as any)[clause.operator](clause.column, clause.value);
        }

        if (this.options.orderBy) {
            query = query.order(this.options.orderBy.column, { ascending: this.options.orderBy.ascending ?? true });
        }
        if (this.options.limit) {
            query = query.limit(this.options.limit);
        }
        if (this.options.offset) {
            query = query.range(this.options.offset, this.options.offset + (this.options.limit || 100) - 1);
        }

        const { data, error } = await query;
        if (error) throw new Error(`[QueryBuilder] query failed: ${error.message}`);
        return (data || []).map((row: any) => (this.EntityClass as any).fromRow(row));
    }

    async getSingleResult(): Promise<T | null> {
        let query = this.supabase.from(this.tableName).select(this.selectColumns);

        for (const clause of this.whereClauses) {
            query = (query as any)[clause.operator](clause.column, clause.value);
        }

        if (this.options.orderBy) {
            query = query.order(this.options.orderBy.column, { ascending: this.options.orderBy.ascending ?? true });
        }

        const { data, error } = await query.limit(1).single();
        if (error || !data) return null;
        return (this.EntityClass as any).fromRow(data);
    }
}

/** Singleton EntityManager instance. */
let _em: EntityManager | null = null;

export function getEntityManager(): EntityManager {
    if (!_em) _em = new EntityManager();
    return _em;
}
