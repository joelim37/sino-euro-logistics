"use client";

import Link, { LinkProps } from "next/link";
import { PropsWithChildren } from "react";
import { trackEvent } from "@/lib/tracking";

type TrackedLinkProps = PropsWithChildren<
  LinkProps & {
    className?: string;
    eventName: string;
    eventParams?: Record<string, string | number | boolean | undefined>;
    onClick?: () => void;
  }
>;

export default function TrackedLink({
  children,
  eventName,
  eventParams,
  onClick,
  ...props
}: TrackedLinkProps) {
  return (
    <Link
      {...props}
      onClick={() => {
        trackEvent(eventName, eventParams);
        onClick?.();
      }}
    >
      {children}
    </Link>
  );
}
