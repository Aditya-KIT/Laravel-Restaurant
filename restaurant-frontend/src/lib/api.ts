const _rawApiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000").replace(/\/+$/, "");
const API_BASE_URL = `${_rawApiUrl}/api/v1`;
console.log("NEXT_PUBLIC_API_URL is:", process.env.NEXT_PUBLIC_API_URL ? "Defined" : "Undefined (using fallback)");


export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export async function apiFetch<T>(endpoint: string, method: HttpMethod = "GET", body?: unknown, token?: string): Promise<T> {
  console.log("Attempting to fetch from API URL:", `${API_BASE_URL}${endpoint}`);
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
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      console.warn(`NETWORK ERROR: Unable to reach the API at ${API_BASE_URL}. \n\nPlease ensure that:\n1. Your backend server is RUNNING.\n2. Apache/XAMPP is started.\n3. There are no CORS issues.`);
    } else {
      console.warn("Fetch error details:", error);
    }
    throw error;
  }


}
