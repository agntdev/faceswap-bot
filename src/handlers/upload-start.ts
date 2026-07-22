import { Composer } from "grammy";
import type { Ctx } from "../bot.js";
import { registerMainMenuItem, inlineButton, inlineKeyboard } from "../toolkit/index.js";

registerMainMenuItem({ label: "📷 Upload Selfie", data: "upload:start", order: 10 });

const composer = new Composer<Ctx>();

const styleKeyboard = inlineKeyboard([
  [inlineButton("❤️ Love", "style:love"), inlineButton("👗 Fashion", "style:fashion")],
  [inlineButton("✨ Custom", "style:custom")],
]);

composer.callbackQuery("upload:start", async (ctx) => {
  await ctx.answerCallbackQuery();
  ctx.session.step = "awaiting_selfie";
  await ctx.reply("Send me a selfie — one face, front-facing works best!", {
    reply_markup: { force_reply: true, input_field_placeholder: "Tap 📎 to attach a photo…" },
  });
});

composer.on("message:photo", async (ctx, next) => {
  if (ctx.session.step !== "awaiting_selfie") return next();
  const photo = ctx.message.photo;
  const largest = photo[photo.length - 1];
  ctx.session.selfie_file_id = largest.file_id;
  ctx.session.step = undefined;
  await ctx.reply("Nice! Now pick a style for your face swap:", {
    reply_markup: styleKeyboard,
  });
});

composer.on("message", async (ctx, next) => {
  if (ctx.session.step !== "awaiting_selfie") return next();
  if (ctx.message.photo) return next();
  await ctx.reply("I need a photo, not text — tap 📎 and send a selfie!");
});

export default composer;
