export function selectEvent<T extends string>(
  eventChances: Record<T, number>
): { event: T; probability: number } {
  const totalWeight = (Object.values(eventChances) as number[]).reduce(
    (sum, prob) => sum + prob,
    0
  );

  const rand = Math.random() * totalWeight;
  let cumulative = 0;

  for (const event in eventChances) {
    cumulative += eventChances[event];
    if (rand < cumulative) {
      return { event, probability: eventChances[event] };
    }
  }

  throw new Error("Failed to determine an event.");
}
