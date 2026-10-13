/**
 * Every match of a global regex, with indices.
 *
 * `matchAll` with `for…of` does not compile under this project's ES5 target
 * (TS2802). An exec loop is the portable form; the `g` flag is required and
 * asserted so a caller cannot silently produce an infinite loop.
 */
export function allMatches(re: RegExp, text: string): RegExpExecArray[] {
  if (!re.global) throw new Error(`allMatches needs a /g regex: ${re}`);
  const out: RegExpExecArray[] = [];
  re.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    out.push(m);
    if (m[0] === "") re.lastIndex += 1;
  }
  return out;
}
