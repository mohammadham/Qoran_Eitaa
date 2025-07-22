import { get, getCategory, saveUser } from '../../shared/database/operations';
import { sendMessage, editMessageText, forwardMessage } from '../../shared/api/eitaaApi';
import { userKeyboards } from '../keyboards/userKeyboards';
import { paginate, createPaginationKeyboard } from '../../shared/utils/pagination';
import config from '../../../config/config';

export const showMainMenu = async (chatId, messageId, page = 1) => {
    const categories = await get('categories') || {};
    const rootCategories = Object.values(categories).filter(c => c.parent === '-1' && c.type === 'user');

    const paginatedCategories = paginate(rootCategories, page, 5);

    const keyboard = userKeyboards.categories(paginatedCategories, "-1", false, rootCategories.length, page);

    if (messageId) {
        await editMessageText(chatId, messageId, "منوی اصلی", keyboard);
    } else {
        await sendMessage(chatId, "منوی اصلی", keyboard);
    }
};

export const showCategory = async (chatId, messageId, categoryId, page = 1) => {
    const categories = await get('categories') || {};
    const category = categories[categoryId];

    if (!category) {
        await sendMessage(chatId, "خطا: دسته مورد نظر یافت نشد. ممکن است حذف شده باشد.", {
            inline_keyboard: [[{ text: "بازگشت به منوی اصلی", callback_data: "main_menu" }]]
        });
        return;
    }

    // Save history
    const user = ctx.user;
    if (user) {
        if (!user.history) user.history = [];
        user.history.push(categoryId);
        if (user.history.length > 20) user.history.shift(); // Keep last 20 items
        await saveUser(user);
    }

    const childCategories = category.children.map(childId => categories[childId]).filter(c => c && c.type === 'user');
    const paginatedCategories = paginate(childCategories, page, 5);

    const files = await get('files') || {};
    const categoryFiles = Object.values(files).filter(f => f.categoryId === categoryId);

    // First, send the files
    for (const file of categoryFiles) {
        const sentMessage = await forwardMessage(chatId, config.channelId, file.eitaaMessageId);
        if (sentMessage.ok) {
            const messageId = sentMessage.result.message_id;
            const keyboard = {
                inline_keyboard: [[
                    { text: `👍 ${file.likes || 0}`, callback_data: `like_${file.id}` },
                    { text: `👎 ${file.dislikes || 0}`, callback_data: `dislike_${file.id}` }
                ]]
            };
            // This is a conceptual implementation. editMessageCaption might not be available
            // for all forwarded message types in Eitaa. A more robust solution might be
            // to send the file and then send a new message with the file's info and the keyboard.
            await editMessageText(chatId, messageId, sentMessage.result.caption || "", keyboard);
        }
    }

    // Then, show the category menu
    const keyboard = userKeyboards.categories(paginatedCategories, category.parent, categoryFiles.length > 0, childCategories.length, page);
    await editMessageText(chatId, messageId, category.title, keyboard);
};
