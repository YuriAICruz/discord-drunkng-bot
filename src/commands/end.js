import Discord from "discord.js";
import { games } from "../gameLogic.js";

/**
 *
 * @param {Discord.Message} msg
 */
async function end(msg) {
  const guildId = msg.guild.id;

  if (!games.has(guildId)) {
    msg.reply("nenhum jogo rolando!");
    return;
  }
  games.get(guildId).result(msg);

  msg.channel.send("jogo fechado");

  games.delete(guildId);
}

export default end;
