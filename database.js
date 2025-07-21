// KV is the binding to the Cloudflare KV namespace
const DB = KV;

// Generic get/set/delete functions
export const get = async (key) => DB.get(key);
export const set = async (key, value) => DB.put(key, value);
export const del = async (key) => DB.delete(key);

// Categories
export const getCategories = async () => JSON.parse(await get('categories') || '[]');
export const getCategory = async (id) => (await getCategories()).find(c => c.id === id);
export const saveCategories = async (categories) => set('categories', JSON.stringify(categories));

// Files
export const getFiles = async () => JSON.parse(await get('files') || '[]');
export const getFile = async (id) => (await getFiles()).find(f => f.id === id);
export const saveFiles = async (files) => set('files', JSON.stringify(files));

// Admins
export const getAdmins = async () => JSON.parse(await get('admins') || '[]');
export const saveAdmins = async (admins) => set('admins', JSON.stringify(admins));

// Users
export const getUsers = async () => JSON.parse(await get('users') || '[]');
export const getUser = async (id) => (await getUsers()).find(u => u.id === id);
export const saveUsers = async (users) => set('users', JSON.stringify(users));

// Welcome Message
export const getWelcomeMessage = async () => JSON.parse(await get('welcome_message') || '{"chosen":"0","list":[]}');
export const saveWelcomeMessage = async (welcomeMessage) => set('welcome_message', JSON.stringify(welcomeMessage));

// Admin Actions
export const getAdminAction = async () => JSON.parse(await get('admin_action') || '{}');
export const saveAdminAction = async (adminAction) => set('admin_action', JSON.stringify(adminAction));
export const clearAdminAction = async () => set('admin_action', '{}');

// Groups and Channels
export const getGroupsAndChannels = async () => JSON.parse(await get('groups_and_channels') || '[]');
export const saveGroupsAndChannels = async (groups) => set('groups_and_channels', JSON.stringify(groups));
