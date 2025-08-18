export function checkSession() {
  const token = localStorage.getItem("token");
  const expiry = localStorage.getItem("expiry");

  if (!token || !expiry) {
    return false;
  }

  const now = Date.now();
  if (now > Number(expiry)) {
    // ลบ token ถ้าหมดอายุ
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("expiry");
    return false;
  }
  return true;
}
