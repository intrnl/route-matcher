/**
 * Convert route patterns into regular expression
 * @param {string} path
 * @param {boolean} [loose]
 * @returns {RegExp}
 */
export function compile (path: string, loose?: boolean): RegExp;

/**
 * Parse route patterns into a string of regular expression
 * @param {string} path
 * @returns {string}
 */
export function parse (path: string): string;
