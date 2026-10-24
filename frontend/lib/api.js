// Aurum API client — Django + DRF backend. Token in localStorage.
const raw = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
export const API_BASE = raw.startsWith("http") ? raw : `https://${raw}`;

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("aurum_token");
}
export function setToken(t) {
  if (typeof window === "undefined") return;
  if (t) localStorage.setItem("aurum_token", t);
  else localStorage.removeItem("aurum_token");
}
export function getUser() {
  if (typeof window === "undefined") return null;
  try { return JSON.parse(localStorage.getItem("aurum_user") || "null"); }
  catch { return null; }
}
export function setUser(u) {
  if (typeof window === "undefined") return;
  if (u) localStorage.setItem("aurum_user", JSON.stringify(u));
  else localStorage.removeItem("aurum_user");
}

async function req(path, opts = {}) {
  const headers = { "Content-Type": "application/json", ...(opts.headers || {}) };
  const token = getToken();
  if (token) headers["Authorization"] = "Token " + token;
  let res;
  try {
    res = await fetch(API_BASE + path, { ...opts, headers });
  } catch (e) {
    throw new Error("Network error — is the backend (" + API_BASE + ") reachable?");
  }
  if (res.status === 204) return null;
  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = { detail: text }; }
  if (!res.ok) {
    if (res.status === 401) { setToken(null); setUser(null); }
    let detail = (data && (data.detail || data.token || data.username || data.password)) || res.statusText;
    if (Array.isArray(detail)) detail = detail.join(" ");
    throw new Error(typeof detail === "string" ? detail : JSON.stringify(detail));
  }
  return data;
}

export const aurum = {
  // auth
  signup: (b) => req("/api/auth/signup/", { method: "POST", body: JSON.stringify(b) }),
  login: (username, password) => req("/api/auth/login/", { method: "POST", body: JSON.stringify({ username, password }) }),
  logout: () => req("/api/auth/logout/", { method: "POST" }),
  passwordForgot: (identifier) => req("/api/auth/password/forgot/", { method: "POST", body: JSON.stringify({ identifier }) }),
  passwordReset: (uid, token, new_password) => req("/api/auth/password/reset/", { method: "POST", body: JSON.stringify({ uid, token, new_password }) }),
  me: () => req("/api/auth/me/"),
  // masteries
  listMasteries: () => req("/api/masteries/"),
  createMastery: (b) => req("/api/masteries/", { method: "POST", body: JSON.stringify(b) }),
  getMastery: (id) => req(`/api/masteries/${id}/`),
  updateMastery: (id, b) => req(`/api/masteries/${id}/`, { method: "PATCH", body: JSON.stringify(b) }),
  deleteMastery: (id) => req(`/api/masteries/${id}/`, { method: "DELETE" }),
  forkMastery: (masteryId) => req(`/api/masteries/${masteryId}/fork/`, { method: "POST" }),
  // structure
  addModule: (masteryId, title) => req(`/api/masteries/${masteryId}/modules/`, { method: "POST", body: JSON.stringify({ title }) }),
  deleteModule: (moduleId) => req(`/api/modules/${moduleId}/`, { method: "DELETE" }),
  addLesson: (moduleId, title) => req(`/api/modules/${moduleId}/lessons/`, { method: "POST", body: JSON.stringify({ title }) }),
  deleteLesson: (lessonId) => req(`/api/lessons/${lessonId}/`, { method: "DELETE" }),
  attachResource: (lessonId, b) => req(`/api/lessons/${lessonId}/resources/`, { method: "POST", body: JSON.stringify(b) }),
  enrichLesson: (lessonId, b) => req(`/api/lessons/${lessonId}/enrich/`, { method: "PATCH", body: JSON.stringify(b) }),
  // progress + notes
  markProgress: (lessonId, b) => req(`/api/lessons/${lessonId}/progress/`, { method: "POST", body: JSON.stringify(b) }),
  getNotes: (lessonId) => req(`/api/lessons/${lessonId}/notes/`),
  addNote: (lessonId, b) => req(`/api/lessons/${lessonId}/notes/`, { method: "POST", body: JSON.stringify(b) }),
};
