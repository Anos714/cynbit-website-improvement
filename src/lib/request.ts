import { randomUUID } from "node:crypto";
import { headers } from "next/headers";

export async function requestIp() {
  const headerStore = await headers();
  return requestIpFromHeaders(headerStore);
}

export async function actionFingerprint(scope: string) {
  return `${scope}:${await requestIp()}`;
}

export function requestIpFromHeaders(headerStore: Headers) {
  const forwarded = headerStore.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || headerStore.get("x-real-ip") || "local";
}

export function createReference() {
  return randomUUID();
}
