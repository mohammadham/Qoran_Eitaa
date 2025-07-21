import { getWelcomeMessages, saveWelcomeMessages } from '../../shared/database/operations';
import { sendMessage } from '../../shared/api/eitaaApi';
import { adminKeyboards } from '../keyboards/adminKeyboards';

export const listWelcomeMessages = async (chatId) => {
    const welcomeMessages = await getWelcomeMessages() || { list: [] };

    if (welcomeMessages.list.length === 0) {
        await sendMessage(chatId, "هیچ پیام خوشامدگویی تعریف نشده است.", adminKeyboards.welcomeMessage);
        return;
    }

    const keyboard = {
        inline_keyboard: welcomeMessages.list.map(wm => ([
            { text: wm.name, callback_data: `wm_select_${wm.id}` }
        ]))
    };

    await sendMessage(chatId, "لیست پیام‌های خوشامدگویی:", keyboard);
};

export const requestNewWelcomeMessage = async (chatId) => {
    // Logic to ask for new welcome message
    await sendMessage(chatId, "لطفا متن پیام خوشامدگویی جدید را وارد کنید:");
};

export const createWelcomeMessage = async (chatId, text) => {
    const welcomeMessages = await getWelcomeMessages() || { list: [] };
    const newId = `wm_${new Date().getTime()}`;
    welcomeMessages.list.push({
        id: newId,
        name: `پیام ${welcomeMessages.list.length + 1}`,
        description: text.substring(0, 20),
        text: text,
        isActive: false
    });
    await saveWelcomeMessages(welcomeMessages);
    await sendMessage(chatId, "پیام خوشامدگویی با موفقیت اضافه شد.");
};

export const selectWelcomeMessage = async (chatId, messageId) => {
    const welcomeMessages = await getWelcomeMessages() || { list: [] };
    welcomeMessages.chosen = messageId;
    welcomeMessages.list.forEach(wm => {
        wm.isActive = wm.id === messageId;
    });
    await saveWelcomeMessages(welcomeMessages);
    await sendMessage(chatId, "پیام خوشامدگویی با موفقیت انتخاب شد.");
};
