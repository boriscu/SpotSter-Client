const BASE = "/api/v1";

async function request<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem("spotster_token");
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${BASE}${url}`, { ...options, headers });

  if (res.status === 401) {
    localStorage.removeItem("spotster_token");
    if (window.location.pathname.startsWith("/admin")) {
      window.location.href = "/admin/login";
    }
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || body.msg || `Request failed: ${res.status}`);
  }

  if (res.status === 204) return {} as T;
  return res.json();
}

export const auth = {
  login: (email: string, password: string) =>
    request<{ access_token: string; msg: string }>("/auth/", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  validate: () => request<{ msg: string }>("/auth/"),
};

export const adminStores = {
  list: () => request<Store[]>("/admin/stores/"),
  get: (id: number) => request<Store>(`/admin/stores/${id}`),
  create: (data: StorePayload) =>
    request<Store>("/admin/stores/", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: number, data: StorePayload) =>
    request<Store>(`/admin/stores/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: number) =>
    request<void>(`/admin/stores/${id}`, { method: "DELETE" }),
};

export const adminMonsters = {
  list: () => request<MonsterDrink[]>("/admin/monsters/"),
  get: (id: number) => request<MonsterDrink>(`/admin/monsters/${id}`),
  create: (data: FormData) =>
    request<MonsterDrink>("/admin/monsters/", {
      method: "POST",
      body: data,
    }),
  update: (id: number, data: FormData) =>
    request<MonsterDrink>(`/admin/monsters/${id}`, {
      method: "PUT",
      body: data,
    }),
  delete: (id: number) =>
    request<void>(`/admin/monsters/${id}`, { method: "DELETE" }),
};

export const publicApi = {
  stores: async (params?: Record<string, string | number>) => {
    const qs = params
      ? "?" + new URLSearchParams(
          Object.entries(params).map(([k, v]) => [k, String(v)])
        ).toString()
      : "";
    const res = await request<{ stores: PublicStore[]; total: number }>(`/public/stores/${qs}`);
    return res.stores;
  },
  storeDetail: (id: number) =>
    request<StoreDetail>(`/public/stores/${id}`),
  filters: () =>
    request<{ tags: TagFilter[] }>("/public/stores/filters"),
  monsters: () => request<MonsterDrink[]>("/public/monsters/"),
};

import type {
  Store,
  MonsterDrink,
  PublicStore,
  StoreDetail,
  TagFilter,
} from "@/types";

interface StorePayload {
  name: string;
  address?: string;
  latitude: number;
  longitude: number;
}
