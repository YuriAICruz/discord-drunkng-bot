import Discord from "discord.js";

/**
 *
 * @param {Discord.VoiceChannel} channel
 * @returns {Discord.Collection<string, Discord.GuildMember>}
 */
export function getMembers(channel) {
  return channel.members.filter((x) => !x.user.bot);
}

/**
 *
 * @param {Discord.Collection<string, Discord.GuildMember>} members
 * @param {Discord.GuildMember} lastMember
 * @returns
 */
export function getRandomMember(members, lastMember) {
  let newMember;

  do {
    const rnd = Math.floor(Math.random() * members.size);
    newMember = members.array()[rnd];
  } while (newMember == lastMember);
  return newMember;
}
