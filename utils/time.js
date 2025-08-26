import { addMinutes, setHours, setMinutes, format, parse } from "date-fns";

export function getTimeSlots(startHour, endHour, stepMin = 60) {
  let start = setMinutes(setHours(new Date(), startHour), 0);
  const end = setMinutes(setHours(new Date(), endHour), 0);

  const slots = [];
  while (start <= end) {
    slots.push(format(start, "HH:mm"));
    start = addMinutes(start, stepMin);
  }
  return slots.map((time24) =>
    format(parse(time24, "HH:mm", new Date()), "hh:mm a")
  );
}
