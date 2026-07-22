import { Composer } from "grammy";
import type { Ctx } from "../bot.js";
import { registerMainMenuItem, inlineButton, inlineKeyboard } from "../toolkit/index.js";

registerMainMenuItem({ label: "✨ Custom", data: "style:custom", order: 40 });

const composer = new Composer<Ctx>();

composer.callbackQuery("style:custom", async (ctx) => {
  await ctx.answerCallbackQuery();
  if (!ctx.session.selfie_file_id) {
    await ctx.reply("No selfie yet — tap 📷 Upload Selfie to start!");
    return;
  }
  ctx.session.style_choice = "custom";
  ctx.session.step = "awaiting_custom_prompt";
  await ctx.reply("What vibe do you want? Describe it in a few words (max 100 characters):", {
    reply_markup: { force_reply: true, input_field_placeholder: "e.g. retro 80s neon glow…" },
  });
});

composer.on("message:text", async (ctx, next) => {
  if (ctx.session.step !== "awaiting_custom_prompt") return next();
  const prompt = ctx.message.text.trim();
  if (prompt.length > 100) {
    await ctx.reply("That's a bit long — keep it under 100 characters and try again.");
    return;
  }
  ctx.session.custom_prompt = prompt;
  ctx.session.step = undefined;
  const backToMenu = inlineKeyboard([[inlineButton("⬅️ Back to menu", "menu:main")]]);
  await ctx.reply(`✨ Custom style: "${prompt}" — Processing your face swap…`, {
    reply_markup: backToMenu,
  });
  await ctx.reply("Here's your swapped image! Save or share it however you like 🎉");
});

export default composer;
