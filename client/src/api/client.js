const API_BASE = '/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };

  if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
    config.body = JSON.stringify(options.body);
  }

  const res = await fetch(url, config);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || data.errors?.[0] || `Request failed with status ${res.status}`);
  }
  return data;
}

export const api = {
  // Overview
  getOverview: () => request('/overview'),

  // Furnaces
  getFurnaces: () => request('/furnaces'),
  getFurnace: (id) => request(`/furnaces/${id}`),
  updateFurnace: (id, data) => request(`/furnaces/${id}`, { method: 'PUT', body: data }),
  createFurnace: (data) => request('/furnaces', { method: 'POST', body: data }),

  // Heats
  getHeats: (params = '') => request(`/heats${params ? `?${params}` : ''}`),
  getHeat: (id) => request(`/heats/${id}`),
  createHeat: (data) => request('/heats', { method: 'POST', body: data }),

  // Energy & PF
  getEnergy: () => request('/energy'),
  getPowerFactor: () => request('/energy/power-factor'),

  // Scheduling
  getCurrentSchedule: () => request('/schedule/current'),
  optimizeSchedule: (data) => request('/schedule/optimize', { method: 'POST', body: data }),

  // Alerts
  getAlerts: (params = '') => request(`/alerts${params ? `?${params}` : ''}`),
  acknowledgeAlert: (id) => request(`/alerts/${id}`, { method: 'PATCH', body: { action: 'acknowledge' } }),
  resolveAlert: (id) => request(`/alerts/${id}`, { method: 'PATCH', body: { action: 'resolve' } }),

  // Settings
  getSettings: () => request('/settings'),
  updateSettings: (data) => request('/settings', { method: 'PUT', body: data }),

  // CSV
  uploadCsvText: (csvText) => request('/data/upload', { method: 'POST', body: { csvText } }),
  uploadCsvFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/data/upload`, {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || data.errors?.[0] || 'Upload failed');
    return data;
  },

  // Simulation
  getSimulationStatus: () => request('/simulation/status'),
  startSimulation: (tickMs = 3000) => request('/simulation/start', { method: 'POST', body: { tickMs } }),
  stopSimulation: () => request('/simulation/stop', { method: 'POST' }),
  resetSimulation: () => request('/simulation/reset', { method: 'POST' }),
  stepSimulation: () => request('/simulation/step', { method: 'POST' }),
};
