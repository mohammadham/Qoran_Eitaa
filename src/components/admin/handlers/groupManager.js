import { getGroups, saveGroups } from '../../shared/database/operations';
import { sendMessage } from '../../shared/api/telegramApi';

export const listGroups = async (chatId) => {
    const groupsData = await getGroups() || { groups: [] };
    const activeGroups = groupsData.groups.filter(g => g.status === 'active');

    if (activeGroups.length === 0) {
        await sendMessage(chatId, "ربات در هیچ گروه یا کانالی عضو نیست.");
        return;
    }

    const keyboard = {
        inline_keyboard: activeGroups.map(g => ([
            { text: g.title, callback_data: `group_info_${g.id}` },
            { text: "خروج", callback_data: `leave_group_${g.id}` }
        ]))
    };

    await sendMessage(chatId, "لیست گروه‌ها و کانال‌ها:", keyboard);
};

export const leaveGroup = async (chatId, groupId) => {
    const groupsData = await getGroups() || { groups: [] };
    const group = groupsData.groups.find(g => g.id === groupId);

    if (group) {
        group.status = 'left';
        await saveGroups(groupsData);
        // You would also need to call the Eitaa API to actually leave the chat
        await sendMessage(chatId, `ربات از گروه "${group.title}" خارج شد.`);
    } else {
        await sendMessage(chatId, "گروه مورد نظر یافت نشد.");
    }
};

export const newChatMember = async (message) => {
    const chat = message.chat;
    const groupsData = await getGroups() || { groups: [] };
    let group = groupsData.groups.find(g => g.id === String(chat.id));

    if (!group) {
        group = {
            id: String(chat.id),
            title: chat.title,
            type: chat.type,
            joinedAt: new Date().toISOString(),
            status: 'active'
        };
        groupsData.groups.push(group);
    } else {
        group.status = 'active';
    }

    await saveGroups(groupsData);
};

export const leftChatMember = async (message) => {
    const chat = message.chat;
    const groupsData = await getGroups() || { groups: [] };
    const group = groupsData.groups.find(g => g.id === String(chat.id));

    if (group) {
        group.status = 'left';
        await saveGroups(groupsData);
    }
};
