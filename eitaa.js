const TOKEN = 'YOUR_EITAA_BOT_TOKEN'; // It's recommended to store this in a secret
const BASE_URL = `https://eitaayar.ir/api/${TOKEN}`;

export async function sendMessage(chat_id, text, reply_markup) {
  const url = `${BASE_URL}/sendMessage`;
  const payload = {
    chat_id,
    text,
    reply_markup: JSON.stringify(reply_markup),
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return response.json();
}

export async function editMessage(chat_id, message_id, text, reply_markup) {
  const url = `${BASE_URL}/editMessageText`;
  const payload = {
    chat_id,
    message_id,
    text,
    reply_markup: JSON.stringify(reply_markup),
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return response.json();
}

export async function forwardMessage(chat_id, from_chat_id, message_id) {
    const url = `${BASE_URL}/forwardMessage`;
    const payload = {
        chat_id,
        from_chat_id,
        message_id,
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    return response.json();
}
