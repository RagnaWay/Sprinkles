import { readFile, aliasChecker, inputChecker, addTime, addTime2, createReminder, sendBossAddedEmbed, getCurrentTime, getTimestamp, createBossList, sort, timeFormatHM } from '../util/common';
import Discord from 'discord.js';
import { BOSS_DATA_DIRECTORY, BOSS_HOLD_DIRECTORY} from '../globals/constants';
export const name = 'mvp';
export const description = 'Ragnarok Online MVP helper';
import moment from 'moment';

export const execute = (message, args, bossList) => {
  let input = '';
  let isFound = false;
  let isValidInput = false;
  let isValidAlias = true;
  let min = "";
  let max = "";
  let min2 = "";
  let max2 = "";
  let currentTime;
  let s;
  let arr = [];

  if (args[0] === 'add') {
    for (let i = 1; i < args.length; i++) {
      input += args[i] + " ";
    }

    isValidAlias = aliasChecker(input);
    isValidInput = inputChecker(input, isValidAlias);

    if(isValidInput) {
      for (let i = 0; i < bossList.bosses.length; i++) {
        if (bossList.bosses[i].bossName.toLowerCase().includes(input.toLowerCase().trim()) && !isValidAlias) {


          min = addTime2(bossList.bosses[i].minRespawnTimeInSeconds);
          max = addTime2(bossList.bosses[i].maxRespawnTimeInSeconds);
          
          min2 = addTime(bossList.bosses[i].minRespawnTimeInSeconds);
          max2 = addTime(bossList.bosses[i].maxRespawnTimeInSeconds);

          isFound = sendBossAddedEmbed(message, bossList.bosses[i], min2, max2, isFound);
          //createReminder(message, bossList.bosses[i], min2, max2);
          createReminder(message, bossList, min, max);
          currentTime = getCurrentTime();
          s = getTimestamp(currentTime);
          bossList.bosses[i].deathTime = s;
          
          bossList.bosses[i].min = min;
          bossList.bosses[i].max = max;
          break;
        } else if (isValidAlias) {
          for (let j = 0; j < bossList.bosses[i].alias.length; j++) {
            if (bossList.bosses[i].alias[j].toLowerCase() === input.toLowerCase().trim()) {
              min = addTime(bossList.bosses[i].minRespawnTimeInSeconds);
              max = addTime(bossList.bosses[i].maxRespawnTimeInSeconds);
              isFound = sendBossAddedEmbed(message, bossList.bosses[i], min, max, isFound);
              createReminder(message, bossList, min, max);
              
            }
          }
        }
    }
    }
    else {
      message.channel.send('Please enter at least **3 characters** or the correct **boss alias**');
    }
    if (!isFound && isValidInput) {
      message.channel.send('Boss not found! Please try again.');
    }
    
  }

  else if (args[0] === 'list') {

    let txt = "";
    let z;
    let y;
    let currentTime = getTimestamp(getCurrentTime());
    for (let i = 0; i < bossList.bosses.length; i++) {
      if(bossList.bosses[i].deathTime && bossList.bosses[i].min > currentTime){
        arr.push(bossList.bosses[i]);
      }
    }
    arr = sort(arr);
    
    if(arr){
      for(let i = 0; i < arr.length; i++) {
        z = timeFormatHM(arr[i].min);
        y = timeFormatHM(arr[i].max);
        txt += `🔹 **${arr[i].bossName}** | ${z} - ${y}\n`;
      }
      message.channel.send(txt);
      arr = [];
    }

    message.channel.send("There is no MVP list");
  }
  else if (args[0] === 'clear') {
    for (let i = 0; i < bossList.bosses.length; i++) {
      if(bossList.bosses[i].deathTime) {
        bossList.bosses[i].min = null;
        bossList.bosses[i].max = null;
      }
    }
    arr = null;
    message.channel.send("MVP list has been cleared!");
}
  else {
    message.channel.send("Command **does not exist**! Please enter `$help` for the list of bot commands.");
  }
  
};
