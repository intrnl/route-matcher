import * as p from './parser-utils.js';
import { escape_re, split_last } from './utils.js';


/**
 * Convert route patterns into regular expression
 * @param {string} path
 * @param {boolean} [loose]
 * @returns {RegExp}
 */
export function compile (path, loose = false) {
	path = path.replace(/^(?!\/)|^\/{2,}/, '/').replace(/\/+$/, '');
	return new RegExp(`^${parse(path)}/?${loose ? '' : '$'}`, 'i');
}

/**
 * Parse route patterns into a string of regular expression
 * @param {string} path
 * @returns {string}
 */
export function parse (path) {
	let state = { res: '', buf: '', str: path, pos: 0 };

	parse_path(state, false);
	p.flush(state);

	return state.res;
}


function parse_path (state, is_affix_mode) {
	while (state.pos < state.str.length) {
		if (p.eat(state, '\\')) {
			state.buf += state.str[state.pos++];
			continue;
		}

		if (p.match(state, '{')) {
			enter_affix_mode(state);
			continue;
		}
		if (is_affix_mode && p.match(state, '}')) {
			break;
		}

		if (p.eat(state, ':')) {
			let name = p.read(state, /[a-zA-Z_]/);
			let pattern = read_param_pattern(state) || '[^/]+?';
			let is_optional = p.eat(state, '?');

			let result = `(?<${name}>${pattern})`;


			if (is_optional) {
				let [escaped, part] = split_last(state.buf, '/');

				if (escaped) {
					state.res += escape_re(escaped);
				}
				if (part) {
					result = `(?:${escape_re(part)}${result})`;
				}

				result += '?';
				state.buf = '';
			} else {
				p.flush(state);
			}

			state.res += result;
			continue;
		}

		state.buf += state.str[state.pos++];
	}
}

function enter_affix_mode (state) {
	p.flush(state);
	p.eat(state, '{', true);

	state.res += '(?:';

	parse_path(state, true);

	p.flush(state);
	p.eat(state, '}', true);

	state.res += ')';
	if (p.eat(state, '?')) state.res += '?';
}

function read_param_pattern (state) {
	if (!p.eat(state, '(')) return null;

	let data = '';
	let num_paren = 1;

	while (state.pos < state.str.length) {
		let char = state.str[state.pos];

		if (char == '(') {
			if (!p.match(state, '(?:')) return p.error(state, 'must be non-capturing group');
			num_paren++;
		}

		if (char == ')') {
			num_paren--;
		}

		if (!num_paren) {
			break;
		}

		data += char;
		state.pos++;
	}

	p.eat(state, ')', true);
	return data;
}
