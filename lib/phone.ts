/**
 * Phone-number handling for the contact form.
 *
 * The old rule was `/^\d{10}$/`, which rejected every number a real person
 * types — "+91 93130 26530", "093130-26530", "(913) 026-530". A contact form
 * that refuses formatted input loses exactly the visitors who bothered to
 * format it. So: accept anything that is recognisably a phone number, and
 * normalise it before it goes anywhere.
 */

/** Digits with an optional leading "+", e.g. "+919313026530". */
export function normalisePhone(raw: string): string {
  const trimmed = raw.trim();
  const plus = trimmed.startsWith("+") ? "+" : "";
  return plus + trimmed.replaceAll(/\D/g, "");
}

/**
 * True when the input, once normalised, is a plausible phone number: 10 to 15
 * digits (E.164 caps at 15; an Indian mobile is 10), with only digits, spaces,
 * dots, dashes, parentheses and one leading "+" in the raw text. Empty input is
 * NOT valid here — optionality is the form's decision, not this function's.
 */
export function isPlausiblePhone(raw: string): boolean {
  const trimmed = raw.trim();
  if (!/^\+?[\d\s().-]+$/.test(trimmed)) return false;
  const digits = normalisePhone(trimmed).replace(/^\+/, "");
  return digits.length >= 10 && digits.length <= 15;
}

export const PHONE_ERROR_MESSAGE =
  "Please enter a valid phone number (10 to 15 digits; +91, spaces and dashes are fine)";
