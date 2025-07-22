import { runModel } from '../../shared/ai/cloudflareAI';
import { get } from '../../shared/database/operations';
import { sendMessage } from '../../shared/api/eitaaApi';
import { saveAdminActivity, getAdminActivity } from '../../shared/database/operations';
import { adminActivitySchema } from '../../shared/database/schema';

export const requestAIQuery = async (userId) => {
    const newActivity = {
        ...adminActivitySchema,
        admin_action_wait: true,
        admin_action_type: 'send_text_for_a_input',
        action_input_id: 'input_ask_ai',
    };
    await saveAdminActivity(userId, newActivity);
    await sendMessage(userId, "لطفا سوال خود را از هوش مصنوعی بپرسید:");
};

export const handleAIQuery = async (userId, query) => {
    await sendMessage(userId, "در حال پردازش سوال شما...");

    const categories = await get('categories') || {};
    const files = await get('files') || {};

    // This is a simplified context generation. In a real scenario, you'd
    // perform a more sophisticated search to find relevant content.
    let context = "";
    for (const category of Object.values(categories)) {
        context += `دسته: ${category.title}\nتوضیحات: ${category.description}\n\n`;
    }

    const response = await runModel('@cf/meta/llama-2-7b-chat-fp16', {
        messages: [
            { role: 'system', content: 'شما یک ربات پاسخگو به سوالات بر اساس محتوای ارائه شده هستید.' },
            { role: 'user', content: `با توجه به محتوای زیر، به این سوال پاسخ بده:\n\nزمینه:\n${context}\n\nسوال: ${query}` }
        ]
    });

    await sendMessage(userId, response.response);
    await saveAdminActivity(userId, { ...adminActivitySchema }); // Reset activity
};

export const summarizeText = async (userId, text) => {
    await sendMessage(userId, "در حال خلاصه‌سازی متن...");

    const response = await runModel('@cf/facebook/bart-large-cnn', {
        input_text: text
    });

    await sendMessage(userId, `**خلاصه متن:**\n\n${response.summary}`);
};
