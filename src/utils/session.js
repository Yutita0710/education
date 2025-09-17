// src/utils/session-guard.js
export function initSessionGuard(router, opts = {}) {
  const {
    ttlMs = Number(import.meta.env.VITE_SESSION_TTL_MS) || 60 * 60 * 1000, // 1 ชม.
    loginRoute = "/admin/login",
    // เส้นทางที่ต้องล็อกอิน (ปรับได้ตามระบบคุณ)
    isProtectedRoute = (to) =>
      to.path.startsWith("/admin") && to.path !== "/admin/login",
    // เขียน expiry ลง storage บ่อยแค่ไหน (กันสแปม)
    renewDebounceMs = 30 * 1000,
    // ความถี่ในการตรวจหมดอายุ
    checkIntervalMs = 15 * 1000,
  } = opts;

  const STORAGE_KEYS = {
    token: "token",
    username: "username",
    expiry: "expiry",
  };

  const now = () => Date.now();
  const getToken = () => localStorage.getItem(STORAGE_KEYS.token);
  const getExpiry = () => Number(localStorage.getItem(STORAGE_KEYS.expiry)) || 0;
  const setExpiry = (ts) => localStorage.setItem(STORAGE_KEYS.expiry, String(ts));
  const clearAuth = () => {
    localStorage.removeItem(STORAGE_KEYS.token);
    localStorage.removeItem(STORAGE_KEYS.username);
    localStorage.removeItem(STORAGE_KEYS.expiry);
    // แจ้งให้ส่วนอื่น ๆ ของแอปทราบ (เช่น App.vue / interceptor)
    window.dispatchEvent(new Event("auth-changed"));
  };

  const redirectToLogin = (toFullPath) => {
    router.replace({
      path: loginRoute,
      query: { redirect: toFullPath || router.currentRoute.value.fullPath },
    });
  };

  let lastRenewAt = 0;
  function renewIfNeeded() {
    const token = getToken();
    if (!token) return;
    const onLoginRoute = router.currentRoute.value.path === loginRoute;
    if (onLoginRoute) return; // ไม่ต้องต่ออายุที่หน้า Login

    const t = now();
    if (t - lastRenewAt < renewDebounceMs) return; // debounce
    lastRenewAt = t;

    // ต่ออายุ session: ต่ออายุทุกครั้งที่มี activity
    setExpiry(t + ttlMs);
  }

  function enforceGuard(to) {
    // ไม่ใช่เส้นทางที่ต้องล็อกอิน → ผ่านได้เลย
    if (!isProtectedRoute(to)) return true;

    const token = getToken();
    if (!token) {
      clearAuth();
      redirectToLogin(to.fullPath);
      return false;
    }

    const exp = getExpiry();
    if (now() > exp) {
      clearAuth();
      redirectToLogin(to.fullPath);
      return false;
    }
    return true;
  }

  // Router guard
  router.beforeEach((to, from, next) => {
    if (!enforceGuard(to)) return; // ถูก redirect ไป login แล้ว
    next();
  });

  // ต่ออายุอัตโนมัติเมื่อมี activity (ใช้งานระบบ)
  const renewEvents = ["click", "mousemove", "keydown", "scroll", "touchstart"];
  const renewHandler = () => renewIfNeeded();
  renewEvents.forEach((ev) => window.addEventListener(ev, renewHandler, { passive: true }));

  // ตรวจ session หมดอายุเป็นระยะ (กรณีไม่มี event)
  const intervalId = setInterval(() => {
    const to = router.currentRoute.value;
    if (!isProtectedRoute(to)) return;
    const token = getToken();
    const exp = getExpiry();
    if (!token || now() > exp) {
      clearAuth();
      redirectToLogin(to.fullPath);
    }
  }, checkIntervalMs);

  // sync เมื่อ axios interceptor เคลียร์ token
  const onAuthChanged = () => {
    const to = router.currentRoute.value;
    if (isProtectedRoute(to)) redirectToLogin(to.fullPath);
  };
  window.addEventListener("auth-changed", onAuthChanged);

  // (ออปชัน) cleanup ถ้ามีระบบ unmount app
  return () => {
    renewEvents.forEach((ev) => window.removeEventListener(ev, renewHandler));
    clearInterval(intervalId);
    window.removeEventListener("auth-changed", onAuthChanged);
  };
}
