export const formatGameDate = (isoString: string): string => {
  if (!isoString) return '';
  
  const date = new Date(isoString);
  
  // Format: "January 29, 2026 - 8:00 PM"
  // We can use Intl.DateTimeFormat for a robust solution without libraries.
  
  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const timeFormatter = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  return `${dateFormatter.format(date)} - ${timeFormatter.format(date)}`;
};
