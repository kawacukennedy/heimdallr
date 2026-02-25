// String utilities
export { truncate, capitalize, slugify } from './formatting';
export function camelToKebab(s: string): string { return s.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase(); }
export function kebabToCamel(s: string): string { return s.replace(/-([a-z])/g, (_, c) => c.toUpperCase()); }
export function escapeHtml(s: string): string { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
export function pluralize(word: string, count: number, plural?: string): string { return count === 1 ? word : (plural || word + 's'); }
export function initials(name: string): string { return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2); }
