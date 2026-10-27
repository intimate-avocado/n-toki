# N-Toki · time by the sun

**Live:** https://intimate-avocado.github.io/n-toki/

> Time became something they could sell. Time to sell it back.

N-Toki is a living clock that follows the real sun where you are. It brings back two ways of keeping time that Japan set aside in its 1872–73 calendar reform:

- **The twelve toki of the day.** Daylight and darkness are each divided by six, so the "hours" stretch and shrink with the seasons. Every toki is centered on a moment of the sun: Rabbit 卯 on sunrise, Horse 午 on the sun's highest point, Rooster 酉 on sunset, Rat 子 on the middle of the night.
- **The 72 micro-seasons of the year (七十二候).** About five days each, with names like 霜始降, "first frost," calculated from the sun's position so the dates are right every year.

N is pronounced *en*: 円 (circle, and yen), 縁 (the bond between people), 時 (time).

## What it does

- **Living clock:** a sky that changes color with the sun; the current toki's kanji in a seal ring that fills as it passes; the current micro-season underneath.
- **Hold anywhere** to see conventional clock time. Let go and the sky returns.
- **Cycle dial:** the day as a ring of 12 toki at their true lengths, read like the sky facing south.
- **The 72 seasons:** the year as a ring of 72, summer solstice at the top, winter solstice at the bottom.
- **Time travel:** jump to any date, play a whole day in 45 seconds, or the whole year in 72.
- **Languages:** English, 日本語, 简体中文, chosen from your device.
- **Anywhere on Earth:** pick a city, use your location, or enter coordinates. Polar day and night fall back to clearly labeled equal toki.
- **Private by design:** no account, no tracking, no server. Everything is calculated on your device and it works offline once installed.

## Install it

- **Phone:** open the live link, then *Share → Add to Home Screen* (iPhone) or *Install app* (Android).
- **Desktop:** in Chrome or Edge, use the install icon in the address bar.
- **Windows window:** double-click `desktop/Open N-Toki (online).bat` for a clean window with no browser bars.
- **Live wallpaper (Windows):** install the free, open-source [Lively Wallpaper](https://github.com/rocksdanister/lively), click *+*, and add `wallpaper.html` (or its live link).

## The engine

`engine/ntoki-engine.js` is a dependency-free module anyone can build on:

```js
import { NT, SKY, TOKI, KO } from './engine/ntoki-engine.js';
const c = NT.cycle(Date.now(), { lat: 30.27, lng: -97.74, tz: 'America/Chicago' });
console.log(TOKI[c.idx].en, Math.round(c.progress * 100) + '%');   // e.g. "Horse 50%"
const y = SKY.year(Date.now(), 30.27);
console.log(KO[y.k][0], KO[y.k][2]);                                // e.g. "霜始降 First frost"
```

Run the checks with `node engine/test.mjs`: a full-year scan, mid-Horse at solar noon, and 2026 equinoxes and solstices within 30 minutes of published times.

The app (`index.html`) is a single self-contained file that inlines the same engine.

## Read more

- [N-Toki V2 specification](spec/N-Toki_Spec_V2.md)
- [N-Toki: Reclaiming Lived Time (working paper)](spec/N-Toki_Research_Paper.md)

## Credits

- Micro-season names: [Japan's 72 Microseasons, nippon.com](https://www.nippon.com/en/features/h00124/), following court astronomer Shibukawa Shunkai's 1685 revision.
- Solar position: low-precision formulas after Jean Meeus, *Astronomical Algorithms*, and the SunCalc sunrise method.
- The micro-seasons were suggested by the author of the post that inspired N-Toki. Thank you.

## License

Code: MIT. The N-Toki name, logo and companion art are not licensed for others' branding.
