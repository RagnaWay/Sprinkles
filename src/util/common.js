import fs from 'fs';
import Discord from 'discord.js';
import { BOSS_DATA_DIRECTORY } from '../globals/constants';

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

// * returns the boss info as object
export const readBossData = () => {
  const data = fs.readFileSync(BOSS_DATA_DIRECTORY);
  const bossList = JSON.parse(data);
  return bossList;
}

// * parameters = user input
// * returns TRUE if boss alias is found in the db
export const aliasChecker = (param) => {
  let isFound = false;
  let bossList = readBossData();

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