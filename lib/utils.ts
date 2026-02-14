/**
 * Escapes special regex characters in a string to prevent ReDoS
 * and NoSQL regex injection attacks.
 */
export function escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
