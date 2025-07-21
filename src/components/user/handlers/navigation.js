import { get, getCategory } from '../../shared/database/operations';
import { sendMessage, editMessageText } from '../../shared/api/eitaaApi';
import { userKeyboards } from '../keyboards/userKeyboards';

export const showMainMenu = async (chatId, messageId) => {
    const categories = await get('categories') || {};
    const rootCategories = Object.values(categories).filter(c => c.parent === '-1' && c.type === 'user');

    if (messageId) {
        await editMessageText(chatId, messageId, "منوی اصلی", userKeyboards.categories(rootCategories, "-1"));
    } else {
        await sendMessage(chatId, "منوی اصلی", userKeyboards.categories(rootCategories, "-1"));
    }
};

export const showCategory = async (chatId, messageId, categoryId) => {
    const categories = await get('categories') || {};
    const category = categories[categoryId];

    if (!category) {
        await sendMessage(chatId, "دسته مورد نظر یافت نشد.");
        return;
    }

    const childCategories = category.children.map(childId => categories[childId]).filter(c => c && c.type === 'user');

    // Here you would also list the files in the category

    await editMessageText(chatId, messageId, category.title, userKeyboards.categories(childCategories, category.parent));
};
