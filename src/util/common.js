import fs from 'fs';
import Discord from 'discord.js';
import { BOSS_DATA_DIRECTORY, BOSS_HOLD_DIRECTORY } from '../globals/constants';
import moment from 'moment';

// * parameters = time
// * returns a number separated with commas
export const numberWithCommas = (x) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

// * parameters = time
// * converts seconds into minutes or hours
export const secondsToHms = (time) => {
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
}

// * parameters = user input
// * returns TRUE if boss alias is found in the db
export const aliasChecker = (param) => {
  let isFound = false;
  let bossList = readFile(BOSS_DATA_DIRECTORY);

  for (let i = 0; i < bossList.bosses.length; i++) {
    for (let j = 0; j < bossList.bosses[i].alias.length; j++) {
      if (bossList.bosses[i].alias[j].toLowerCase() === param.toLowerCase().trim()) {
        isFound = true;
      }
    }
  }
  return isFound;
}

// * parameters = user input and its result checked by aliasChecker()
// * returns TRUE if input is correct 
export const inputChecker = (param, aliasCheckerResult) => {
  let isValidInput = true;

  if (param.length < 3 && !aliasCheckerResult) {
    isValidInput = false;
  }
  return isValidInput;

}

// * parameters = boss info
// * returns embed
export const createBossInfoEmbed = ({bossName, HP, race, property, location, minRespawnTimeInSeconds, maxRespawnTimeInSeconds, imageUrl, alias}) => {
  const bossEmbed = new Discord.MessageEmbed()
  .setColor('#0xD8BFDD')
  .setTitle(bossName)
  .setDescription(`Alias: [${alias.join(', ')}]`)
  .setThumbnail(imageUrl)
  .addFields(
    { name: 'HP', value: numberWithCommas(HP) || '--' },
    { name: 'Location', value: location || '--' },
    { name: 'Race', value: race || '--', inline: true },
    { name: '\u200B', value: '\u200B', inline: true },
    { name: 'Property', value: property || '--', inline: true },
    { name: 'Min. Respawn', value: secondsToHms(minRespawnTimeInSeconds) || '--', inline: true },
    { name: '\u200B', value: '\u200B', inline: true },
    { name: 'Max. Respawn', value: secondsToHms(maxRespawnTimeInSeconds) || '--', inline: true },
  );
  return bossEmbed;
}

export const sendBossInfoEmbed = (message, data, isFound) => {
  message.channel.send(createBossInfoEmbed(data));
  return isFound = true;
}

// * parameters = boss info
// * returns embed
export const createBossAddedEmbed = ({bossName, location, imageUrl}, min, max) => {
  const bossEmbed = new Discord.MessageEmbed()
  .setColor('#0xf44336')
  .setTitle(bossName)
  .setThumbnail(imageUrl)
  .addFields(
    { name: 'Location', value: location || '--' },
    { name: 'Min. Respawn', value: min || '--', inline: true },
    { name: '\u200B', value: '\u200B', inline: true },
    { name: 'Max. Respawn', value: max || '--', inline: true }
  )
  .setFooter(`Time of Death: ${getTime()}`, "https://emoji.gg/assets/emoji/9468_ghostplus.gif");
  return bossEmbed;
}

export const sendBossAddedEmbed = (message, data, min, max, isFound) => {
  message.channel.send(createBossAddedEmbed(data, min, max));
  message.channel.send(`I will remind you in **${secondsToHms(data.minRespawnTimeInSeconds)}**!`);
  return isFound = true;
}
// * returns current time in hh:mm A format
export const getTime = () => {
  let currentTime = moment();
  return moment(currentTime).format("hh:mm A");
}

export const getCurrentTime = () => {
  let currentTime = moment();
  return moment(currentTime);
}

export const getTimestamp = (time) => {
  return moment(time).unix();
}

export const timeCalendarFormat = (time) => {
  return moment.unix(time).calendar()
}

export const timeFormatHM = (time) => {
  return moment.unix(time).format("hh:mm A");
}

// * parameters = time
// * returns = added time
export const addTime = (time) => {
  return moment().add(time,'seconds').calendar();
}

export const addTime2 = (time) => {
  return moment().add(time,'seconds').unix();
}

// * parameters = time in seconds
// * returns time in milliseconds
export const convertSecondsToMS = (seconds) => {
  return seconds * 1000;
}

export const createReminder = (message, bossList, min, max) => {
  /*setTimeout(function(){
    const remindEmbed = new Discord.MessageEmbed()
    .setColor('#0x43a047')
    .setTitle(`${bossName} respawn time has started! `)
    .setThumbnail(imageUrl)
    .addFields(
      { name: 'Min. Respawn', value: min || '--', inline: true },
      { name: 'Max. Respawn', value: max || '--', inline: true }
    )
    .setFooter(`Current Time: ${getTime()}`, "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/alarm-clock_23f0.png");
    message.channel.send(remindEmbed);
  }, convertSecondsToMS(minRespawnTimeInSeconds));*/
 

  setInterval(function(){
    let currentTime = getTimestamp(getCurrentTime());
    for(let i = 0; i < bossList.bosses.length; i++) {
      if(bossList.bosses[i].min <= currentTime) {
        const remindEmbed = new Discord.MessageEmbed()
        .setColor('#0x43a047')
        .setTitle(`${bossList.bosses[i].bossName} respawn time has started! `)
        .setThumbnail(bossList.bosses[i].imageUrl)
        .addFields(
          { name: 'Min. Respawn', value: min || '--', inline: true },
          { name: 'Max. Respawn', value: max || '--', inline: true }
        )
        .setFooter(`Current Time: ${getTime()}`, "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/alarm-clock_23f0.png");
        message.channel.send(remindEmbed);
      }
    }
  }, 1000);
}

export const writeFile = (filename, data) => {
  let jsonString = JSON.stringify(data);
  fs.writeFile(filename, jsonString, err => {
    if (err) {
        console.log('Error writing file', err)
    } else {
        console.log('Successfully wrote file')
    }
})
}

export const createBossList = ({bossName}, min, max, message) => {
  message.channel.send(`${bossName} | **Min** ${min} | **Max** ${max} \n`);
}

export const sort = (arr) => {
  return arr.sort((a, b) => (a.min > b.min) ? 1 : -1 )
}