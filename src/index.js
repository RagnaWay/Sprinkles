import Discord from 'discord.js';
import { BOT_NAME, DEFAULT_COMMAND_PREFIX, events } from './globals/constants';
import * as commandManager from './util/commandManager';

const discordClient = new Discord.Client();

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
    discordClient.commands.get('mvp').execute(message, args);
  } else if (command == 'help') {
    discordClient.commands.get('help').execute(message, args);
  } else if (command == 'info') {
    discordClient.commands.get('info').execute(message, args);
  } else {
    message.channel.send(
      "Command **does not exist**! Please enter `$help` for the list of bot commands.",
    );
  }
};

discordClient.once(events.READY, onReady);
discordClient.on(events.MESSAGE, onMessageReceived);
discordClient.login(`${process.env.TOKEN}`);
