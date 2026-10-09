"use client";

import { useRef, useState } from "react";
import { useProgress } from "@/components/ProgressProvider";
import { Button } from "@/components/ui";

export function DataManager() {
  const { exportData, importData, reset, ready } = useProgress();
  const fileRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const download = () => {
    const blob = new Blob([exportData()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `muhoben-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMessage("تم تنزيل ملف النسخة الاحتياطية.");
  };

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    const text = await file.text();
    setMessage(importData(text) ? "تمت استعادة التقدّم بنجاح ✅" : "تعذّرت قراءة الملف. تأكد أنه ملف نسخة احتياطية من هذه المنصة.");
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="mt-4 space-y-3">
      <div className="flex flex-wrap gap-3">
        <Button variant="secondary" onClick={download} disabled={!ready}>
          ⬇️ تنزيل نسخة احتياطية
        </Button>
        <Button variant="secondary" onClick={() => fileRef.current?.click()} disabled={!ready}>
          ⬆️ استعادة من ملف
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={(e) => onFile(e.target.files?.[0])}
        />
        <Button variant="danger" onClick={() => setConfirmReset(true)} disabled={!ready}>
          🗑️ مسح كل التقدّم
        </Button>
      </div>
      {confirmReset && (
        <div role="alertdialog" aria-labelledby="reset-title" className="rounded-xl bg-rose-50 p-4 ring-1 ring-rose-200">
          <p id="reset-title" className="font-bold text-rose-900">
            سيُحذف كل التقدّم المحفوظ على هذا الجهاز ولا يمكن التراجع. هل أنت متأكد؟
          </p>
          <div className="mt-3 flex gap-3">
            <Button
              variant="danger"
              onClick={() => {
                reset();
                setConfirmReset(false);
                setMessage("تم مسح التقدّم. يمكنك البدء من جديد.");
              }}
            >
              نعم، امسح
            </Button>
            <Button variant="secondary" onClick={() => setConfirmReset(false)}>
              إلغاء
            </Button>
          </div>
        </div>
      )}
      {message && (
        <p role="status" className="text-sm font-bold text-slate-700">
          {message}
        </p>
      )}
    </div>
  );
}
