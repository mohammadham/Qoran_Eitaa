import { isAdmin } from '../../admin/middleware/adminAuth';
import * as adminCategoryManager from '../../admin/handlers/categoryManager';
import * as adminGroupManager from '../../admin/handlers/groupManager';
import * as adminWelcomeMessage from '../../admin/handlers/welcomeMessage';
import * as userNavigation from '../../user/handlers/navigation';
import * as userSearch from '../../user/handlers/search';
import { getAdminActivity, saveAdminActivity } from '../database/operations';
import { adminKeyboards } from '../../admin/keyboards/adminKeyboards';

export const handleMessage = async (update) => {
    const message = update.message;
    const chatId = message.chat.id;
    const fromId = message.from.id;
    const text = message.text;

    if (isAdmin(fromId)) {
        const adminActivity = await getAdminActivity(fromId);
        if (adminActivity && adminActivity.admin_action_wait) {
            // Handle admin inputs
        } else {
            switch (text) {
                case "افزودن دسته جدید":
                    // request category name
                    break;
                case "لیست دسته‌ها":
                    adminCategoryManager.listCategories(chatId);
                    break;
                case "لیست گروه‌ها":
                    adminGroupManager.listGroups(chatId);
                    break;
                case "پیام خوشامدگویی":
                    adminWelcomeMessage.listWelcomeMessages(chatId);
                    break;
                default:
                    // show admin main menu
            }
        }
    } else {
        // Handle user messages
        if (text === '/start') {
            userNavigation.showMainMenu(chatId);
        }
    }
};

export const handleCallbackQuery = async (update) => {
    const callbackQuery = update.callback_query;
    const fromId = callbackQuery.from.id;
    const chatId = callbackQuery.message.chat.id;
    const messageId = callbackQuery.message.message_id;
    const data = callbackQuery.data;

    if (isAdmin(fromId)) {
        if (data.startsWith("edit_category_")) {
            const categoryId = data.replace("edit_category_", "");
            adminCategoryManager.showCategoryMenu(chatId, categoryId);
        } else if (data === 'list_categories') {
            adminCategoryManager.listCategories(chatId);
        }
    } else {
        if (data.startsWith("category_")) {
            const categoryId = data.replace("category_", "");
            userNavigation.showCategory(chatId, messageId, categoryId);
        } else if (data === 'search') {
            userSearch.requestSearchQuery(chatId);
        } else if (data === 'main_menu') {
            userNavigation.showMainMenu(chatId, messageId);
        }
    }
};
