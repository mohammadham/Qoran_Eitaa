import { sendMessage } from './eitaa.js';
import { handleAdmin } from './admin.js';
import { handleUser } from './user.js';
import { getAdmins } from './database.js';

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request).catch(err => new Response(err.stack, { status: 500 })))
})

async function handleRequest(request) {
  if (request.method === 'POST') {
    const payload = await request.json()
    if (payload.message) {
      await handleMessage(payload.message)
    } else if (payload.callback_query) {
      await handleCallbackQuery(payload.callback_query)
    }
  }
  return new Response('OK')
}

async function handleMessage(message) {
  const { chat, text } = message;
  const admins = await getAdmins();

  if (admins.includes(chat.id)) {
    await handleAdmin(message);
  } else {
    await handleUser(message);
  }
}

async function handleCallbackQuery(callbackQuery) {
  const { from, data } = callbackQuery;
  const admins = await getAdmins();

  if (admins.includes(from.id)) {
    await handleAdmin(callbackQuery);
  } else {
    await handleUser(callbackQuery);
  }
}
