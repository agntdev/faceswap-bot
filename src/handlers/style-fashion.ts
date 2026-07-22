import { Composer } from "grammy";
import type { Ctx } from "../bot.js";
import { registerMainMenuItem, inlineButton, inlineKeyboard } from "../toolkit/index.js";

registerMainMenuItem({ label: "👗 Fashion", data: "style:fashion", order: 30 });

const composer = new Composer<Ctx>();

composer.callbackQuery("style:fashion", async (ctx) => {
  await ctx.answerCallbackQuery();
  if (!ctx.session.selfie_file_id) {
    await ctx.reply("No selfie yet — tap 📷 Upload Selfie to start!");
    return;
  }
  ctx.session.style_choice = "fashion";
  const backToMenu = inlineKeyboard([[inlineButton("⬅️ Back to menu", "menu:main")]]);
  await ctx.reply("👗 Fashion style selected! Processing your face swap…", {
    reply_markup: backToMenu,
  });
  await ctx.reply("Here's your swapped image! Save or share it however you like 🎉");
});

export default composer;
