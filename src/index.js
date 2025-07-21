import { Router } from 'itty-router';
import { handleMessage, handleCallbackQuery } from './components/shared/utils/messageHandler';
import { userAuth } from './components/user/middleware/userAuth';
import { newChatMember, leftChatMember } from './components/admin/handlers/groupManager';

const router = Router();

router.post('/', async (request, env) => {
    const update = await request.json();

    global.env = env;

    if (update.message) {
        if (update.message.new_chat_member) {
            await newChatMember(update.message);
        } else if (update.message.left_chat_member) {
            await leftChatMember(update.message);
        } else {
            await userAuth({ update }, async () => {
                await handleMessage(update);
            });
        }
    } else if (update.callback_query) {
        await userAuth({ update }, async () => {
            await handleCallbackQuery(update);
        });
    }

    return new Response('OK');
});

export default {
    async fetch(request, env, ctx) {
        return router.handle(request, env, ctx);
    },
};
