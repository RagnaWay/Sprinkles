import {
  addTimeInSecondsToCalendarFormat,
  addTimeInSecondsToUnixFormat,
  checkAlias,
  checkInput,
  getCurrentTime,
  convertToTimestamp,
  convertUnixTimeToHMAFormat,
  sendBossAddedEmbed,
  sortArray,
} from '../util/common';
export const name = 'mvp';
export const description = 'Ragnarok Online MVP helper';

export const execute = (message, args, bossList) => {
  let input = '';
  let isFound = false;
  let isValidInput = false;
  let isValidAlias = true;
  let currentMVPList = [];
  let currentTimeInUnix = convertToTimestamp(getCurrentTime());
  let minRespawnTime;
  let maxRespawnTime;

  if (args[0] === 'add') {
    for (let i = 1; i < args.length; i++) {
      input += args[i] + ' ';
    }

    isValidAlias = checkAlias(input);
    isValidInput = checkInput(input, isValidAlias);

    if (isValidInput) {
      for (let i = 0; i < bossList.bosses.length; i++) {
        if (
          bossList.bosses[i].bossName.toLowerCase().includes(input.toLowerCase().trim()) &&
          !isValidAlias
        ) {
          isFound = setupBossAddedEmbed(
            bossList.bosses[i],
            bossList.bosses[i].minRespawnTimeScheduleInSeconds,
            bossList.bosses[i].maxRespawnTimeScheduleInSeconds,
            isFound,
            message,
          );

          //  change deathTime, minRespawn and maxRespawn in bossList file

          minRespawnTime = addTimeInSecondsToUnixFormat(
            bossList.bosses[i].minRespawnTimeScheduleInSeconds,
          );
          maxRespawnTime = addTimeInSecondsToUnixFormat(
            bossList.bosses[i].maxRespawnTimeScheduleInSeconds,
          );

          bossList.bosses[i].deathTime = currentTimeInUnix;
          bossList.bosses[i].minRespawnTime = minRespawnTime;
          bossList.bosses[i].maxRespawnTime = maxRespawnTime;
          break;
        } else if (isValidAlias) {
          for (let j = 0; j < bossList.bosses[i].alias.length; j++) {
            if (bossList.bosses[i].alias[j].toLowerCase() === input.toLowerCase().trim()) {
              isFound = setupBossAddedEmbed(
                bossList.bosses[i],
                bossList.bosses[i].minRespawnTimeScheduleInSeconds,
                bossList.bosses[i].maxRespawnTimeScheduleInSeconds,
                isFound,
                message,
              );
              //  change deathTime, minRespawn and maxRespawn in bossList file

              minRespawnTime = addTimeInSecondsToUnixFormat(
                bossList.bosses[i].minRespawnTimeScheduleInSeconds,
              );
              maxRespawnTime = addTimeInSecondsToUnixFormat(
                bossList.bosses[i].maxRespawnTimeScheduleInSeconds,
              );

              bossList.bosses[i].deathTime = currentTimeInUnix;
              bossList.bosses[i].minRespawnTime = minRespawnTime;
              bossList.bosses[i].maxRespawnTime = maxRespawnTime;
            }
          }
        }
      }
    } else {
      message.channel.send('Please enter at least **3 characters** or the correct **boss alias**');
    }
    if (!isFound && isValidInput) {
      message.channel.send(
        'Boss not found! Please try again with the correct **boss name** or **alias**.',
      );
    }
  } else if (args[0] === 'list') {
    let txt = '';
    let minTime;
    let maxTime;

    for (let i = 0; i < bossList.bosses.length; i++) {
      if (bossList.bosses[i].deathTime && bossList.bosses[i].minRespawnTime > currentTimeInUnix) {
        currentMVPList.push(bossList.bosses[i]);
      }
    }
    currentMVPList = sortArray(currentMVPList);

    if (currentMVPList.length > 0) {
      for (let i = 0; i < currentMVPList.length; i++) {
        minTime = convertUnixTimeToHMAFormat(currentMVPList[i].minRespawnTime);
        maxTime = convertUnixTimeToHMAFormat(currentMVPList[i].maxRespawnTime);
        txt += `🔹 **${currentMVPList[i].bossName}** | ${minTime} - ${maxTime}\n`;
      }
      message.channel.send(txt);
    } else {
      message.channel.send(
        '⚠️ There is **no** MVP list! Enter `$mvp add <bossname>` to add a MVP into the list',
      );
    }
  } else if (args[0] === 'clear') {
    for (let i = 0; i < bossList.bosses.length; i++) {
      if (bossList.bosses[i].deathTime) {
        bossList.bosses[i].minRespawnTime = null;
        bossList.bosses[i].maxRespawnTime = null;
        bossList.bosses[i].deathTime = null;
      }
    }
    currentMVPList = null;
    message.channel.send('✅ MVP List has been cleared **successfully**!');
  } else {
    message.channel.send(
      '⚠️ Command **does not exist**! Please enter `$help` for the list of bot commands.',
    );
  }
};

// * parameter = boss data
// * returns isFound result
const setupBossAddedEmbed = (
  bossList,
  minRespawnTimeScheduleInSeconds,
  maxRespawnTimeScheduleInSeconds,
  isFound,
  message,
) => {
  let minRespawnTimeInCalendar;
  let maxRespawnTimeInCalendar;

  minRespawnTimeInCalendar = addTimeInSecondsToCalendarFormat(minRespawnTimeScheduleInSeconds);
  maxRespawnTimeInCalendar = addTimeInSecondsToCalendarFormat(maxRespawnTimeScheduleInSeconds);

  isFound = sendBossAddedEmbed(
    message,
    bossList,
    minRespawnTimeInCalendar,
    maxRespawnTimeInCalendar,
    isFound,
  );

  return isFound;
};
