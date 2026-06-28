import { z } from "zod";
import { subDays, startOfDay, endOfDay, max, min, subYears } from "date-fns";

export const dateRangeValidator = z.object({
  start: z.string().optional(),
  end: z.string().optional(),
}).transform((data) => {
  // Default to Last 30 Days
  const defaultEnd = endOfDay(new Date());
  const defaultStart = startOfDay(subDays(defaultEnd, 30));
  
  let parsedStart = data.start ? new Date(data.start) : defaultStart;
  let parsedEnd = data.end ? new Date(data.end) : defaultEnd;

  // Validate dates
  if (isNaN(parsedStart.getTime())) parsedStart = defaultStart;
  if (isNaN(parsedEnd.getTime())) parsedEnd = defaultEnd;

  // Ensure start is before end
  if (parsedStart > parsedEnd) {
    const temp = parsedStart;
    parsedStart = parsedEnd;
    parsedEnd = temp;
  }

  // Security: Restrict maximum range to 1 year to prevent heavy queries
  const oneYearAgo = subYears(parsedEnd, 1);
  parsedStart = max([parsedStart, oneYearAgo]);
  
  // Ensure we don't query the future unnecessarily
  parsedEnd = min([parsedEnd, endOfDay(new Date())]);

  return {
    start: startOfDay(parsedStart),
    end: endOfDay(parsedEnd),
  };
});
