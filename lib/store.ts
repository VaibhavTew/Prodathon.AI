import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { cache } from "react";
import { defaultContent } from "./defaults";
import type { Content, Enrollment, Lead, Registration } from "./types";

/**
 * Tiny JSON-file data store. Works out of the box on any Node host with a
 * persistent disk (VPS, Render/Railway with a volume, your laptop).
 *
 * To use a hosted DB (Supabase, Postgres, Firebase…) re-implement the exported
 * functions in this file — nothing else in the app touches storage directly.
 * Serverless hosts like Vercel do NOT keep files between requests, so swap this
 * out (or set FORM_WEBHOOK_URL to mirror submissions) before deploying there.
 */

const DATA_DIR = path.resolve(process.env.DATA_DIR || path.join(process.cwd(), "data"));

type Collections = {
  registrations: Registration;
  enrollments: Enrollment;
  leads: Lead;
};
export type CollectionName = keyof Collections;
export const COLLECTIONS: CollectionName[] = ["registrations", "enrollments", "leads"];

// Serialize writes within this process so concurrent requests can't clobber a file.
let writeChain: Promise<unknown> = Promise.resolve();
function serialized<T>(fn: () => Promise<T>): Promise<T> {
  const next = writeChain.then(fn, fn);
  writeChain = next.catch(() => undefined);
  return next;
}

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    return JSON.parse(await fs.readFile(path.join(DATA_DIR, file), "utf8")) as T;
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return fallback;
    throw err;
  }
}

async function writeJson(file: string, data: unknown) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const target = path.join(DATA_DIR, file);
  const tmp = `${target}.${process.pid}.${Date.now()}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), "utf8");
  await fs.rename(tmp, target);
}

// ---------- Content ----------

/**
 * Deduped per server render: the root layout, the page and helpers like getProgress()
 * all call this, but content.json is only read from disk once per request.
 */
export const getContent = cache(async (): Promise<Content> => {
  const saved = await readJson<Partial<Content>>("content.json", {});
  // Shallow merge so new top-level sections added in code show up for old saves.
  return { ...defaultContent, ...saved } as Content;
});

export async function saveContent(content: Content): Promise<void> {
  await serialized(() => writeJson("content.json", content));
}

// ---------- Records ----------

export async function listRecords<K extends CollectionName>(name: K): Promise<Collections[K][]> {
  return readJson<Collections[K][]>(`${name}.json`, []);
}

export async function addRecord<K extends CollectionName>(
  name: K,
  data: Omit<Collections[K], "id" | "createdAt">,
): Promise<Collections[K]> {
  const record = { id: randomUUID(), createdAt: new Date().toISOString(), ...data } as Collections[K];
  await serialized(async () => {
    const all = await listRecords(name);
    all.push(record);
    await writeJson(`${name}.json`, all);
  });
  void mirrorToWebhook(name, record);
  return record;
}

export async function getRecord<K extends CollectionName>(name: K, id: string) {
  const all = await listRecords(name);
  return all.find((r) => r.id === id) ?? null;
}

/** Atomically read-modify-write one record. Return null from `fn` to skip the write. */
export async function updateRecord<K extends CollectionName>(
  name: K,
  id: string,
  fn: (current: Collections[K]) => Collections[K] | null,
): Promise<Collections[K] | null> {
  return serialized(async () => {
    const all = await listRecords(name);
    const idx = all.findIndex((r) => r.id === id);
    if (idx === -1) return null;
    const updated = fn(all[idx]);
    if (!updated) return all[idx];
    all[idx] = updated;
    await writeJson(`${name}.json`, all);
    return updated;
  });
}

async function mirrorToWebhook(collection: string, record: unknown) {
  const url = process.env.FORM_WEBHOOK_URL;
  if (!url) return;
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ collection, record }),
      signal: AbortSignal.timeout(5000),
    });
  } catch (err) {
    console.error("[store] webhook mirror failed:", err);
  }
}
