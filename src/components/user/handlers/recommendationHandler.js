import { get, getUser } from '../../shared/database/operations';
import { sendMessage } from '../../shared/api/eitaaApi';

export const getRecommendations = async (userId) => {
    const user = await getUser(userId);
    if (!user || !user.history || user.history.length === 0) {
        await sendMessage(userId, "هنوز تاریخچه‌ای برای شما ثبت نشده است تا پیشنهادی ارائه شود.");
        return;
    }

    const categories = await get('categories') || {};
    const lastVisitedCategoryId = user.history[user.history.length - 1];
    const lastVisitedCategory = categories[lastVisitedCategoryId];

    if (!lastVisitedCategory) {
        await sendMessage(userId, "خطا در دریافت اطلاعات آخرین بازدید.");
        return;
    }

    // Simple recommendation: suggest siblings of the last visited category
    const parentId = lastVisitedCategory.parent;
    const recommendations = Object.values(categories).filter(c => c.parent === parentId && c.id !== lastVisitedCategoryId && c.type === 'user');

    if (recommendations.length === 0) {
        await sendMessage(userId, "متاسفانه پیشنهاد مرتبطی یافت نشد.");
        return;
    }

    const keyboard = {
        inline_keyboard: recommendations.map(c => ([{ text: c.title, callback_data: `category_${c.id}` }]))
    };

    await sendMessage(userId, "چند پیشنهاد برای شما:", keyboard);
};
