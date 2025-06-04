interface RateLimiterConfig {
  windowMs: number;
  max: number;
}

export class RateLimiter {
  private store: Map<string, { count: number; resetTime: number }>;
  private windowMs: number;
  private max: number;

  constructor(config: RateLimiterConfig) {
    this.store = new Map();
    this.windowMs = config.windowMs;
    this.max = config.max;
  }

  tryAcquire(key: string): boolean {
    const now = Date.now();
    const record = this.store.get(key);

    if (!record) {
      this.store.set(key, { count: 1, resetTime: now + this.windowMs });
      return true;
    }

    if (now > record.resetTime) {
      this.store.set(key, { count: 1, resetTime: now + this.windowMs });
      return true;
    }

    if (record.count >= this.max) {
      return false;
    }

    record.count++;
    return true;
  }
} 