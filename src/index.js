import Discord from 'discord.js';
import { BOT_NAME, DEFAULT_COMMAND_PREFIX, events } from './globals/constants';
import { readFile, writeFile } from './util/common';
import { BOSS_DATA_DIRECTORY, BOSS_HOLD_DIRECTORY} from './globals/constants';
import * as commandManager from './util/commandManager';

const discordClient = new Discord.Client();
const bossList = readFile(BOSS_HOLD_DIRECTORY);

const onReady = () => {
  commandManager.loadCommands(discordClient).then(onLoad);
};

const onLoad = () => {
  console.log(`${BOT_NAME} is online!`);
};

const onMessageReceived = (message) => {
  if (!message.content.startsWith(DEFAULT_COMMAND_PREFIX) || message.author.bot) return;

  const args = message.content.slice(DEFAULT_COMMAND_PREFIX.length).split(/ +/);
  const command = args.shift().toLowerCase();

  if (command == 'mvp') {
    discordClient.commands.get('mvp').execute(message, args, bossList);
  } else if (command == 'help') {
    discordClient.commands.get('help').execute(message, args);
  } else if (command == 'info') {
    discordClient.commands.get('info').execute(message, args, bossList);
  } else {
    message.channel.send(
      "Command **does not exist**! Please enter `$help` for the list of bot commands.",
    );
  }
};

discordClient.once(events.READY, onReady);
discordClient.on(events.MESSAGE, onMessageReceived);
discordClient.login(`${process.env.TOKEN}`);

setInterval(function(){ 
  writeFile(BOSS_HOLD_DIRECTORY, bossList); }, 30000);