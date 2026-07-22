import { Composer } from "grammy";
import type { Ctx } from "../bot.js";
import { registerMainMenuItem, inlineButton, inlineKeyboard } from "../toolkit/index.js";

registerMainMenuItem({ label: "❤️ Love", data: "style:love", order: 20 });

const composer = new Composer<Ctx>();

composer.callbackQuery("style:love", async (ctx) => {
  await ctx.answerCallbackQuery();
  if (!ctx.session.selfie_file_id) {
    await ctx.reply("No selfie yet — tap 📷 Upload Selfie to start!");
    return;
  }
  ctx.session.style_choice = "love";
  const backToMenu = inlineKeyboard([[inlineButton("⬅️ Back to menu", "menu:main")]]);
  await ctx.reply("❤️ Love style selected! Processing your face swap…", {
    reply_markup: backToMenu,
  });
  await ctx.reply("Here's your swapped image! Save or share it however you like 🎉");
});

export default composer;
