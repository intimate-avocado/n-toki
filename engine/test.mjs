// Run: node engine/test.mjs — checks continuity and known 2026 dates.
import { NT, SKY, TOKI, KO } from './ntoki-engine.js';
let fail = 0;
const ok = (c, m) => { if (!c) { fail++; console.error('FAIL', m); } else console.log('ok  ', m); };
const austin = { lat: 30.2672, lng: -97.7431, tz: 'America/Chicago' };
// 1. A full year at 5-minute steps: toki only ever advance by one, never skip, never fall back to the polar mode.
let prev = null, skips = 0, fixed = 0;
for (let t = Date.parse('2026-01-01T00:00:00Z'); t < Date.parse('2027-01-01T00:00:00Z'); t += 5 * 60e3) {
  const c = NT.cycle(t, austin);
  if (prev !== null && c.idx !== prev && c.idx !== (prev + 1) % 12) skips++;
  if (c.mode !== 'solar') fixed++;
  prev = c.idx;
}
ok(skips === 0 && fixed === 0, `Austin 2026 toki scan: ${skips} skips, ${fixed} fallbacks`);
// 2. Horse is centered on solar noon (1:16 PM CDT on 26 Oct 2026).
const c = NT.cycle(Date.parse('2026-10-26T18:16:00Z'), austin);
ok(TOKI[c.idx].en === 'Horse' && Math.abs(c.progress - 0.5) < 0.02, `26 Oct 2026 13:16 CDT is mid-Horse (${TOKI[c.idx].en}, ${(c.progress * 100).toFixed(1)}%)`);
// 3. Solar terms match published 2026 times within 30 minutes.
const y = SKY.year(Date.parse('2026-10-27T12:00:00Z'), 35.7);
const near = (a, iso) => Math.abs(a - Date.parse(iso)) < 30 * 60e3;
ok(near(y.marks[0], '2026-03-20T14:46:00Z'), 'Spring equinox 2026');
ok(near(y.marks[1], '2026-06-21T08:24:00Z'), 'Summer solstice 2026');
ok(near(y.marks[2], '2026-09-23T00:05:00Z'), 'Autumn equinox 2026');
ok(near(y.marks[3], '2026-12-21T20:50:00Z'), 'Winter solstice 2026');
ok(KO[y.k][0] === '霜始降', `27 Oct 2026 is ${KO[y.k][0]} (${KO[y.k][2]})`);
// 4. Polar night falls back cleanly.
const tromso = NT.cycle(Date.parse('2026-12-21T11:00:00Z'), { lat: 69.6492, lng: 18.9553, tz: 'Europe/Oslo' });
ok(tromso.mode === 'fixed' && tromso.polar === 'night', 'Tromsø midwinter uses the labeled fallback');
console.log(fail ? `${fail} failed` : 'all passed');
process.exit(fail ? 1 : 0);
