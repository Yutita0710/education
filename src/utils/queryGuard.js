export function sanitizeQuery(q = {}) {
  const out = {};
  const allow = new Set([10, 20, 50, 100]);

  const limit = Number(q.limit);
  out.limit = allow.has(limit) ? limit : 10;

  const page = Number(q.page);
  out.page = Number.isFinite(page) && page >= 1 ? page : 1;

  if (q.status === "0" || q.status === "1") out.status = q.status;

  const trimCap = (s, n = 200) => (typeof s === "string" ? s.trim().slice(0, n) : "");
  out.search   = trimCap(q.search, 200);
  out.country  = trimCap(q.country, 20);
  out.province = trimCap(q.province, 50);

  return out;
}
