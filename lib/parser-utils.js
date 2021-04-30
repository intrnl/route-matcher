import { escape_re } from './utils.js';


export function error (state, message, index = state.pos) {
	throw new Error(`${message} at ${index}`)
}

export function flush (state) {
	state.res += escape_re(state.buf);
	state.buf = '';
}

export function match (state, string) {
	return state.str.slice(state.pos, state.pos + string.length) == string;
}

export function eat (state, string, required = false) {
	if (match(state, string)) {
		state.pos += string.length;
		return true;
	}

	if (required) {
		return error(state, `expected string '${string}'`);
	}

	return false;
}

export function read (state, regex) {
	let data = '';

	while (state.pos < state.str.length && regex.test(state.str[state.pos])) {
		data += state.str[state.pos++];
	}

	return data;
}
