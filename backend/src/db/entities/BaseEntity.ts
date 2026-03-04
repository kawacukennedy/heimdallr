/**
 * BaseEntity — Hibernate-style abstract base entity.
 * All entity classes extend this to gain lifecycle hooks and common fields.
 */
export abstract class BaseEntity {
    id!: string;
    createdAt?: string;
    updatedAt?: string;

    /** The table name this entity maps to. */
    abstract get tableName(): string;

    /** Column mappings: entity property → database column. */
    abstract get columnMap(): Record<string, string>;

    /** Convert a raw database row to entity fields. */
    static fromRow<T extends BaseEntity>(this: new () => T, row: Record<string, any>): T {
        const entity = new this();
        const colMap = entity.columnMap;
        const reverseMap: Record<string, string> = {};
        for (const [prop, col] of Object.entries(colMap)) {
            reverseMap[col] = prop;
        }
        for (const [key, value] of Object.entries(row)) {
            const prop = reverseMap[key] || key;
            (entity as any)[prop] = value;
        }
        return entity;
    }

    /** Convert entity fields to database row for insert/update. */
    toRow(): Record<string, any> {
        const row: Record<string, any> = {};
        for (const [prop, col] of Object.entries(this.columnMap)) {
            if ((this as any)[prop] !== undefined) {
                row[col] = (this as any)[prop];
            }
        }
        return row;
    }

    /** Lifecycle hook: called before insert. */
    prePersist(): void {
        if (!this.createdAt) this.createdAt = new Date().toISOString();
        this.updatedAt = new Date().toISOString();
    }

    /** Lifecycle hook: called before update. */
    preUpdate(): void {
        this.updatedAt = new Date().toISOString();
    }
}
