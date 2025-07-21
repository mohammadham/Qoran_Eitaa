import { saveCategory, getCategory, get, put } from '../../shared/database/operations';
import { categorySchema } from '../../shared/database/schema';
import { sendMessage } from '../../shared/api/eitaaApi';
import { adminKeyboards } from '../keyboards/adminKeyboards';

export const requestCategoryName = async (chatId) => {
    // Logic to ask for category name
    await sendMessage(chatId, "لطفا نام دسته جدید را وارد کنید:");
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
    await sendMessage(chatId, `دسته "${name}" با موفقیت ایجاد شد.`, adminKeyboards.main);
};

export const showCategoryMenu = async (chatId, categoryId) => {
    const category = await getCategory(categoryId);
    if (category) {
        await sendMessage(chatId, `شما در حال ویرایش دسته "${category.title}" هستید.`, adminKeyboards.categoryEdit(categoryId));
    } else {
        await sendMessage(chatId, "دسته مورد نظر یافت نشد.");
    }
};

export const listCategories = async (chatId, parentId = "-1") => {
    const categories = await get('categories') || {};
    const categoryList = Object.values(categories).filter(c => c.parent === parentId);

    if (categoryList.length === 0) {
        await sendMessage(chatId, "هیچ دسته‌ای برای نمایش وجود ندارد.");
        return;
    }

    const keyboard = {
        inline_keyboard: categoryList.map(c => ([{ text: c.title, callback_data: `edit_category_${c.id}` }]))
    };

    await sendMessage(chatId, "لیست دسته‌ها:", keyboard);
};
