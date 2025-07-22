import { get, getCategory } from '../../shared/database/operations';
import { sendMessage } from '../../shared/api/eitaaApi';

export const notifyUsersAboutCategory = async (adminId, categoryId) => {
    const category = await getCategory(categoryId);
    if (!category) {
        await sendMessage(adminId, "دسته مورد نظر یافت نشد.");
        return;
    }

    const users = await get('users') || {};
    const userIds = Object.keys(users);

    await sendMessage(adminId, `در حال ارسال اعلان به ${userIds.length} کاربر...`);

    let successCount = 0;
    for (const userId of userIds) {
        try {
            const message = `📢 محتوای جدیدی در دسته "${category.title}" اضافه شد!`;
            const keyboard = {
                inline_keyboard: [[{ text: `مشاهده دسته`, callback_data: `category_${categoryId}` }]]
            };
            await sendMessage(userId, message, keyboard);
            successCount++;
            // Add a small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
            console.error(`Failed to send notification to user ${userId}:`, error);
        }
    }

    await sendMessage(adminId, `اعلان با موفقیت به ${successCount} کاربر از ${userIds.length} کاربر ارسال شد.`);
};

export const confirmNotify = async (adminId, categoryId) => {
    const keyboard = {
        inline_keyboard: [
            [{ text: "بله، ارسال کن", callback_data: `notify_confirm_${categoryId}` }, { text: "خیر", callback_data: `edit_category_${categoryId}` }]
        ]
    };
    await sendMessage(adminId, "آیا از ارسال اعلان به تمامی کاربران مطمئن هستید؟", keyboard);
}
