export class API {
    baseUrl;
    headers;
    options;
    constructor(options = {}) {
        this.options = options;
        this.baseUrl = options.baseUrl || 'https://apis.do';
        this.headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };
        if (options.apiKey) {
            this.headers['Authorization'] = `Bearer ${options.apiKey}`;
        }
    }
    async request(method, path, data, params) {
        const url = new URL(path, this.baseUrl);
        // Add query parameters
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined) {
                    if (key === 'where' && typeof value === 'object') {
                        url.searchParams.append(key, JSON.stringify(value));
                    }
                    else {
                        // Let URLSearchParams handle the encoding naturally
                        url.searchParams.append(key, String(value));
                    }
                }
            });
        }
        const options = {
            method,
            headers: this.headers,
        };
        if (data) {
            options.body = JSON.stringify(data);
        }
        if (typeof process !== 'undefined' && (process.env.NODE_ENV === 'test' || process.env.VITEST === 'true') && this.options?.ignoreSSLErrors) {
            try {
                const { Agent } = require('node:https');
                const fetchOptions = options;
                fetchOptions.agent = new Agent({ rejectUnauthorized: false });
            }
            catch (e) {
                console.warn('SSL certificate validation will not be disabled in browser environment');
            }
        }
        const response = await fetch(url.toString(), options);
        const responseData = await response.json();
        if (!response.ok) {
            throw new Error(responseData.errors?.[0]?.message || `API request failed with status ${response.status}`);
        }
        return responseData;
    }
    async get(path, params) {
        return this.request('GET', path, undefined, params);
    }
    async post(path, data) {
        return this.request('POST', path, data);
    }
    async put(path, data) {
        return this.request('PUT', path, data);
    }
    async patch(path, data) {
        return this.request('PATCH', path, data);
    }
    async delete(path) {
        return this.request('DELETE', path);
    }
    async list(collection, params) {
        return this.get(`/api/${collection}`, params);
    }
    async getById(collection, id) {
        return this.get(`/api/${collection}/${id}`);
    }
    async create(collection, data) {
        return this.post(`/api/${collection}`, data);
    }
    async update(collection, id, data) {
        return this.patch(`/api/${collection}/${id}`, data);
    }
    async replace(collection, id, data) {
        return this.put(`/api/${collection}/${id}`, data);
    }
    async remove(collection, id) {
        return this.delete(`/api/${collection}/${id}`);
    }
    async search(collection, query, params) {
        return this.get(`/api/${collection}/search`, {
            ...params,
            q: query,
        });
    }
}
