export function trackEvent(eventName: string, params?: Record<string, string | number | boolean | undefined>) {
  if (typeof window === "undefined") return;

  const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
  if (!gtag) return;

  gtag("event", eventName, params || {});
}
