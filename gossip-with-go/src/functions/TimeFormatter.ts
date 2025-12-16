/**
 * Converts an ISO timestamp to a human-readable relative time string
 * @param timestamp - ISO format timestamp (e.g., "2025-12-16T15:57:28.57636")
 * @returns Human-readable time string (e.g., "2 hours ago", "3 days ago")
 */
export function getRelativeTime(timestamp: string): string {
  const now = new Date();
  const past = new Date(timestamp);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 0) {
    return "just now";
  }

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(diffInSeconds / secondsInUnit);

    if (interval >= 1) {
      return interval === 1
        ? `${interval} ${unit} ago`
        : `${interval} ${unit}s ago`;
    }
  }

  return "just now";
}
