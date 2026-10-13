import { defineOriginalQuestions } from "../define";
import { arrow, flipV, grid, isoCubes, mirror, rot180, rot270, rot90 } from "./kit";

/*
 * الدفعة الخامسة: أسئلة اقترحتها أداة ذكاء اصطناعي (DeepSeek) باستخدام برومبت المنصة،
 * ثم رُوجعت قبل الإدراج. من أصل 20 سؤالًا قُبل 7 (3 منها بعد إصلاح)، ورُفض 13:
 * إجابات خاطئة (spa-i03، spa-i05)، أو أكثر من إجابة صحيحة (pat-i04 الأصلي، pat-i07، log-i02)،
 * أو بلا قاعدة منطقية (pat-i05، spa-i09، log-i01)، أو تكرار لأسئلة موجودة (الباقي).
 * أُعيد ترقيم المعرّفات بالحرف j لأن الحرف i مستخدم في الدفعة الرابعة.
 */

const SEQ = "ما الشكل الذي يأتي مكان علامة الاستفهام؟ (تُقرأ السلسلة من اليمين إلى اليسار)";

// pat-j02: شكلان غير متماثلين (في الأصل كان أحدهما قطرًا متماثلًا فتطابقت ثلاثة خيارات)
const R1 = [0, 1, 4];
const R2 = [1, 2, 5];
const R3 = [0, 3, 4];

// spa-j01: مجسّم مسطّح من ثلاثة مكعبات على شكل زاوية
const FLAT_L: [number, number, number][] = [[1, 0, 0], [0, 1, 0], [1, 1, 0]]; // الزاوية في المقدمة فتظهر المكعبات الثلاثة
const FLAT_FOOTPRINT = FLAT_L.map(([x, y]) => y * 3 + x).sort((a, b) => a - b);

const COLUMN = [0, 3, 6];
const HOOK = [0, 3, 6, 7];
const CAP = [0, 1, 4];
const CODE = [0, 1, 4];

export const patternShapeQuestions5 = defineOriginalQuestions("patterns", [
  {
    id: "pat-j01",
    difficulty: 1,
    prompt: SEQ,
    visual: { layout: "sequence", cells: [arrow(0), arrow(90), arrow(180), null] },
    optionVisuals: [arrow(270), arrow(45), arrow(135), arrow(225)],
    options: ["سهم إلى اليسار", "سهم مائل إلى الأعلى واليمين", "سهم مائل إلى الأسفل واليمين", "سهم مائل إلى الأسفل واليسار"],
    answer: 0,
    explanation: "يدور السهم ربع دورة مع عقارب الساعة في كل خطوة: إلى الأعلى، ثم إلى اليمين، ثم إلى الأسفل. بعد ذلك يشير إلى اليسار.",
  },
  {
    id: "pat-j02",
    difficulty: 3,
    prompt: "ما الشكل الذي يكمل الجدول؟ (يُقرأ كل صف من اليمين إلى اليسار)",
    visual: {
      layout: "matrix",
      cols: 3,
      cells: [grid(R1), grid(rot90(R1)), grid(rot180(R1)), grid(R2), grid(rot90(R2)), grid(rot180(R2)), grid(R3), grid(rot90(R3)), null],
    },
    optionVisuals: [grid(mirror(R3)), grid(rot180(R3)), grid(flipV(R3)), grid(rot270(R3))],
    options: ["صورة الشكل في مرآة عمودية", "الشكل بعد نصف دورة", "صورة الشكل في مرآة أفقية", "الشكل بعد ثلاثة أرباع دورة"],
    answer: 1,
    explanation:
      "في كل صف يدور الشكل ربع دورة مع عقارب الساعة من خانة إلى التي تليها، فيكون الأخير هو الأول بعد نصف دورة. في الصف الثالث ننقل كل مربع إلى الجهة المقابلة تمامًا حول المركز.",
  },
]);

export const spatialShapeQuestions5 = defineOriginalQuestions("spatial", [
  {
    id: "spa-j01",
    difficulty: 1,
    prompt: "كيف يبدو المجسّم عند النظر إليه من الأعلى؟",
    visual: { layout: "single", glyph: isoCubes(FLAT_L) },
    optionVisuals: [grid([0, 1, 2]), grid([0, 3, 6]), grid(FLAT_FOOTPRINT), grid([0, 1, 2, 5])],
    options: ["ثلاثة مربعات في صف", "ثلاثة مربعات في عمود", "ثلاثة مربعات على شكل زاوية", "أربعة مربعات"],
    answer: 2,
    explanation: "المجسّم ثلاثة مكعبات في طبقة واحدة على شكل زاوية، فنرى من الأعلى ثلاثة مربعات على شكل زاوية.",
  },
  {
    id: "spa-j02",
    difficulty: 1,
    prompt: "ما صورة الشكل في مرآة عمودية (تقلب اليمين واليسار)؟",
    visual: { layout: "mirror", glyph: grid(COLUMN) },
    optionVisuals: [grid(mirror(COLUMN)), grid(COLUMN), grid([0, 1, 2]), grid([6, 7, 8])],
    options: ["العمود الأيمن", "العمود الأيسر (دون تغيير)", "الصف العلوي", "الصف السفلي"],
    answer: 0,
    explanation: "المرآة العمودية تبدّل اليمين باليسار وتُبقي الصفوف كما هي، فيصبح العمود الأيسر عمودًا أيمن.",
  },
  {
    id: "spa-j03",
    difficulty: 2,
    prompt: "كيف يبدو الشكل بعد تدويره ربع دورة مع اتجاه عقارب الساعة؟",
    visual: { layout: "single", glyph: grid(HOOK) },
    optionVisuals: [grid(rot90(HOOK)), grid(mirror(HOOK)), grid(flipV(HOOK)), grid(rot180(HOOK))],
    options: ["ثلاثة مربعات في الصف العلوي ومربع تحت أولها", "صورة الشكل في مرآة عمودية", "صورة الشكل في مرآة أفقية", "الشكل بعد نصف دورة"],
    answer: 0,
    explanation:
      "عند التدوير ربع دورة مع عقارب الساعة يصبح العمود الأيسر هو الصف العلوي، والمربع الذي كان في أسفل العمود الأوسط ينتقل إلى بداية الصف الأوسط من اليسار.",
  },
  {
    id: "spa-j04",
    difficulty: 1,
    prompt: "الخط المتقطع مرآة أفقية. ما صورة الشكل في المرآة؟",
    visual: { layout: "mirror", axis: "horizontal", glyph: grid(CAP) },
    optionVisuals: [grid(flipV(CAP)), grid(mirror(CAP)), grid(CAP), grid([6, 7, 8])],
    options: ["مربعان في الصف السفلي والمركز فوقهما", "مربعان في الصف العلوي من الجهة الأخرى", "الشكل نفسه دون تغيير", "الصف السفلي كاملًا"],
    answer: 0,
    explanation: "المرآة الأفقية تبدّل الأعلى بالأسفل: المربعان في الصف العلوي ينتقلان إلى الصف السفلي، والمركز يبقى في مكانه.",
  },
]);

export const problemShapeQuestions5 = defineOriginalQuestions("problem-solving", [
  {
    id: "prb-j01",
    difficulty: 3,
    prompt:
      "في هذا الرمز السرّي: الدائرة ● تعني «دوّر الشكل ربع دورة مع عقارب الساعة»، والمثلث ▲ يعني «اقلب الشكل بين اليمين واليسار». ما ناتج تطبيق ● أولًا ثم ▲ على الشكل؟",
    visual: { layout: "single", glyph: grid(CODE) },
    optionVisuals: [grid(rot90(mirror(CODE))), grid(mirror(rot90(CODE))), grid(rot90(CODE)), grid(mirror(CODE))],
    options: ["القلب أولًا ثم الدوران (ترتيب معكوس)", "الدوران أولًا ثم القلب", "الدوران فقط", "القلب فقط"],
    answer: 1,
    explanation:
      "نطبّق العمليتين بالترتيب: ندوّر الشكل ربع دورة مع عقارب الساعة، ثم نقلب الناتج بين اليمين واليسار. انتبه: الترتيب مهم، فالقلب ثم الدوران يعطي شكلًا مختلفًا.",
  },
]);

/** للاختبارات */
export const BATCH5_DATA = { R1, R2, R3, FLAT_L, FLAT_FOOTPRINT, COLUMN, HOOK, CAP, CODE };
