const Discord = require("discord.js");
const fs = require("fs/promises");

const client = new Discord.Client();

/**
 * @type {Discord.GuildMember | undefined}
 */
let lastMember;

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", (msg) => {
  const txtMsg = msg.cleanContent;

  const cmds = txtMsg.split(/\s+/);

  if (cmds[0] != "game") return;

  const channel = msg?.member?.voice?.channel;

  if (!channel) return;

  const members = getMembers(channel);

  switch (cmds[1]) {
    case "start":
      start(msg, members, cmds.slice(2));
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
function start(msg, members, cmds) {
  if (members.size <= 1) {
    msg.reply("Não pode brincar sozinho");
    return;
  }

  let newMember;
  do {
    const rnd = Math.floor(Math.random() * members.size);
    newMember = members.array()[rnd];
  } while (newMember == lastMember);

  msg.channel.send(`<@${newMember.id}>`);

  lastMember = newMember;
}

/**
 *
 * @param {Discord.VoiceChannel} channel
 * @returns {Discord.Collection<string, Discord.GuildMember>}
 */
function getMembers(channel) {
  return channel.members.filter((x) => !x.user.bot);
}
