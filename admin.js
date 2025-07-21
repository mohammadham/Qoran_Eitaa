import { sendMessage, editMessage } from './eitaa.js';
import * as db from './database.js';
import { v4 as uuidv4 } from 'uuid';

export async function handleAdmin(update) {
    if (update.message) {
        await handleAdminMessage(update.message);
    } else if (update.callback_query) {
        await handleAdminCallback(update.callback_query);
    }
}

async function handleAdminMessage(message) {
    const { chat, text } = message;
    const adminAction = await db.getAdminAction();

    if (adminAction.admin_action_wait && adminAction.admin_action_type === 'send_text_for_a_input') {
        if (adminAction.action_input_id === 'input_category_name') {
            const newCategory = {
                id: uuidv4(),
                name: text,
                parent: -1,
                children: [],
                attachment: [],
                type: 'user'
            };
            const categories = await db.getCategories();
            categories.push(newCategory);
            await db.saveCategories(categories);
            await db.clearAdminAction();
            await sendMessage(chat.id, `Category "${text}" created successfully.`);
            await showAdminMenu(chat.id);
        }
    } else if (text === '/start') {
        await showAdminMenu(chat.id);
    }
}

async function handleAdminCallback(callbackQuery) {
    const { from, message, data } = callbackQuery;
    const [action, ...params] = data.split(':');

    switch (action) {
        case 'admin_menu':
            await showAdminMenu(from.id, message.message_id);
            break;
        case 'add_category':
            await db.saveAdminAction({ admin_action_wait: true, admin_action_type: 'send_text_for_a_input', action_input_id: 'input_category_name' });
            await sendMessage(from.id, 'Please send the name for the new category.');
            break;
        case 'list_categories':
            await showCategories(from.id, message.message_id);
            break;
        case 'list_groups':
            // Logic to list groups
            break;
        case 'set_welcome':
            // Logic to set welcome message
            break;
    }
}

async function showAdminMenu(chat_id, message_id) {
    const text = 'Admin Panel';
    const keyboard = {
        inline_keyboard: [
            [{ text: 'افزودن دسته جدید', callback_data: 'add_category' }],
            [{ text: 'نمایش لیست دسته ها', callback_data: 'list_categories' }],
            [{ text: 'لیست گروه ها', callback_data: 'list_groups' }],
            [{ text: 'انتخاب پیام خوشامدگویی', callback_data: 'set_welcome' }],
        ],
    };

    if (message_id) {
        await editMessage(chat_id, message_id, text, keyboard);
    } else {
        await sendMessage(chat_id, text, keyboard);
    }
}

async function showCategories(chat_id, message_id) {
    const categories = await db.getCategories();
    const keyboard = {
        inline_keyboard: categories.map(cat => ([{ text: cat.name, callback_data: `edit_category:${cat.id}` }]))
    };
    keyboard.inline_keyboard.push([{ text: '🔙 Back to Admin Menu', callback_data: 'admin_menu' }]);

    const text = 'Select a category to edit:';
    if (message_id) {
        await editMessage(chat_id, message_id, text, keyboard);
    } else {
        await sendMessage(chat_id, text, keyboard);
    }
}
