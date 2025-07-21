import { saveCategory, getCategory, get, put } from '../../shared/database/operations';
import { categorySchema } from '../../shared/database/schema';
import { sendMessage } from '../../shared/api/eitaaApi';
import { adminKeyboards } from '../keyboards/adminKeyboards';
import { paginate, createPaginationKeyboard } from '../../shared/utils/pagination';

import { saveAdminActivity, getAdminActivity, saveCategory, getCategory, get, put } from '../../shared/database/operations';
import { adminActivitySchema } from '../../shared/database/schema';

export const requestCategoryName = async (adminId) => {
    const newActivity = {
        ...adminActivitySchema,
        admin_action_wait: true,
        admin_action_type: 'send_text_for_a_input',
        action_input_id: 'input_send_name',
    };
    await saveAdminActivity(adminId, newActivity);
    await sendMessage(adminId, "لطفا نام دسته جدید را وارد کنید:");
};

export const createCategory = async (chatId, name, parentId = "-1") => {
    const newCategory = {
        ...categorySchema,
        id: `cat_${new Date().getTime()}`,
        title: name,
        parent: parentId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    await saveCategory(newCategory);
    if (parentId !== "-1") {
        const parentCategory = await getCategory(parentId);
        parentCategory.children.push(newCategory.id);
        await saveCategory(parentCategory);
    }
    await saveAdminActivity(chatId, { ...adminActivitySchema }); // Reset activity
    await sendMessage(chatId, `دسته "${name}" با موفقیت ایجاد شد.`, adminKeyboards.main);
};

export const showCategoryMenu = async (chatId, categoryId) => {
    const category = await getCategory(categoryId);
    if (category) {
        await sendMessage(chatId, `شما در حال ویرایش دسته "${category.title}" هستید.`, adminKeyboards.categoryEdit(categoryId));
    } else {
        await sendMessage(chatId, "خطا: دسته مورد نظر یافت نشد. ممکن است حذف شده باشد.", {
            inline_keyboard: [[{ text: "بازگشت به لیست دسته‌ها", callback_data: "list_categories" }]]
        });
    }
};

export const listCategories = async (chatId, parentId = "-1", page = 1) => {
    const categories = await get('categories') || {};
    const allCategories = Object.values(categories).filter(c => c.parent === parentId);

    const paginatedCategories = paginate(allCategories, page, 5);

    if (allCategories.length === 0) {
        await sendMessage(chatId, "هیچ دسته‌ای برای نمایش وجود ندارد.");
        return;
    }

    const keyboard = paginatedCategories.map(c => ([{ text: c.title, callback_data: `edit_category_${c.id}` }]));
    const paginationKeyboard = createPaginationKeyboard(allCategories.length, page, 5, `list_cat_${parentId}`);

    const finalKeyboard = {
        inline_keyboard: [...keyboard, paginationKeyboard]
    };

    await sendMessage(chatId, "لیست دسته‌ها:", finalKeyboard);
};

export const deleteCategoryPrompt = async (chatId, categoryId) => {
    const keyboard = {
        inline_keyboard: [
            [{ text: "بله، حذف کن", callback_data: `delete_cat_confirm_${categoryId}` }, { text: "خیر", callback_data: `edit_category_${categoryId}` }]
        ]
    };
    await sendMessage(chatId, "آیا از حذف این دسته مطمئن هستید؟", keyboard);
};

export const deleteCategoryRecursive = async (categoryId) => {
    const category = await getCategory(categoryId);
    if (!category) return;

    for (const childId of category.children) {
        await deleteCategoryRecursive(childId);
    }

    // Here you should also delete the files associated with the category

    await deleteCategory(categoryId);
};
