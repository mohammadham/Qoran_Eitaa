import { getUser, saveUser } from '../../shared/database/operations';
import { userSchema } from '../../shared/database/schema';

export const userAuth = async (ctx, next) => {
    const from = ctx.update?.message?.from || ctx.update?.callback_query?.from;
    if (!from) return;

    let user = await getUser(String(from.id));
    if (!user) {
        user = {
            ...userSchema,
            id: String(from.id),
            username: from.username,
            firstName: from.first_name,
            lastName: from.last_name,
            createdAt: new Date().toISOString(),
        };
    }
    user.lastSeen = new Date().toISOString();
    await saveUser(user);

    ctx.user = user;
    return next();
};
