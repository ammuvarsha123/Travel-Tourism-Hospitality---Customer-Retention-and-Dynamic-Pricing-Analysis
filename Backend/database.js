import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'db.json');

// Initialize database with seed data if not present
const defaultDb = {
  users: [
    { id: 'usr-1', username: 'admin', email: 'admin@tourism.io', password: 'password123', role: 'Admin', tier: 'enterprise' },
    { id: 'usr-2', username: 'analyst', email: 'analyst@tourism.io', password: 'password123', role: 'Analyst', tier: 'pro' },
    { id: 'usr-3', username: 'guest', email: 'guest@tourism.io', password: 'password123', role: 'Viewer', tier: 'free' }
  ],
  workspaces: [
    { id: 'workspace-tourism', name: 'Tourism & Hospitality Industry', description: 'Global tourism stats, hotel occupancy, revenues, and environmental indicators.', ownerId: 'usr-1', createdAt: new Date().toISOString() }
  ],
  annotations: [
    { id: 'note-1', workspaceId: 'workspace-tourism', chartId: 'rev-trend', text: 'Seasonal revenue drop noticed in Month 2 & 3 across European destinations due to off-season schedules.', author: 'admin', createdAt: new Date().toISOString() },
    { id: 'note-2', workspaceId: 'workspace-tourism', chartId: 'carbon-scatter', text: 'Scatter plot indicates high correlation of carbon footprint with leisure visits in high-rating hotels.', author: 'analyst', createdAt: new Date().toISOString() }
  ],
  apikeys: [
    { key: 'trm_live_8f3c7e9b01a2d3c4', userId: 'usr-2', name: 'Analyst Production Key', createdAt: new Date().toISOString(), status: 'Active' }
  ],
  notifications: [
    { id: 'notif-1', userId: 'usr-1', type: 'sustainability', title: 'High Carbon Footprint Alert', message: 'Multiple destinations exceeded the 4M kg carbon threshold this month.', read: false, createdAt: new Date().toISOString() },
    { id: 'notif-2', userId: 'usr-2', type: 'system', title: 'Dataset Updated', message: 'Tourism & Hospitality dataset has been refreshed with new 2025 records.', read: false, createdAt: new Date().toISOString() }
  ],
  uploadedDatasets: []
};

function readDb() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(defaultDb, null, 2), 'utf-8');
      return defaultDb;
    }
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(data);
    // Ensure new collections exist for old DB files
    if (!parsed.notifications) parsed.notifications = defaultDb.notifications;
    if (!parsed.uploadedDatasets) parsed.uploadedDatasets = [];
    return parsed;
  } catch (error) {
    console.error('Error reading database, using default structure', error);
    return defaultDb;
  }
}

function writeDb(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error writing to database', error);
    return false;
  }
}

export const db = {
  getCollection: (name) => {
    const data = readDb();
    return data[name] || [];
  },

  saveCollection: (name, items) => {
    const data = readDb();
    data[name] = items;
    return writeDb(data);
  },

  findOne: (collectionName, query) => {
    const items = db.getCollection(collectionName);
    return items.find(item => {
      return Object.entries(query).every(([key, value]) => item[key] === value);
    });
  },

  insert: (collectionName, newItem) => {
    const items = db.getCollection(collectionName);
    const id = newItem.id || `${collectionName.slice(0, 3)}-${Math.random().toString(36).substr(2, 9)}`;
    const itemWithId = { ...newItem, id };
    items.push(itemWithId);
    db.saveCollection(collectionName, items);
    return itemWithId;
  },

  update: (collectionName, id, updates) => {
    const items = db.getCollection(collectionName);
    const index = items.findIndex(item => item.id === id);
    if (index === -1) return null;
    items[index] = { ...items[index], ...updates };
    db.saveCollection(collectionName, items);
    return items[index];
  },

  delete: (collectionName, id) => {
    const items = db.getCollection(collectionName);
    const filtered = items.filter(item => item.id !== id);
    db.saveCollection(collectionName, filtered);
    return true;
  }
};
