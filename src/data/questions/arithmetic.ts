import type { Difficulty, Question, TopicId } from "@/lib/types";
import { defineOriginalQuestions } from "./define";

/*
 * مسائل حسابية على نمط قسم «مسائل حسابية» في الامتحان. الأسئلة أصلية من إعداد المنصة،
 * وكل الإجابات تُحسب برمجيًا، وكل سؤال يُفحص عند البناء (حل وحيد، خيارات مختلفة):
 *   1) رقم مخفي برمز (△) في تمرين حسابي
 *   2) مواعيد مع استراحات بين الحلقات أو الحصص
 *   3) الصعود والانزلاق (الحلزون على الحائط)
 *   4) التقدير بالمجموع والفرق (وزن الصندوق ووزن ما فيه)
 *   5) قصّ قطع من لوح (أكبر عدد ممكن)
 */

type QuestionInput = Omit<Question, "topic" | "source">;

/** يضع الإجابة في الموضع answer ويضيف مشتّتات مختلفة (يُسقط المكرر وغير الصالح) */
function choices<T>(correct: T, traps: T[], answer: number, show: (v: T) => string, valid: (v: T) => boolean = () => true) {
  const key = (v: T) => show(v);
  const wrong: T[] = [];
  for (const t of traps) if (valid(t) && key(t) !== key(correct) && !wrong.some((w) => key(w) === key(t)) && wrong.length < 3) wrong.push(t);
  if (wrong.length < 3) throw new Error(`مشتّتات غير كافية: ${show(correct)}`);
  const list = wrong.map(show);
  list.splice(answer, 0, show(correct));
  return { options: list, answer };
}

/** العدد والمعدود: 1 قطعة واحدة، 2 قطعتان، 3–10 قطع، 11+ قطعة */
function counted(k: number, one: string, two: string, few: string, many: string) {
  if (k === 1) return one;
  if (k === 2) return two;
  return k <= 10 ? `${k} ${few}` : `${k} ${many}`;
}
const pieces = (k: number) => counted(k, "قطعة واحدة", "قطعتان", "قطع", "قطعة");

let n = 0;
const nextId = () => `ari-${String(++n).padStart(2, "0")}`;

// =====================================================================
// 1) الرقم المخفي: الرمز △ يمثّل الرقم نفسه في كل مكان
// =====================================================================

function evalSide(s: string): number {
  // يقبل الأعداد و × + −
  const tokens = s.trim().split(" ");
  let total = Number(tokens[0]);
  for (let i = 1; i < tokens.length; i += 2) {
    const v = Number(tokens[i + 1]);
    if (tokens[i] === "×") total *= v;
    else if (tokens[i] === "+") total += v;
    else if (tokens[i] === "−") total -= v;
  }
  return total;
}

function digitSolutions(t: string): number[] {
  const out: number[] = [];
  for (let d = 0; d <= 9; d++) {
    const s = t.replaceAll("△", String(d));
    const nums = s.split(/[^0-9]+/).filter(Boolean);
    if (nums.some((x) => x.length > 1 && x.startsWith("0"))) continue; // لا يبدأ عدد بصفر
    const [l, r] = s.split("=");
    if (evalSide(l) === Number(r.trim())) out.push(d);
  }
  return out;
}

function hiddenDigit(t: string, difficulty: Difficulty, answer: number, tip: string): QuestionInput {
  const sols = digitSolutions(t);
  if (sols.length !== 1) throw new Error(`يجب أن يكون للتمرين حل واحد: ${t} → ${sols}`);
  const d = sols[0];
  const filled = t.replaceAll("△", String(d));
  return {
    id: nextId(),
    difficulty,
    prompt: `في التمرين التالي، الرمز △ يمثّل الرقم نفسه في المكانين. أيّ رقم يمكن أن يكون مكان △ ليصبح التمرين صحيحًا؟ $${t}$`,
    ...choices(d, [(d + 1) % 10, (d + 9) % 10, (d + 3) % 10, (d + 6) % 10], answer, String),
    explanation: `${tip} نعوّض △ = ${d}: $${filled}$ ✓. ولا يوجد رقم آخر يجعل التمرين صحيحًا.`,
  };
}

const UNITS = "طريقة سريعة: ابدأ بخانة الآحاد، فهي تعطي غالبًا رقمًا واحدًا ممكنًا أو اثنين، ثم تحقّق بالتعويض.";
const ESTIMATE = "طريقة سريعة: قدّر حجم الناتج أولًا، فتستبعد الأرقام البعيدة، ثم جرّب الأرقام القليلة الباقية.";

const hiddenDigitQuestions: QuestionInput[] = [
  hiddenDigit("△3 × 7 = 5△1", 1, 2, ESTIMATE),
  hiddenDigit("1△1 + 114 = △35", 1, 0, UNITS),
  hiddenDigit("43△ − 226 = △06", 1, 3, UNITS),
  hiddenDigit("△4 × 4 = 1△6", 2, 1, ESTIMATE),
  hiddenDigit("4△ × 8 = 3△4", 2, 2, UNITS),
  hiddenDigit("7△5 + 742 = 1△87", 2, 0, UNITS),
  hiddenDigit("72△ − 467 = 2△8", 2, 3, UNITS),
  hiddenDigit("△9 × 8 = △52", 3, 1, ESTIMATE),
  hiddenDigit("4△ × 4 = △64", 3, 2, UNITS),
];

// =====================================================================
// 2) المواعيد مع الاستراحات: n حلقات تحتاج n − 1 استراحات فقط
// =====================================================================

const clock = (min: number) => `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;
const hm = (h: number, m = 0) => h * 60 + m;

interface Schedule {
  who: string;
  item: string; // «حلقة»
  items: string; // «حلقات»
  /** ما يفعله، مع المفعول: «يشاهد حلقات برنامج علمي» */
  verb: string;
  dur: number;
  rest: number;
  start: number;
}

const endAfter = (s: Schedule, k: number) => s.start + k * s.dur + (k - 1) * s.rest;

/** «في أيّ ساعة يمكن أن يكون قد انتهى؟» */
function finishTime(s: Schedule, k: number, difficulty: Difficulty, answer: number): QuestionInput {
  const valid = new Set(Array.from({ length: 12 }, (_, i) => endAfter(s, i + 1)));
  const t = endAfter(s, k);
  const traps = [
    s.start + k * (s.dur + s.rest), // استراحة بعد الأخيرة أيضًا
    s.start + (k + 1) * (s.dur + s.rest),
    s.start + (k + 1) * s.dur, // بلا استراحات
    s.start + k * s.dur + k * s.rest + 5,
    t + 10,
    t - 10,
  ];
  return {
    id: nextId(),
    difficulty,
    prompt:
      `${s.who} ${s.verb}، مدة كل ${s.item} ${s.dur} دقيقة، ويأخذ استراحة مدتها ${s.rest} دقائق بين كل ${s.item} والتي تليها. ` +
      `بدأ الساعة ${clock(s.start)}، وأنهى عدة ${s.items} متتالية. في أيّ ساعة يمكن أن يكون قد انتهى؟`,
    ...choices(t, traps, answer, clock, (v) => !valid.has(v)),
    explanation:
      `إذا أنهى ${k} ${s.items}، فهناك ${counted(k - 1, "استراحة واحدة", "استراحتان", "استراحات", "استراحة")} فقط (بين كل ${s.item} والتي تليها، ولا استراحة بعد الأخيرة): ` +
      `$${k} × ${s.dur} + ${k - 1} × ${s.rest} = ${k * s.dur + (k - 1) * s.rest}$ دقيقة. ` +
      `$${clock(s.start)} + ${k * s.dur + (k - 1) * s.rest}$ دقيقة = ${clock(t)}. ` +
      `طريقة سريعة: كل ${s.item} مع استراحتها ${s.dur + s.rest} دقيقة، ثم نطرح الاستراحة الأخيرة. الأوقات الأخرى لا تناسب أي عدد من ال${s.items}.`,
  };
}

/** «كم ... أنهى إذا انتهى الساعة كذا؟» */
function howMany(s: Schedule, k: number, difficulty: Difficulty, answer: number): QuestionInput {
  const t = endAfter(s, k);
  const naive = Math.floor((t - s.start) / (s.dur + s.rest));
  return {
    id: nextId(),
    difficulty,
    prompt:
      `${s.who} ${s.verb}، مدة كل ${s.item} ${s.dur} دقيقة، وبين كل ${s.item} والتي تليها استراحة ${s.rest} دقائق. ` +
      `بدأ الساعة ${clock(s.start)} وانتهى الساعة ${clock(t)}. كم ${s.item} أنهى؟`,
    ...choices(k, [naive, k + 1, k - 1, Math.floor((t - s.start) / s.dur), k + 2], answer, String, (v) => v > 0),
    explanation:
      `المدة كلها ${t - s.start} دقيقة. لو كانت بعد كل ${s.item} استراحة لكان كل جزء ${s.dur + s.rest} دقيقة، ` +
      `لكن الأخيرة بلا استراحة، فنضيف ${s.rest} دقائق: $${t - s.start} + ${s.rest} = ${t - s.start + s.rest}$، ` +
      `ثم نقسم: $${t - s.start + s.rest} ÷ ${s.dur + s.rest} = ${k}$.`,
  };
}

const TV: Schedule = { who: "يوسف", item: "حلقة", items: "حلقات", verb: "يشاهد حلقات برنامج علمي", dur: 25, rest: 5, start: hm(16) };
const PIANO: Schedule = { who: "سامي", item: "مقطوعة", items: "مقطوعات", verb: "يعزف مقطوعات على البيانو", dur: 12, rest: 3, start: hm(17, 30) };
const SWIM: Schedule = { who: "المدرّب", item: "جولة", items: "جولات", verb: "يدرّب فريق السباحة في جولات", dur: 20, rest: 10, start: hm(8) };
const QUIZ: Schedule = { who: "فريق المسابقة", item: "مرحلة", items: "مراحل", verb: "يجيب عن أسئلة مسابقة في مراحل", dur: 15, rest: 4, start: hm(10, 15) };

const scheduleQuestions: QuestionInput[] = [
  finishTime(TV, 3, 1, 1),
  finishTime(PIANO, 4, 2, 3),
  finishTime(SWIM, 3, 2, 0),
  finishTime(QUIZ, 5, 3, 2),
  howMany(TV, 4, 2, 2),
  howMany(SWIM, 5, 2, 1),
  howMany(PIANO, 6, 3, 0),
  howMany(QUIZ, 3, 2, 3),
];

// =====================================================================
// 3) الصعود والانزلاق: في اليوم الأخير يصل قبل أن ينزلق
// =====================================================================

interface Climb {
  who: string;
  /** المكان مع وصف ارتفاعه: «جدار ارتفاعه» */
  where: string;
  unit: string;
  up: number;
  down: number;
  height: number;
}

function climbDays(c: Climb) {
  if (c.up >= c.height) return 1;
  return Math.ceil((c.height - c.up) / (c.up - c.down)) + 1;
}

function climb(c: Climb, difficulty: Difficulty, answer: number): QuestionInput {
  const days = climbDays(c);
  const net = c.up - c.down;
  const naive = Math.ceil(c.height / net);
  const before = (days - 1) * net;
  return {
    id: nextId(),
    difficulty,
    prompt:
      `${c.who} ${c.where} ${c.height} ${c.unit}. في النهار يصعد ${c.up} ${c.unit}، وفي الليل ينزلق إلى الأسفل ${c.down} ${c.unit}. ` +
      `في أيّ يوم يصل إلى الأعلى لأول مرة؟`,
    ...choices(days, [naive, naive + 1, days + 1, days - 1], answer, (v) => `في اليوم ${v}`, (v) => v > 0),
    explanation:
      `كل يوم وليلة يتقدّم ${net} ${c.unit} فقط. لكن في اليوم الأخير يصل إلى الأعلى في النهار قبل أن ينزلق، فلا نطرح الانزلاق. ` +
      `بعد ${counted(days - 1, "يوم وليلة", "يومين وليلتين", "أيام وليالٍ", "يومًا وليلة")} يكون على ارتفاع $${days - 1} × ${net} = ${before}$، ` +
      `وفي نهار اليوم ${days} يصعد ${c.up}: $${before} + ${c.up} = ${before + c.up}$، وهذا يكفي للوصول إلى ${c.height}. ` +
      `الخطأ الشائع: قسمة ${c.height} على ${net} مباشرة.`,
  };
}

const climbQuestions: QuestionInput[] = [
  climb({ who: "حلزون يزحف على", where: "جدار أملس ارتفاعه", unit: "سم", up: 5, down: 2, height: 20 }, 2, 1),
  climb({ who: "ضفدع يحاول الخروج من", where: "بئر عمقه", unit: "م", up: 4, down: 1, height: 13 }, 2, 3),
  climb({ who: "سنجاب يتسلق", where: "عمودًا أملس طوله", unit: "م", up: 7, down: 3, height: 27 }, 2, 0),
  climb({ who: "حلزون يصعد", where: "ساق نبتة طولها", unit: "سم", up: 8, down: 3, height: 48 }, 3, 2),
  climb({ who: "متسلّق يصعد", where: "جبلًا ارتفاعه", unit: "كم", up: 3, down: 1, height: 15 }, 3, 1),
  climb({ who: "عنكبوت يصعد على", where: "خيط طوله", unit: "سم", up: 6, down: 4, height: 30 }, 3, 3),
  climb({ who: "حلزون يزحف على", where: "زجاج نافذة ارتفاعه", unit: "سم", up: 10, down: 4, height: 40 }, 1, 0),
];

// =====================================================================
// 4) التقدير بالمجموع والفرق
// =====================================================================

interface Box {
  box: string; // «صندوق»
  fem?: boolean; // علبة، سلّة
  /** العدد مع المعدود كما يُكتب: «نحو 50 برتقالة» */
  countText: string;
  /** «برتقالة واحدة» */
  one: string;
  plural: string; // «البرتقال»
  count: number;
  total: number;
  diff: number;
  unit: string;
}

const dec = (v: number) => String(Math.round(v * 1000) / 1000);

const the = (b: Box) => `ال${b.box}`;
const empty = (b: Box) => `ال${b.box} ${b.fem ? "الفارغة" : "الفارغ"}`;

function perItem(b: Box, difficulty: Difficulty, answer: number): QuestionInput {
  const content = (b.total + b.diff) / 2;
  const box = (b.total - b.diff) / 2;
  const v = content / b.count;
  return {
    id: nextId(),
    difficulty,
    prompt:
      `في ${b.box} ${b.countText}. وزن ${the(b)} مع ${b.plural} ${b.total} ${b.unit}، ` +
      `ووزن ${b.plural} أكبر من وزن ${empty(b)} بـ ${b.diff} ${b.unit}. ما الوزن التقريبي ل${b.one}، إذا كانت أوزانها متساوية تقريبًا؟`,
    ...choices(v, [b.total / b.count, b.diff / b.count, box / b.count, (content + 1) / b.count], answer, (x) => `${dec(x)} ${b.unit}`),
    explanation:
      `المجموع ${b.total} والفرق ${b.diff}. الأكبر = (المجموع + الفرق) ÷ 2: $(${b.total} + ${b.diff}) ÷ 2 = ${content}$ ${b.unit} وزن ${b.plural}، ` +
      `ووزن ${empty(b)} $${b.total} − ${content} = ${box}$ ${b.unit}. ثم نقسم على العدد: $${content} ÷ ${b.count} = ${dec(v)}$ ${b.unit}. ` +
      `فخّ شائع: قسمة الوزن الكلي ${b.total} على ${b.count}، مع أنه يشمل وزن ${the(b)}.`,
  };
}

function emptyBox(b: Box, difficulty: Difficulty, answer: number): QuestionInput {
  const box = (b.total - b.diff) / 2;
  return {
    id: nextId(),
    difficulty,
    prompt: `وزن ${the(b)} مع ${b.plural} ${b.total} ${b.unit}، ووزن ${b.plural} أكبر من وزن ${empty(b)} بـ ${b.diff} ${b.unit}. ما وزن ${empty(b)}؟`,
    ...choices(box, [b.total - b.diff, b.diff / 2, b.total / 2, box + 1], answer, (x) => `${dec(x)} ${b.unit}`),
    explanation:
      `وزن ${b.plural} يزيد بـ ${b.diff}، فنطرح هذا الفرق من المجموع فيبقى وزنان متساويان: $${b.total} − ${b.diff} = ${b.total - b.diff}$، ` +
      `ونقسم على 2: $${b.total - b.diff} ÷ 2 = ${dec(box)}$ ${b.unit}. تحقّق: وزن ${b.plural} $${dec(box)} + ${b.diff} = ${dec(box + b.diff)}$، والمجموع $${dec(box)} + ${dec(box + b.diff)} = ${b.total}$ ✓.`,
  };
}

const ORANGES: Box = { box: "صندوق", countText: "نحو 50 برتقالة", one: "برتقالة واحدة", plural: "البرتقال", count: 50, total: 13, diff: 11, unit: "كغ" };
const MELONS: Box = { box: "قفص", countText: "10 بطيخات", one: "بطيخة واحدة", plural: "البطيخ", count: 10, total: 46, diff: 38, unit: "كغ" };
const PENCILS: Box = { box: "علبة", fem: true, countText: "نحو 20 قلمًا", one: "قلم واحد", plural: "الأقلام", count: 20, total: 260, diff: 140, unit: "غم" };
const MARBLES: Box = { box: "كيس", countText: "نحو 100 كرة زجاجية", one: "كرة زجاجية واحدة", plural: "الكرات", count: 100, total: 640, diff: 560, unit: "غم" };

const boxQuestions: QuestionInput[] = [
  perItem(ORANGES, 2, 2),
  perItem(MELONS, 2, 0),
  perItem(PENCILS, 3, 3),
  perItem(MARBLES, 3, 1),
  emptyBox(ORANGES, 1, 1),
  emptyBox(MELONS, 1, 3),
  emptyBox(PENCILS, 2, 0),
  emptyBox({ box: "سلّة", fem: true, countText: "نحو 40 تفاحة", one: "تفاحة واحدة", plural: "التفاح", count: 40, total: 9, diff: 7, unit: "كغ" }, 2, 2),
];

// =====================================================================
// 5) القصّ من لوح: أكبر عدد من القطع (يمكن تدوير القطع)
// =====================================================================

interface Cut {
  thing: string; // «الرفوف» (معرّفة)
  board: string; // «لوح خشب»
  W: number;
  H: number;
  a: number;
  b: number;
}

const gridFit = (W: number, H: number, a: number, b: number) => Math.floor(W / a) * Math.floor(H / b);

/** أفضل ترتيب: شبكة واحدة، أو جزءان يُقصّ كل منهما باتجاه (التقسيم من جهة الطول أو من جهة العرض) */
function bestCut({ W, H, a, b }: Cut) {
  let best = { count: Math.max(gridFit(W, H, a, b), gridFit(W, H, b, a)), text: "" };
  for (const [p, q] of [
    [a, b],
    [b, a],
  ]) {
    for (let k = 1; k * p < W; k++) {
      const first = k * Math.floor(H / q);
      const rest = gridFit(W - k * p, H, q, p);
      if (first + rest > best.count)
        best = {
          count: first + rest,
          text: `نقصّ أولًا جزءًا مقاسه $${k * p} × ${H}$ سم فيه ${pieces(first)}، ويبقى جزء مقاسه $${W - k * p} × ${H}$ سم نقصّ منه ${pieces(rest)} بعد تدويرها.`,
        };
    }
    for (let k = 1; k * q < H; k++) {
      const first = k * Math.floor(W / p);
      const rest = gridFit(W, H - k * q, q, p);
      if (first + rest > best.count)
        best = {
          count: first + rest,
          text: `نقصّ أولًا جزءًا مقاسه $${W} × ${k * q}$ سم فيه ${pieces(first)}، ويبقى جزء مقاسه $${W} × ${H - k * q}$ سم نقصّ منه ${pieces(rest)} بعد تدويرها.`,
        };
    }
  }
  return best;
}

function cutting(c: Cut, difficulty: Difficulty, answer: number): QuestionInput {
  const area = Math.floor((c.W * c.H) / (c.a * c.b));
  const best = bestCut(c);
  if (best.count !== area) throw new Error(`لا يمكن إثبات أن ${best.count} هو الأكبر: ${JSON.stringify(c)}`);
  const g1 = gridFit(c.W, c.H, c.a, c.b);
  const g2 = gridFit(c.W, c.H, c.b, c.a);
  const simple = Math.max(g1, g2);
  const how = best.text
    ? `الترتيب البسيط (كل القطع في اتجاه واحد) يعطي ${pieces(simple)} فقط. لكن يمكن الجمع بين اتجاهين: ${best.text} المجموع ${best.count}.`
    : `نصفّ القطع في اتجاه واحد: $${Math.floor(c.W / (g1 >= g2 ? c.a : c.b))} × ${Math.floor(c.H / (g1 >= g2 ? c.b : c.a))} = ${simple}$ ${simple <= 10 ? "قطع" : "قطعة"}.`;
  return {
    id: nextId(),
    difficulty,
    prompt:
      `اشترت ورشة ${c.board} طوله ${c.W} سم وعرضه ${c.H} سم، وتريد أن تقصّ منه عددًا من ${c.thing}، طول كل قطعة ${c.a} سم وعرضها ${c.b} سم. ` +
      `ما أكبر عدد من ${c.thing} يمكن قصّه من اللوح؟ (يمكن تدوير القطع، ولا يمكن لصق قطعتين)`,
    ...choices(best.count, [simple, best.count + 1, best.count - 1, g1 === simple ? g2 : g1, area + 2], answer, pieces, (v) => v > 0),
    explanation:
      `${how} ولا يمكن أكثر من ذلك، لأن مساحة اللوح ÷ مساحة القطعة الواحدة: $${c.W * c.H} ÷ ${c.a * c.b} ${(c.W * c.H) % (c.a * c.b) ? "≈" : "="} ${dec((c.W * c.H) / (c.a * c.b))}$، أي ${pieces(area)} على الأكثر. ` +
      `طريقة سريعة: احسب هذا الحد الأعلى أولًا، ثم ابحث عن ترتيب يصل إليه.`,
  };
}

const cutQuestions: QuestionInput[] = [
  cutting({ thing: "البطاقات", board: "لوح كرتون", W: 120, H: 60, a: 40, b: 30 }, 1, 0),
  cutting({ thing: "الرفوف", board: "لوح خشب", W: 100, H: 80, a: 50, b: 20 }, 1, 2),
  cutting({ thing: "البلاطات", board: "لوح رخام", W: 70, H: 50, a: 30, b: 20 }, 2, 3),
  cutting({ thing: "اللافتات", board: "لوح بلاستيك", W: 90, H: 50, a: 30, b: 20 }, 2, 1),
  cutting({ thing: "الأغطية", board: "لوح خشب", W: 80, H: 70, a: 40, b: 25 }, 3, 0),
  cutting({ thing: "الرفوف", board: "لوح خشب", W: 100, H: 70, a: 50, b: 20 }, 3, 2),
  cutting({ thing: "البطاقات", board: "لوح كرتون", W: 100, H: 50, a: 30, b: 20 }, 3, 3),
  cutting({ thing: "اللوحات", board: "لوح زجاج", W: 90, H: 60, a: 50, b: 20 }, 2, 1),
];

// =====================================================================

const byTopic = (topic: TopicId, list: QuestionInput[]) => defineOriginalQuestions(topic, list);

export const arithmeticQuantitative = byTopic("quantitative", [...hiddenDigitQuestions, ...boxQuestions]);
export const arithmeticProblemSolving = byTopic("problem-solving", [...scheduleQuestions, ...climbQuestions, ...cutQuestions]);

/** للاختبارات */
export const ARITHMETIC_DATA = { digitSolutions, climbDays, bestCut, endAfter };
