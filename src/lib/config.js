export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3500/api";

// export const API_BASE_URL = "https://project-phoenix-omega.vercel.app/api";
// export const API_BASE_URL = "http://localhost:3500/api";

export const GOOGLE_CLIENT_ID =
  "802396137377-5pfhl96kiru3ttesrvt52uqsq0631jma.apps.googleusercontent.com";

export const GOOGLE_OAUTH_REDIRECT_URL = `${API_BASE_URL}/oauth/google`;

// export const GOOGLE_OAUTH_REDIRECT_URL =
// "http://localhost:3500/api/oauth/google";

export const ROLES_LIST = {
  ADMIN: 4200,
  SUPERADMIN: 8848,
};
