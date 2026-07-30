export const formatEstimatedWait = (
  position: number,
  avgServiceTimeMins: number,
): string => {
  const minutes = Math.max(0, (position - 1) * avgServiceTimeMins);
  if (minutes < 1) return "Almost your turn";
  if (minutes < 60) return `~${minutes} min wait`;
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  return remaining > 0 ? `~${hours}h ${remaining}m wait` : `~${hours}h wait`;
};

export const formatRelativeTime = (isoDate: string): string => {
  const now = Date.now();
  const then = new Date(isoDate).getTime();
  const diffMs = now - then;
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins} min ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;

  return new Date(isoDate).toLocaleDateString();
};

export const formatDateTime = (isoDate: string): string => {
  return new Date(isoDate).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
