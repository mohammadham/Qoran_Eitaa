import config from '../../../config/config';

export const isAdmin = (userId) => {
    return config.adminUserIds.includes(String(userId));
};

export const adminAuth = (ctx, next) => {
    const fromId = ctx.update?.message?.from?.id || ctx.update?.callback_query?.from?.id;
    if (isAdmin(fromId)) {
        return next();
    }
    // You might want to send a message to the user that they are not authorized
};
