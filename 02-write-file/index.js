const fs = require('fs');
const path = require('path');
const readline = require('readline');

const filePath = path.join(__dirname, 'TextFile.txt');
const inputFild = 'Enter text (To quit: Ctrl+C or type "exit"): ';

const readfield = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const showInput = () => {
  readfield.question(inputFild, (input) => {
    if (input.toLowerCase() === 'exit') {
      console.log('Goodbye!');
      readfield.close();
    } else {
      fs.appendFile(filePath, input + '\n', () => {
        showInput();
      });
    }
  });
};
console.log('Let\'s add new text to the file!');

readfield.on('close', () => {
  console.log('\nGoodbye!');
});

showInput();
