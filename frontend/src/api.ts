import { toast } from "react-toastify";

export const API_URL: string = (
  import.meta.env.VITE_BACKEND_URL || "http://localhost:3000"
).replace(/\/$/, "");

interface ApiResult<T> {
  data: T | null;
  ok: boolean;
  status: number;
}

interface ErrorBody {
  message?: string | string[];
  msg?: string;
}

function showError(data: ErrorBody | null, status: number) {
  const msg = data?.message || data?.msg || `Request failed (${status})`;
  if (Array.isArray(msg)) {
    msg.forEach((m) => toast.error(m));
  } else {
    toast.error(typeof msg === "string" ? msg : "Request failed");
  }
}

export async function request<T = unknown>(
  path: string,
  options: RequestInit = {},
  showErrorToast = true
): Promise<ApiResult<T>> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      credentials: "include",
      ...options,
    });
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    if (showErrorToast) toast.error(`Network error: ${reason}`);
    return { data: null, ok: false, status: 0 };
  }

  let data: T | null = null;
  try {
    data = (await res.json()) as T;
  } catch {
    data = null;
  }

  if (!res.ok && showErrorToast) {
    showError(data as ErrorBody | null, res.status);
  }

  return { data, ok: res.ok, status: res.status };
}

export function postJson<T = unknown>(path: string, body: unknown, showErrorToast = true) {
  return request<T>(
    path,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
    showErrorToast
  );
}