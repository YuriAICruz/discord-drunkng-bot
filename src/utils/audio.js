import Discord from "discord.js";

/**
 * @enum {String}
 */
export const audioClips = {
  errou: "https://www.myinstants.com/media/sounds/faustao-errou.mp3",
  acertou: "https://www.myinstants.com/media/sounds/acertou-ah-miseravi.mp3",
  tchau: "https://www.myinstants.com/media/sounds/tchau-querida.mp3",
  tempoEsgotado:
    "https://www.myinstants.com/media/sounds/gugu-tempo-esgotado.mp3",
  startTimer: "https://www.myinstants.com/media/sounds/banhaira_3s.mp3",
  valendo:
    "https://www.myinstants.com/media/sounds/valendo-online-audio-converter.mp3",
  timesUp:
    "https://www.myinstants.com/media/sounds/nao-consegue-ne_nF0dk58.mp3",
  timer: "https://www.myinstants.com/media/sounds/ten-sec-timer.mp3",
};

/**
 * Toca um som.
 * @param {Discord.Message} msg
 * @param {audioClips} url - A URL do áudio. (pode ser direto do myinstants)
 * @returns {Discord.StreamDispatcher}
 */
export async function playSound(msg, url) {
  /** @type {Discord.VoiceChannel} */
  let voice;
  /** @type {Discord.VoiceConnection} */
  let connection;

  try {
    voice = msg?.member?.voice?.channel;
    if (!voice) {
      msg.reply("Você não está conectado em nenhum canal de voz.");
      throw new Error("Usuário não conectado a canal de voz.");
    }
    if (!voice.joinable) {
      msg.reply("Eu não consigo conectar nesse canal de voz.");
      throw new Error("Canal privado.");
    }

    connection = await voice.join();
  } catch (err) {
    msg.reply("Não rolou conexão, mina!");
    throw new Error("Erro ao conectar no canal de voz.", err);
  }

  return connection.play(url);
}
