export const paginate = (items, page = 1, perPage = 10) => {
    const start = (page - 1) * perPage;
    const end = page * perPage;
    return items.slice(start, end);
};

export const createPaginationKeyboard = (totalItems, page = 1, perPage = 10, callbackPrefix) => {
    const totalPages = Math.ceil(totalItems / perPage);
    if (totalPages <= 1) return [];

    const keyboardRow = [];
    if (page > 1) {
        keyboardRow.push({ text: "« قبلی", callback_data: `${callbackPrefix}_${page - 1}` });
    }
    if (page < totalPages) {
        keyboardRow.push({ text: "بعدی »", callback_data: `${callbackPrefix}_${page + 1}` });
    }
    return keyboardRow;
};
