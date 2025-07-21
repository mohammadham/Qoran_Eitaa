export const defaultSchema = {
    categories: {},
    files: {},
    welcome_messages: {
        chosen: "0",
        list: []
    },
    admin_activities: {},
    groups: {},
    users: {}
};

export const categorySchema = {
    id: "",
    parent: "-1",
    title: "",
    description: "",
    children: [],
    attachments: [],
    type: "user", // "admin" or "user"
    createdAt: "",
    updatedAt: ""
};

export const fileSchema = {
    id: "",
    name: "",
    type: "", // "photo", "video", "document", "audio"
    eitaaMessageId: "",
    categoryId: "",
    fileSize: 0,
    mimeType: "",
    createdAt: ""
};

export const welcomeMessageSchema = {
    id: "",
    name: "",
    description: "",
    text: "",
    isActive: false
};

export const adminActivitySchema = {
    admin_action_wait: false,
    admin_action_type: "", // "send_messages_or_file_to_a_group" | "send_text_for_a_input"
    action_temp_file_array: [],
    action_input_id: "", // "category_id" | "input_send_name" | "input_send_description"
    state: "", // "waiting_name" | "waiting_description" | "waiting_files" | "completed"
    tempData: {}
};

export const groupSchema = {
    id: "",
    title: "",
    type: "", // "group" | "channel"
    joinedAt: "",
    status: "active" // "active" | "left"
};

export const userSchema = {
    id: "",
    type: "user", // "admin" | "user"
    username: "",
    firstName: "",
    lastName: "",
    createdAt: "",
    lastSeen: "",
    currentMenu: "main"
};
