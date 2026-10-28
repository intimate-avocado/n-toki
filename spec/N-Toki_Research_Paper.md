# N-Toki: Reclaiming Lived Time

*A seasonal clock, a shared language of time, and the case for time sovereignty*

Working paper, draft 1 · intimate-avocado · 26 October 2026

---

## Abstract

N-Toki is a seasonal clock that divides each day into twelve *toki*, periods anchored to the real movement of the sun, adapted from the temporal-hour system Japan used until 1873. This paper argues that equal clock hours turned time into a measurable, saleable unit of labor, and that a widely lived alternative must exist before work can be reorganized around autonomy.

We define the centered toki system formally, describe a working prototype, and set out a three-stage theory of change: experience, then shared language, then economics. We close with testable hypotheses, risks, and an open-source strategy. N-Toki makes no medical claims; its effects on stress and wellbeing are hypotheses to be tested, not findings.

---

## 1. Introduction

Time became something people could sell when it became something that could be counted in identical units. Once every hour was the same length everywhere and in every season, an hour of a person's life could be priced, bought, and audited. N-Toki starts from a simple proposition: *time became something they could sell; it is time to sell it back.*

Most people now experience their day mainly as a countdown. The clock tells them how much time remains, how late they are, and what is due. Meanwhile the day itself, its light, its length, the way it shifts across the year, has dropped out of view. A 12:00 on the screen is not noon in the sky. In Tokyo on 26 October 2026, the sun reached its highest point at 11:26 AM; in Austin, Texas, the same day, at 1:16 PM.

N-Toki proposes an additional layer, not a replacement. It gives people a clock that follows the sun, divides daylight and darkness into six toki each, and lets conventional time appear only when precision is actually needed. The long-term aim is cultural: a shared, felt language of time that makes it thinkable to organize life and work around something other than the billable hour.

This paper makes four contributions:

1. A historical argument linking equal hours to the commodification of labor time, with Japan's 1873 transition as a concrete case.
2. A formal, reproducible definition of the centered twelve-toki cycle, including edge cases.
3. A theory of change in three stages, with the product design that serves the first stage.
4. A research agenda of falsifiable hypotheses and the risks that could make the project fail.

---

## 2. Background: how time became a unit of sale

For most of history, hours followed the sun. Many societies, including Edo-period Japan, divided daylight and darkness into equal shares, so an hour of daylight was longer in summer than in winter. Equal, fixed hours became the norm only as mechanical clocks, factories and railways required a single shared measure.

### 2.1 From task time to clock time

The historian E. P. Thompson described this shift in his 1967 essay *Time, Work-Discipline, and Industrial Capitalism* [1]. In pre-industrial work, effort followed the task and the season. Under wage labor, the employer's clock measured work, and time moved from something that passes to something that is spent.

Thompson documents how this discipline was imposed through time-sheets, fines, bells, and schooling, and how workers resisted it. His central point for N-Toki is that the clock-based valuation of time is a historical product, not a law of nature. What was built can be rebuilt.

### 2.2 Standard time

Before 1883, North America ran on more than 144 local times, and railroads alone used about 80. On 18 November 1883, the railroads switched to standard time zones adopted by their own General Time Convention. Congress made standard time federal law only in 1918 [2]. The clock most people live by was set by commerce first and by law later.

### 2.3 Japan's temporal hours and the 1873 reform

In Edo-period Japan, daytime and nighttime were each divided into six periods whose length changed with the season. Each period carried a zodiac animal, and bells counted the hours down from nine to four, so dawn and dusk were both the sixth hour [3]. Clockmakers built *wadokei* with adjustable weights and dials to follow these shifting hours.

The historian Yulia Frumer shows that Tokugawa society was highly time-conscious: diaries, contracts and court records ran on hour marks [4]. Several time systems coexisted, each judged by how well it fit a task. As astronomy came to stand for rationality and progress, Western mean time came to be treated as the one true time.

After the Meiji Restoration, Ordinance No. 453 of 1872 moved Japan to the solar calendar, and in 1873 the government adopted Western equal hours [3]. Japan set aside its sun-shaped hours as part of joining the industrial world order. N-Toki returns to the point where that choice was made.

### 2.4 Chronology

| Year | Event | Why it matters here |
| --- | --- | --- |
| 1603–1868 | Edo-period Japan keeps unequal temporal hours | A complete, lived alternative to equal hours |
| 1844 | Japanese calendar revised to vary hour lengths through the year | Seasonal time was refined, not abandoned |
| 1873 | Japan adopts Western equal hours | Sun time traded for industrial time |
| 1883 | North American railroads adopt standard time zones | Commerce sets the public clock |
| 1918 | US Standard Time Act | The commercial clock becomes law |
| 1930 | Keynes predicts roughly fifteen-hour work weeks for his grandchildren | Productivity was expected to return time |
| 1967 | Thompson publishes his essay on time and work-discipline | Clock time named as a historical product |
| 2022 | UK four-day week pilot, 61 companies | Shorter work time tested at scale |

---

## 3. The toki system

N-Toki divides each solar day into twelve toki: six spanning daylight and six spanning darkness, each centered on a moment of the sun. Rabbit is centered on sunrise, Horse on the sun's highest point, Rooster on sunset, and Rat on the middle of the night. This follows the traditional zodiac-hour convention in which noon is *shōgo* (正午, "true Horse").

### 3.1 Definition

Let **R** be today's sunrise, **S** today's sunset, **R′** the next sunrise, and **S₋** the previous sunset, all as absolute timestamps. The daylight and night toki lengths are:

```
D  = (S − R) / 6        length of one daylight toki
N  = (R′ − S) / 6       length of one night toki
N₋ = (R − S₋) / 6       length of one toki of the previous night
```

Toki *k* (k = 0 for Rabbit through k = 11 for Tiger) is centered on the instant *cₖ*, and its boundaries fall halfway between neighboring centers:

```
cₖ = R + k·D              for 0 ≤ k ≤ 6
cₖ = S + (k − 6)·N        for 6 ≤ k ≤ 12

b₀ = R − N₋/2
bₖ = (cₖ₋₁ + cₖ) / 2      for 1 ≤ k ≤ 12
```

In practice the cycle opens half a night toki before sunrise, steps by D through the day and by N through the night. Rabbit and Rooster straddle the horizon: half night-length, half day-length.

### 3.2 The twelve toki, with a worked example

The table gives each toki's traditional name and bell, and its actual window in Tokyo on 26 October 2026 (sunrise 5:58 AM, sunset 4:54 PM, local time). That day each daylight toki lasted 1 h 49 min and each night toki 2 h 11 min.

| Toki | Kanji | Reading | Bell | Centered on | Tokyo, 26 Oct 2026 |
| --- | --- | --- | --- | --- | --- |
| Rabbit | 卯 | U | Sixth (明け六つ) | Sunrise, 5:58 AM | 4:53 – 6:52 AM |
| Dragon | 辰 | Tatsu | Fifth | | 6:52 – 8:42 AM |
| Snake | 巳 | Mi | Fourth | | 8:42 – 10:31 AM |
| Horse | 午 | Uma | Ninth (昼九つ) | Sun at its height, 11:26 AM | 10:31 AM – 12:21 PM |
| Sheep | 未 | Hitsuji | Eighth | | 12:21 – 2:10 PM |
| Monkey | 申 | Saru | Seventh | | 2:10 – 4:00 PM |
| Rooster | 酉 | Tori | Sixth (暮れ六つ) | Sunset, 4:54 PM | 4:00 – 6:00 PM |
| Dog | 戌 | Inu | Fifth | | 6:00 – 8:11 PM |
| Boar | 亥 | I | Fourth | | 8:11 – 10:21 PM |
| Rat | 子 | Ne | Ninth (夜九つ) | Middle of the night, 11:27 PM | 10:21 PM – 12:32 AM |
| Ox | 丑 | Ushi | Eighth | | 12:32 – 2:43 AM |
| Tiger | 寅 | Tora | Seventh | | 2:43 – 4:53 AM |

By the sun, noon in Tokyo that day was 11:26 AM and midnight 11:27 PM: Tokyo lies east of its time zone's reference meridian, and the equation of time adds about a quarter hour in late October. In Austin, Texas, the same day, solar noon fell at 1:16 PM, pushed the other way by longitude and daylight saving time.

### 3.3 Toki follow the seasons

Because D and N are recomputed every day, toki stretch and shrink through the year. Near the equator they barely change; at high latitudes the swing is large. In Tokyo, one daylight toki runs from 1 h 37 min at the winter solstice to 2 h 26 min at the summer solstice. Austin, further south, swings a little less.

Length of one daylight toki on the 21st of each month (minutes, calculated by the N-Toki engine):

| City | Jan | Feb | Mar | Apr | May | Jun | Jul | Aug | Sep | Oct | Nov | Dec |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tokyo | 101 | 111 | 121 | 133 | 142 | 146 | 142 | 133 | 122 | 111 | 102 | 97 |
| Austin | 105 | 113 | 122 | 131 | 138 | 141 | 138 | 131 | 122 | 113 | 105 | 102 |

### 3.4 Edge cases

- **Daylight saving time.** All arithmetic uses absolute timestamps, so a clock change does not move a toki boundary. On the night US clocks fell back in 2026, a Texas night toki still ran exactly as the sun dictated; only the labels on the clock changed.
- **Polar day and polar night.** Where the sun does not rise or set, there is no anchor. N-Toki shows a clearly labeled fallback of equal two-hour toki, still centered on local noon and midnight, and never invents a sunrise.
- **Historical fidelity.** Edo practice defined dawn and dusk by observable twilight rather than astronomical sunrise, and several conventions coexisted [4]. N-Toki is a modern system inspired by that practice, not a reconstruction of an Edo clock. A historical twilight mode is a possible later option.
- **Validation.** The prototype engine was scanned across all of 2026 at 5-minute steps. It produced no skipped or repeated toki and needed no fallback.

---

## 4. Time sovereignty

Time sovereignty is a person's ability to decide how their own time is experienced, measured, and spent, rather than having all three set by an employer, a platform, or a commercial standard. N-Toki treats it as the project's core value and its design test: every feature must leave a person more in charge of their time than before.

The idea sits inside a wider mission: building companies that **nourish the body, protect the mind, and elevate the spirit**. N-Toki maps onto all three.

| Pillar | What it means for time | What N-Toki does |
| --- | --- | --- |
| Nourish the body | Live in step with the actual sun where you are | Toki follow real sunrise, solar noon and sunset for your location and season |
| Protect the mind | Freedom from attention extraction and countdown pressure | No streaks, no feeds, bells off by default; the clock knows when to leave you alone at night |
| Elevate the spirit | Ritual, heritage, and connection | Zodiac companions, temple-bell numbering, and plans made in a shared language of time |
| Foundation | Software that cannot be turned against its users | Local-first, offline, no account, open standard |

### 4.1 What sovereignty demands of the software

A product about reclaiming time cannot quietly harvest attention or data. Sovereignty therefore sets hard requirements on N-Toki itself:

- **Local first.** Sunrise, sunset and every toki are calculated on the device. The clock works offline and needs no account.
- **Location stays home.** Coordinates are never sent to a server unless a person opts into a feature that requires it.
- **No engagement machinery.** No streaks, rankings, infinite feeds, or notifications designed to pull people back. Bells are off until a person turns them on.
- **Precision on demand.** Conventional time is always one press away. Sovereignty includes the freedom to be on time for a 3:00 PM appointment.
- **An open core.** The toki standard and its reference engine are published openly, so no single company can own the language of time it creates (Section 10).

### 4.2 What sovereignty is not

It is not a withdrawal from shared schedules or legal obligations. Trains, shifts and court dates still run on standard time, and N-Toki keeps that time available underneath every toki. The claim is narrower: people should also have a second way to read their day, one that belongs to the sky rather than to the ledger.

---

## 5. Theory of change

The economic aim cannot come first. People will not reorganize work around a time system they have never lived in, so N-Toki moves in three stages, and each stage has to earn the next.

```
STAGE 1: EXPERIENCE        →   STAGE 2: SHARED LANGUAGE   →   STAGE 3: ECONOMICS
Feel time by the sun            Plan and speak in toki          Organize work around
                                                                autonomy and season
Produces: daily habit           Produces: shared vocabulary     Produces: new norms for
                                and real-world meetups          pay, schedules, seasons
Gate: people return             Gate: invites are understood    Gate: communities and
unprompted                      and kept                        employers opt in
```

**Stage 1, experience.** A person opens their phone and sees Monkey toki before they see 4:12 PM. The clock has to be beautiful, accurate, and calm enough that people return to it without being pushed. Success here means N-Toki is understood in seconds and missed when it is gone.

**Stage 2, shared language.** Time becomes culture when it is spoken between people. "Coffee during Monkey toki" is a plan that respects a window rather than a minute, and it only works if the other person can read it. Invitations, shared bells, and community gatherings turn a private habit into a shared vocabulary.

**Stage 3, economics.** Once enough people coordinate by toki, questions that sound radical today start to sound ordinary. Why is pay tied to hours rather than outcomes? Why does a December workday ask for the same daylight as a June one? Section 7 sets out where this could lead.

The order matters because each stage supplies what the next one needs: a felt experience gives the language meaning, and a shared language gives the economic proposals a constituency. Skipping ahead produces a scheduling tool, not a cultural shift.

---

## 6. The N-Toki product

A working prototype of Stage 1 exists today: a living clock and a cycle dial driven by real solar calculations for a chosen place. It runs entirely in the browser, with no account and no server.

### 6.1 The Living Clock

The main screen is an atmospheric sky that changes with the sun. The current toki's kanji sits inside a seal ring that fills as the toki progresses, with its English name, reading, and bell beneath. The incoming toki's color enters from the left while the outgoing one lingers on the right, so there is never a visual reset at a boundary.

- **Press and hold** anywhere to reveal conventional time, the date, sunrise, the sun's peak, sunset, and the current toki's window. Release, and the sky returns.
- **Tap the companion** to read the toki's story, bell, and place in the day.
- **After sunset,** a single quiet line appears: "The sun has set. The day asks nothing more of you."

### 6.2 The Cycle dial

The second view is a ring of twelve connected segments, each sized to its real length that day. It reads like the sky facing south: the sun rises on the left, peaks at the top in Horse, and sets on the right; Rat sits at the bottom. A hand marks now, a thin inner line shows how much of the cycle has passed, and ticks mark sunrise, the sun's height, sunset, and true midnight. Tapping any toki lifts it from the ring and shows its window and story in the center.

### 6.3 Color follows the sun's height

The palette is an arc, not twelve swatches. It is darkest at Rat, lifts through predawn teal and pale dawn green, peaks at pale gold in the middle of Horse, then moves through gold, orange, sunset red-orange, pink, and purple back into night. Colors are blended in a perceptual color space so every transition is continuous.

| Toki | Moment | Color |
| --- | --- | --- |
| Rat, Ox | Middle and depth of night | Darkest blue-black, midnight blue |
| Tiger | Before dawn | Teal |
| Rabbit | Sunrise | Pale dawn green |
| Dragon, Snake | Morning | Pale green-gold, pale yellow |
| Horse | Sun at its height | Pale gold, the brightest point |
| Sheep, Monkey | Afternoon | Gold, orange |
| Rooster | Sunset | Red-orange |
| Dog, Boar | Evening | Pink, purple |

### 6.4 Names, numbers, and translation

People can label toki three ways: kanji (午), English animal names (Horse), or the bell numbers people actually heard (9). The bell numbers repeat by design, nine through four by day and again by night, as the temple bells did.

### 6.5 What is not built yet

- Illustrated zodiac companions (the prototype uses the kanji as the companion).
- Invitations that render a toki window for each recipient's own location.
- A native iOS app and Home Screen widget.
- Optional bells, and accessibility testing with real users.

---

## 7. Economic and societal implications

Hourly pay measures presence, not contribution. That made sense when the factory clock was the only shared measure of effort. It makes less sense when much work is judged by outcomes, and when automation can return time that wages never give back.

### 7.1 The time that never came back

In 1930, John Maynard Keynes predicted that rising productivity would let his grandchildren's generation spread work into weeks of perhaps fifteen hours [5]. Productivity rose, but the gains arrived mostly as more output and consumption rather than as returned time. N-Toki's economic thesis is that this was a choice of culture and institutions, not a law of economics.

### 7.2 Evidence that shorter time can work

The largest recent test is the UK four-day week pilot, run by the think tank Autonomy with the 4 Day Week Campaign and 4 Day Week Global [6][7]:

| Measure | Result |
| --- | --- |
| Participants | 61 companies, about 2,900 workers |
| Period | Six months, June to December 2022 |
| Schedule | Average 34 hours over four days, no pay cut |
| Continued after the trial | 56 of 61 companies (92%); 18 made it permanent |
| About a year later | 54 of 61 still on the policy |
| Burnout | 71% of employees reported less burnout |
| Revenue | Up 1.4% on average, weighted by company size |
| Staff losses | Down 57% during the trial |

This does not prove that toki-based work would succeed. It does show that reducing clock hours need not reduce what organizations produce, which is the precondition for the directions below.

### 7.3 Possible directions (Stage 3)

- **Seasonal working windows.** Work blocks set in toki rather than fixed hours, so the short daylight of December asks less of people than the long days of June.
- **Outcome-based projects.** Contracts defined by what is delivered and by which toki a team is reachable, not by hours logged.
- **Flexible team coordination.** Distributed teams agree on shared toki windows instead of a single time zone's office hours.
- **Productivity dividends as time.** When automation saves hours, a share of them returns to people as shorter schedules, not only as more output.
- **Time-returned accounting.** Tools that measure and report how much time an organization has given back.

### 7.4 Safeguards

Any workforce product must keep the duration records required by wage-and-hour and overtime laws, and must not be used to blur paid time. Toki-based scheduling should widen people's choices, never become a way to extract unpaid work in "flexible windows." These questions need specialist legal review before any employer pilot; nothing in this paper is legal advice.

---

## 8. Hypotheses and research agenda

N-Toki's claims are hypotheses. Each one below names a test that could prove it wrong.

| # | Hypothesis | How to test | Measure |
| --- | --- | --- | --- |
| H1 | People understand toki with under a minute of explanation | Onboarding sessions with first-time users | Share who can name the current toki and say when Horse falls |
| H2 | People return to the Living Clock without being prompted | 30-day field test with bells off | Days opened per week, retention at day 30 |
| H3 | Reading the day by toki feels less pressured than a countdown clock | Randomized comparison against a standard clock widget | Self-reported time pressure on a validated short scale, before and after |
| H4 | Flexible toki invitations are understood and kept | Pilot with friend groups | Invitations accepted and meetups that actually happen, versus exact-time invites |
| H5 | Use builds solar awareness | Quiz after two weeks of use | Share who can estimate their local solar noon within 15 minutes |
| H6 | The shared language spreads person to person | Track invitation links | New people who arrive through an invitation |

**Explicit non-claims.** N-Toki does not claim to slow aging, improve sleep, or treat any condition. Any wellbeing finding will be reported as measured, with its limits.

---

## 9. Risks, limitations and open questions

- **Cultural respect.** N-Toki draws on Japanese heritage. It should credit that origin clearly, work with Japanese historians and illustrators, and avoid treating the culture as decoration.
- **Missed appointments.** A toki is a window, not a minute. Exact events must keep their exact timestamps, and conventional time must stay one press away.
- **Novelty fade.** A beautiful clock can be admired for a week and forgotten. Stage 1 succeeds only if people return without being prompted (H2).
- **Cold start.** A toki invitation means nothing to someone without N-Toki. Invitations must open as plain web links that show the window to anyone.
- **Commercial tension.** Funding the project through advertising or attention metrics would contradict its mission. Revenue must come from things people choose to pay for, such as companion art, widgets, or physical clocks.
- **High latitudes.** Polar day and night break the solar anchor; the labeled fallback works but loses the system's meaning there.
- **Historical accuracy.** Several Edo conventions coexisted. N-Toki's centered convention is a deliberate choice that should be explained, not presented as the only correct one.

---

## 10. Roadmap and open-source strategy

N-Toki separates what should be shared from what should be built and owned.

**Open:** the toki specification and a reference engine that turns a place and a time into twelve centered toki, under a permissive license such as MIT. A cultural shift spreads faster when anyone can put toki on a watch face, a smart light, or a calendar.

**Owned:** the N-Toki name, the companion art, the app experience, and the community. The math is roughly eighty lines; the lasting value is the brand, the feel, and the people.

| Phase | Deliverable | Gate to the next phase |
| --- | --- | --- |
| A | Living Clock and Cycle dial prototype | Built |
| A+ | Installable web app tested with 10–20 people | H1 and H2 look promising |
| B | Toki invitations as links, no accounts | H4: invitations understood and kept |
| C | Illustrated zodiac companions | Art direction approved with cultural advisers |
| D | Native iOS app and Home Screen widget | Retention holds on mobile |
| E | Community gatherings and shared bells | Groups form without paid growth |
| F | Economic pilots with willing employers and communities | Legal review; enough people fluent in toki |

---

## 11. Conclusion

The equal hour was a tool that made time countable, and therefore saleable. It was adopted for good reasons, and it will remain the backbone of shared schedules. But it was never the only way to live a day, and Japan used something different until 1873.

N-Toki offers a second reading of the day: one that follows the sun, changes with the seasons, and asks nothing of a person after dark. If people come to feel time this way, and then to speak it with each other, the old question can be asked again with a constituency behind it: who owns our time?

Time never runs out. Time runs through us.

*Acknowledgment.* N-Toki began as a reply to a post by [@ReiOfJapan7](https://x.com/ReiOfJapan7) on Japanese timekeeping, who also suggested adding the 72 micro-seasons.

---

## References

1. E. P. Thompson, "Time, Work-Discipline, and Industrial Capitalism," *Past & Present*, 1967. https://libcom.org/library/time-work-discipline-industrial-capitalism-e-p-thompson
2. Library of Congress, Law Library blog, "Whose Time Is It Anyway? A Brief History of Standardized Time Zones in the United States," November 2024. https://blogs.loc.gov/law/2024/11/whose-time-is-it-anyway-a-brief-history-of-standardized-time-zones-in-the-united-states/
3. Wikipedia, "Japanese clock." https://en.wikipedia.org/wiki/Japanese_clock
4. Weatherhead East Asian Institute, Columbia University, "Author Q&A: Yulia Frumer's *Making Time: Astronomical Time Measurement in Tokugawa Japan*" (University of Chicago Press). https://archive.weai.columbia.edu/weai-author-qa-yulia-frumers-making-time/
5. Karl Widerquist, "John Maynard Keynes: Economic Possibilities of Our Grandchildren," *Dissent*. https://www.dissentmagazine.org/article/john-maynard-keynes-economic-possibilities-of-our-grandchildren
6. Fox Business, "More than 60 companies tried a four-day work week and results show why 92% are keeping it," February 2023. https://www.foxbusiness.com/economy/more-than-60-companies-tried-four-day-work-week-results-show-why-92-are-keeping-it
7. Michigan Public, "These companies tried a 4-day workweek. More than a year in, they still love it," 27 February 2024. https://www.michiganpublic.org/2024-02-27/these-companies-tried-a-4-day-workweek-more-than-a-year-in-they-still-love-it
