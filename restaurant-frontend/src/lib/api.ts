const _rawApiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000").replace(/\/+$/, "");
const API_BASE_URL = `${_rawApiUrl}/api/v1`;

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export async function apiFetch<T>(endpoint: string, method: HttpMethod = "GET", body?: unknown, token?: string): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      // Try to parse the error body for a human-readable message
      const contentType = response.headers.get("content-type") || "";
      let errorMessage = `HTTP error! status: ${response.status}`;
      if (contentType.includes("application/json")) {
        const errorBody = await response.json().catch(() => ({}));
        // Handle Laravel validation errors (422)
        if (errorBody.errors) {
          const messages = Object.values(errorBody.errors as Record<string, string[]>).flat();
          errorMessage = messages.join(", ");
        } else if (errorBody.message) {
          errorMessage = errorBody.message;
        }
      }
      throw new Error(errorMessage);
    }

    // Handle empty responses (204 No Content, or DELETE that returns nothing)
    const contentLength = response.headers.get("content-length");
    if (response.status === 204 || contentLength === "0") {
      return {} as T;
    }

    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      return response.json();
    }

    return {} as T;

  } catch (error) {
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      console.warn(
        `NETWORK ERROR: Unable to reach the API at ${API_BASE_URL}.\n\n` +
        `Please ensure that:\n1. Your backend server is RUNNING.\n2. Apache/XAMPP is started.\n3. There are no CORS issues.`
      );
    } else {
      console.warn("API fetch error:", error);
    }
    throw error;
  }
}
