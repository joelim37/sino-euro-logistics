import Link from "next/link";
import { PhoneCall, Mail } from "lucide-react";

interface FloatingContactProps {
  phone?: string;
  email?: string;
}

export default function FloatingContact({ phone, email }: FloatingContactProps) {
  return (
    <div className="fixed right-4 bottom-4 z-50 flex flex-col gap-3">
      {phone ? (
        <Link
          href={`tel:${phone}`}
          className="flex items-center gap-2 rounded-full bg-gold px-4 py-3 text-white shadow-lg hover:opacity-95"
        >
          <PhoneCall className="w-4 h-4" />
          <span className="text-sm font-medium">立即致电</span>
        </Link>
      ) : null}
      {email ? (
        <Link
          href={`mailto:${email}`}
          className="flex items-center gap-2 rounded-full bg-navy px-4 py-3 text-white shadow-lg hover:opacity-95"
        >
          <Mail className="w-4 h-4" />
          <span className="text-sm font-medium">邮件咨询</span>
        </Link>
      ) : null}
    </div>
  );
}
