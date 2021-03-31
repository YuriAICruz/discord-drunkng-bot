import Discord from "discord.js";
import { games } from "../gameLogic.js";
import GameLogic from "../classes/GameLogicValeno.js";

/**
 * @param {Discord.Client} client
 * @param {Discord.Message} msg
 * @param {Array<string>} cmds
 */
async function start(client, msg, cmds) {
  const guildId = msg.guild.id;
  if (!games.has(guildId)) {
    games.set(guildId, new GameLogic(client, cmds.length > 0 ? cmds[0] : 10));
  }
  games.get(guildId).start(msg);
}

export default start;
