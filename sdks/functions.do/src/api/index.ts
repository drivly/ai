export class ApiClient {
  private baseUrl: string;
  private headers: Record<string, string>;

  constructor(options: { baseUrl: string; headers: Record<string, string> }) {
    this.baseUrl = options.baseUrl;
    this.headers = options.headers;
  }

  async post<T>(path: string, data: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return await response.json();
  }

  async list<T>(resource: string, params?: { limit?: number; page?: number }): Promise<T> {
    const url = new URL(`${this.baseUrl}/v1/${resource}`);
    if (params?.limit) url.searchParams.append('limit', params.limit.toString());
    if (params?.page) url.searchParams.append('page', params.page.toString());

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: this.headers,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return await response.json();
  }

  async getById<T>(resource: string, id: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}/v1/${resource}/${id}`, {
      method: 'GET',
      headers: this.headers,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return await response.json();
  }

  async update<T>(resource: string, id: string, data: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}/v1/${resource}/${id}`, {
      method: 'PATCH',
      headers: this.headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return await response.json();
  }

  async remove<T>(resource: string, id: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}/v1/${resource}/${id}`, {
      method: 'DELETE',
      headers: this.headers,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return await response.json();
  }
}
