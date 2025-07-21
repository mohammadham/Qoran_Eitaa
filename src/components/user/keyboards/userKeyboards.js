export const userKeyboards = {
    categories: (categories, parentId) => {
        const keyboard = categories.map(c => ([{ text: c.title, callback_data: `category_${c.id}` }]));

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
