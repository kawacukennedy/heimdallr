// Object utilities
export function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> { return keys.reduce((out, k) => { if (k in obj) out[k] = obj[k]; return out; }, {} as Pick<T, K>); }
export function omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> { const result = { ...obj }; keys.forEach(k => delete (result as any)[k]); return result; }
export function deepClone<T>(obj: T): T { return JSON.parse(JSON.stringify(obj)); }
export function isEmpty(obj: object): boolean { return Object.keys(obj).length === 0; }
export function merge<T extends object>(...objects: Partial<T>[]): T { return Object.assign({}, ...objects) as T; }
export function diffKeys(a: Record<string, any>, b: Record<string, any>): string[] { return Object.keys(a).filter(k => a[k] !== b[k]); }
