# N-TOKI — Product & Build Specification V2.0

Draft · 27 October 2026 · Gabriel

**Tagline:** Time never runs out. Time runs through us.
**Name:** N-Toki, pronounced *en-toki*: 円 (circle, and yen), 縁 (the bond between people), 時 (time). Final name subject to a trademark search (Section 17).

---

## 0. What changed since V1

V2 turns the V1 concept into a working, sun-accurate clock and adds the year: the 72 micro-seasons. It adds a light, non-intrusive social layer, three languages, and desktop packaging. Messaging, accounts and the moon move to V3; work and economics to V4 and later.

| Area | V1 spec | V2 |
| --- | --- | --- |
| Toki boundaries | Rabbit starts at sunrise | **Centered:** each toki is centered on a moment of the sun (Section 3) |
| Color | 12 flat swatches | **Sun-height arc:** darkest at true midnight, pale gold at the sun's peak (Section 7) |
| Second screen | Linear timeline | **Cycle dial:** south-facing ring, segments at true length (Section 6) |
| The year | Not covered | **72 micro-seasons (kō)** and 24 solar terms (Section 4) |
| Labels | Kanji only | Kanji · Animal · Bells |
| Languages | English | English · 日本語 · 简体中文, auto-detected |
| Places | Device location or city | World cities, "Use my location", custom coordinates |
| Social | Accounts, friends, messaging | **No accounts:** invitation links, sky postcards, recurring windows (Section 11) |
| Platforms | iOS first | Installable web app + Windows desktop now; native iOS/Android + widgets in V3 |
| Messaging, accounts | V1 Release B | Moved to V3 |
| Moon | Not covered | V3 |
| Work and economics | Future framework | V4 and later |

---

## 1. Vision

N-Toki is a living clock that follows the sun through the day and the year. It brings back two ways of keeping time that Japan set aside in its 1872–73 calendar reform: the twelve unequal toki of the day and the 72 micro-seasons of the year.

The purpose is time sovereignty. People should be able to read their day and their year by the sky, with conventional time always one press away when precision matters. The path is cultural first: experience, then a shared language, then economics.

### Principles (unchanged from V1, now enforced in code)

1. Experience before measurement.
2. Nature before arbitrary schedules: the sun and, later, the moon set every boundary.
3. Simplicity before features.
4. Connection before engagement.
5. Precision on demand.
6. No artificial urgency: no streaks, scores, feeds, counts, or pull notifications.
7. Personal autonomy, local first.

---

## 2. Release scope

| Release | Theme | Contents |
| --- | --- | --- |
| **V2** (this spec) | Day + year, shared lightly | Centered toki, color arc, cycle dial, **72 kō**, languages, places, time travel, **invitation links, sky postcards, recurring windows**, installable web app, Windows wallpaper, open-source engine, companion illustrations, first user test |
| **V3** | Moon + people | Lunar layer (12 or 13 months a year), optional accounts (passkeys, local-first sync), lightweight messaging between friends, shared bells and gatherings, native iOS/Android apps, Home and Lock Screen widgets, watch complications |
| **V4+** | Work and economics | Team toki windows, seasonal schedules, outcome-based projects, time-returned ledger, employer and community pilots with legal review |

---

## 3. The toki system (centered)

Each day has twelve toki: six spanning daylight and six spanning darkness. Each toki is **centered** on a moment of the sun, following the traditional zodiac-hour convention (正午, *shōgo*, noon = "true Horse").

| Anchor | Toki at its center |
| --- | --- |
| Sunrise | Rabbit 卯 |
| Sun at its height (solar noon) | Horse 午 |
| Sunset | Rooster 酉 |
| Middle of the night (solar midnight) | Rat 子 |

### 3.1 Definition

R = today's sunrise, S = today's sunset, R′ = next sunrise, S₋ = previous sunset (absolute timestamps).

```
D  = (S − R) / 6         one daylight toki
N  = (R′ − S) / 6        one night toki
N₋ = (R − S₋) / 6        one toki of the previous night

centers:  cₖ = R + k·D            for k = 0…6
          cₖ = S + (k − 6)·N      for k = 6…12
bounds:   b₀ = R − N₋/2
          bₖ = (cₖ₋₁ + cₖ) / 2    for k = 1…12
```

Rabbit and Rooster straddle the horizon: half night-length, half day-length.

### 3.2 Rules

- All math uses absolute timestamps, so daylight saving changes never move a boundary.
- **Polar day/night:** where the sun does not rise or set, show a clearly labeled fallback of equal two-hour toki centered on local noon and midnight. Never invent a sunrise.
- **Validation:** a full-year scan at 5-minute steps must produce no skipped or repeated toki (passed for Austin, 2026).

### 3.3 The twelve toki

| # | Toki | Kanji | Reading | JA name | ZH name | Bell | Bell (JA) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 0 | Rabbit | 卯 | U | 卯の刻 | 卯时 (mǎo) | 6 | 明け六つ |
| 1 | Dragon | 辰 | Tatsu | 辰の刻 | 辰时 (chén) | 5 | 朝五つ |
| 2 | Snake | 巳 | Mi | 巳の刻 | 巳时 (sì) | 4 | 昼四つ |
| 3 | Horse | 午 | Uma | 午の刻 | 午时 (wǔ) | 9 | 昼九つ |
| 4 | Sheep | 未 | Hitsuji | 未の刻 | 未时 (wèi) | 8 | 昼八つ |
| 5 | Monkey | 申 | Saru | 申の刻 | 申时 (shēn) | 7 | 夕七つ |
| 6 | Rooster | 酉 | Tori | 酉の刻 | 酉时 (yǒu) | 6 | 暮れ六つ |
| 7 | Dog | 戌 | Inu | 戌の刻 | 戌时 (xū) | 5 | 宵五つ |
| 8 | Boar | 亥 | I | 亥の刻 | 亥时 (hài) | 4 | 夜四つ |
| 9 | Rat | 子 | Ne | 子の刻 | 子时 (zǐ) | 9 | 夜九つ |
| 10 | Ox | 丑 | Ushi | 丑の刻 | 丑时 (chǒu) | 8 | 夜八つ |
| 11 | Tiger | 寅 | Tora | 寅の刻 | 寅时 (yín) | 7 | 暁七つ |

---

## 4. The year: 72 micro-seasons (七十二候, *shichijūni-kō*) — new in V2

The day is divided by the sun into twelve toki; the year is divided by the sun into 24 solar terms (二十四節気, *sekki*) and 72 micro-seasons (*kō*) of about five days each. Each kō has a short poetic name, such as 霜始降 *shimo hajimete furu*, "first frost." The names came from China and were revised for Japan's climate by court astronomer Shibukawa Shunkai in 1685.

*Origin of this feature:* suggested by the author of the post that inspired N-Toki. Credit them in the release notes and tag them when it ships.

### 4.1 Definition (astronomical, not calendar dates)

Kō are tied to the sun's ecliptic longitude λ, not to fixed dates, so they stay correct every year.

```
sekki index  s = floor( ((λ − 315°) mod 360°) / 15° )     0 = Risshun 立春
kō index     k = floor( ((λ − 315°) mod 360°) / 5° )      0 = 東風解凍 … 71 = 鶏始乳
kō start     = the instant λ crosses 315° + 5°·k  (solve by bisection on the engine's sun model)
```

- The engine already computes λ for sunrise; reuse it. Required accuracy: kō boundaries within ±1 day of the published dates.
- **Southern hemisphere:** the names describe a northern year. For latitude < 0, shift λ by 180° and show a one-line note ("Seasons shifted for the southern hemisphere"). Allow switching this off.
- **Equatorial note:** near the equator seasons are weak; still show the kō, which describe the Japanese year they came from.

### 4.2 Where kō appear

- **Living Clock:** one quiet line under the bell: `霜始降 · First frost · Oct 23–27`. Tap for the kō card.
- **Kō card:** kanji, reading, translation, its sekki, start and end dates for this place, a two-sentence note, and the previous and next kō.
- **Year view (third screen):** a ring of 72 segments grouped into 24 sekki, colored by season. Spring greens → summer golds → autumn ambers → winter blues. Same interaction model as the cycle dial: a "now" hand, tap any kō to center it.
- **Time travel:** changing the date updates the kō.

### 4.3 Languages

- **EN:** English translation (Appendix A) plus the romanized reading.
- **JA:** kanji name plus kana reading (kana to be added from a published reading source; readings vary between sources).
- **ZH:** the Japanese kanji name plus a Simplified Chinese gloss. Note in the kō card that China's own 72 hou differ in places, and that N-Toki uses the Japanese set.

### 4.4 Acceptance

- The current kō matches published Japanese dates within ±1 day for 2026 and 2027.
- The southern flip works for Sydney and is clearly labeled.
- All 72 names are present in EN, JA (with readings) and ZH.

---

## 5. Living Clock (V2 state)

- Atmospheric sky driven by the sun's position; the incoming toki enters from the left, the outgoing one lingers on the right; no reset at a boundary.
- Seal ring with the toki glyph (kanji, animal, or bell number), progress ring, name, reading, and bell line.
- **New in V2:** the kō line under the bell.
- Press and hold anywhere for conventional time: time, date, sunrise, sun at its height, sunset, this toki's window, time left, daylight and night toki lengths. A "Clock time" button gives the same without gestures.
- Tap the companion for the toki's story, bell, and place in the day ("Centered on sunrise (7:41)").
- After sunset only, one quiet line: "The sun has set. The day asks nothing more of you."
- **Wallpaper mode:** sky and companion only, sized for a desktop, no controls.

---

## 6. Cycle dial

- Ring of 12 connected segments, each sized to its true length today.
- Read facing south: sunrise on the left, Horse at the top, sunset on the right, Rat at the bottom.
- A hand shows now; a thin inner arc shows how much of the cycle has passed. Past segments keep their true color (no dark shading).
- Ticks outside the ring mark sunrise, the sun's height, sunset, and the middle of the night, with a legend of their times.
- The center shows the current toki by default. Tapping any segment lifts it and moves its glyph, name, window and status ("Begins in 3 h 10 min") to the center. A "Show the current toki" button returns.
- Label switch: Kanji · Animal · Bells, applied to the dial and the clock together.

---

## 7. Color system: the sun-height arc

The palette follows the sun's height. Colors are anchored at each toki's midpoint and blended in OKLab, so every transition is continuous.

| Toki | Moment | Color | Hex |
| --- | --- | --- | --- |
| Rabbit | Sunrise | Pale dawn green | #B9D4AE |
| Dragon | Morning | Pale green-gold | #D8E5B2 |
| Snake | Late morning | Pale yellow | #EDE7AE |
| Horse | Sun at its height | Pale gold, brightest | #FFEDA8 |
| Sheep | Early afternoon | Gold | #FFD27A |
| Monkey | Late afternoon | Orange | #FFA45C |
| Rooster | Sunset | Red-orange | #F2704E |
| Dog | Dusk | Pink | #E06C9C |
| Boar | Evening | Purple | #6A4E9E |
| Rat | Middle of the night | Darkest blue-black | #0E1729 |
| Ox | Deep night | Midnight blue | #15233F |
| Tiger | Before dawn | Teal | #3E7477 |

Text switches between dark and light ink at an OKLab lightness of 0.62. The palette must stay readable for the main kinds of color blindness: never rely on color alone, and always show names or glyphs.

---

## 8. Labels and languages

- **Label modes:** Kanji (午) · Animal (Horse / うま / 马) · Bells (9).
- **Languages:** English, 日本語, 简体中文. On first open, N-Toki picks the first supported language in the device's list, otherwise English. The globe button switches it, and the choice is remembered on the device.
- Every string lives in one table per language. Adding a language means adding one table plus the 12 toki names and 72 kō names. Priority community languages for V2.x: Spanish, Portuguese, Korean, Traditional Chinese, French, German, Hindi.
- Times and dates follow the language's locale (7:41 AM / 7:41 / 7:41).
- Simplified Chinese uses Noto Serif SC and Noto Sans SC, with system fallbacks.

---

## 9. Places

- **City list** (worldwide; expand from 16 to about 60 in V2).
- **Use my location:** the browser's location prompt; coordinates stay on the device; time zone from the device.
- **Custom coordinates:** latitude, longitude, time zone.
- The chosen place is remembered on the device only.

---

## 10. Time travel

- Choose a date and time to see its toki, its kō, and the day's toki lengths.
- **Play the whole day:** one full twelve-toki cycle in about 45 seconds.
- **New in V2: Play the year.** All 72 kō in about 72 seconds on the year view.
- A "Now" pill always returns to the present.

---

## 11. Social layer V2: shared, not intrusive

**Principle:** N-Toki helps people meet and share the sky. It never watches, ranks, or pulls. There are no accounts, feeds, follower counts, read receipts, "online now" indicators or social notifications in V2.

### 11.1 Toki invitations (links)

1. A person picks a toki (or part of one), a date, a short title and an optional place: "Coffee · Monkey toki · Sat."
2. N-Toki makes a link. The invitation lives entirely in the link (in the part after `#`, which browsers never send to a server): title, toki, and the exact start and end timestamps.
3. The recipient opens the link without an account and sees the Monkey color, companion, and the window **in their own time zone**: "Sat · 4:03 – 5:54 PM your time."
4. Actions: "Add to calendar" (an .ics file with exact times), "Open in N-Toki."
5. Exact appointments keep an exact timestamp underneath and are labeled "Exact time."

Privacy: links carry no sender location unless the sender types a place. Nothing is stored on a server.

### 11.2 Recurring windows

A standing invitation such as "Tea · Sheep toki · every Sunday." The link stores the toki and the rule; each recipient's app computes each week's window for their own sky. This is the seed of shared rituals.

### 11.3 Sky postcards

Share an image of the current sky: the gradient, the companion, the toki, and the kō line ("霜始降 · First frost"), with a small N-Toki mark and link. It's for sharing culture, not for collecting likes.

### 11.4 Not in V2 (moved to V3)

Accounts, friend lists, messaging, shared bells, gatherings, presence.

---

## 12. Platforms and packaging

| Platform | V2 delivery | Status |
| --- | --- | --- |
| Any browser | Hosted, installable web app (PWA) at a public HTTPS address: offline support, home-screen icon on phones and desktops | To build |
| Windows desktop window | `Open N-Toki window.bat` opens Edge in app mode (no browser chrome) | Built |
| Windows live wallpaper | `n-toki-wallpaper.html` hosted by Lively Wallpaper (free, open source) | Built |
| Windows wallpaper, no install | Script: Edge (built into Windows) renders the sky to an image every 5 minutes; Task Scheduler sets it as the wallpaper. Not animated, but changes through the day. | To build |
| macOS | Same app-window approach; a wallpaper script later | V2.x |
| iOS / Android widgets | Need native apps | V3 |

Note: a web page cannot set itself as the desktop wallpaper; operating systems block that for security. A host program or a script is always required.

---

## 13. Open-source strategy

- **Open (MIT license):** the toki and kō specification and a reference engine: `sun.js` (sunrise, sunset, solar longitude), `toki.js` (centered cycle), `ko.js` (72 kō, 24 sekki, hemisphere flip). Pure functions, no dependencies, with unit tests and a full-year validation scan.
- **Owned:** the N-Toki name, logo, companion illustrations, app design and copy.
- **Repository layout:** `/engine`, `/spec`, `/app`, `/i18n` (one file per language), `/desktop` (launcher, wallpaper, scripts).
- **Contributions:** languages, city lists and accessibility fixes welcome; changes to the system's rules go through the spec.

---

## 14. Companion illustrations (V2)

- Twelve animals in one consistent hand-drawn style, readable at 24 px and beautiful at 360 px.
- Each in one resting pose for V2; day and night poses in V3.
- Art direction to be reviewed with Japanese illustrators and cultural advisers. Credit the artist in the app.

---

## 15. Privacy and accessibility (carried from V1, now required)

- The core clock works offline with no account; location never leaves the device.
- No advertising, behavioral tracking, or sale of data.
- Reduced motion respected; sky animation pauses when the page is hidden.
- Screen-reader labels on every control; progress available as text; all gestures have button equivalents.
- Contrast checked against every point of the color arc.

---

## 16. Research and acceptance

### 16.1 First user test (V2 gate)

10–20 people, two weeks, using the installable web app. Hypotheses from the N-Toki paper:

| # | Hypothesis | Measure |
| --- | --- | --- |
| H1 | Toki are understood with under a minute of explanation | Can name the current toki and say when Horse falls |
| H2 | People return without prompts | Days opened per week, with bells off |
| H3 | The toki view feels less pressured than a countdown clock | Short self-report scale, before and after |
| H4 | Invitations are understood and kept | Invites accepted and meetups that happen |
| H5 | Solar awareness grows | Can estimate local solar noon within 15 minutes |
| H6 | The language spreads | New people arriving through invitation links |

### 16.2 V2 acceptance criteria

- Toki: correct for any date and place; full-year scan clean; DST and polar cases handled.
- Kō: within ±1 day of published dates; southern flip labeled.
- Invitations: correct window in each recipient's time zone, including across the international date line; exact times preserved.
- Languages: no untranslated strings in EN, JA or ZH.
- Performance: smooth on a mid-range phone; no background CPU use when hidden.

---

## 17. Name and brand

- **First choice:** N-Toki, "N, pronounced *en*." 円 for circle and yen, 縁 for the bonds between people, 時 for time.
- **Before launch:** search the USPTO trademark database and Japan's J-PlatPat for software (class 9), online services (class 42) and clocks (class 14). Check app stores and domains. Not legal advice; consult a trademark attorney before filing.
- **Fallbacks:** *Utsuroi* (移ろい, the shifting of the seasons). Avoid *Utsu* alone (鬱 means depression in Japanese). *Wadokei* (和時計) and *hidokei* (日時計) are generic words and weak as marks.

---

## 18. V3 and beyond

### V3: Moon and people

- **Moon layer:** the current phase and lunar month. Years with 13 new moons show 13 months, as the old lunisolar calendar did with its leap month (閏月).
- **Optional accounts:** passkeys, local-first sync, data export and deletion.
- **Lightweight messaging** between accepted friends, with block and report.
- **Shared bells and gatherings:** opt-in group rituals ("our tea bell rings at Sheep on Sundays").
- **Native iOS and Android apps,** Home and Lock Screen widgets, watch complications.
- Companion day and night poses.

### V4 and later: work and economics

- Team toki windows instead of office hours.
- Seasonal schedules: shorter working daylight in winter.
- Outcome-based projects.
- A time-returned ledger that shows hours given back through automation.
- Pilots with willing employers and communities, with legal review of wage-and-hour records.

---

## 19. Open questions

1. Which hosting for the public web app (GitHub Pages, Cloudflare Pages, other)?
2. Kana readings for the 72 kō: which published source do we standardize on?
3. Year view in V2.0 or V2.1?
4. Do recurring windows ship in V2.0 or follow invitations?
5. Who illustrates the companions, and who are the cultural advisers?

---

## Appendix A: The 72 kō

Source: [Japan's 72 Microseasons, nippon.com](https://www.nippon.com/en/features/h00124/). Dates are approximate and may shift by a day; N-Toki calculates them from the sun's position. English renderings paraphrase the source.

| # | Sekki | Kanji | Reading | English | Approx. dates |
| --- | --- | --- | --- | --- | --- |
| 1 | Risshun 立春 | 東風解凍 | Harukaze kōri o toku | East wind thaws the ice | Feb 4–8 |
| 2 | Risshun | 黄鶯睍睆 | Kōō kenkan su | Warblers sing in the hills | Feb 9–13 |
| 3 | Risshun | 魚上氷 | Uo kōri o izuru | Fish rise beneath the ice | Feb 14–18 |
| 4 | Usui 雨水 | 土脉潤起 | Tsuchi no shō uruoi okoru | Rain softens the soil | Feb 19–23 |
| 5 | Usui | 霞始靆 | Kasumi hajimete tanabiku | Mist begins to linger | Feb 24–28 |
| 6 | Usui | 草木萌動 | Sōmoku mebae izuru | Plants begin to sprout | Mar 1–5 |
| 7 | Keichitsu 啓蟄 | 蟄虫啓戸 | Sugomori mushi to o hiraku | Hibernating insects emerge | Mar 6–10 |
| 8 | Keichitsu | 桃始笑 | Momo hajimete saku | First peach blossoms | Mar 11–15 |
| 9 | Keichitsu | 菜虫化蝶 | Namushi chō to naru | Caterpillars become butterflies | Mar 16–20 |
| 10 | Shunbun 春分 | 雀始巣 | Suzume hajimete sukū | Sparrows start nesting | Mar 21–25 |
| 11 | Shunbun | 櫻始開 | Sakura hajimete saku | First cherry blossoms | Mar 26–30 |
| 12 | Shunbun | 雷乃発声 | Kaminari sunawachi koe o hassu | Distant thunder | Mar 31–Apr 4 |
| 13 | Seimei 清明 | 玄鳥至 | Tsubame kitaru | Swallows return | Apr 5–9 |
| 14 | Seimei | 鴻雁北 | Kōgan kaeru | Wild geese fly north | Apr 10–14 |
| 15 | Seimei | 虹始見 | Niji hajimete arawaru | First rainbows | Apr 15–19 |
| 16 | Kokuu 穀雨 | 葭始生 | Ashi hajimete shōzu | Reeds sprout | Apr 20–24 |
| 17 | Kokuu | 霜止出苗 | Shimo yamite nae izuru | Frost ends, rice seedlings grow | Apr 25–29 |
| 18 | Kokuu | 牡丹華 | Botan hana saku | Peonies bloom | Apr 30–May 4 |
| 19 | Rikka 立夏 | 蛙始鳴 | Kawazu hajimete naku | Frogs start singing | May 5–9 |
| 20 | Rikka | 蚯蚓出 | Mimizu izuru | Worms surface | May 10–14 |
| 21 | Rikka | 竹笋生 | Takenoko shōzu | Bamboo shoots sprout | May 15–20 |
| 22 | Shōman 小満 | 蚕起食桑 | Kaiko okite kuwa o hamu | Silkworms feast on mulberry leaves | May 21–25 |
| 23 | Shōman | 紅花栄 | Benibana sakau | Safflowers bloom | May 26–30 |
| 24 | Shōman | 麦秋至 | Mugi no toki itaru | Wheat ripens and is harvested | May 31–Jun 5 |
| 25 | Bōshu 芒種 | 蟷螂生 | Kamakiri shōzu | Praying mantises hatch | Jun 6–10 |
| 26 | Bōshu | 腐草為螢 | Kusaretaru kusa hotaru to naru | Rotten grass becomes fireflies | Jun 11–15 |
| 27 | Bōshu | 梅子黄 | Ume no mi kibamu | Plums turn yellow | Jun 16–20 |
| 28 | Geshi 夏至 | 乃東枯 | Natsukarekusa karuru | Self-heal withers | Jun 21–26 |
| 29 | Geshi | 菖蒲華 | Ayame hana saku | Irises bloom | Jun 27–Jul 1 |
| 30 | Geshi | 半夏生 | Hange shōzu | Crow-dipper sprouts | Jul 2–6 |
| 31 | Shōsho 小暑 | 温風至 | Atsukaze itaru | Warm winds blow | Jul 7–11 |
| 32 | Shōsho | 蓮始開 | Hasu hajimete hiraku | First lotus blossoms open | Jul 12–16 |
| 33 | Shōsho | 鷹乃学習 | Taka sunawachi waza o narau | Young hawks learn to fly | Jul 17–22 |
| 34 | Taisho 大暑 | 桐始結花 | Kiri hajimete hana o musubu | Paulownia sets seed | Jul 23–28 |
| 35 | Taisho | 土潤溽暑 | Tsuchi uruōte mushi atsushi | Earth is damp, air is muggy | Jul 29–Aug 2 |
| 36 | Taisho | 大雨時行 | Taiu tokidoki furu | Heavy rains fall at times | Aug 3–7 |
| 37 | Risshū 立秋 | 涼風至 | Suzukaze itaru | Cool winds blow | Aug 8–12 |
| 38 | Risshū | 寒蝉鳴 | Higurashi naku | Evening cicadas sing | Aug 13–17 |
| 39 | Risshū | 蒙霧升降 | Fukaki kiri matō | Thick fog descends | Aug 18–22 |
| 40 | Shosho 処暑 | 綿柎開 | Wata no hana shibe hiraku | Cotton flowers bloom | Aug 23–27 |
| 41 | Shosho | 天地始粛 | Tenchi hajimete samushi | Heat begins to subside | Aug 28–Sep 1 |
| 42 | Shosho | 禾乃登 | Kokumono sunawachi minoru | Rice ripens | Sep 2–7 |
| 43 | Hakuro 白露 | 草露白 | Kusa no tsuyu shiroshi | Dew on grass glistens white | Sep 8–12 |
| 44 | Hakuro | 鶺鴒鳴 | Sekirei naku | Wagtails sing | Sep 13–17 |
| 45 | Hakuro | 玄鳥去 | Tsubame saru | Swallows leave | Sep 18–22 |
| 46 | Shūbun 秋分 | 雷乃収声 | Kaminari sunawachi koe o osamu | Thunder ceases | Sep 23–27 |
| 47 | Shūbun | 蟄虫坏戸 | Mushi kakurete to o fusagu | Insects hole up underground | Sep 28–Oct 2 |
| 48 | Shūbun | 水始涸 | Mizu hajimete karuru | Farmers drain fields | Oct 3–7 |
| 49 | Kanro 寒露 | 鴻雁来 | Kōgan kitaru | Wild geese return | Oct 8–12 |
| 50 | Kanro | 菊花開 | Kiku no hana hiraku | Chrysanthemums bloom | Oct 13–17 |
| 51 | Kanro | 蟋蟀在戸 | Kirigirisu to ni ari | Crickets chirp around the door | Oct 18–22 |
| 52 | Sōkō 霜降 | 霜始降 | Shimo hajimete furu | First frost | Oct 23–27 |
| 53 | Sōkō | 霎時施 | Kosame tokidoki furu | Light rain falls at times | Oct 28–Nov 1 |
| 54 | Sōkō | 楓蔦黄 | Momiji tsuta kibamu | Maple and ivy turn yellow | Nov 2–6 |
| 55 | Rittō 立冬 | 山茶始開 | Tsubaki hajimete hiraku | Camellias bloom | Nov 7–11 |
| 56 | Rittō | 地始凍 | Chi hajimete kōru | Land begins to freeze | Nov 12–16 |
| 57 | Rittō | 金盞香 | Kinsenka saku | Daffodils bloom | Nov 17–21 |
| 58 | Shōsetsu 小雪 | 虹蔵不見 | Niji kakurete miezu | Rainbows hide | Nov 22–26 |
| 59 | Shōsetsu | 朔風払葉 | Kitakaze konoha o harau | North wind strips the leaves | Nov 27–Dec 1 |
| 60 | Shōsetsu | 橘始黄 | Tachibana hajimete kibamu | Tachibana citrus begins to yellow | Dec 2–6 |
| 61 | Taisetsu 大雪 | 閉塞成冬 | Sora samuku fuyu to naru | Cold sets in, winter begins | Dec 7–11 |
| 62 | Taisetsu | 熊蟄穴 | Kuma ana ni komoru | Bears start hibernating | Dec 12–16 |
| 63 | Taisetsu | 鱖魚群 | Sake no uo muragaru | Salmon gather and swim upstream | Dec 17–21 |
| 64 | Tōji 冬至 | 乃東生 | Natsukarekusa shōzu | Self-heal sprouts | Dec 22–26 |
| 65 | Tōji | 麋角解 | Sawashika no tsuno otsuru | Deer shed antlers | Dec 27–31 |
| 66 | Tōji | 雪下出麦 | Yuki watarite mugi nobiru | Wheat sprouts under snow | Jan 1–4 |
| 67 | Shōkan 小寒 | 芹乃栄 | Seri sunawachi sakau | Parsley flourishes | Jan 5–9 |
| 68 | Shōkan | 水泉動 | Shimizu atataka o fukumu | Springs thaw | Jan 10–14 |
| 69 | Shōkan | 雉始雊 | Kiji hajimete naku | Pheasants start to call | Jan 15–19 |
| 70 | Daikan 大寒 | 款冬華 | Fuki no hana saku | Butterburs bud | Jan 20–24 |
| 71 | Daikan | 水沢腹堅 | Sawamizu kōri tsumeru | Ice thickens on streams | Jan 25–29 |
| 72 | Daikan | 鶏始乳 | Niwatori hajimete toya ni tsuku | Hens start laying eggs | Jan 30–Feb 3 |

---

*End of N-Toki Product & Build Specification — Draft V2.0*
