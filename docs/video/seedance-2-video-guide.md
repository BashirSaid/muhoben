# دليل إنتاج الفيديو الإرشادي لمنصة تسنيم التعليمية باستخدام Seedance 2.0

دليل عملي لإنتاج فيديو تعريفي وإرشادي مدته **80–90 ثانية** يشرح للطلاب والأهل ما هي منصة تسنيم التعليمية وكيف تُستخدم.

---

## 1. الفكرة الأساسية: إنتاج هجين

Seedance 2.0 نموذج قوي لتوليد المشاهد السينمائية، لكن عنده حدود يجب أن نبني الخطة حولها:

| ما نصنعه بـ Seedance | ما لا نصنعه بـ Seedance |
|---|---|
| مشاهد الطالب والأجواء والمشاعر | واجهة المنصة الحقيقية (الصفحات والأزرار) |
| ظهور الشعار المتحرك | أي نص عربي داخل الفيديو |
| الخلفيات والانتقالات الجمالية | الأرقام والبيانات الدقيقة |
| بطاقة النهاية (بدون نص) | التعليق الصوتي العربي (يُسجَّل منفصلًا) |

**لماذا؟**
- نماذج توليد الفيديو تكتب الحروف العربية بشكل مشوّه في الغالب، وتخترع واجهات غير موجودة. لذلك تُعرض **واجهة المنصة الحقيقية بتسجيل شاشة**، وتُضاف **كل النصوص العربية في برنامج المونتاج**.
- المقطع الواحد في Seedance 2.0 مدته **4–15 ثانية** (حسب المنصة التي تستخدمها)، فالفيديو الكامل يُركَّب من عدة مقاطع.

---

## 2. المواصفات النهائية

| البند | القيمة |
|---|---|
| المدة | 80–90 ثانية |
| النسبة | 16:9 (يوتيوب والموقع)، ونسخة 9:16 اختيارية للتيك توك والريلز |
| الدقة | 1080p (أو أعلى دقة تتيحها منصتك) |
| اللغة | العربية الفصحى المبسّطة |
| الألوان | أزرق الشعار `#1d6fd8`، أزرق سماوي `#0ea5e9`، رمادي `#475569`، أبيض |
| الخط في المونتاج | Tajawal (نفس خط المنصة) |
| الجمهور | طلاب الصف السادس وأهاليهم |

---

## 3. التحضير قبل البدء

جهّز هذه الملفات في مجلد واحد:

1. **الشعار:** `public/logo.png` من المستودع (خلفية بيضاء، 256×256). يفضّل نسخة أكبر إن وُجدت (1024×1024).
2. **لقطات شاشة من المنصة** (للمرجع البصري في Seedance): لوحة الطالب، صفحة اليوم، سؤال مع الشرح، تقرير النتيجة.
3. **تسجيلات شاشة** (القسم 7): هي التي ستظهر فعليًا في الفيديو.
4. **التعليق الصوتي** (القسم 6): مسجَّل بصوت بشري أو بأداة تحويل نص إلى كلام عربية.
5. **موسيقى خلفية** هادئة ومرخّصة (مثل مكتبة YouTube Audio Library أو مكتبة CapCut).

---

## 4. لوحة القصة (Storyboard)

| # | الزمن | المصدر | المحتوى | التعليق الصوتي |
|---|---|---|---|---|
| 1 | 0:00–0:10 | **Seedance** | طالب يجلس إلى مكتبه مساءً، يفتح جهازه اللوحي بفضول، ومربعات ضوئية زرقاء تتطاير | الجملة 1 |
| 2 | 0:10–0:16 | **Seedance** | ظهور الشعار من مربعات البكسل الزرقاء | الجملة 2 |
| 3 | 0:16–0:32 | تسجيل شاشة | لوحة الطالب ← صفحة الخطة | الجملة 3 |
| 4 | 0:32–0:52 | تسجيل شاشة | صفحة اليوم: الدرس ← مثال محلول ← سؤال ← «تحقّق» ← الشرح | الجملة 4 |
| 5 | 0:52–1:04 | تسجيل شاشة | اختبار بمؤقت ← التقرير ونقاط القوة | الجملة 5 |
| 6 | 1:04–1:14 | **Seedance** | الطالب يبتسم بثقة، وحلقة ضوئية زرقاء تكتمل حوله، ووالدته تشجّعه | الجملة 6 |
| 7 | 1:14–1:26 | **Seedance** + نص في المونتاج | بطاقة النهاية: الشعار وخلفية متحركة، ثم الاسم وبيانات التواصل | الجملة 7 |

---

## 5. البرومبتات الجاهزة لـ Seedance 2.0

### قواعد عامة لكل البرومبتات
- **اكتب البرومبت بالإنجليزية**: النماذج تلتزم بها بدقة أكبر. (الترجمة العربية تحت كل برومبت للفهم فقط.)
- **اربط كل ملف مرفوع بوسم @** واذكر صراحة ماذا تأخذ منه: `@Image1` للشعار مثلًا.
- **4–5 ملفات مرجعية كحد أقصى** في التوليد الواحد؛ الأقل أدق.
- **ولّد 3–4 نسخ** من كل مشهد واختر الأفضل.
- **الشخصيات بأسلوب رسوم ثلاثية الأبعاد** وليست واقعية: أنسب للأطفال، وتتجنب استخدام وجوه أطفال حقيقيين، وبعض المنصات تقيّد توليد الأشخاص الواقعيين في Seedance 2.0.
- اختم كل برومبت بقسم القيود (Constraints) لمنع النصوص والتشوهات.

---

### المشهد 1: الافتتاح (10 ثوانٍ)

**الإعدادات:** المدة 10 ث · النسبة 16:9 · بدون ملفات مرجعية (أو `@Image1` للشعار لاستلهام الألوان)

```text
Stylized 3D animated short film, warm and friendly, high-quality family-animation look.

Shot 1 (0-4s): Medium-wide shot. Evening, a cozy bedroom study corner with a wooden desk,
a small plant and a warm desk lamp. A curious 11-year-old Arab student with short dark hair,
wearing a light blue sweater, sits down and picks up a tablet. Slow dolly-in.

Shot 2 (4-7s): Close-up on the student's face lit by the soft blue glow of the tablet screen.
Their expression turns from curious to excited. Shallow depth of field.

Shot 3 (7-10s): Small glowing blue square pixels float up from the tablet screen and drift
gently through the air around the student, like digital fireflies. Camera slowly orbits
around the student. The tablet screen itself is shown only as soft glowing light.

Color palette: royal blue #1d6fd8, sky blue #0ea5e9, soft grey, warm lamp light.
Lighting: soft cinematic key light from the lamp, cool blue rim light from the screen.
Audio: gentle ambient room tone, a soft magical shimmer when the pixels appear. No dialogue.

Constraints: no text, no letters, no numbers, no logos, no user interface on any screen,
no subtitles, no watermark. Consistent character across all shots. Natural hands.
```

> **الترجمة:** رسوم ثلاثية الأبعاد دافئة. لقطة 1: ركن دراسة مسائي، طالب عربي في الحادية عشرة يلتقط جهازًا لوحيًا، والكاميرا تقترب ببطء. لقطة 2: وجهه مضاء بتوهج الشاشة، يتحول تعبيره من الفضول إلى الحماس. لقطة 3: مربعات بكسل زرقاء مضيئة تتطاير من الشاشة كاليراعات، والكاميرا تدور حوله. بلا نصوص ولا واجهات.

---

### المشهد 2: ظهور الشعار (6 ثوانٍ)

**الإعدادات:** المدة 6 ث · النسبة 16:9 · الملف المرجعي: `@Image1` = الشعار

```text
Logo reveal animation. @Image1 is the exact brand logo: a blue and grey diamond shape with
a white stylized letter "T" and small blue square pixels on its left side.

0-3s: Pure white clean background. Dozens of small glowing blue square pixels fly in from the
left side of the frame, swirling smoothly toward the center.

3-5s: The pixels assemble and snap together precisely into the logo from @Image1, centered
in frame. A soft light sweep passes across the logo surface.

5-6s: The finished logo holds perfectly still, centered, with a subtle soft shadow beneath it.

Style: clean premium motion graphics, smooth easing, crisp edges.
Audio: soft whoosh as the pixels fly in, a gentle bright chime when the logo completes.

Constraints: the final logo must match @Image1 exactly in shape, colors and proportions.
Do not redesign, distort, mirror or add elements to the logo. No text, no letters besides the
logo's own "T" shape, no watermark. Locked-off static camera.
```

> **ملاحظة:** إذا تشوّه الشعار في النتيجة، استخدم الثانيتين الأوليين فقط (تطاير المربعات)، ثم أضف صورة الشعار الحقيقية في المونتاج مع حركة تكبير ناعمة (Scale 90% ← 100%) وتلاشٍ للظهور. هذه الطريقة تضمن شعارًا مطابقًا 100%.

---

### المشهد 6: لحظة الثقة (10 ثوانٍ)

**الإعدادات:** المدة 10 ث · النسبة 16:9 · الملفات المرجعية: `@Image1` = إطار من المشهد 1 لنفس الطالب (لثبات الشخصية)

```text
Stylized 3D animated short film, same art style and same student character as @Image1
(an 11-year-old Arab student with short dark hair and a light blue sweater).

Shot 1 (0-4s): Daytime, bright sunny version of the same study corner. The student finishes
working on the tablet, leans back and smiles proudly. Slow push-in.

Shot 2 (4-7s): A glowing blue ring of light appears in the air in front of the student and
gradually fills in a smooth circular motion until it is complete, then glows brighter.
The student watches it with a confident smile.

Shot 3 (7-10s): The student's mother enters from the side, places a gentle hand on the
student's shoulder and smiles encouragingly. Warm, calm moment. Slow camera pull-back.

Color palette: royal blue #1d6fd8, sky blue #0ea5e9, warm sunlight, soft whites.
Audio: uplifting soft piano note when the ring completes, gentle ambient sound. No dialogue.

Constraints: no text, no numbers, no percentages, no user interface, no logos, no watermark.
Keep the student's face, hair and clothes consistent with @Image1. Natural hands.
```

> **الترجمة:** نفس الطالب في ضوء النهار، ينهي تدريبه ويبتسم بفخر. حلقة ضوئية زرقاء تمتلئ أمامه حتى تكتمل (رمز لإنجاز الخطة). تدخل والدته وتضع يدها على كتفه مشجّعة. بلا أرقام ولا نصوص.

---

### المشهد 7: خلفية بطاقة النهاية (12 ثانية)

**الإعدادات:** المدة 12 ث · النسبة 16:9 · الملف المرجعي: `@Image1` = الشعار

```text
Elegant looping end-card background for an educational brand.

A soft white-to-light-blue gradient background. Small translucent blue square pixels drift
slowly and calmly across the frame, with gentle depth of field and subtle parallax.
The logo from @Image1 sits small and perfectly still in the upper center of the frame.
The lower two thirds of the frame stay clean and uncluttered (reserved for text added later).

Style: minimal, premium, calm motion graphics. Static locked-off camera. Seamless slow motion.
Audio: none.

Constraints: the logo must match @Image1 exactly and must not move or change.
No text, no letters, no numbers, no watermark.
```

> **لماذا مساحة فارغة؟** لأننا سنضيف في المونتاج: اسم المنصة، والبريد، والهاتف، وسطر الحقوق، كلها بخط Tajawal العربي الواضح.

---

### مشهد اختياري: الجهاز اللوحي بشاشة خضراء (للمحترفين)

لدمج تسجيل الشاشة الحقيقي داخل مشهد سينمائي:

```text
Stylized 3D animated scene. Over-the-shoulder shot of the same 11-year-old student from @Image1
holding a tablet in landscape orientation, facing the camera at a slight angle.
The tablet screen is a perfectly flat, uniform, bright chroma-key green (#00FF00) with no
reflections, no glare and no content. The camera is completely locked off and static.
The student's fingers rest on the tablet edges and never cover the screen.
Duration 6 seconds. No text, no logos, no watermark.
```

في CapCut: ضع تسجيل الشاشة تحت هذا المقطع، ثم طبّق **Chroma Key** على اللون الأخضر، وعدّل زوايا تسجيل الشاشة لتطابق الشاشة (الكاميرا ثابتة فلا حاجة للتتبع).

---

## 6. نص التعليق الصوتي (عربي فصيح مبسّط)

**الإيقاع:** هادئ ودافئ ومشجّع، نحو 120–130 كلمة في الدقيقة. يمكن التسجيل بصوت معلّم أو معلّمة.

| # | الزمن | النص |
|---|---|---|
| 1 | 0:00 | هل تحبّ الألغاز والتحديات؟ وهل تريد أن تقوّي تفكيرك استعدادًا لاختبارات برامج الموهوبين؟ |
| 2 | 0:10 | مع **منصة تسنيم التعليمية**… ثلاثون يومًا من التدريب الممتع. |
| 3 | 0:16 | ابدأ من لوحتك: ترى يومك الحالي، ونسبة إنجازك، ومستواك في ستة مجالات: المنطق، والأنماط، واللغة، والتفكير الكمّي، والأشكال، وحلّ المشكلات. |
| 4 | 0:32 | في كل يوم: درس قصير، وأمثلة محلولة خطوة بخطوة، ثم أسئلة تدريبية. اختر إجابتك، واضغط «تحقّق»، واقرأ الشرح فورًا… فكل خطأ فرصة لتتعلّم. |
| 5 | 0:52 | وعندما تكون مستعدًا، جرّب الاختبارات الشاملة بمؤقت، واحصل على تقرير يوضّح نقاط قوّتك، وما يحتاج إلى تدريب أكثر. |
| 6 | 1:04 | خطوة صغيرة كل يوم… تصنع فرقًا كبيرًا. |
| 7 | 1:14 | منصة تسنيم التعليمية. ابدأ يومك الأول الآن! |

**على الشاشة (سطر صغير في المشهد 7):**
> الأسئلة تدريبية من إعداد المنصة، وليست أسئلة رسمية.

---

## 7. تسجيل الشاشة

**الأدوات:** OBS Studio (مجاني) على الحاسوب، أو التسجيل المدمج في الهاتف لنسخة 9:16.

**قبل التسجيل:**
1. افتح المنصة في نافذة متصفح نظيفة (بلا إشارات مرجعية ولا إضافات ظاهرة)، بمقاس **1920×1080**، وتكبير 110–125% ليكون النص واضحًا.
2. حضّر بيانات تجريبية: أنجز يومين أو ثلاثة واختبارًا قصيرًا حتى تظهر اللوحة ممتلئة. (التقدّم يُحفظ في المتصفح فقط.)
3. لا تُظهر أي اسم أو بيانات حقيقية لطالب.

**اللقطات المطلوبة** (سجّل كلًا منها منفصلة، بحركة فأرة بطيئة وهادئة):

| اللقطة | الصفحة | الحركة |
|---|---|---|
| أ | `/` لوحة الطالب | تمرير بطيء من بطاقة «اليوم» إلى «مستواك في كل مجال» |
| ب | `/plan/` الخطة | تمرير بطيء على الأسابيع، ثم ضغطة على اليوم الحالي |
| ج | `/day/4/` صفحة اليوم | تمرير على الدرس، فتح «مثال 1» |
| د | أسئلة اليوم | اختيار إجابة ← «تحقّق من الإجابة» ← توقف 3 ثوانٍ على الشرح |
| هـ | `/exam/` | «ابدأ الاختبار» ← إظهار المؤقت ← الإجابة عن سؤالين |
| و | تقرير النتيجة | تمرير على «الأداء حسب المجال» و«نقاط القوة» |

**نصيحة:** في المونتاج كبّر الإطار تدريجيًا (Zoom 100% ← 115%) نحو العنصر الذي يُذكر في التعليق الصوتي، مثل زر «تحقّق» أو حلقة الإنجاز.

---

## 8. المونتاج في CapCut (أو Premiere / DaVinci Resolve)

1. **الترتيب:** ضع المقاطع حسب لوحة القصة (القسم 4)، ثم التعليق الصوتي على مسار منفصل.
2. **القصّ على الصوت:** اجعل كل انتقال يحدث في نهاية جملة من التعليق.
3. **الانتقالات:** تلاشٍ قصير (0.3–0.5 ث) أو انتقال «Zoom» خفيف؛ تجنّب الانتقالات المبهرجة.
4. **النصوص العربية:**
   - الخط: **Tajawal** (Bold للعناوين، Regular للتفاصيل).
   - المحاذاة: يمين، واتجاه RTL. تأكد أن الحروف متصلة وليست مقطّعة. إذا ظهرت مقطّعة فاكتب النص في محرر يدعم العربية والصقه.
   - عناوين قصيرة فوق تسجيلات الشاشة: «لوحتك اليومية» · «درس + أمثلة + أسئلة» · «شرح فوري لكل سؤال» · «تقارير تشجّعك».
5. **الترجمة النصية (Subtitles):** أضف ترجمة عربية للتعليق كاملًا؛ كثيرون يشاهدون بلا صوت.
6. **الموسيقى:** مستوى منخفض (−20 إلى −25 dB) تحت التعليق، ورفعها قليلًا في المشهدين 2 و6.
7. **بطاقة النهاية (المشهد 7):** أضف فوق الخلفية:
   ```
   منصة تسنيم التعليمية
   ✉️ tasnimsystems@gmail.com
   📞 +972 54-729-7817
   © 2026 جميع الحقوق محفوظة لتسنيم للحاسوب
   ```
   ورابط المنصة عند نشرها، مثل `bashirsaid.github.io/muhoben`.
8. **التصدير:** MP4، H.264، 1080p، 30 إطارًا/ث، معدل بت 10–16 Mbps.

**نسخة 9:16:** أعد توليد مشاهد Seedance بنسبة 9:16 (لا تقصّ نسخة 16:9)، وسجّل الشاشة من الهاتف.

---

## 9. حل المشكلات الشائعة

| المشكلة | الحل |
|---|---|
| ظهرت حروف أو كلمات مشوّهة في المشهد | أكّد في القيود: `no text, no letters, no numbers`، وأزل أي ذكر لكلمات مثل "sign" أو "book title" |
| الشعار تغيّر شكله | استخدم الحل البديل في المشهد 2 (صورة الشعار الحقيقية في المونتاج) |
| الطالب يختلف شكله بين المشاهد | استخرج إطارًا واضحًا من المشهد 1 واستخدمه `@Image1` في المشاهد التالية، وكرّر وصف الملابس نفسه |
| الأيدي والأصابع مشوّهة | قلّل الحركات المعقدة لليدين، وأضف `natural hands, simple hand poses` |
| الحركة سريعة أو مضطربة | أضف `slow, smooth camera movement` وقلّل عدد اللقطات داخل المقطع الواحد |
| المنصة ترفض توليد الأشخاص | جرّب أسلوبًا أكثر كرتونية، أو استبدل الطالب بيدين فقط تمسكان الجهاز، أو استخدم نموذجًا آخر لهذا المشهد |
| المقطع أقصر من المطلوب | المدة القصوى للمقطع 15 ثانية؛ قسّم المشهد إلى مقطعين متتاليين بنفس المرجع |

---

## 10. قائمة التحقق قبل النشر

- [ ] اسم المنصة مكتوب صحيحًا: «منصة تسنيم التعليمية».
- [ ] الشعار مطابق للأصل ولم يتشوّه.
- [ ] كل النصوص العربية متصلة الحروف واتجاهها صحيح.
- [ ] لا تظهر بيانات أو وجوه طلاب حقيقيين.
- [ ] لا يوجد شعار وزارة التربية والتعليم، ولا ادّعاء بأن الأسئلة رسمية أو مطابقة للامتحان.
- [ ] السطر التوضيحي «الأسئلة تدريبية من إعداد المنصة» ظاهر.
- [ ] البريد والهاتف صحيحان: `tasnimsystems@gmail.com` · `+972 54-729-7817`.
- [ ] سطر الحقوق: «© 2026 جميع الحقوق محفوظة لتسنيم للحاسوب».
- [ ] الموسيقى مرخّصة للاستخدام.
- [ ] شاهدت الفيديو كاملًا على الهاتف وبصوت منخفض.

---

### ملاحظة عن حدود Seedance 2.0

حدود الأداة (المدة القصوى، وعدد الملفات المرجعية، وتوليد الأشخاص، وتوفر الصوت) تختلف حسب المنصة التي تستخدم Seedance من خلالها، وقد تتغير مع الإصدارات الجديدة. تحقق من إعدادات منصتك قبل البدء.
