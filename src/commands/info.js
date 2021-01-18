import { checkAlias, checkInput, sendBossInfoEmbed } from '../util/common';

export const name = 'info';
export const description = 'To check boss information';

export const execute = (message, args, bossList) => {
  let input = args.join(' ');
  let isFound = false;
  let isValidInput = false;
  let isValidAlias = true;

  isValidAlias = checkAlias(input);
  isValidInput = checkInput(input, isValidAlias);

  if (isValidInput) {
    for (let i = 0; i < bossList.bosses.length; i++) {
      if (
        bossList.bosses[i].bossName.toLowerCase().includes(input.toLowerCase().trim()) &&
        !isValidAlias
      ) {
        isFound = sendBossInfoEmbed(message, bossList.bosses[i], isFound);
      } else if (isValidAlias) {
        for (let j = 0; j < bossList.bosses[i].alias.length; j++) {
          if (bossList.bosses[i].alias[j].toLowerCase() === input.toLowerCase().trim()) {
            isFound = sendBossInfoEmbed(message, bossList.bosses[i], isFound);
          }
        }
      }
    }
  } else {
    message.channel.send('Please enter at least **3 characters** or the correct **boss alias**');
  }

  if (!isFound && isValidInput) {
    message.channel.send('Boss not found! Please try again.');
  }
};
