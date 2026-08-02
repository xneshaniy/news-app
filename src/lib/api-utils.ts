export async function fetchWithTimeout(
  url: string | URL,
  options: RequestInit & { timeout?: number } = {}
): Promise<Response> {
  const { timeout = 10000, ...fetchOptions } = options;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    return await fetch(url, { ...fetchOptions, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

export function createApiResponse(
  data: Record<string, unknown>,
  status = 200
): Response {
  return Response.json(data, {
    status,
    headers: {
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
    },
  });
}

export function createApiError(
  error: string,
  status = 500
): Response {
  return Response.json({ error }, { status });
}

export function validateRequired(
  obj: Record<string, unknown>,
  fields: string[]
): string | null {
  for (const field of fields) {
    if (!obj[field]) return `Missing required field: ${field}`;
  }
  return null;
}

export function sanitizeString(input: unknown, maxLength = 10000): string {
  if (typeof input !== "string") return "";
  return input.slice(0, maxLength).replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
}
