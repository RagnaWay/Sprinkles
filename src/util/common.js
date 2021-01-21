import fs from 'fs';
import Discord from 'discord.js';
import { BOSS_DATA_DIRECTORY } from '../globals/constants';
import moment from 'moment';

// * parameters = time
// * returns a number separated with commas
export const addNumberWithCommas = (x) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

// * parameters = time
// * returns the converted seconds into minutes or hours
export const convertSecondstoHMS = (time) => {
  time = Number(time);
  var h = Math.floor(time / 3600);
  var m = Math.floor((time % 3600) / 60);
  var s = Math.floor((time % 3600) % 60);

  var hDisplay = h > 0 ? h + (h == 1 ? ' hour ' : ' hours ') : '';
  var mDisplay = m > 0 ? m + (m == 1 ? ' minute ' : ' minutes ') : '';
  var sDisplay = s > 0 ? s + (s == 1 ? ' second' : ' seconds') : '';
  return hDisplay + mDisplay + sDisplay;
};

export const removePrefix = (input, prefix) => input.replace(prefix, '').trim();
export const tokenizeInput = (input, prefix) => removePrefix(input, prefix).split(' ');

// * parameter = file name
// * returns parsed data
export const readFile = (filename) => {
  const data = fs.readFileSync(filename);
  const result = JSON.parse(data);
  return result;
};

// * parameters = user input
// * returns TRUE if boss alias is found in the db
export const checkAlias = (input) => {
  let isFound = false;
  let bossList = readFile(BOSS_DATA_DIRECTORY);

  for (let i = 0; i < bossList.bosses.length; i++) {
    for (let j = 0; j < bossList.bosses[i].alias.length; j++) {
      if (bossList.bosses[i].alias[j].toLowerCase() === input.toLowerCase().trim()) {
        isFound = true;
      }
    }
  }
  return isFound;
};

// * parameters = user input and its result checked by checkAlias()
// * returns TRUE if input is correct
export const checkInput = (input, checkAliasResult) => {
  let isValidInput = true;

  if (input.length < 3 && !checkAliasResult) {
    isValidInput = false;
  }
  return isValidInput;
};

// * parameters = boss info
// * returns embed with boss info
export const createBossInfoEmbed = ({
  bossName,
  HP,
  race,
  property,
  location,
  minRespawnTimeScheduleInSeconds,
  maxRespawnTimeScheduleInSeconds,
  imageUrl,
  alias,
}) => {
  const bossInfoEmbed = new Discord.MessageEmbed()
    .setColor('#0xD8BFDD')
    .setTitle(bossName)
    .setDescription(`**Alias:** ${alias.join(', ')}`)
    .setThumbnail(imageUrl)
    .addFields(
      { name: 'HP', value: addNumberWithCommas(HP) || '--' },
      { name: 'Location', value: location || '--' },
      { name: 'Race', value: race || '--', inline: true },
      { name: '\u200B', value: '\u200B', inline: true },
      { name: 'Property', value: property || '--', inline: true },
      {
        name: 'Min. Respawn',
        value: convertSecondstoHMS(minRespawnTimeScheduleInSeconds) || '--',
        inline: true,
      },
      { name: '\u200B', value: '\u200B', inline: true },
      {
        name: 'Max. Respawn',
        value: convertSecondstoHMS(maxRespawnTimeScheduleInSeconds) || '--',
        inline: true,
      },
    );
  return bossInfoEmbed;
};

// * parameters = message, boss data, isFound
// * returns isFound result and sends boss info embed
export const sendBossInfoEmbed = (message, data, isFound) => {
  message.channel.send(createBossInfoEmbed(data));
  isFound = true;
  return isFound;
};

// * parameters = boss info
// * returns embed with boss info and its respawn times
export const createBossAddedEmbed = (
  { bossName, location, imageUrl },
  minRespawnTimeCalendarFormat,
  maxRespawnTimeCalendarFormat,
) => {
  const bossAddedEmbed = new Discord.MessageEmbed()
    .setColor('#0xf44336')
    .setTitle(bossName)
    .setThumbnail(imageUrl)
    .addFields(
      { name: 'Location', value: location || '--' },
      { name: 'Min. Respawn', value: minRespawnTimeCalendarFormat || '--', inline: true },
      { name: '\u200B', value: '\u200B', inline: true },
      { name: 'Max. Respawn', value: maxRespawnTimeCalendarFormat || '--', inline: true },
    )
    .setFooter(
      `Time of Death: ${getCurrentTimeInHMAFormat()}`,
      'https://emoji.gg/assets/emoji/9468_ghostplus.gif',
    );
  return bossAddedEmbed;
};

// * parameters = message, boss data, min respawn time, max respawn time, isFound
// * returns isFound result and sends boss info embed
export const sendBossAddedEmbed = (
  message,
  data,
  minRespawnTimeCalendarFormat,
  maxRespawnTimeCalendarFormat,
  isFound,
) => {
  message.channel.send(
    createBossAddedEmbed(data, minRespawnTimeCalendarFormat, maxRespawnTimeCalendarFormat),
  );
  message.channel.send(
    `MVP added successfully!\nI will remind you in **${convertSecondstoHMS(
      data.minRespawnTimeScheduleInSeconds,
    )}**!`,
  );
  isFound = true;
  return isFound;
};

// * returns current time in hh:mm A format
export const getCurrentTimeInHMAFormat = () => {
  let currentTime = moment();
  return moment(currentTime).format('hh:mm A');
};

// * returns current time in default format
export const getCurrentTime = () => {
  let currentTime = moment();
  return moment(currentTime);
};

// * returns time in unix format
export const convertToTimestamp = (time) => moment(time).unix();

// * parameters = time in unix
// * returns time in calendar format
export const convertUnixTimeToCalendarFormat = (time) => moment.unix(time).calendar();

// * parameters = time in unix
// * returns time in HMA format
export const convertUnixTimeToHMAFormat = (time) => moment.unix(time).format('hh:mm A');

// * parameters = time in seconds
// * returns = added time in calendar format
export const addTimeInSecondsToCalendarFormat = (time) => moment().add(time, 'seconds').calendar();

// * parameters = time in seconds
// * returns = added time in unix format
export const addTimeInSecondsToUnixFormat = (time) => moment().add(time, 'seconds').unix();

// * parameters = time in seconds
// * returns time in milliseconds
export const convertSecondsToMS = (seconds) => seconds * 1000;

// * parameters = file to be written, and data to be written
export const writeFile = (filename, data) => {
  let jsonString = JSON.stringify(data);
  fs.writeFile(filename, jsonString, (err) => {
    if (err) {
      console.log('Error in writing file!', err);
    } else {
      console.log(`Successfully wrote the file in ${filename}`);
    }
  });
};

// * parameters = boss data, message
// * sends the boss list with scheduled respawn times
export const createBossList = ({ bossName }, min, max, message) => {
  message.channel.send(`${bossName} | **Min** ${min} | **Max** ${max} \n`);
};

// * parameter = array
// * sends a sorted array
export const sortArray = (arr) =>
  arr.sort((a, b) => (a.minRespawnTime > b.minRespawnTime ? 1 : -1));
