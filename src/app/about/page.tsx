import type { Metadata } from "next";
import { Card, PageTitle } from "@/components/ui";
import { QUESTION_BANK } from "@/data/questions";
import { TOPICS } from "@/data/topics";
import { formatNumber } from "@/lib/format";
import { DataManager } from "./DataManager";

export const metadata: Metadata = { title: "عن المنصة والخصوصية" };

export default function AboutPage() {
  return (
    <>
      <PageTitle title="عن المنصة والخصوصية" />
      <div className="space-y-5 leading-8">
        <Card>
          <h2 className="text-lg font-extrabold">ما هذه المنصة؟</h2>
          <p className="mt-2 text-slate-700">
            منصة تدريبية مجانية لطلاب الصف السادس في المدارس العربية، تساعدهم على تنمية مهارات التفكير والاستدلال وحل
            المسائل خلال 30 يومًا، استعدادًا لاختبارات القبول في برامج الموهوبين والمتفوقين.
          </p>
          <p className="mt-2 text-slate-700">تغطي المنصة ستة مجالات تفكير عامة:</p>
          <ul className="mt-1 list-inside list-disc text-slate-700">
            {TOPICS.map((t) => (
              <li key={t.id}>{t.name}</li>
            ))}
          </ul>
          <p className="mt-2 text-slate-700">
            يضم بنك الأسئلة حاليًا {formatNumber(QUESTION_BANK.length)} سؤالًا أصليًا بثلاثة مستويات صعوبة.
          </p>
        </Card>

        <Card>
          <h2 className="text-lg font-extrabold">⚠️ تنبيه مهم حول المحتوى</h2>
          <ul className="mt-2 list-inside list-disc space-y-1 text-slate-700">
            <li>جميع الدروس والأسئلة والشروح من إعداد المنصة لأغراض التدريب فقط.</li>
            <li>الأسئلة ليست أسئلة رسمية، وليست صادرة عن وزارة التربية والتعليم أو أي جهة رسمية، ولم تُنسخ من امتحانات منشورة.</li>
            <li>
              تقسيم المجالات وعدد الأسئلة ومدة الاختبارات في المنصة اجتهاد تدريبي، ولا يُدّعى أنها تطابق مبنى الامتحان الرسمي
              المعتمد حاليًا. للحصول على معلومات رسمية ومحدّثة عن الامتحان ومواعيده، يُرجى مراجعة المدرسة أو قسم الطلاب
              الموهوبين والمتفوقين في وزارة التربية والتعليم.
            </li>
            <li>النتائج في المنصة للتدريب والمتابعة الذاتية، ولا تتنبأ بنتيجة الامتحان الرسمي.</li>
          </ul>
        </Card>

        <Card>
          <h2 className="text-lg font-extrabold">🔒 الخصوصية وحفظ البيانات</h2>
          <ul className="mt-2 list-inside list-disc space-y-1 text-slate-700">
            <li>لا تطلب المنصة اسمًا أو بريدًا إلكترونيًا أو رقم هوية أو أي معلومات شخصية، ولا يوجد تسجيل دخول.</li>
            <li>
              يُحفظ التقدّم (الأيام المنجزة ونتائج الاختبارات) في <b>التخزين المحلي لمتصفح هذا الجهاز فقط</b>، ولا يُرسل إلى أي
              خادم.
            </li>
            <li>
              هذا ليس تخزينًا مركزيًا: لن يظهر تقدّمك على جهاز آخر أو متصفح آخر، وقد يُحذف إذا مُسحت بيانات المتصفح أو
              استُخدم وضع التصفح الخاص. ولا يستطيع المعلّم الاطلاع على النتائج من خلال المنصة.
            </li>
            <li>إذا استخدم أكثر من طالب الجهاز والمتصفح نفسيهما، فسيتشاركون التقدّم نفسه.</li>
            <li>لا تستخدم المنصة ملفات تتبّع أو إعلانات أو خدمات تحليل خارجية.</li>
          </ul>
        </Card>

        <Card>
          <h2 className="text-lg font-extrabold">💾 إدارة بياناتك</h2>
          <p className="mt-2 text-slate-700">
            يمكنك حفظ نسخة احتياطية من تقدّمك في ملف، ثم استعادتها لاحقًا أو على جهاز آخر.
          </p>
          <DataManager />
        </Card>

        <Card>
          <h2 className="text-lg font-extrabold">👨‍👩‍👧 للأهل والمعلّمين</h2>
          <ul className="mt-2 list-inside list-disc space-y-1 text-slate-700">
            <li>يكفي 20–30 دقيقة يوميًا. الاستمرارية أهم من طول الجلسة.</li>
            <li>شجّعوا الطالب على قراءة الشرح بعد كل خطأ، فهو جزء أساسي من التعلّم.</li>
            <li>تجنّبوا مقارنة نتائج الطالب بغيره؛ الهدف هو تقدّمه الشخصي.</li>
          </ul>
        </Card>
      </div>
    </>
  );
}
