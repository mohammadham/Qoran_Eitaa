# پروژه ربات مدیریت محتوا برای ایتا - مستندات فنی

## 📋 معرفی پروژه
ربات مدیریت محتوا یک سیستم پیشرفته برای مدیریت و دسته‌بندی محتوا در پیام‌رسان ایتا است که بر روی Cloudflare Workers اجرا می‌شود. این ربات با معماری کامپوننت محور طراحی شده و امکان مدیریت آسان محتوا را برای ادمین‌ها فراهم می‌کند.

## 🏗️ ساختار پروژه

```
eitaa-content-bot/
├── src/
│   ├── components/
│   │   ├── admin/
│   │   │   ├── handlers/
│   │   │   │   ├── categoryManager.js
│   │   │   │   ├── fileUploader.js
│   │   │   │   ├── groupManager.js
│   │   │   │   └── welcomeMessage.js
│   │   │   ├── keyboards/
│   │   │   │   └── adminKeyboards.js
│   │   │   └── middleware/
│   │   │       └── adminAuth.js
│   │   ├── user/
│   │   │   ├── handlers/
│   │   │   │   ├── navigation.js
│   │   │   │   └── search.js
│   │   │   ├── keyboards/
│   │   │   │   └── userKeyboards.js
│   │   │   └── middleware/
│   │   │       └── userAuth.js
│   │   ├── shared/
│   │   │   ├── database/
│   │   │   │   ├── schema.js
│   │   │   │   ├── operations.js
│   │   │   │   └── migrations.js
│   │   │   ├── utils/
│   │   │   │   ├── messageHandler.js
│   │   │   │   ├── fileHandler.js
│   │   │   │   └── constants.js
│   │   │   └── api/
│   │   │       └── eitaaApi.js
│   ├── config/
│   │   └── config.js
│   ├── index.js
│   └── package.json
├── docs/
│   └── API.md
├── README.md
└── wrangler.toml
```

## 🗄️ ساختار دیتابیس (Cloudflare KV)

### 1. Namespace: `EITAA_BOT_DATA`

#### Key: `categories`
```javascript
{
  "category_id": {
    "id": "category_id",
    "parent": "parent_category_id or -1",
    "title": "عنوان دسته",
    "description": "توضیحات دسته",
    "children": ["child_id_1", "child_id_2"],
    "attachments": ["file_id_1", "file_id_2"],
    "type": "admin/user",
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
}
```

#### Key: `files`
```javascript
{
  "file_id": {
    "id": "file_id",
    "name": "نام فایل",
    "type": "photo/video/document/audio",
    "eitaaMessageId": "message_id_in_channel",
    "categoryId": "category_id",
    "fileSize": 1024,
    "mimeType": "application/pdf",
    "createdAt": "timestamp"
  }
}
```

#### Key: `welcome_messages`
```javascript
{
  "chosen": "0",
  "list": [
    {
      "id": "msg_id",
      "name": "نام پیام",
      "description": "توضیحات پیام",
      "text": "متن پیام خوشامدگویی",
      "isActive": true
    }
  ]
}
```

#### Key: `admin_activities`
```javascript
{
  "admin_user_id": {
    "admin_action_wait": true,
    "admin_action_type": "send_messages_or_file_to_a_group|send_text_for_a_input",
    "action_temp_file_array": ["msg_id_1", "msg_id_2"],
    "action_input_id": "category_id|input_send_name|input_send_description",
    "state": "waiting_name|waiting_description|waiting_files|completed",
    "tempData": {} // ذخیره داده‌های موقت
  }
}
```

#### Key: `groups`
```javascript
{
  "groups": [
    {
      "id": "group_id",
      "title": "نام گروه/کانال",
      "type": "group|channel",
      "joinedAt": "timestamp",
      "status": "active|left"
    }
  ]
}
```

#### Key: `users`
```javascript
{
  "user_id": {
    "id": "user_id",
    "type": "admin|user",
    "username": "username",
    "firstName": "نام",
    "lastName": "نام خانوادگی",
    "createdAt": "timestamp",
    "lastSeen": "timestamp",
    "currentMenu": "menu_path"
  }
}
```

## 🔧 نحوه راه‌اندازی

### پیش‌نیازها
- Node.js v16 یا بالاتر
- حساب Cloudflare
- wrangler CLI

### مراحل نصب

1. **کلون پروژه**
```bash
git clone [repository-url]
cd eitaa-content-bot
```

2. **نصب وابستگی‌ها**
```bash
npm install
```

3. **تنظیم متغیرهای محیطی**
```bash
# wrangler.toml
name = "eitaa-content-bot"
main = "src/index.js"
compatibility_date = "2024-01-01"

[vars]
BOT_TOKEN = "YOUR_BOT_TOKEN"
ADMIN_USER_IDS = "123456789,987654321"
CHANNEL_ID = "@your_channel_id"

[[kv_namespaces]]
binding = "EITAA_BOT_DATA"
id = "your_kv_namespace_id"
preview_id = "your_preview_kv_namespace_id"
```

4. **استقرار در Cloudflare Workers**
```bash
wrangler login
wrangler deploy
```

## 🎯 راهنمای استفاده

### برای ادمین‌ها

#### افزودن دسته جدید
1. از منوی اصلی "افزودن دسته جدید" را انتخاب کنید
2. نام دسته را وارد کنید
3. توضیحات دسته را وارد کنید
4. نوع دسته (ادمین/کاربر) را انتخاب کنید
5. دسته والد را انتخاب کنید (برای دسته اصلی، بدون انتخاب والد)
6. تایید نهایی

#### مدیریت فایل‌ها
1. از منوی اصلی "لیست دسته‌ها" را انتخاب کنید
2. دسته مورد نظر را انتخاب کنید
3. "افزودن فایل" را انتخاب کنید
4. فایل‌های مورد نظر را ارسال کنید
5. دکمه "اتمام ارسال" را فشار دهید

#### مدیریت گروه‌ها
1. از منوی اصلی "لیست گروه‌ها" را انتخاب کنید
2. لیست گروه‌ها و کانال‌ها نمایش داده می‌شود
3. برای خروج از گروه، دکمه "خروج" را فشار دهید

### برای کاربران

#### جستجو
1. در منوی اصلی دکمه "جستجو" را فشار دهید
2. عبارت مورد نظر را تایپ کنید
3. نتایج جستجو نمایش داده می‌شود

#### مرور دسته‌ها
1. از منوی اصلی دسته‌های اصلی نمایش داده می‌شود
2. برای ورود به زیردسته، روی دسته کلیک کنید
3. برای بازگشت از دکمه "بازگشت" استفاده کنید

## 📋 TODO LIST

### فاز 1 - توسعه هسته (Priority: High)
- [x] پیاده‌سازی سیستم مسیریابی منوها
- [x] پیاده‌سازی سیستم مدیریت دسته‌بندی‌ها
- [x] پیاده‌سازی سیستم آپلود و ذخیره فایل‌ها
- [x] پیاده‌سازی سیستم جستجو برای کاربران
- [x] پیاده‌سازی سیستم مدیریت گروه‌ها

### فاز 2 - بهبود تجربه کاربری (Priority: Medium)
- [x] **اضافه کردن سیستم pagination برای لیست‌ها:** برای نمایش لیست‌های طولانی (مانند دسته‌ها، فایل‌ها و گروه‌ها) در چندین صفحه، از pagination استفاده می‌شود تا کاربر بتواند به راحتی بین صفحات جابجا شود.
- [x] **اضافه کردن دکمه‌های شناور (Floating buttons):** دکمه‌های مهم و پرکاربرد مانند "بازگشت به منوی اصلی" به صورت شناور در پایین منوها قرار می‌گیرند تا دسترسی به آن‌ها آسان‌تر شود.
- [x] **بهبود پیام‌های خطا و بازخورد به کاربر:** پیام‌های خطا با جزئیات بیشتری نمایش داده می‌شوند و در هر مرحله، بازخورد مناسبی به کاربر ارائه می‌شود تا تجربه کاربری بهتری فراهم شود.
- [x] **اضافه کردن سیستم آمار و گزارش‌گیری:** ادمین‌ها می‌توانند به آمارهای کلی ربات (مانند تعداد کاربران، تعداد فایل‌ها و...) دسترسی داشته باشند و گزارش‌های دوره‌ای از فعالیت‌ها دریافت کنند.

### فاز 3 - هوش مصنوعی (Priority: Low)
- [x] **اضافه کردن قابلیت پاسخگویی خودکار با AI:** کاربران می‌توانند با استفاده از دکمه "از AI بپرس" سوالات خود را مطرح کرده و بر اساس محتوای موجود در ربات، پاسخ دریافت کنند. این قابلیت از مدل‌های زبان بزرگ Cloudflare Workers AI استفاده می‌کند.
- [ ] **اضافه کردن سیستم پیشنهاد محتوا بر اساس تاریخچه:** ربات با تحلیل تاریخچه فعالیت کاربر، محتوای مرتبط و مورد علاقه او را پیشنهاد می‌دهد.
- [x] **اضافه کردن قابلیت خلاصه‌سازی متون:** کاربران می‌توانند با ارسال دستور `/summarize` در پاسخ به یک پیام متنی، خلاصه‌ای از آن را دریافت کنند. این ویژگی نیز توسط مدل‌های هوش مصنوعی Cloudflare پشتیبانی می‌شود.
- [ ] **اضافه کردن ترجمه خودکار محتوا:** امکان ترجمه متون به زبان‌های مختلف با استفاده از مدل‌های ترجمه هوش مصنوعی فراهم می‌شود.

### فاز 4 - امکانات پیشرفته (Priority: Low)
- [ ] اضافه کردن سیستم اشتراک‌گذاری بین ربات‌ها
- [ ] اضافه کردن سیستم نظرسنجی برای فایل‌ها
- [ ] اضافه کردن قابلیت دانلود دسته‌ای
- [ ] اضافه کردن سیستم اعلان برای محتوای جدید

## 🔐 امنیت

- اعتبارسنجی تمامی ورودی‌ها
- محدود کردن دسترسی ادمین‌ها به عملیات خاص
- استفاده از rate limiting برای جلوگیری از اسپم
- لاگ‌گیری تمامی عملیات مهم

## 📊 مانیتورینگ

- لاگ‌گیری تمامی خطاها
- آمار استفاده روزانه
- مانیتورینگ عملکرد API
- گزارش‌های هفتگی برای ادمین‌ها
