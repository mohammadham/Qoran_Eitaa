import { saveFile, getCategory, saveCategory, getAdminActivity, saveAdminActivity } from '../../shared/database/operations';
import { fileSchema, adminActivitySchema } from '../../shared/database/schema';
import { sendMessage, forwardMessage } from '../../shared/api/eitaaApi';
import config from '../../../config/config';

export const startFileUpload = async (adminId, categoryId) => {
    const newActivity = {
        ...adminActivitySchema,
        admin_action_wait: true,
        admin_action_type: 'send_messages_or_file_to_a_group',
        action_input_id: categoryId,
        state: 'waiting_files',
        action_temp_file_array: [],
    };
    await saveAdminActivity(adminId, newActivity);
    await sendMessage(adminId, "لطفا فایل‌های مورد نظر را ارسال کنید. پس از اتمام، دکمه 'اتمام ارسال' را بزنید.");
};

export const handleFileUpload = async (message) => {
    const adminId = message.from.id;
    const adminActivity = await getAdminActivity(adminId);

    if (!adminActivity || !adminActivity.admin_action_wait || adminActivity.state !== 'waiting_files') return;

    const file = message.photo || message.video || message.document || message.audio;
    const fileId = file.file_id;
    const fileName = message.caption || "";
    const fileType = message.photo ? 'photo' : (message.video ? 'video' : (message.document ? 'document' : 'audio'));

    // Forward the message to the database channel to get a permanent file_id
    adminActivity.action_temp_file_array.push(message.message_id);
    await saveAdminActivity(adminId, adminActivity);
};

export const finishFileUpload = async (adminId) => {
    const adminActivity = await getAdminActivity(adminId);
    if (!adminActivity || !adminActivity.admin_action_wait || adminActivity.state !== 'waiting_files') return;

    const categoryId = adminActivity.action_input_id;
    const category = await getCategory(categoryId);

    for (const messageId of adminActivity.action_temp_file_array) {
        const forwardedMessage = await forwardMessage(config.channelId, adminId, messageId);
        const eitaaMessageId = forwardedMessage.result.message_id;

        // In a real scenario, you would get file details from the original message.
        // This is a simplified version.
        const newFile = {
            ...fileSchema,
            id: `file_${new Date().getTime()}`,
            name: "File Name", // You would get this from the message
            type: "document", // You would get this from the message
            eitaaMessageId: eitaaMessageId,
            categoryId: categoryId,
            createdAt: new Date().toISOString()
        };
        await saveFile(newFile);
        category.attachments.push(newFile.id);
    }

    await saveCategory(category);
    await saveAdminActivity(adminId, { ...adminActivitySchema }); // Reset activity
    await sendMessage(adminId, "فایل‌ها با موفقیت به دسته اضافه شدند.");
};
