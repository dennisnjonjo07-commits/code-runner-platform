// API Configuration
const API_BASE_URL = '/api';
const socket = io();

class APIClient {
    constructor() {
        this.token = localStorage.getItem('token');
    }

    setToken(token) {
        this.token = token;
        localStorage.setItem('token', token);
    }

    getHeaders() {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
        };
    }

    async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const config = {
            ...options,
            headers: {
                ...this.getHeaders(),
                ...options.headers
            }
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || `HTTP ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error(`API Error: ${endpoint}`, error);
            throw error;
        }
    }

    // Auth endpoints
    async register(username, email, password, confirmPassword) {
        return this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ username, email, password, confirmPassword })
        });
    }

    async login(email, password) {
        return this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
    }

    async verifyToken() {
        return this.request('/auth/verify', {
            method: 'POST'
        });
    }

    async logout() {
        return this.request('/auth/logout', {
            method: 'POST'
        });
    }

    // Projects endpoints
    async getProjects() {
        return this.request('/projects');
    }

    async createProject(name, description, language) {
        return this.request('/projects', {
            method: 'POST',
            body: JSON.stringify({ name, description, language })
        });
    }

    async getProject(id) {
        return this.request(`/projects/${id}`);
    }

    async updateProject(id, data) {
        return this.request(`/projects/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    async deleteProject(id) {
        return this.request(`/projects/${id}`, {
            method: 'DELETE'
        });
    }

    // Execution endpoints
    async runCode(projectId, language, code) {
        return this.request('/execution/run', {
            method: 'POST',
            body: JSON.stringify({ projectId, language, code })
        });
    }

    async getExecution(executionId) {
        return this.request(`/execution/${executionId}`);
    }

    async stopExecution(executionId) {
        return this.request(`/execution/${executionId}/stop`, {
            method: 'POST'
        });
    }

    // Upload endpoints
    async uploadFile(file) {
        const formData = new FormData();
        formData.append('file', file);

        return fetch(`${API_BASE_URL}/upload/file`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.token}`
            },
            body: formData
        }).then(r => r.json());
    }

    async uploadZip(file) {
        const formData = new FormData();
        formData.append('file', file);

        return fetch(`${API_BASE_URL}/upload/zip`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.token}`
            },
            body: formData
        }).then(r => r.json());
    }
}

const api = new APIClient();
