export default function getNextDays(count) {
  const today = new Date();
  const result = [];

  for (let i = 0; i < count; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    result.push({
      dayName: date
        .toLocaleDateString("en-US", { weekday: "short" })
        .toUpperCase(), // e.g. "Sun"
      dateString: date.getDate(),
    });
  }

  return result;
}

// Example
