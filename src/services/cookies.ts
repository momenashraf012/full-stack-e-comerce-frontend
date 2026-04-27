import Cookies, { CookieGetOptions, CookieSetOptions } from "universal-cookie";

const cookies = new Cookies();

class CookieService {
  /**
   * Get a cookie by name
   */
  get(name: string, options?: CookieGetOptions) {
    return cookies.get(name, options);
  }

  /**
   * Set a cookie
   * @param name Name of the cookie
   * @param value Value of the cookie
   * @param options Expiration, path, etc.
   */
  set(name: string, value: any, options?: CookieSetOptions) {
    return cookies.set(name, value, {
      path: "/",
      secure: import.meta.env.PROD,
      sameSite: "lax",
      ...options,
    });
  }

  /**
   * Remove a cookie
   */
  remove(name: string, options?: CookieSetOptions) {
    return cookies.remove(name, { path: "/", ...options });
  }
}

export default new CookieService();
