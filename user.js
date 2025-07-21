import { sendMessage, editMessage } from './eitaa.js';
import * as db from './database.js';

export async function handleUser(update) {
    if (update.message) {
        await handleUserMessage(update.message);
    } else if (update.callback_query) {
        await handleUserCallback(update.callback_query);
    }
}

async function handleUserMessage(message) {
    const { chat, text } = message;

    if (text === '/start') {
        const welcomeMessage = await db.getWelcomeMessage();
        const chosenWelcome = welcomeMessage.list.find(wm => wm.id === welcomeMessage.chosen);
        const messageText = chosenWelcome ? chosenWelcome.description : 'Welcome!';
        await showMainMenu(chat.id, null, messageText);
    }
}

async function handleUserCallback(callbackQuery) {
    const { from, message, data } = callbackQuery;
    const [action, ...params] = data.split(':');

    switch (action) {
        case 'main_menu':
            await showMainMenu(from.id, message.message_id);
            break;
        case 'category':
            await showCategoryMenu(from.id, message.message_id, params[0]);
            break;
        case 'search':
            // Logic for search
            break;
    }
}

async function showMainMenu(chat_id, message_id, text = 'Main Menu') {
    const categories = await db.getCategories();
    const rootCategories = categories.filter(c => c.parent === -1 && c.type === 'user');

    const keyboard = {
        inline_keyboard: rootCategories.map(cat => ([{ text: cat.name, callback_data: `category:${cat.id}` }]))
    };
    keyboard.inline_keyboard.push([{ text: '🔍 Search', callback_data: 'search' }]);

    if (message_id) {
        await editMessage(chat_id, message_id, text, keyboard);
    } else {
        await sendMessage(chat_id, text, keyboard);
    }
}

async function showCategoryMenu(chat_id, message_id, category_id) {
    const categories = await db.getCategories();
    const category = categories.find(c => c.id === category_id);
    const childCategories = categories.filter(c => c.parent === category_id);
    const files = await db.getFiles();
    const categoryFiles = files.filter(f => category.attachment.includes(f.id));


    const keyboard = {
        inline_keyboard: [
            ...childCategories.map(cat => ([{ text: cat.name, callback_data: `category:${cat.id}` }])),
            ...categoryFiles.map(file => ([{ text: file.file_name, callback_data: `file:${file.id}` }]))
        ]
    };

    if (category.parent === -1) {
        keyboard.inline_keyboard.push([{ text: '🔝 Back to Main Menu', callback_data: 'main_menu' }]);
    } else {
        keyboard.inline_keyboard.push([{ text: '🔙 Back', callback_data: `category:${category.parent}` }]);
    }


    const text = category.name;
    if (message_id) {
        await editMessage(chat_id, message_id, text, keyboard);
    } else {
        await sendMessage(chat_id, text, keyboard);
    }
}
