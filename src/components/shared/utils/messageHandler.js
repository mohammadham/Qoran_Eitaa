import { isAdmin } from '../../admin/middleware/adminAuth';
import * as adminCategoryManager from '../../admin/handlers/categoryManager';
import * as adminGroupManager from '../../admin/handlers/groupManager';
import * as adminWelcomeMessage from '../../admin/handlers/welcomeMessage';
import * as adminStats from '../../admin/handlers/stats';
import * as userNavigation from '../../user/handlers/navigation';
import * as userSearch from '../../user/handlers/search';
import * as userAI from '../../user/handlers/aiHandler';
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
            switch (adminActivity.admin_action_type) {
                case 'send_text_for_a_input':
                    switch (adminActivity.action_input_id) {
                        case 'input_send_name':
                            await adminCategoryManager.createCategory(chatId, text);
                            break;
                        // سایر موارد ورودی متن در اینجا مدیریت می‌شوند
                    }
                    break;
                case 'send_messages_or_file_to_a_group':
                    // منطق مربوط به دریافت فایل در اینجا پیاده‌سازی می‌شود
                    break;
            }
        } else {
            switch (text) {
                case "افزودن دسته جدید":
                    await adminCategoryManager.requestCategoryName(fromId);
                    break;
                case "لیست دسته‌ها":
                    await adminCategoryManager.listCategories(chatId);
                    break;
                case "لیست گروه‌ها":
                    adminGroupManager.listGroups(chatId);
                    break;
                case "پیام خوشامدگویی":
                    adminWelcomeMessage.listWelcomeMessages(chatId);
                    break;
                case "آمار":
                    adminStats.showStats(chatId);
                    break;
                default:
                    await sendMessage(chatId, "منوی اصلی ادمین", adminKeyboards.main);
            }
        }
    } else {
        // Handle user messages
        if (text === '/start') {
            await userNavigation.showMainMenu(chatId);
        } else if (text && text.startsWith('/summarize') && message.reply_to_message) {
            const repliedMessage = message.reply_to_message;
            // In a real scenario, you would fetch the full text of the file.
            // Here, we assume the text is in the caption or text of the replied message.
            const textToSummarize = repliedMessage.text || repliedMessage.caption || "";
            if (textToSummarize) {
                await userAI.summarizeText(fromId, textToSummarize);
            } else {
                await sendMessage(fromId, "لطفا این دستور را در پاسخ به یک پیام متنی ارسال کنید.");
            }
        } else {
            const userActivity = await getAdminActivity(fromId);
            if (userActivity && userActivity.admin_action_wait && userActivity.action_input_id === 'input_ask_ai') {
                await userAI.handleAIQuery(fromId, text);
            }
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
        } else if (data.startsWith("delete_cat_confirm_")) {
            const categoryId = data.replace("delete_cat_confirm_", "");
            await adminCategoryManager.deleteCategoryRecursive(categoryId);
            await sendMessage(chatId, "دسته با موفقیت حذف شد.");
        } else if (data.startsWith("delete_cat_")) {
            const categoryId = data.replace("delete_cat_", "");
            await adminCategoryManager.deleteCategoryPrompt(chatId, categoryId);
        } else if (data.startsWith("list_cat_")) {
            const parts = data.split('_');
            const parentId = parts[2];
            const page = parseInt(parts[3]);
            adminCategoryManager.listCategories(chatId, parentId, page);
        } else if (data === 'list_categories') {
            adminCategoryManager.listCategories(chatId);
        } else if (data === 'admin_main') {
            await sendMessage(chatId, "منوی اصلی ادمین", adminKeyboards.main);
        }
    } else {
        if (data.startsWith("category_")) {
            const parts = data.split('_');
            const categoryId = parts[1];
            const page = parts.length > 2 ? parseInt(parts[2]) : 1;
            userNavigation.showCategory(chatId, messageId, categoryId, page);
        } else if (data === 'search') {
            userSearch.requestSearchQuery(chatId);
        } else if (data === 'ask_ai') {
            userAI.requestAIQuery(fromId);
        } else if (data.startsWith('main_menu_')) {
            const page = parseInt(data.split('_')[2]);
            userNavigation.showMainMenu(chatId, messageId, page);
        } else if (data === 'main_menu') {
            userNavigation.showMainMenu(chatId, messageId);
        }
    }
};
