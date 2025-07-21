import config from '../../../config/config';

const db = config.db;

export const get = async (key) => {
    return await db.get(key, { type: 'json' });
};

export const put = async (key, value) => {
    return await db.put(key, JSON.stringify(value));
};

export const list = async (prefix) => {
    return await db.list({ prefix });
};

export const del = async (key) => {
    return await db.delete(key);
};

export const getCategory = async (categoryId) => {
    const categories = await get('categories') || {};
    return categories[categoryId];
};

export const saveCategory = async (category) => {
    const categories = await get('categories') || {};
    categories[category.id] = category;
    await put('categories', categories);
};

export const deleteCategory = async (categoryId) => {
    const categories = await get('categories') || {};
    delete categories[categoryId];
    await put('categories', categories);
};

export const getFile = async (fileId) => {
    const files = await get('files') || {};
    return files[fileId];
};

export const saveFile = async (file) => {
    const files = await get('files') || {};
    files[file.id] = file;
    await put('files', files);
};

export const getWelcomeMessages = async () => {
    return await get('welcome_messages');
};

export const saveWelcomeMessages = async (messages) => {
    await put('welcome_messages', messages);
};

export const getAdminActivity = async (adminId) => {
    const activities = await get('admin_activities') || {};
    return activities[adminId];
};

export const saveAdminActivity = async (adminId, activity) => {
    const activities = await get('admin_activities') || {};
    activities[adminId] = activity;
    await put('admin_activities', activities);
};

export const getGroups = async () => {
    return await get('groups');
};

export const saveGroups = async (groups) => {
    await put('groups', groups);
};

export const getUser = async (userId) => {
    const users = await get('users') || {};
    return users[userId];
};

export const saveUser = async (user) => {
    const users = await get('users') || {};
    users[user.id] = user;
    await put('users', users);
};
