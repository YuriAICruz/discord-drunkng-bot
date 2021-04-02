import Discord from "discord.js";
import { playSound } from "../utils/audio.js";

/**
 * Testa o play da paradinha
 * @param {Discord.Client} client
 * @param {Discord.Message} msg
 * @return {Promise<Discord.StreamDispatcher>}
 */
async function testSound(client, msg) {
  const url = "https://www.myinstants.com/media/sounds/cavalo.mp3";

  try {
    await playSound(msg, url);
  } catch (err) {
    // ignora erro porque já foi dado feedback
  }
}

export default testSound;
