/**
 * Web Vitals reporting for Core Web Vitals monitoring
 * Reports LCP, FID, CLS, TTFB, INP metrics
 */

export function reportWebVitals(metric: {
  id: string;
  name: string;
  value: number;
  rating: "good" | "needs-improvement" | "poor";
  delta: number;
  navigationType: string;
}) {
  // Log to console in development
  if (process.env.NODE_ENV === "development") {
    console.log(`[Web Vitals] ${metric.name}: ${metric.value.toFixed(2)} (${metric.rating})`);
  }

  // In production, send to analytics endpoint
  if (process.env.NODE_ENV === "production") {
    // Send to your analytics service
    const body = JSON.stringify({
      id: metric.id,
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      navigationType: metric.navigationType,
      url: window.location.pathname,
      timestamp: Date.now(),
    });

    // Use sendBeacon for reliable delivery
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/analytics/vitals", body);
    } else {
      fetch("/api/analytics/vitals", {
        body,
        method: "POST",
        keepalive: true,
        headers: { "Content-Type": "application/json" },
      });
    }
  }
}

