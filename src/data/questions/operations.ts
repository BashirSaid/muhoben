import type { Difficulty, Question } from "@/lib/types";
import { defineOriginalQuestions } from "./define";

/*
 * أسئلة «العملية الجديدة»: رمز جديد (@، #، ★، ◆) تُعرَّف له قاعدة في نص السؤال،
 * والمطلوب تطبيقها. الأسئلة أصلية من إعداد المنصة، وكل الإجابات والمشتّتات
 * تُحسب برمجيًا من تعريف العملية، فلا تحتمل خطأً حسابيًا.
 */

type QuestionInput = Omit<Question, "topic" | "source">;

interface BinOp {
  sym: string;
  /** التعريف كما يُكتب في السؤال (يُعرض من اليسار إلى اليمين) */
  def: string;
  /** نص إضافي بالعربية يشرح التعريف (اختياري) */
  note?: string;
  f: (a: number, b: number) => number;
  /** التعويض كما يُكتب في الشرح */
  show: (a: number, b: number) => string;
}

interface UnOp {
  sym: string;
  def: string;
  f: (a: number) => number;
  show: (a: number) => string;
}

const bin = (sym: string, rhs: string, f: BinOp["f"], show: BinOp["show"], note?: string): BinOp => ({
  sym,
  def: `a ${sym} b = ${rhs}`,
  f,
  show,
  note,
});

const intro = (op: BinOp) =>
  `العملية ${op.sym} مُعرَّفة لكل عددين a و b هكذا: $${op.def}$${op.note ? ` (${op.note})` : ""}.`;

/** أربعة خيارات مختلفة: الصحيح في الموضع answer، والمشتّتات من أخطاء شائعة */
function choices(correct: number, traps: number[], answer: number) {
  const wrong: number[] = [];
  for (const t of [...traps, correct + 1, correct - 1, correct + 2, correct + 10, correct * 2])
    if (Number.isInteger(t) && t >= 0 && t !== correct && !wrong.includes(t) && wrong.length < 3) wrong.push(t);
  const list = wrong.map(String);
  list.splice(answer, 0, String(correct));
  return { options: list, answer };
}

let n = 0;
const nextId = () => `qnt-op${String(++n).padStart(2, "0")}`;

// ---------------------------------------------------------------------
// تعريفات العمليات
// ---------------------------------------------------------------------

const OPS = {
  a2b: bin("@", "a + 2 × b", (a, b) => a + 2 * b, (a, b) => `${a} + 2 × ${b}`),
  ab1: bin("#", "a × b − 1", (a, b) => a * b - 1, (a, b) => `${a} × ${b} − 1`),
  sq: bin("★", "a × a + b", (a, b) => a * a + b, (a, b) => `${a} × ${a} + ${b}`),
  diff3: bin("◆", "3 × a − b", (a, b) => 3 * a - b, (a, b) => `3 × ${a} − ${b}`),
  sumx2: bin("@", "(a + b) × 2", (a, b) => (a + b) * 2, (a, b) => `(${a} + ${b}) × 2`),
  avg: bin("#", "(a + b) ÷ 2", (a, b) => (a + b) / 2, (a, b) => `(${a} + ${b}) ÷ 2`),
  prodSum: bin("★", "a × b + a + b", (a, b) => a * b + a + b, (a, b) => `${a} × ${b} + ${a} + ${b}`),
  halfA: bin("◆", "a ÷ 2 + b", (a, b) => a / 2 + b, (a, b) => `${a} ÷ 2 + ${b}`),
  aMinusB2: bin("@", "a × 2 − b", (a, b) => a * 2 - b, (a, b) => `${a} × 2 − ${b}`),
  tenAB: bin("#", "10 × a + b", (a, b) => 10 * a + b, (a, b) => `10 × ${a} + ${b}`),
  maxMin: bin(
    "◆",
    "الأكبر − الأصغر",
    (a, b) => Math.max(a, b) - Math.min(a, b),
    (a, b) => `${Math.max(a, b)} − ${Math.min(a, b)}`,
    "نطرح العدد الأصغر من الأكبر",
  ),
  bigTwice: bin(
    "★",
    "2 × الأكبر + الأصغر",
    (a, b) => 2 * Math.max(a, b) + Math.min(a, b),
    (a, b) => `2 × ${Math.max(a, b)} + ${Math.min(a, b)}`,
    "نضاعف العدد الأكبر ثم نضيف الأصغر",
  ),
} satisfies Record<string, BinOp>;

const UN = {
  sqMinus1: { sym: "#", def: "#a = a × a − 1", f: (a: number) => a * a - 1, show: (a: number) => `${a} × ${a} − 1` },
  triple: { sym: "@", def: "@a = 3 × a + 1", f: (a: number) => 3 * a + 1, show: (a: number) => `3 × ${a} + 1` },
  half: { sym: "★", def: "★a = a ÷ 2 + 4", f: (a: number) => a / 2 + 4, show: (a: number) => `${a} ÷ 2 + 4` },
} satisfies Record<string, UnOp>;

// ---------------------------------------------------------------------
// أنواع الأسئلة
// ---------------------------------------------------------------------

/** حساب مباشر: a op b */
function direct(op: BinOp, a: number, b: number, difficulty: Difficulty, answer: number): QuestionInput {
  const v = op.f(a, b);
  return {
    id: nextId(),
    difficulty,
    prompt: `${intro(op)} ما قيمة $${a} ${op.sym} ${b}$؟`,
    ...choices(v, [op.f(b, a), a + b], answer),
    explanation:
      `نعوّض a = ${a} و b = ${b} في التعريف: $${op.show(a, b)} = ${v}$. ` +
      (op.f(b, a) === v
        ? "في هذه العملية لا يغيّر تبديل العددين النتيجة، لكنه يغيّرها في عمليات كثيرة، فاحرص دائمًا على أن يكون العدد الأول مكان a."
        : `انتبه للترتيب: العدد الأول مكان a والثاني مكان b. لو بدّلناهما لحصلنا على ${op.f(b, a)}، وهذا خطأ شائع.`),
  };
}

/** تبديل العددين: (a op b) − (b op a) */
function swap(op: BinOp, a: number, b: number, answer: number): QuestionInput {
  const x = op.f(a, b);
  const y = op.f(b, a);
  const v = x - y;
  return {
    id: nextId(),
    difficulty: 2,
    prompt: `${intro(op)} ما قيمة $(${a} ${op.sym} ${b}) − (${b} ${op.sym} ${a})$؟`,
    ...choices(v, [0, x, x + y], answer),
    explanation:
      `نحسب كل قوس وحده: $${a} ${op.sym} ${b} = ${op.show(a, b)} = ${x}$، و $${b} ${op.sym} ${a} = ${op.show(b, a)} = ${y}$. ` +
      `إذن $${x} − ${y} = ${v}$. تبديل العددين يغيّر النتيجة في هذه العملية، فلا تفترض أن الجواب صفر.`,
  };
}

/** متداخلة: (a op b) op c */
function nestedLeft(op: BinOp, a: number, b: number, c: number, difficulty: Difficulty, answer: number): QuestionInput {
  const x = op.f(a, b);
  const v = op.f(x, c);
  return {
    id: nextId(),
    difficulty,
    prompt: `${intro(op)} ما قيمة $(${a} ${op.sym} ${b}) ${op.sym} ${c}$؟`,
    ...choices(v, [op.f(a, op.f(b, c)), x, op.f(c, x)], answer),
    explanation: `نبدأ بالقوس: $${a} ${op.sym} ${b} = ${op.show(a, b)} = ${x}$. ثم نستعمل الناتج مكان a: $${x} ${op.sym} ${c} = ${op.show(x, c)} = ${v}$.`,
  };
}

/** متداخلة من اليمين: a op (b op c) */
function nestedRight(op: BinOp, a: number, b: number, c: number, answer: number): QuestionInput {
  const x = op.f(b, c);
  const v = op.f(a, x);
  return {
    id: nextId(),
    difficulty: 3,
    prompt: `${intro(op)} ما قيمة $${a} ${op.sym} (${b} ${op.sym} ${c})$؟`,
    ...choices(v, [op.f(op.f(a, b), c), x, op.f(x, a)], answer),
    explanation: `القوس أولًا: $${b} ${op.sym} ${c} = ${op.show(b, c)} = ${x}$. والناتج هنا مكان b لأنه العدد الثاني: $${a} ${op.sym} ${x} = ${op.show(a, x)} = ${v}$.`,
  };
}

/** عدد مجهول: x op b = t (أو a op x = t) */
function unknown(op: BinOp, side: "a" | "b", known: number, x: number, difficulty: Difficulty, answer: number): QuestionInput {
  const calc = (k: number) => (side === "a" ? op.f(k, known) : op.f(known, k));
  const t = calc(x);
  const sols = Array.from({ length: 201 }, (_, k) => k).filter((k) => calc(k) === t);
  if (sols.length !== 1) throw new Error(`أكثر من حل: ${op.def} ${t}`);
  const lhs = side === "a" ? `x ${op.sym} ${known}` : `${known} ${op.sym} x`;
  const traps = [t - known, t, known, Math.abs(x - known)];
  return {
    id: nextId(),
    difficulty,
    prompt: `${intro(op)} إذا كان $${lhs} = ${t}$، فما قيمة x؟`,
    ...choices(x, traps, answer),
    explanation:
      `نعوّض في التعريف: $${(side === "a" ? op.show(NaN, known) : op.show(known, NaN)).replace(/NaN/g, "x")} = ${t}$. ` +
      `نجرّب الخيارات أو نعمل بالعكس، فنجد x = ${x}. تحقّق: $${side === "a" ? op.show(x, known) : op.show(known, x)} = ${t}$ ✓.`,
  };
}

/** عملية على عدد واحد، مرة أو مرتين */
function unary(op: UnOp, a: number, twice: boolean, difficulty: Difficulty, answer: number): QuestionInput {
  const x = op.f(a);
  const v = twice ? op.f(x) : x;
  const expr = twice ? `${op.sym}(${op.sym}${a})` : `${op.sym}${a}`;
  return {
    id: nextId(),
    difficulty,
    prompt: `العملية ${op.sym} مُعرَّفة لكل عدد a هكذا: $${op.def}$. ما قيمة $${expr}$؟`,
    ...choices(v, twice ? [x, x * 2, op.f(a + 1)] : [op.f(a + 1), a * 3], answer),
    explanation: twice
      ? `من الداخل إلى الخارج: $${op.sym}${a} = ${op.show(a)} = ${x}$، ثم $${op.sym}${x} = ${op.show(x)} = ${v}$.`
      : `نعوّض a = ${a}: $${op.show(a)} = ${v}$.`,
  };
}

/** عمليتان معًا: (a op1 b) op2 c */
function mixed(op1: BinOp, op2: BinOp, a: number, b: number, c: number, answer: number): QuestionInput {
  const x = op1.f(a, b);
  const v = op2.f(x, c);
  return {
    id: nextId(),
    difficulty: 3,
    prompt:
      `العمليتان مُعرَّفتان لكل عددين a و b هكذا: $${op1.def}$، و $${op2.def}$. ` + `ما قيمة $(${a} ${op1.sym} ${b}) ${op2.sym} ${c}$؟`,
    ...choices(v, [op1.f(x, c), op2.f(a, b), x], answer),
    explanation: `القوس أولًا بالعملية ${op1.sym}: $${op1.show(a, b)} = ${x}$. ثم العملية ${op2.sym}: $${x} ${op2.sym} ${c} = ${op2.show(x, c)} = ${v}$. لا تخلط بين تعريفَي العمليتين.`,
  };
}

/** أيّ زوج يعطي ناتجًا معيّنًا */
function whichPair(op: BinOp, pairs: [number, number][], target: number, answer: number): QuestionInput {
  const hits = pairs.filter(([a, b]) => op.f(a, b) === target);
  if (hits.length !== 1) throw new Error(`يجب أن يكون زوج واحد صحيح: ${op.def}`);
  const [ca, cb] = hits[0];
  const wrong = pairs.filter((p) => p !== hits[0]);
  const list = wrong.map(([a, b]) => `$${a} ${op.sym} ${b}$`);
  list.splice(answer, 0, `$${ca} ${op.sym} ${cb}$`);
  return {
    id: nextId(),
    difficulty: 2,
    prompt: `${intro(op)} أيّ تعبير قيمته ${target}؟`,
    options: list,
    answer,
    explanation:
      `نحسب كل خيار: ` +
      pairs.map(([a, b]) => `$${op.show(a, b)} = ${op.f(a, b)}$`).join("، ") +
      `. الوحيد الذي يساوي ${target} هو $${ca} ${op.sym} ${cb}$.`,
  };
}

// ---------------------------------------------------------------------
// بنك الأسئلة (40 سؤالًا)
// ---------------------------------------------------------------------

const list: QuestionInput[] = [
  // حساب مباشر
  direct(OPS.a2b, 3, 4, 1, 0),
  direct(OPS.ab1, 5, 6, 1, 1),
  direct(OPS.sq, 4, 3, 1, 2),
  direct(OPS.diff3, 7, 5, 1, 3),
  direct(OPS.sumx2, 6, 9, 1, 1),
  direct(OPS.avg, 7, 13, 1, 2),
  direct(OPS.prodSum, 3, 5, 2, 0),
  direct(OPS.halfA, 18, 7, 1, 3),
  direct(OPS.aMinusB2, 9, 4, 1, 2),
  direct(OPS.tenAB, 4, 7, 1, 0),
  direct(OPS.maxMin, 4, 11, 2, 1),
  direct(OPS.bigTwice, 3, 8, 2, 3),
  // تبديل العددين
  swap(OPS.a2b, 2, 6, 2),
  swap(OPS.diff3, 5, 4, 0),
  swap(OPS.sq, 4, 2, 3),
  swap(OPS.tenAB, 5, 2, 1),
  // متداخلة
  nestedLeft(OPS.a2b, 1, 2, 3, 2, 1),
  nestedLeft(OPS.ab1, 2, 3, 2, 2, 3),
  nestedLeft(OPS.avg, 6, 10, 4, 2, 0),
  nestedLeft(OPS.diff3, 4, 5, 6, 2, 2),
  nestedLeft(OPS.maxMin, 3, 10, 2, 2, 3),
  nestedLeft(OPS.halfA, 8, 2, 1, 3, 1),
  nestedRight(OPS.a2b, 5, 1, 2, 2),
  nestedRight(OPS.ab1, 2, 2, 3, 0),
  nestedRight(OPS.sumx2, 1, 2, 3, 3),
  // عدد مجهول
  unknown(OPS.a2b, "a", 4, 7, 2, 1),
  unknown(OPS.a2b, "b", 5, 6, 2, 3),
  unknown(OPS.ab1, "a", 3, 8, 2, 0),
  unknown(OPS.diff3, "a", 6, 9, 2, 2),
  unknown(OPS.sumx2, "b", 4, 11, 3, 1),
  unknown(OPS.tenAB, "b", 3, 6, 3, 3),
  // عملية على عدد واحد
  unary(UN.sqMinus1, 5, false, 1, 2),
  unary(UN.triple, 4, true, 2, 0),
  unary(UN.sqMinus1, 2, true, 2, 1),
  unary(UN.half, 12, true, 3, 3),
  // عمليتان معًا
  mixed(OPS.a2b, OPS.ab1, 2, 3, 2, 2),
  mixed(OPS.sumx2, OPS.diff3, 1, 2, 4, 0),
  mixed(OPS.maxMin, OPS.sq, 9, 6, 5, 1),
  // أيّ تعبير قيمته ...
  whichPair(OPS.a2b, [[2, 5], [5, 2], [4, 3], [6, 1]], 12, 2),
  whichPair(OPS.diff3, [[4, 2], [3, 1], [5, 6], [2, 4]], 9, 2),
];

export const operationQuestions = defineOriginalQuestions("quantitative", list);
