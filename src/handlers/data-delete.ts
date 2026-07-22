import { Composer } from "grammy";
import type { Ctx } from "../bot.js";
import { registerMainMenuItem, inlineButton, inlineKeyboard } from "../toolkit/index.js";

registerMainMenuItem({ label: "🗑 Delete my data", data: "data:delete", order: 50 });

const composer = new Composer<Ctx>();

composer.callbackQuery("data:delete", async (ctx) => {
  await ctx.answerCallbackQuery();
  const confirm = inlineKeyboard([
    [inlineButton("Yes, delete everything", "data:delete:confirm")],
    [inlineButton("Cancel", "menu:main")],
  ]);
  await ctx.reply("This will erase your selfie, style preferences, and all stored data. Ready?", {
    reply_markup: confirm,
  });
});

composer.callbackQuery("data:delete:confirm", async (ctx) => {
  await ctx.answerCallbackQuery();
  ctx.session.step = undefined;
  ctx.session.selfie_file_id = undefined;
  ctx.session.style_choice = undefined;
  ctx.session.custom_prompt = undefined;
  await ctx.reply("All done — your data is gone. Tap /start to start fresh.");
});

export default composer;
