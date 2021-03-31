const Discord = require("discord.js");
const fs = require("fs/promises");

const client = new Discord.Client();

/**
 * @type {Discord.GuildMember | undefined}
 */
let lastMember;

/**
 * @type {string}
 */
let currentPassword;

let gameRunning = false;
let passwordSize = 5;

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", (msg) => {
  const txtMsg = msg.cleanContent;

  const cmds = txtMsg.split(/\s+/);

  if (cmds[0] != "game") {
    if (gameRunning) {
      gameLogic(msg);
      return;
    }
    return;
  }

  const channel = msg?.member?.voice?.channel;

  if (!channel) return;

  const members = getMembers(channel);

  switch (cmds[1]) {
    case "start":
      start(msg, members, cmds.slice(2));
      break;
    case "end":
      end(msg);
      break;
    case "help":
      help(msg);
      break;
  }
});

client.login("ODI2NjE1MzQyNzUwNjI5OTUw.YGPDhw.gIQejvkv5YO2SmqOoeJYVqV76GY");

/**
 *
 * @param {Discord.Message} msg
 */
async function help(msg) {
  const helpText = await fs
    .readFile("./help.txt", { encoding: "utf-8" })
    .catch((e) => {
      console.log("Erro: ", e);
    });
  msg.reply(helpText);
}

/**
 *
 * @param {Discord.Message} msg
 * @param {Discord.Collection<string, Discord.GuildMember>} members
 * @param {Array<string>} cmds
 */
async function start(msg, members, cmds) {
  if (gameRunning) {
    msg.reply("O jogo ja está rolando.");
    return;
  }
  if (members.size <= 1) {
    msg.reply("Não pode brincar sozinho.");
    return;
  }

  gameRunning = true;

  const newMember = randomMember(members);

  currentPassword = createPassword();

  await respond(msg, newMember);

  lastMember = newMember;
}

/**
 *
 * @param {Discord.GuildMember} members
 * @param {Discord.GuildMember} newMember
 * @returns
 */
function randomMember(members) {
  let newMember;
  do {
    const rnd = Math.floor(Math.random() * members.size);
    newMember = members.array()[rnd];
  } while (newMember == lastMember);
  return newMember;
}

async function respond(msg, newMember) {
  msg.channel.send(`<@${newMember.id}>`);
  msg.channel.send("3");
  await sleep(1000);
  msg.channel.send("2");
  await sleep(1000);
  msg.channel.send("1");
  await sleep(1000);
  msg.channel.send(`digite: **${currentPassword}**`);
}

/**
 *
 * @param {Discord.Message} msg
 */
function gameLogic(msg) {
  if (msg.member != lastMember) {
    return;
  }

  if (msg.cleanContent != currentPassword) {
    msg.reply("Você errou!");
    return;
  }

  next(msg);
}
/**
 *
 * @param {Discord.Message} msg
 */
async function end(msg) {
  if (!gameRunning) return;

  gameRunning = false;
  lastMember = undefined;

  msg.channel.send("jogo fechado");
}

/**
 *
 * @param {Discord.Message} msg
 */
async function next(msg) {
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

  const newMember = randomMember(members);

  currentPassword = createPassword();

  await respond(msg, newMember);

  lastMember = newMember;
}

/**
 * @returns {string}
 */
function createPassword() {
  const chars = "qwertyuiopasdfghjklçzxcvbnm1234567890^/*-+.@#$!%&()_=";
  let word = [];
  for (let i = 0; i < passwordSize; i++) {
    word.push(chars[Math.floor(Math.random() * chars.length)]);
  }

  return word.join("");
}

/**
 *
 * @param {Discord.VoiceChannel} channel
 * @returns {Discord.Collection<string, Discord.GuildMember>}
 */
function getMembers(channel) {
  return channel.members.filter((x) => !x.user.bot);
}

/**
 *
 * @param {Number} ms
 */
async function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
