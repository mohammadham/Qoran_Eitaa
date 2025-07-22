import { saveFile, getCategory, saveCategory } from '../../shared/database/operations';
import { fileSchema } from '../../shared/database/schema';
import { sendMessage, forwardMessage } from '../../shared/api/telegramApi';
import config from '../../../config/config';

export const startFileUpload = async (chatId, categoryId) => {
    // Logic to start file upload process
    await sendMessage(chatId, "لطفا فایل‌های مورد نظر را ارسال کنید. پس از اتمام، دکمه 'اتمام ارسال' را بزنید.");
};

export const handleFileUpload = async (message) => {
    const chatId = message.chat.id;
    const adminId = message.from.id;
    const categoryId = "some_category_id"; // This should be retrieved from admin_activities

    const file = message.photo || message.video || message.document || message.audio;
    const fileId = file.file_id;
    const fileName = message.caption || "";
    const fileType = message.photo ? 'photo' : (message.video ? 'video' : (message.document ? 'document' : 'audio'));

    // Forward the message to the database channel to get a permanent file_id
    const forwardedMessage = await forwardMessage(config.channelId, chatId, message.message_id);
    const telegramMessageId = forwardedMessage.result.message_id;

    const newFile = {
        ...fileSchema,
        id: `file_${new Date().getTime()}`,
        name: fileName,
        type: fileType,
        telegramMessageId: telegramMessageId,
        categoryId: categoryId,
        fileSize: file.file_size,
        mimeType: file.mime_type,
        createdAt: new Date().toISOString()
    };

    await saveFile(newFile);

    const category = await getCategory(categoryId);
    category.attachments.push(newFile.id);
    await saveCategory(category);

    // This is a simplified version. In a real scenario, you'd add the file to a temporary list
    // and only save them when the admin clicks "finish".
};

export const finishFileUpload = async (chatId) => {
    // Logic to finish file upload process
    await sendMessage(chatId, "فایل‌ها با موفقیت به دسته اضافه شدند.");
};
