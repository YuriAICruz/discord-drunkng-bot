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
    /** @type {Boolean|Number}*/
    this.awaitingAnswer = false;
    /** @type {String|Number} */
    this.currentPassword = undefined;
    /** @type {Discord.GuildMember} */
    this.lastMember = undefined;

    this.checkRound = this.checkRound.bind(this);
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

    if (this.awaitingAnswer) this.client.off("message", this.checkRound);
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

    this.awaitingAnswer = true;
    this.client.on("message", this.checkRound);
  }

  /**
   *
   * @param {Discord.Message} msg
   */
  checkRound(msg) {
    if (msg.member != this.lastMember) {
      return;
    }

    this.client.off("message", this.checkRound);
    this.awaitingAnswer = false;

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

    const [countdownMsg] = await Promise.all([
      msg.channel.send("_3…_"),
      sleep(1000),
    ]);
    await Promise.all([countdownMsg.edit("_3… 2…_"), sleep(1000)]);
    await Promise.all([countdownMsg.edit("_3… 2… 1…_"), sleep(1000)]);
    await countdownMsg.edit(`digite: **${this.currentPassword}**`);

    // msg.channel.send("2");
    // msg.channel.send("1");
    // await sleep(1000);
    // msg.channel.send(`digite: **${this.currentPassword}**`);
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
