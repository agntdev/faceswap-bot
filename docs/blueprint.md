# FaceSwap Fun — Bot specification

**Archetype:** custom

**Voice:** playful and casual — write every user-facing message, button label, error, and empty state in this voice.

A Telegram bot that guides users through uploading selfies, selecting face-swap styles (Love/Fashion/Custom), and receiving low-cost quick-edit results directly in chat with friendly error handling and 7-day data retention.

> This is the complete contract for the bot. Implement EVERY entry point, flow, feature, integration, and edge case below. The completeness review checks the bot against this document after each build pass.

## Primary audience

- casual Telegram users
- social media content creators
- playful image editors

## Success criteria

- Image processing completes within 15 seconds
- 95% of users reach final image without errors
- All selfies deleted after 7 days

## Entry points

Every feature must be reachable from the bot's command/button surface (button-first; only /start and /help are slash commands).

- **/start** (command, actor: user, command: /start) — Open main menu with style choices
- **Upload Selfie** (button, actor: user, callback: upload:start) — Initiate selfie upload flow
  - inputs: image file
  - outputs: style selection prompt
- **Love** (button, actor: user, callback: style:love) — Select Love style preset
- **Fashion** (button, actor: user, callback: style:fashion) — Select Fashion style preset
- **Custom** (button, actor: user, callback: style:custom) — Enable custom prompt input

## Flows

### main_flow
_Trigger:_ /start

1. Show style buttons
2. Collect selfie
3. Validate face detection
4. Process style selection
5. Generate and deliver output

_Data touched:_ user_profile, selfie, job_record

### error_retry
_Trigger:_ invalid_image

1. Detect invalid image
2. Prompt re-upload
3. Cancel processing if multiple faces detected

_Data touched:_ selfie, job_record

## Data entities

Durable data (must survive a restart) uses the toolkit's persistent store, never in-memory maps.

- **user_profile** _(retention: persistent)_ — Telegram user metadata
  - fields: telegram_id, display_name
- **selfie** _(retention: persistent)_ — Original uploaded image
  - fields: file_id, upload_time
- **job_record** _(retention: persistent)_ — Processing status tracking
  - fields: style_choice, prompt_text, status, created_at
- **output_image** _(retention: persistent)_ — Final swapped image derivative
  - fields: file_id, generation_time

## Integrations

- **Telegram** (required) — Bot API messaging
Call external APIs against their real contract (correct endpoints, ids, params); credentials from env. Do not fake responses.

## Owner controls

- 7-day retention policy configuration
- Style preset definitions
- Error message templates
- Face detection validation rules

## Notifications

- In-chat processing status updates
- Final image delivery with Save/Share hint
- Error prompts with retry options

## Permissions & privacy

- Selfies stored for 7 days max
- No third-party data sharing
- User can delete their data via /start menu

## Edge cases

- Multiple faces in selfie
- Custom prompt exceeding 100 characters
- Face detection failure
- Job status polling during processing

## Required tests

- End-to-end flow from upload to image delivery
- Error handling for invalid images
- Retention policy expiration test

## Assumptions

- Face detection requires single frontal face
- Custom prompts limited to 100 characters
- Low-resolution output prioritized for speed
