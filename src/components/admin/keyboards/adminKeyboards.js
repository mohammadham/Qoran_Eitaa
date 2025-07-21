export const adminKeyboards = {
    main: {
        keyboard: [
            [{ text: "افزودن دسته جدید" }, { text: "لیست دسته‌ها" }],
            [{ text: "لیست گروه‌ها" }, { text: "پیام خوشامدگویی" }],
            [{ text: "آمار" }]
        ],
        resize_keyboard: true
    },
    categoryEdit: (categoryId) => ({
        inline_keyboard: [
            [{ text: "ویرایش نام", callback_data: `edit_cat_name_${categoryId}` }, { text: "ویرایش توضیحات", callback_data: `edit_cat_desc_${categoryId}` }],
            [{ text: "افزودن فایل", callback_data: `add_file_${categoryId}` }, { text: "حذف دسته", callback_data: `delete_cat_${categoryId}` }],
            [{ text: "بازگشت", callback_data: "list_categories" }],
            [{ text: "بازگشت به منوی اصلی", callback_data: "admin_main" }]
        ]
    }),
    welcomeMessage: {
        inline_keyboard: [
            [{ text: "افزودن پیام جدید", callback_data: "add_wm" }],
            [{ text: "بازگشت", callback_data: "admin_main" }]
        ]
    }
};
