# N-Toki · time by the sun

**Live:** https://intimate-avocado.github.io/n-toki/

> Time became something they could sell. Time to take it back.

## What it is

A living clock that follows the real sun where you are. The day is twelve *toki*, six of daylight and six of night, each named for a zodiac animal and centered on a moment of the sun: Rabbit on sunrise, Horse on the sun's highest point, Rooster on sunset, Rat on the middle of the night. The year is 72 micro-seasons of about five days, with names like *first frost* and *rainbows hide*. Japan kept time this way until 1873.

Open it and you don't see 4:12 PM. You see a warm orange sky, the kanji 申, and the word Monkey. Hold the screen and clock time appears; let go and the sky returns.

## What it isn't

No account. No tracking. No ads. No streaks, countdowns or "you're late." No premium tier. See [VALUES.md](VALUES.md): those are constraints, not marketing. If a future version breaks one, it is no longer N-Toki.

## The idea

The equal hour is what made time countable, and anything countable can be sold. N-Toki is step one toward taking it back: experience time by the sky, then speak it with each other, then rethink how work fits around it. The full argument is in the app under Settings → About ([LORE.md](LORE.md)) and in the [working paper](spec/N-Toki_Research_Paper.md).

## Privacy

**Nothing leaves your device.** The page makes no network requests after it loads: fonts ship with the app, sunrise and sunset are calculated locally, and your location (if you share it) is used on-device and never transmitted. It works offline once installed. Deleting it deletes everything.

## How the sun math works

`engine/ntoki-engine.js` is a dependency-free module anyone can build on:

```js
import { NT, SKY, TOKI, KO } from './engine/ntoki-engine.js';
const c = NT.cycle(Date.now(), { lat: 35.68, lng: 139.65, tz: 'Asia/Tokyo' });
console.log(TOKI[c.idx].en);                 // e.g. "Horse"
const y = SKY.year(Date.now(), 35.68);
console.log(KO[y.k][0], KO[y.k][2]);         // e.g. "霜始降 First frost"
```

Sunrise and sunset use the SunCalc method; the sun's longitude for the 72 seasons uses Meeus. `node engine/test.mjs` runs a full-year scan, checks that Horse is centered on solar noon, and checks the 2026 equinoxes and solstices against published times. The formal definition is in [spec/N-Toki_Spec_V2.md](spec/N-Toki_Spec_V2.md).

## Self-host

It's one HTML file plus fonts and icons. Copy the repo to any static host, or open `index.html` from disk. No build step, no server.

- **Phone:** open the live link, then *Add to Home Screen* (iPhone) or *Install app* (Android).
- **Windows window:** `desktop/Open N-Toki (online).bat` opens it with no browser bars.
- **Live wallpaper:** add `wallpaper.html` or `wallpaper-dark.html` to [Lively Wallpaper](https://github.com/rocksdanister/lively) (free, open source).

## Using it

- **Living clock:** the sky changes with the sun; the current toki's kanji sits in a seal ring; the micro-season reads underneath.
- **Day ring:** twelve toki at their true lengths, read facing south. **Year ring:** the 72 seasons.
- **Settings:** place, appearance (Sky, Dark, Follow the sun), labels (kanji, animal, bells), accessibility (reduce motion, larger text), language (English, 日本語, 简体中文).
- **Time travel:** any date; play a day in 45 seconds or a year in 72.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Translations, cities and accessibility fixes welcome.

## Credits

- Micro-season names: [Japan's 72 Microseasons, nippon.com](https://www.nippon.com/en/features/h00124/), after Shibukawa Shunkai's 1685 revision.
- N-Toki began as a reply to a post by [@ReiOfJapan7](https://x.com/ReiOfJapan7) on Japanese timekeeping, who also suggested the 72 micro-seasons. Thank you.

## License

Code: [MIT](LICENSE), so the toki standard can spread to watch faces, lamps and calendars. Text and lore: [CC BY-SA 4.0](LICENSE-CONTENT). Fonts: SIL OFL 1.1. The N-Toki name, logo and companion art are not licensed for others' branding.
