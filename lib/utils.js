export function escape_re (str) {
	return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function split_last (str, match) {
	let idx = str.lastIndexOf(match);

	if (idx == -1) return [str, ''];
	return [str.slice(0, idx), str.slice(idx)];
}
