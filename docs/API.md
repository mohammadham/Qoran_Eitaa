# Telegram Bot API

This document outlines the API endpoints and methods used for interacting with the Telegram Bot API.

## API Endpoint

The base URL for all API requests is:

`https://api.telegram.org/bot<BOT_TOKEN>/`

Replace `<BOT_TOKEN>` with your actual bot token.

## Methods

### `sendMessage`

Sends a text message.

-   **URL:** `sendMessage`
-   **Method:** `POST`
-   **Parameters:**
    -   `chat_id`: Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
    -   `text`: Text of the message to be sent
    -   `reply_markup` (Optional): Additional interface options. A JSON-serialized object for an [inline keyboard](https://core.telegram.org/bots/api#inlinekeyboardmarkup), [custom reply keyboard](https://core.telegram.org/bots/api#replykeyboardmarkup), instructions to remove reply keyboard or to force a reply from the user.

### `editMessageText`

Edits a text and game message.

-   **URL:** `editMessageText`
-   **Method:** `POST`
-   **Parameters:**
    -   `chat_id`: Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
    -   `message_id`: Identifier of the message to edit
    -   `text`: New text of the message
    -   `reply_markup` (Optional): A JSON-serialized object for an inline keyboard.

### `forwardMessage`

Forwards messages of any kind.

-   **URL:** `forwardMessage`
-   **Method:** `POST`
-   **Parameters:**
    -   `chat_id`: Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
    -   `from_chat_id`: Unique identifier for the chat where the original message was sent (or channel username in the format `@channelusername`)
    -   `message_id`: Message identifier in the chat specified in `from_chat_id`

### `deleteMessage`

Deletes a message, including service messages, with the following limitations:
- A message can only be deleted if it was sent less than 48 hours ago.
- Bots can delete outgoing messages in private chats, groups, and supergroups.
- Bots can delete incoming messages in private chats.
- Bots granted `can_post_messages` permissions can delete outgoing messages in channels.
- If the bot is an administrator of a group, it can delete any message there.
- If the bot has `can_delete_messages` permission in a supergroup or a channel, it can delete any message there.

-   **URL:** `deleteMessage`
-   **Method:** `POST`
-   **Parameters:**
    -   `chat_id`: Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
    -   `message_id`: Identifier of the message to delete
