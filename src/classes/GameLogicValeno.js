// @ts-check
import Discord from "discord.js";
import { sleep } from "../utils/time.js";

class GameLogic {
  static PASSWORD_CHARS =
    "qwertyuiopasdfghjklçzxcvbnm1234567890^/*-+.@#$!%&()_=";

  /**
   * @param {Discord.Client} client
   * @param {Number} passwordLength
   */
  constructor(client, passwordLength) {
    this.client = client;
    this.passwordLength = passwordLength;
    /** @type {Boolean|Number} The thing the thangs the thong */
    this.running = false;
    /** @type {String|Number} */
    this.currentPassword = undefined;
    /** @type {Discord.GuildMember} */
    this.lastMember = undefined;
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

    msg.channel.send("Resultado: ??????");
  }

  /**
   *
   * @param {Discord.Message} msg
   */
  async next(msg) {
    const channel = msg?.member?.voice?.channel;

    if (!channel) {
      msg.reply("você não está em um canal de voz");
      return;
    }

    const members = this.getMembers(channel);

    if (members.size <= 1) {
      msg.reply("Não pode brincar sozinho.");
      return;
    }

    const newMember = this.getRandom(members);

    this.currentPassword = this.createPassword();

    await this.respond(msg, newMember);

    this.lastMember = newMember;

    this._checkRound = this.checkRound.bind(this);
    this.client.on("message", this._checkRound);
  }

  /**
   *
   * @param {Discord.Message} msg
   */
  checkRound(msg) {
    if (msg.member != this.lastMember) {
      return;
    }

    this.client.off("message", this._checkRound);

    if (msg.cleanContent != this.currentPassword) {
      msg.reply("Você errou!");
    }

    this.next(msg);
  }

  /**
   * @returns {string}
   */
  createPassword() {
    const chars = GameLogic.PASSWORD_CHARS;
    let word = [];
    for (let i = 0; i < this.passwordLength; i++) {
      word.push(chars[Math.floor(Math.random() * chars.length)]);
    }

    return word.join("");
  }

  /**
   * @param {Discord.Message} msg
   * @param {Discord.GuildMember} newMember
   */
  async respond(msg, newMember) {
    msg.channel.send(`<@${newMember.id}>`);
    msg.channel.send("3");
    await sleep(1000);
    msg.channel.send("2");
    await sleep(1000);
    msg.channel.send("1");
    await sleep(1000);
    msg.channel.send(`digite: **${this.currentPassword}**`);
  }

  /**
   *
   * @param {Discord.Collection<string, Discord.GuildMember>} members
   * @returns
   */
  getRandom(members) {
    let newMember;

    do {
      const rnd = Math.floor(Math.random() * members.size);
      newMember = members.array()[rnd];
    } while (newMember == this.lastMember);
    return newMember;
  }

  /**
   *
   * @param {Discord.VoiceChannel} channel
   * @returns {Discord.Collection<string, Discord.GuildMember>}
   */
  getMembers(channel) {
    return channel.members.filter((x) => !x.user.bot);
  }
}

export default GameLogic;
/*

Pseudocoisa

start() {
  escolhe nova pessoa
  sorteia string
  faz o countdown
  mostra a string
  ON awaitResponse()
}

awaitResponse() {
  a resposta é correta?
  sim:
    escolhe nova pessoa
    sorteia a string
  não:
    você errou
  OFF  awaitResponse()
}

*/
