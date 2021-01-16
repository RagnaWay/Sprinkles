import Discord from 'discord.js';
import { readBossData, aliasChecker, inputChecker, createBossInfoEmbed } from '../util/common';

export const name = 'info';
export const description = 'To check boss information';

export const execute = (message, args) => {
  let input = args.join(' ');
  let isFound = false;
  let isValidInput = false;
  let isValidAlias = true;
  let bossList = readBossData();

  isValidAlias = aliasChecker(input);
  isValidInput = inputChecker(input, isValidAlias);
  
  if(isValidInput) {
    for (let i = 0; i < bossList.bosses.length; i++) {
      if (bossList.bosses[i].bossName.toLowerCase().includes(input.toLowerCase().trim()) && !isValidAlias) {
        message.channel.send(createBossInfoEmbed(bossList.bosses[i]));
        isFound = true;
      } else if (isValidAlias) {
        for (let j = 0; j < bossList.bosses[i].alias.length; j++) {
          if (bossList.bosses[i].alias[j].toLowerCase() === input.toLowerCase().trim()) {
            message.channel.send(createBossInfoEmbed(bossList.bosses[i]));
            isFound = true;
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
};