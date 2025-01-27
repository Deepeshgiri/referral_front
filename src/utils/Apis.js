import { constant } from "../Constant";

class ApiCaller {
  constructor(baseURL = constant.api) {
    this.baseURL = baseURL; // Base URL for the API
  }

  // Helper function to get the token from localStorage
  getToken() {
    return localStorage.getItem("authToken"); // Assuming 'token' is saved in localStorage after login
  }

  // Helper function to prepare the request headers
  getHeaders(body) {
    const headers = {};

    if (body instanceof FormData) {
      // No need to set Content-Type for FormData; the browser will handle it
    } else {
      headers["Content-Type"] = "application/json";
    }

    // Automatically add the token if available
    const token = this.getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  }

  // General request method to handle all HTTP methods
  async request(endpoint, method = "GET", { body = null, setLoading = null, retries = 1 } = {}) {
    const headers = this.getHeaders(body);

    const options = {
      method,
      headers,
    };

    if (body) {
      options.body = body instanceof FormData ? body : JSON.stringify(body);
    }

    try {
      if (setLoading) setLoading(true); // Set loading before the request

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Request timed out")), 10000)
      );

      // Making the actual API request and waiting for either the response or timeout
      const response = await Promise.race([
        fetch(`${this.baseURL}${endpoint}`, options),
        timeoutPromise,
      ]);

      if (!response.ok) {
        console.log(response)
        const errorData = await response.json().catch(() => null); // Handle non-JSON responses
        throw new Error(
          errorData?.message || errorData?.error||`Request failed with status ${response.status}: ${response.statusText}`
        );
      }

      // Parse the response JSON if it's successful
      return await response.json();
    } catch (error) {
      // Retry if we have retries left
      if (retries > 0) {
        console.warn(`Retrying request... (${retries} retries left)`);
        return this.request(endpoint, method, { body, setLoading, retries: retries - 1 });
      } else {
        console.error("API call error:", error);
        throw error; // Throw error after retries are exhausted
      }
    } finally {
      if (setLoading) setLoading(false); // Reset loading after the request
    }
  }

  // POST request method
  async post(endpoint, body, setLoading = null) {
    return await this.request(endpoint, "POST", { body, setLoading });
  }

  // GET request method
  async get(endpoint, setLoading = null) {
    return await this.request(endpoint, "GET", { setLoading });
  }

  // PUT request method
  async put(endpoint, body, setLoading = null) {
    return await this.request(endpoint, "PUT", { body, setLoading });
  }

  // PATCH request method
  async patch(endpoint, body, setLoading = null) {
    return await this.request(endpoint, "PATCH", { body, setLoading });
  }

  // DELETE request method
  async delete(endpoint, setLoading = null) {
    return await this.request(endpoint, "DELETE", { setLoading });
  }
}

// Creating an instance of the ApiCaller class
const apiCaller = new ApiCaller();

export { apiCaller };
