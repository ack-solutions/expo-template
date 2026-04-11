import { db } from '../client';

export async function withTransaction<T>(fn: (tx: Parameters<typeof db.transaction>[0] extends (arg: infer A) => any ? A : never) => Promise<T>): Promise<T> {
  return await db.transaction(async (tx) => await fn(tx));
}

