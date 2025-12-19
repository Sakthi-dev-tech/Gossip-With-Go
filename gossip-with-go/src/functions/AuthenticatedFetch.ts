// Since Safari blocks third-party cookies, we need to use fetch with credentials

export async function authenticatedFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = localStorage.getItem("access_token");

  const headers = {
    ...options.headers as Record<string, string>,
  };

  // Add Authorization header if token exists (fallback for Safari)
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return fetch(url, {
    ...options,
    headers,
    credentials: "include", // Still try cookies for browsers that support them
  });
}
