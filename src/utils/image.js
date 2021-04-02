import { default as textToImage } from "text-to-image";
import Discord from "discord.js";

/**
 *
 * @param {Discord.Message} msg
 * @param {String} text
 */
export async function sendImage(msg, text) {
  if (msg.member.user.bot) return;

  let dataUri = await textToImage.generate(text, {
    debug: false,
    maxWidth: 720,
    fontSize: 56,
    fontFamily: "comic sans",
    lineHeight: 64,
    margin: 5,
    bgColor: "white",
    textColor: "black",
  });

  const sfbuff = Buffer.from(dataUri.split(",")[1], "base64");
  const sfattach = new Discord.MessageAttachment(sfbuff, "output.png");
  msg.channel.send(sfattach);
}
