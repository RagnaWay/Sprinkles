import fs from 'fs';
import Discord from 'discord.js';
import { COMMANDS_DIRECTORY } from '../globals/constants';

const commandFiles = fs.readdirSync(COMMANDS_DIRECTORY)
.filter((fileName) => fileName.endsWith('.js'));

export const loadCommands = async (discordClient) => {
  discordClient.commands = new Discord.Collection();
  console.log("Loading commands...");
  for (const fileName of commandFiles) {
    const command = await import(`../commands/${fileName}`);
    discordClient.commands.set(command.name, command);
  }
  console.log("Loaded all commands...");
};
