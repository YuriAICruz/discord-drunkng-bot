// @ts-check
import Discord from "discord.js";
import { createSignal, sleep } from "../utils/time.js";
import { playSound, audioClips } from "../utils/audio.js";
import { getMembers, getRandomMember } from "../utils/discord.js";
import { sendImage } from "../utils/image.js";

import {
  createSyllabicPassword,
  createAlphanumericPassword,
} from "../utils/word.js";

class GameLogic {
  /**
   * @param {Discord.Client} client
   * @param {Number} passwordLength
   */
  constructor(client, passwordLength) {
    this.client = client;
    this.passwordLength = passwordLength;
    /** @type {Boolean|Number} The thing the thangs the thong */
    this.running = false;
    /** @type {Boolean|Number}*/
    this.awaitingAnswer = false;
    /** @type {String} */
    this.currentPassword = undefined;
    /** @type {Discord.GuildMember} */
    this.lastMember = undefined;
    /** @type {Map<string,Number>} */
    this.score = new Map();
    /** @type {Discord.StreamDispatcher} */
    this.audioDispatcher = undefined;

    /** @type {import("../utils/time.js").Signal} */
    this.gameSignal = createSignal();

    /** @type {import("../utils/time.js").Signal} */
    this.timerSignal = createSignal();

    this._checkRound = this.checkRound.bind(this);
  }

  /**
   *
   * @param {Discord.Message} msg
   * @returns
   */
  start(msg) {
    if (this.running) {
      msg.reply("O jogo ja está rolando.");
      return;
    }

    this.running = true;

    this.next(msg);
  }

  /**
   *
   * @param {Discord.Message} msg
   */
  result(msg) {
    if (!this.running) return;

    this.running = false;

    if (this.audioDispatcher) this.audioDispatcher.pause();

    this.gameSignal.abort = true;

    const todoMundo = Array.from(this.score.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([nome, valor], index) => `${index + 1} - ${nome}: ${valor}`)
      .join("\n");

    msg.channel.send("Resultado:\n" + todoMundo);

    if (this.awaitingAnswer) this.client.off("message", this._checkRound);
  }

  /**
   *
   * @param {Discord.Message} msg
   */
  async next(msg) {
    if (!this.running) {
      return;
    }

    const channel = msg?.member?.voice?.channel;

    if (!channel) {
      msg.reply("você não está em um canal de voz");
      return;
    }

    const members = getMembers(channel);

    if (members.size <= 1) {
      msg.reply("Não pode brincar sozinho.");
      return;
    }

    const newMember = getRandomMember(members, this.lastMember);

    this.currentPassword = createSyllabicPassword(this.passwordLength);

    await this.respond(msg, newMember);

    this.lastMember = newMember;

    this.awaitingAnswer = true;

    this.startTimer(msg);

    this.client.on("message", this._checkRound);
  }

  /**
   *
   * @param {Discord.Message} msg
   */
  async checkRound(msg) {
    if (!this.awaitingAnswer || !this.running) {
      this.client.off("message", this._checkRound);
      return;
    }

    if (msg.member != this.lastMember) {
      return;
    }

    this.timerSignal.abort = true;

    this.client.off("message", this._checkRound);
    this.awaitingAnswer = false;

    if (msg.cleanContent.toUpperCase() != this.currentPassword) {
      await this.missed(msg, audioClips.errou);
    } else {
      await this.right(msg);
    }

    await sleep(3000, this.gameSignal);
    this.next(msg);
  }

  /**
   *
   * @param {Discord.Message} msg
   */
  async right(msg) {
    try {
      this.audioDispatcher = await playSound(msg, audioClips.acertou);
    } catch (err) {
      // ignora erro porque já foi dado feedback
    }
    msg.reply("acertou");

    this.addScore(msg.member.nickname, 1);
  }

  /**
   *
   * @param {Discord.Message} msg
   */
  async missed(msg, clip) {
    try {
      this.audioDispatcher = await playSound(msg, clip);
    } catch (err) {
      // ignora erro porque já foi dado feedback
    }
    msg.channel.send(`<@${this.lastMember.id}>Você errou!`);

    this.addScore(msg.member.nickname, 0);
  }

  /**
   *
   * @param {string} id
   * @param {Number} value
   */
  addScore(id, value) {
    if (this.score.has(id)) this.score.set(id, this.score.get(id) + value);

    this.score.set(id, value);
  }

  /**
   * @param {Discord.Message} msg
   * @param {Discord.GuildMember} newMember
   */
  async respond(msg, newMember) {
    msg.channel.send(`<@${newMember.id}>`);

    try {
      this.audioDispatcher = await playSound(msg, audioClips.startTimer);
    } catch (err) {
      // ignora erro porque já foi dado feedback
    }

    const [countdownMsg] = await Promise.all([
      msg.channel.send("_3…_"),
      sleep(1000, this.gameSignal),
    ]);
    await Promise.all([
      countdownMsg.edit("_3… 2…_"),
      sleep(1000, this.gameSignal),
    ]);
    await Promise.all([
      countdownMsg.edit("_3… 2… 1…_"),
      sleep(1000, this.gameSignal),
    ]);
    await countdownMsg.edit(`Vai filhão`);
    try {
      this.audioDispatcher = await playSound(msg, audioClips.valendo);
    } catch (err) {
      // ignora erro porque já foi dado feedback
    }
    await sendImage(msg, this.currentPassword);
  }

  /**
   *
   * @param {Discord.Message} msg
   */
  async startTimer(msg) {
    if (!this.running) return;

    this.timerSignal.abort = false;

    try {
      this.audioDispatcher = await playSound(msg, audioClips.timer);
    } catch (err) {
      // ignora erro porque já foi dado feedback
    }

    await sleep(10000, this.timerSignal);

    if (!this.awaitingAnswer || !this.running) {
      return;
    }

    this.client.off("message", this._checkRound);

    await this.missed(msg, audioClips.timesUp);

    await sleep(3000, this.gameSignal);
    this.next(msg);
  }
}

export default GameLogic;
/*

Pseudocoisa

Problemas:
* Quando dá `game end` ele ainda entende o chute

start() {
  setup das paradas
  next()
}

end() {
  OFF awaitResponse()
  toca "tchau querida — Pai"
}

next() {
  escolhe nova pessoa
  sorteia a string
  faz o countdown
  mostra a string
  toca "Banheira do Gugu OST"
  ON awaitResponse()
  contador()
}

contador(){
  toca "tema passa ou repassa"
  conta tempo restante para responder
  tempo termina:
    toca "não consegue - silvio"
    OFF awaitResponse()
    next()
}

awaitResponse() {
  é a pessoa correta?
  não:
    ignora
  sim:
    OFF awaitResponse()
    a resposta é correta?
    sim:
      toca "Acertou miseravel"
    não:
      toca "Erou — SILVA, Fausto"
    next()
}

*/
