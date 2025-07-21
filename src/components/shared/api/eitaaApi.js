import config from '../../../config/config';

const API_URL = `https://eitaayar.ir/api/${config.botToken}`;

const sendRequest = async (method, params) => {
    const response = await fetch(`${API_URL}/${method}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
    });
    return response.json();
};

export const sendMessage = (chat_id, text, reply_markup = null) => {
    return sendRequest('sendMessage', { chat_id, text, reply_markup });
};

export const editMessageText = (chat_id, message_id, text, reply_markup = null) => {
    return sendRequest('editMessageText', { chat_id, message_id, text, reply_markup });
};

export const forwardMessage = (chat_id, from_chat_id, message_id) => {
    return sendRequest('forwardMessage', { chat_id, from_chat_id, message_id });
};

export const deleteMessage = (chat_id, message_id) => {
    return sendRequest('deleteMessage', { chat_id, message_id });
};
