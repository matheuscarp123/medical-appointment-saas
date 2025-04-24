import Queue from 'bull';
import { redisConfig } from '../config/redis.config';
import { logger } from '../utils/logger';

class QueueService {
  private static instance: QueueService;
  private queues: Map<string, Queue.Queue>;

  private constructor() {
    this.queues = new Map();
  }

  public static getInstance(): QueueService {
    if (!QueueService.instance) {
      QueueService.instance = new QueueService();
    }
    return QueueService.instance;
  }

  public getQueue(name: string): Queue.Queue {
    if (!this.queues.has(name)) {
      const queue = new Queue(name, {
        redis: {
          host: redisConfig.host,
          port: redisConfig.port,
          password: redisConfig.password
        },
        defaultJobOptions: {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 1000
          }
        }
      });

      queue.on('completed', (job) => {
        logger.info(`Job ${job.id} completed in queue ${name}`);
      });

      queue.on('failed', (job, err) => {
        logger.error(`Job ${job.id} failed in queue ${name}: ${err.message}`);
      });

      this.queues.set(name, queue);
    }

    return this.queues.get(name)!;
  }

  public async addJob<T>(
    queueName: string,
    data: T,
    options?: Queue.JobOptions
  ): Promise<Queue.Job<T>> {
    const queue = this.getQueue(queueName);
    return queue.add(data, options);
  }

  public async processQueue<T>(
    queueName: string,
    processor: Queue.ProcessCallbackFunction<T>
  ): Promise<void> {
    const queue = this.getQueue(queueName);
    queue.process(processor);
  }

  public async close(): Promise<void> {
    for (const queue of this.queues.values()) {
      await queue.close();
    }
  }
}

export const queueService = QueueService.getInstance(); 