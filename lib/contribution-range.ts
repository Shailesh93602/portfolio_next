import { format, parseISO } from "date-fns";

/**
 * The span a set of GitHub contribution days actually covers, as
 * "Jan 2024 – Sep 2026".
 *
 * /statistics used to caption both charts "Last 365 days" and sum 980 days:
 * lib/github-service.ts queries the contribution calendar from 2024-01-01 to
 * today, so the 9,634 on the page was the total since January 2024 while the
 * public GitHub profile shows the trailing twelve months (~4,100). Neither
 * number was wrong; the page did not say what it counted. Every caption on
 * that page now derives its range from the data it is summing.
 */
export function contributionRange(
  days: readonly { date: string }[]
): string | null {
  if (days.length === 0) return null;
  let first = days[0].date;
  let last = days[0].date;
  for (const { date } of days) {
    if (date < first) first = date;
    if (date > last) last = date;
  }
  const label = (d: string) => format(parseISO(d), "MMM yyyy");
  const from = label(first);
  const to = label(last);
  return from === to ? from : `${from} – ${to}`;
}
