import { readBossData, aliasChecker, inputChecker, createBossInfoEmbed } from '../util/common';

export const name = 'mvp';
export const description = 'Ragnarok Online MVP helper';

export const execute = (message, args) => {
  let input = '';
  let isFound = false;
  let isValidInput = false;
  let isValidAlias = true;
  let bossList = readBossData();


  if (args[0] === 'add') {
    for (let i = 1; i < args.length; i++) {
      input += args[i];
    }

    isValidAlias = aliasChecker(input);
    isValidInput = inputChecker(input, isValidAlias);

    if(isValidInput) {
      console.log(` ${input} = Valid input-add boss to list`);
      isFound = true;

      if(isValidAlias){
        isFound = true;
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
      console.log('MVP list');
  }
  else if (args[0] === 'clear') {
      console.log('Clear MVP list')
  }
  else {
    message.channel.send("Command **does not exist**! Please enter `$help` for the list of bot commands.");
  }
  
};
