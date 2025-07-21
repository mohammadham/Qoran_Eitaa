import { get } from '../../shared/database/operations';
import { sendMessage } from '../../shared/api/eitaaApi';
import { userKeyboards } from '../keyboards/userKeyboards';

export const requestSearchQuery = async (chatId) => {
    await sendMessage(chatId, "لطفا عبارت مورد نظر خود را برای جستجو وارد کنید:");
};

export const searchCategories = async (chatId, query) => {
    const categories = await get('categories') || {};
    const userCategories = Object.values(categories).filter(c => c.type === 'user');

    const results = userCategories.filter(c => c.title.includes(query));

    if (results.length === 0) {
        await sendMessage(chatId, "هیچ نتیجه‌ای برای جستجوی شما یافت نشد.");
        return;
    }

    const keyboard = {
        inline_keyboard: results.map(c => ([{ text: c.title, callback_data: `category_${c.id}` }]))
    };

    await sendMessage(chatId, "نتایج جستجو:", keyboard);
};
