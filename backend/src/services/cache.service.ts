import NodeCache from 'node-cache';

class CacheService {
  private cache: NodeCache;
  private static instance: CacheService;

  private constructor() {
    this.cache = new NodeCache({
      stdTTL: 600, // 10 minutos por padrão
      checkperiod: 120, // Verificar a cada 2 minutos
      useClones: false
    });
  }

  public static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  public async get<T>(key: string): Promise<T | undefined> {
    return this.cache.get<T>(key);
  }

  public async set<T>(key: string, value: T, ttl?: number): Promise<boolean> {
    return this.cache.set(key, value, ttl);
  }

  public async del(key: string): Promise<number> {
    return this.cache.del(key);
  }

  public async flush(): Promise<void> {
    this.cache.flushAll();
  }

  public async getOrSet<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== undefined) {
      return cached;
    }

    const value = await fetchFn();
    await this.set(key, value, ttl);
    return value;
  }
}

export const cacheService = CacheService.getInstance(); 