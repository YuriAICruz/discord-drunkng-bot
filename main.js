import { Client } from "discord.js";
import { end, help, start } from "./src/commands/index.js";

const TOKEN = process.env.TOKEN;

const client = new Client();

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", (msg) => {
  const txtMsg = msg.cleanContent;

  const cmds = txtMsg.split(/\s+/);

  if (cmds[0] != "game") {
    return;
  }

  const channel = msg?.member?.voice?.channel;

  if (!channel) return;

  switch (cmds[1]) {
    case "start":
      start(client, msg, cmds.slice(2));
      break;
    case "end":
      end(msg);
      break;
    case "help":
      help(msg);
      break;
  }
});

client.login(TOKEN);
