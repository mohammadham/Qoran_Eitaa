import { getFile, saveFile } from '../../shared/database/operations';
import { editMessageText } from '../../shared/api/eitaaApi';

export const handleVote = async (userId, fileId, voteType, chatId, messageId) => {
    const file = await getFile(fileId);
    if (!file) return;

    if (!file.voters) file.voters = {};

    const userLastVote = file.voters[userId];
    if (userLastVote === voteType) {
        // User is toggling their vote off
        if (voteType === 'like') file.likes--;
        else file.dislikes--;
        delete file.voters[userId];
    } else {
        // New vote or changing vote
        if (userLastVote === 'like') file.likes--;
        if (userLastVote === 'dislike') file.dislikes--;

        if (voteType === 'like') file.likes++;
        else file.dislikes++;
        file.voters[userId] = voteType;
    }

    await saveFile(file);

    const keyboard = {
        inline_keyboard: [[
            { text: `👍 ${file.likes || 0}`, callback_data: `like_${file.id}` },
            { text: `👎 ${file.dislikes || 0}`, callback_data: `dislike_${file.id}` }
        ]]
    };

    await editMessageText(chatId, messageId, "", keyboard);
};
