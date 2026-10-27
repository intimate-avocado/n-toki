/**
 * N-Toki engine: time by the sun.
 * - NT.cycle(t, {lat, lng, tz}) → the twelve centered toki containing instant t
 * - SKY.year(t, lat)            → the 72 kō (micro-seasons) of the season year containing t
 * Pure functions, no dependencies. MIT License (see ../LICENSE).
 *
 * Toki convention: each toki is centered on a moment of the sun —
 * Rabbit on sunrise, Horse on solar noon, Rooster on sunset, Rat on solar midnight.
 * Daylight and darkness are each divided by six.
 */
const NT = (() => {
  const PI = Math.PI, rad = PI / 180, dayMs = 864e5, J1970 = 2440588, J2000 = 2451545, OBL = rad * 23.4397, J0 = 0.0009;
  const toDays = ms => ms / dayMs - 0.5 + J1970 - J2000;
  const fromJ = j => (j + 0.5 - J1970) * dayMs;

  // Sunrise / sunset for the solar day nearest `ms` (SunCalc algorithm, -0.833° horizon).
  function sunTimes(ms, lat, lng) {
    const lw = rad * -lng, phi = rad * lat, d = toDays(ms);
    const n = Math.round(d - J0 - lw / (2 * PI));
    const ds = J0 + lw / (2 * PI) + n;
    const M = rad * (357.5291 + 0.98560028 * ds);
    const C = rad * (1.9148 * Math.sin(M) + 0.02 * Math.sin(2 * M) + 0.0003 * Math.sin(3 * M));
    const L = M + C + rad * 102.9372 + PI;
    const dec = Math.asin(Math.sin(OBL) * Math.sin(L));
    const Jnoon = J2000 + ds + 0.0053 * Math.sin(M) - 0.0069 * Math.sin(2 * L);
    const h0 = -0.833 * rad;
    const cosw = (Math.sin(h0) - Math.sin(phi) * Math.sin(dec)) / (Math.cos(phi) * Math.cos(dec));
    if (cosw < -1) return { noon: fromJ(Jnoon), polar: 'day' };
    if (cosw > 1) return { noon: fromJ(Jnoon), polar: 'night' };
    const w = Math.acos(cosw);
    const a = J0 + (w + lw) / (2 * PI) + n;
    const Jset = J2000 + a + 0.0053 * Math.sin(M) - 0.0069 * Math.sin(2 * L);
    const Jrise = Jnoon - (Jset - Jnoon);
    return { noon: fromJ(Jnoon), rise: fromJ(Jrise), set: fromJ(Jset) };
  }

  const dtfCache = {};
  function partsOf(ms, tz) {
    const f = dtfCache[tz] || (dtfCache[tz] = new Intl.DateTimeFormat('en-US', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    const o = {};
    for (const x of f.formatToParts(ms)) if (x.type !== 'literal') o[x.type] = +x.value;
    if (o.hour === 24) o.hour = 0;
    return o;
  }
  function tzOffset(ms, tz) {
    const p = partsOf(ms, tz);
    return Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second) - Math.floor(ms / 1000) * 1000;
  }
  // Absolute ms for a wall-clock time (minutes after midnight) on a date in a time zone.
  function zoned(y, m, d, mins, tz) {
    const g = Date.UTC(y, m - 1, d, 0, mins);
    const o = tzOffset(g, tz);
    let r = g - o;
    const o2 = tzOffset(r, tz);
    if (o2 !== o) r = g - o2;
    return r;
  }

  // The original centered system: every toki is centered on a moment of the sun.
  // Rabbit on sunrise, Horse on the sun's height, Rooster on sunset, Rat on the middle of the night.
  // Daylight (sunrise -> sunset) and darkness (sunset -> sunrise) are each divided by six,
  // so Rabbit and Rooster straddle the horizon: half night-length, half day-length.
  function cycle(t, place) {
    const ev = [];
    for (let k = -3; k <= 3; k++) {
      const s = sunTimes(t + k * dayMs, place.lat, place.lng);
      if (s.rise != null && isFinite(s.rise)) { ev.push({ t: s.rise, type: 'rise' }); ev.push({ t: s.set, type: 'set' }); }
    }
    ev.sort((a, b) => a.t - b.t);
    const u = [];
    for (const e of ev) { const last = u[u.length - 1]; if (!last || e.type !== last.type || e.t - last.t > 3 * 3600e3) u.push(e); }
    for (let j = 1; j + 2 < u.length; j++) {
      if (u[j].type !== 'rise' || u[j - 1].type !== 'set' || u[j + 1].type !== 'set' || u[j + 2].type !== 'rise') continue;
      const Sp = u[j - 1].t, R = u[j].t, S = u[j + 1].t, R2 = u[j + 2].t;
      if (!((R2 - R) > 22 * 3600e3 && (R2 - R) < 26 * 3600e3 && R - Sp > 0 && R - Sp < 24 * 3600e3)) continue;
      const D = (S - R) / 6, N = (R2 - S) / 6, Np = (R - Sp) / 6;
      const b0 = R - Np / 2, b12 = R2 - N / 2;
      if (t < b0 || t >= b12) continue;
      const b = [b0];
      for (let k = 1; k <= 6; k++) b.push(R + (k - 0.5) * D);   // ends at sunset - half a day toki
      for (let k = 1; k <= 6; k++) b.push(S + (k - 0.5) * N);   // ends at next sunrise - half a night toki
      return finish({ mode: 'solar', rise: R, set: S, nextRise: R2, noon: R + 3 * D, midnight: S + 3 * N, b }, t);
    }
    return fixedCycle(t, place, sunTimes(t, place.lat, place.lng).polar || 'unusual');
  }

  // Polar day / night: no real sunrise to anchor to, so use labeled equal 2-hour toki,
  // still centered: Rabbit on 6:00, Horse on 12:00, Rat on midnight (local clock).
  function fixedCycle(t, place, polar) {
    const p = partsOf(t, place.tz);
    let start = zoned(p.year, p.month, p.day, 300, place.tz);
    if (t < start) start = zoned(p.year, p.month, p.day - 1, 300, place.tz);
    const b = [];
    for (let k = 0; k <= 12; k++) b.push(start + k * 7200e3);
    const h = 3600e3;
    return finish({ mode: 'fixed', polar, rise: b[0] + h, set: b[6] + h, nextRise: b[12] + h, noon: b[3] + h, midnight: b[9] + h, b }, t);
  }

  function finish(c, t) {
    let idx = 0;
    for (let k = 0; k < 12; k++) if (t >= c.b[k]) idx = k;
    c.idx = idx;
    c.progress = Math.min(1, Math.max(0, (t - c.b[idx]) / (c.b[idx + 1] - c.b[idx])));
    c.dayToki = (c.set - c.rise) / 6;
    c.nightToki = (c.nextRise - c.set) / 6;
    c.t = t;
    return c;
  }

  return { sunTimes, cycle, partsOf, zoned, tzOffset };
})();

const TOKI = [
  { k: '卯', en: 'Rabbit', r: 'U', bell: 'Sixth', bj: '明け六つ', br: 'Ake-mutsu', d: "Sunrise falls in the middle of this toki. In Edo, the dawn sixth bell opened the town's ward gates and started the working day." },
  { k: '辰', en: 'Dragon', r: 'Tatsu', bell: 'Fifth', bj: '朝五つ', br: 'Asa-itsutsu', d: 'Morning light climbs and shadows shorten. Shops and workshops are open.' },
  { k: '巳', en: 'Snake', r: 'Mi', bell: 'Fourth', bj: '昼四つ', br: 'Hiru-yotsu', d: 'Late morning. The light is close to full strength.' },
  { k: '午', en: 'Horse', r: 'Uma', bell: 'Ninth', bj: '昼九つ', br: 'Hiru-kokonotsu', d: 'The sun reaches its height in the middle of this toki. Japanese still names noon after it: 正午 (shōgo) means true Horse, and AM and PM are 午前 and 午後, before Horse and after Horse.' },
  { k: '未', en: 'Sheep', r: 'Hitsuji', bell: 'Eighth', bj: '昼八つ', br: 'Hiru-yatsu', d: 'Early afternoon. The eighth bell gave Japanese its word for an afternoon snack, oyatsu.' },
  { k: '申', en: 'Monkey', r: 'Saru', bell: 'Seventh', bj: '夕七つ', br: 'Yū-nanatsu', d: 'The light lowers and warms. The last stretch of the working day.' },
  { k: '酉', en: 'Rooster', r: 'Tori', bell: 'Sixth', bj: '暮れ六つ', br: 'Kure-mutsu', d: 'Sunset falls in the middle of this toki. The evening sixth bell hands the day over to the night.' },
  { k: '戌', en: 'Dog', r: 'Inu', bell: 'Fifth', bj: '宵五つ', br: 'Yoi-itsutsu', d: 'Early evening. Lamps, the evening meal, company.' },
  { k: '亥', en: 'Boar', r: 'I', bell: 'Fourth', bj: '夜四つ', br: 'Yo-yotsu', d: "The night deepens. Edo's ward gates closed at this bell." },
  { k: '子', en: 'Rat', r: 'Ne', bell: 'Ninth', bj: '夜九つ', br: 'Yoru-kokonotsu', d: 'The middle of the night falls in the middle of this toki. The ninth bell rings again, as it did when the sun was highest.' },
  { k: '丑', en: 'Ox', r: 'Ushi', bell: 'Eighth', bj: '夜八つ', br: 'Yoru-yatsu', d: 'The deepest hours. In old stories, ushi-mitsu, the third quarter of Ox, belonged to ghosts.' },
  { k: '寅', en: 'Tiger', r: 'Tora', bell: 'Seventh', bj: '暁七つ', br: 'Akatsuki-nanatsu', d: 'Before dawn. Travelers set out at the seventh bell to cover ground by daylight.' }
];

const SEKKI = [
  ['立春', '立春', 'Risshun', 'Beginning of spring', 'りっしゅん'], ['雨水', '雨水', 'Usui', 'Rainwater', 'うすい'], ['啓蟄', '惊蛰', 'Keichitsu', 'Insects awaken', 'けいちつ'],
  ['春分', '春分', 'Shunbun', 'Spring equinox', 'しゅんぶん'], ['清明', '清明', 'Seimei', 'Pure and clear', 'せいめい'], ['穀雨', '谷雨', 'Kokuu', 'Grain rains', 'こくう'],
  ['立夏', '立夏', 'Rikka', 'Beginning of summer', 'りっか'], ['小満', '小满', 'Shōman', 'Lesser ripening', 'しょうまん'], ['芒種', '芒种', 'Bōshu', 'Grain beards and seeds', 'ぼうしゅ'],
  ['夏至', '夏至', 'Geshi', 'Summer solstice', 'げし'], ['小暑', '小暑', 'Shōsho', 'Lesser heat', 'しょうしょ'], ['大暑', '大暑', 'Taisho', 'Greater heat', 'たいしょ'],
  ['立秋', '立秋', 'Risshū', 'Beginning of autumn', 'りっしゅう'], ['処暑', '处暑', 'Shosho', 'Manageable heat', 'しょしょ'], ['白露', '白露', 'Hakuro', 'White dew', 'はくろ'],
  ['秋分', '秋分', 'Shūbun', 'Autumn equinox', 'しゅうぶん'], ['寒露', '寒露', 'Kanro', 'Cold dew', 'かんろ'], ['霜降', '霜降', 'Sōkō', 'Frost falls', 'そうこう'],
  ['立冬', '立冬', 'Rittō', 'Beginning of winter', 'りっとう'], ['小雪', '小雪', 'Shōsetsu', 'Lesser snow', 'しょうせつ'], ['大雪', '大雪', 'Taisetsu', 'Greater snow', 'たいせつ'],
  ['冬至', '冬至', 'Tōji', 'Winter solstice', 'とうじ'], ['小寒', '小寒', 'Shōkan', 'Lesser cold', 'しょうかん'], ['大寒', '大寒', 'Daikan', 'Greater cold', 'だいかん']
];
// [kanji, romaji, English, kana, Simplified Chinese gloss]
const KO = [
  ['東風解凍', 'Harukaze kōri o toku', 'East wind thaws the ice', 'はるかぜこおりをとく', '东风解冻'],
  ['黄鶯睍睆', 'Kōō kenkan su', 'Warblers sing in the hills', 'こうおうけんかんす', '黄莺在山中鸣唱'],
  ['魚上氷', 'Uo kōri o izuru', 'Fish rise beneath the ice', 'うおこおりをいずる', '鱼从冰下浮起'],
  ['土脉潤起', 'Tsuchi no shō uruoi okoru', 'Rain softens the soil', 'つちのしょううるおいおこる', '春雨润土'],
  ['霞始靆', 'Kasumi hajimete tanabiku', 'Mist begins to linger', 'かすみはじめてたなびく', '春霭初现'],
  ['草木萌動', 'Sōmoku mebae izuru', 'Plants begin to sprout', 'そうもくめばえいずる', '草木萌芽'],
  ['蟄虫啓戸', 'Sugomori mushi to o hiraku', 'Hibernating insects emerge', 'すごもりむしとをひらく', '蛰虫出洞'],
  ['桃始笑', 'Momo hajimete saku', 'First peach blossoms', 'ももはじめてさく', '桃花初开'],
  ['菜虫化蝶', 'Namushi chō to naru', 'Caterpillars become butterflies', 'なむしちょうとなる', '青虫化蝶'],
  ['雀始巣', 'Suzume hajimete sukū', 'Sparrows start nesting', 'すずめはじめてすくう', '麻雀筑巢'],
  ['櫻始開', 'Sakura hajimete saku', 'First cherry blossoms', 'さくらはじめてさく', '樱花初开'],
  ['雷乃発声', 'Kaminari sunawachi koe o hassu', 'Distant thunder', 'かみなりすなわちこえをはっす', '远雷初鸣'],
  ['玄鳥至', 'Tsubame kitaru', 'Swallows return', 'つばめきたる', '燕子归来'],
  ['鴻雁北', 'Kōgan kaeru', 'Wild geese fly north', 'こうがんかえる', '大雁北飞'],
  ['虹始見', 'Niji hajimete arawaru', 'First rainbows', 'にじはじめてあらわる', '彩虹初现'],
  ['葭始生', 'Ashi hajimete shōzu', 'Reeds sprout', 'あしはじめてしょうず', '芦苇发芽'],
  ['霜止出苗', 'Shimo yamite nae izuru', 'Frost ends, rice seedlings grow', 'しもやみてなえいずる', '霜止秧苗生'],
  ['牡丹華', 'Botan hana saku', 'Peonies bloom', 'ぼたんはなさく', '牡丹盛开'],
  ['蛙始鳴', 'Kawazu hajimete naku', 'Frogs start singing', 'かわずはじめてなく', '青蛙始鸣'],
  ['蚯蚓出', 'Mimizu izuru', 'Worms surface', 'みみずいずる', '蚯蚓出土'],
  ['竹笋生', 'Takenoko shōzu', 'Bamboo shoots sprout', 'たけのこしょうず', '竹笋生长'],
  ['蚕起食桑', 'Kaiko okite kuwa o hamu', 'Silkworms feast on mulberry leaves', 'かいこおきてくわをはむ', '蚕食桑叶'],
  ['紅花栄', 'Benibana sakau', 'Safflowers bloom', 'べにばなさかう', '红花盛开'],
  ['麦秋至', 'Mugi no toki itaru', 'Wheat ripens and is harvested', 'むぎのときいたる', '麦子成熟'],
  ['蟷螂生', 'Kamakiri shōzu', 'Praying mantises hatch', 'かまきりしょうず', '螳螂孵化'],
  ['腐草為螢', 'Kusaretaru kusa hotaru to naru', 'Rotten grass becomes fireflies', 'くされたるくさほたるとなる', '腐草化萤'],
  ['梅子黄', 'Ume no mi kibamu', 'Plums turn yellow', 'うめのみきばむ', '梅子变黄'],
  ['乃東枯', 'Natsukarekusa karuru', 'Self-heal withers', 'なつかれくさかるる', '夏枯草枯萎'],
  ['菖蒲華', 'Ayame hana saku', 'Irises bloom', 'あやめはなさく', '菖蒲开花'],
  ['半夏生', 'Hange shōzu', 'Crow-dipper sprouts', 'はんげしょうず', '半夏生长'],
  ['温風至', 'Atsukaze itaru', 'Warm winds blow', 'あつかぜいたる', '暖风吹来'],
  ['蓮始開', 'Hasu hajimete hiraku', 'First lotus blossoms open', 'はすはじめてひらく', '莲花初开'],
  ['鷹乃学習', 'Taka sunawachi waza o narau', 'Young hawks learn to fly', 'たかすなわちわざをならう', '雏鹰学飞'],
  ['桐始結花', 'Kiri hajimete hana o musubu', 'Paulownia sets seed', 'きりはじめてはなをむすぶ', '桐树结籽'],
  ['土潤溽暑', 'Tsuchi uruōte mushi atsushi', 'Earth is damp, air is muggy', 'つちうるおうてむしあつし', '土湿闷热'],
  ['大雨時行', 'Taiu tokidoki furu', 'Heavy rains fall at times', 'たいうときどきふる', '时有大雨'],
  ['涼風至', 'Suzukaze itaru', 'Cool winds blow', 'すずかぜいたる', '凉风吹来'],
  ['寒蝉鳴', 'Higurashi naku', 'Evening cicadas sing', 'ひぐらしなく', '寒蝉鸣叫'],
  ['蒙霧升降', 'Fukaki kiri matō', 'Thick fog descends', 'ふかききりまとう', '浓雾弥漫'],
  ['綿柎開', 'Wata no hana shibe hiraku', 'Cotton flowers bloom', 'わたのはなしべひらく', '棉花开放'],
  ['天地始粛', 'Tenchi hajimete samushi', 'Heat begins to subside', 'てんちはじめてさむし', '暑气渐消'],
  ['禾乃登', 'Kokumono sunawachi minoru', 'Rice ripens', 'こくものすなわちみのる', '稻谷成熟'],
  ['草露白', 'Kusa no tsuyu shiroshi', 'Dew on grass glistens white', 'くさのつゆしろし', '草露泛白'],
  ['鶺鴒鳴', 'Sekirei naku', 'Wagtails sing', 'せきれいなく', '鹡鸰鸣叫'],
  ['玄鳥去', 'Tsubame saru', 'Swallows leave', 'つばめさる', '燕子离去'],
  ['雷乃収声', 'Kaminari sunawachi koe o osamu', 'Thunder ceases', 'かみなりすなわちこえをおさむ', '雷声收敛'],
  ['蟄虫坏戸', 'Mushi kakurete to o fusagu', 'Insects hole up underground', 'むしかくれてとをふさぐ', '蛰虫封洞'],
  ['水始涸', 'Mizu hajimete karuru', 'Farmers drain fields', 'みずはじめてかるる', '田水始干'],
  ['鴻雁来', 'Kōgan kitaru', 'Wild geese return', 'こうがんきたる', '大雁南来'],
  ['菊花開', 'Kiku no hana hiraku', 'Chrysanthemums bloom', 'きくのはなひらく', '菊花开放'],
  ['蟋蟀在戸', 'Kirigirisu to ni ari', 'Crickets chirp around the door', 'きりぎりすとにあり', '蟋蟀在户'],
  ['霜始降', 'Shimo hajimete furu', 'First frost', 'しもはじめてふる', '初霜降临'],
  ['霎時施', 'Kosame tokidoki furu', 'Light rain falls at times', 'こさめときどきふる', '时有小雨'],
  ['楓蔦黄', 'Momiji tsuta kibamu', 'Maple and ivy turn yellow', 'もみじつたきばむ', '枫叶与藤叶变黄'],
  ['山茶始開', 'Tsubaki hajimete hiraku', 'Camellias bloom', 'つばきはじめてひらく', '山茶初开'],
  ['地始凍', 'Chi hajimete kōru', 'Land begins to freeze', 'ちはじめてこおる', '大地始冻'],
  ['金盞香', 'Kinsenka saku', 'Daffodils bloom', 'きんせんかさく', '水仙飘香'],
  ['虹蔵不見', 'Niji kakurete miezu', 'Rainbows hide', 'にじかくれてみえず', '彩虹隐没'],
  ['朔風払葉', 'Kitakaze konoha o harau', 'North wind strips the leaves', 'きたかぜこのはをはらう', '北风扫落叶'],
  ['橘始黄', 'Tachibana hajimete kibamu', 'Tachibana citrus begins to yellow', 'たちばなはじめてきばむ', '柑橘始黄'],
  ['閉塞成冬', 'Sora samuku fuyu to naru', 'Cold sets in, winter begins', 'そらさむくふゆとなる', '天寒入冬'],
  ['熊蟄穴', 'Kuma ana ni komoru', 'Bears start hibernating', 'くまあなにこもる', '熊入洞冬眠'],
  ['鱖魚群', 'Sake no uo muragaru', 'Salmon gather and swim upstream', 'さけのうおむらがる', '鲑鱼成群洄游'],
  ['乃東生', 'Natsukarekusa shōzu', 'Self-heal sprouts', 'なつかれくさしょうず', '夏枯草萌芽'],
  ['麋角解', 'Sawashika no tsuno otsuru', 'Deer shed antlers', 'さわしかのつのおつる', '鹿角脱落'],
  ['雪下出麦', 'Yuki watarite mugi nobiru', 'Wheat sprouts under snow', 'ゆきわたりてむぎのびる', '雪下麦生'],
  ['芹乃栄', 'Seri sunawachi sakau', 'Parsley flourishes', 'せりすなわちさかう', '水芹繁茂'],
  ['水泉動', 'Shimizu atataka o fukumu', 'Springs thaw', 'しみずあたたかをふくむ', '泉水始动'],
  ['雉始雊', 'Kiji hajimete naku', 'Pheasants start to call', 'きじはじめてなく', '野鸡始鸣'],
  ['款冬華', 'Fuki no hana saku', 'Butterburs bud', 'ふきのはなさく', '款冬花开'],
  ['水沢腹堅', 'Sawamizu kōri tsumeru', 'Ice thickens on streams', 'さわみずこおりつめる', '溪水冻实'],
  ['鶏始乳', 'Niwatori hajimete toya ni tsuku', 'Hens start laying eggs', 'にわとりはじめてとやにつく', '母鸡开始产蛋']
];
const SKY = (() => {
  const rad = Math.PI / 180, dayMs = 864e5, J1970 = 2440588, J2000 = 2451545, YEAR = 365.2422 * dayMs;
  // The sun's apparent ecliptic longitude in degrees (Meeus, Astronomical Algorithms ch. 25; within ~0.01°, i.e. minutes).
  function sunLon(ms) {
    const T = (ms / dayMs + J1970 - 0.5 - J2000) / 36525;
    const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
    const M = rad * (357.52911 + 35999.05029 * T - 0.0001537 * T * T);
    const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(M) + (0.019993 - 0.000101 * T) * Math.sin(2 * M) + 0.000289 * Math.sin(3 * M);
    const lon = L0 + C - 0.00569 - 0.00478 * Math.sin(rad * (125.04 - 1934.136 * T));
    return ((lon % 360) + 360) % 360;
  }
  // The instant the sun reaches `target` degrees, searched within ±12 days of `guess`.
  function reach(target, guess) {
    const f = t => ((sunLon(t) - target + 540) % 360) - 180;
    let a = guess - 12 * dayMs, b = guess + 12 * dayMs;
    for (let i = 0; i < 48; i++) { const m = (a + b) / 2; if (f(m) < 0) a = m; else b = m; }
    return (a + b) / 2;
  }
  // The season year containing t, starting at Risshun (315°). South of the equator the year is shifted 180°.
  function year(t, lat) {
    const flip = lat < 0 ? 180 : 0, disp = (sunLon(t) + flip) % 360, rel = (((disp - 315) % 360) + 360) % 360;
    const start = reach((315 - flip + 360) % 360, t - (rel / 360) * YEAR);
    const b = [start];
    for (let j = 1; j <= 72; j++) b.push(reach((315 + 5 * j - flip + 720) % 360, start + (j / 72) * YEAR));
    let k = 0;
    for (let j = 0; j < 72; j++) if (t >= b[j]) k = j;
    const marks = [0, 90, 180, 270].map(L => reach((L - flip + 360) % 360, start + ((((L - 315) % 360) + 360) % 360) / 360 * YEAR));
    return { flip, disp, k, b, marks, progress: (t - b[k]) / (b[k + 1] - b[k]) };
  }
  return { sunLon, reach, year };
})();

export { NT, SKY, TOKI, KO, SEKKI };
