import { createPaginationKeyboard } from '../../shared/utils/pagination';

export const userKeyboards = {
    categories: (categories, parentId, hasFiles, totalItems, page) => {
        const keyboard = categories.map(c => ([{ text: c.title, callback_data: `category_${c.id}` }]));

        const paginationKeyboard = createPaginationKeyboard(totalItems, page, 5, `category_${parentId}`);
        if(paginationKeyboard.length > 0) keyboard.push(paginationKeyboard);

        if (parentId !== "-1") {
            keyboard.push([{ text: "بازگشت", callback_data: `category_${parentId}` }]);
        }

        keyboard.push([{ text: "جستجو", callback_data: "search" }]);

        if (parentId !== "-1") {
            keyboard.push([{ text: " بازگشت به صفحه اصلی", callback_data: "main_menu" }])
        }

        return { inline_keyboard: keyboard };
    }
};
