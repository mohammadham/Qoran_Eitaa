import { get } from '../../shared/database/operations';
import { sendMessage } from '../../shared/api/eitaaApi';

export const showStats = async (chatId) => {
    const users = await get('users') || {};
    const categories = await get('categories') || {};
    const files = await get('files') || {};
    const groups = await get('groups') || { groups: [] };

    const statsMessage = `
📊 **آمار ربات**

- تعداد کل کاربران: ${Object.keys(users).length}
- تعداد کل دسته‌ها: ${Object.keys(categories).length}
- تعداد کل فایل‌ها: ${Object.keys(files).length}
- تعداد گروه‌ها و کانال‌ها: ${groups.groups.length}
    `;

    await sendMessage(chatId, statsMessage);
};
