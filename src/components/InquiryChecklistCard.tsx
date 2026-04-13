import { CheckCircle2 } from "lucide-react";

export default function InquiryChecklistCard({
  title = "建议优先提供",
  items,
  tips,
  className = "",
}: {
  title?: string;
  items: string[];
  tips?: string[];
  className?: string;
}) {
  return (
    <div className={`rounded-2xl bg-white/5 border border-white/10 p-6 ${className}`.trim()}>
      <p className="text-sm text-gold mb-3">{title}</p>
      <ul className="space-y-3 text-sm text-white/85 leading-7">
        {items.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
      {tips?.length ? (
        <div className="mt-5 space-y-2 text-sm text-white/75">
          {tips.map((item) => (
            <p key={item} className="inline-flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-gold" />{item}</p>
          ))}
        </div>
      ) : null}
    </div>
  );
}
