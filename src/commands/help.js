import { readFile } from "fs/promises";

/**
 * @param {Discord.Message} msg
 */
async function help(msg) {
  const helpText = await readFile("./help.txt", { encoding: "utf-8" }).catch(
    (e) => {
      console.log("Erro: ", e);
    }
  );
  msg.reply(helpText);
}

export default help;
