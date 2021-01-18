import Discord from 'discord.js';
import { BOT_NAME, DEFAULT_COMMAND_PREFIX, events } from './globals/constants';
import {
  readFile,
  convertToTimestamp,
  getCurrentTime,
  writeFile,
  getCurrentTimeInHMAFormat,
  convertUnixTimeToCalendarFormat,
} from './util/common';
import { BOSS_DATA_DIRECTORY } from './globals/constants';
import * as commandManager from './util/commandManager';

const discordClient = new Discord.Client();
const bossList = readFile(BOSS_DATA_DIRECTORY);
const onReady = () => {
  commandManager.loadCommands(discordClient).then(onLoad);
};

const onLoad = () => {
  console.log(`${BOT_NAME} is online!`);
};

const checkMvpRespawnTimers = (message) => {
  setInterval(() => {
    let currentTime = convertToTimestamp(getCurrentTime());
    for (let i = 0; i < bossList.bosses.length; i++) {
      if (bossList.bosses[i].deathTime && currentTime >= bossList.bosses[i].minRespawnTime) {
        const remindEmbed = new Discord.MessageEmbed()
          .setColor('#0x43a047')
          .setTitle(`${bossList.bosses[i].bossName} respawn schedule is now **UP!** `)
          .setThumbnail(bossList.bosses[i].imageUrl)
          .addFields(
            {
              name: 'Min. Respawn',
              value: convertUnixTimeToCalendarFormat(bossList.bosses[i].minRespawnTime) || '--',
              inline: true,
            },
            {
              name: 'Max. Respawn',
              value: convertUnixTimeToCalendarFormat(bossList.bosses[i].maxRespawnTime) || '--',
              inline: true,
            },
          )
          .setFooter(
            `Current Time: ${getCurrentTimeInHMAFormat()}`,
            'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/alarm-clock_23f0.png',
          );
        message.channel.send(remindEmbed);
        bossList.bosses[i].deathTime = null;
        bossList.bosses[i].minRespawnTime = null;
        bossList.bosses[i].maxRespawnTime = null;
      }
    }
  }, 1000);

  setInterval(function () {
    writeFile(BOSS_DATA_DIRECTORY, bossList);
  }, 30000);
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
      'Command **does not exist**! Please enter `$help` for the list of bot commands.',
    );
  }
};

discordClient.once(events.READY, onReady);
discordClient.on(events.MESSAGE, onMessageReceived);
discordClient.on(events.MESSAGE, checkMvpRespawnTimers);
discordClient.login(`${process.env.TOKEN}`);
