export async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 2500
) {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) throw error;
    console.log(`Retrying... (${retries} attempts left)`);
    await new Promise((resolve) => setTimeout(resolve, delay));
    return withRetry(fn, retries - 1, delay);
  }
}
