#! /usr/bin/env node
import inquirer from "inquirer";
import chalk from "chalk";
import { differenceInSeconds } from "date-fns";

console.log(
  chalk.bgWhiteBright.magentaBright.italic.bold("\n\t  Welcome to the Countdown Timer...\t\n")
);

async function main() {
  const countdown = await inquirer.prompt({
    name: "userAnswer",
    type: "list",
    message: chalk.yellowBright("Select the Countdown Timer:"),
    choices: [chalk.cyanBright("inSeconds"), chalk.greenBright("inMinutes")],
  });

  const response = await inquirer.prompt({
    name: "userInput",
    type: "input", // Changed from "number" to "input"
    message: countdown.userAnswer === chalk.cyanBright("inSeconds") 
      ? chalk.blue("Please enter the amount of Seconds...")
      : chalk.cyanBright("Please enter the amount of Minutes..."),
    validate: (input) => {
      const value = parseInt(input, 10);
      if (isNaN(value)) {
        return chalk.red("Please enter a valid number...");
      } else if (countdown.userAnswer === chalk.cyanBright("inSeconds") && value < 1) {
        return chalk.red("Seconds must be greater than 0...");
      } else if (countdown.userAnswer === chalk.greenBright("inMinutes") && value <= 0) {
        return chalk.red("Minutes must be greater than 0...");
      } else {
        return true;
      }
    },
  });

  let input = parseInt(response.userInput, 10);
  startTimer(input, countdown.userAnswer === chalk.cyanBright("inSeconds"));
}

function startTimer(duration: number, isSeconds: boolean) {
  const initialTime = new Date();
  const intervalTime = new Date(initialTime.getTime() + (isSeconds ? duration * 1000 : duration * 60000));

  let interval = setInterval(async () => {
    const currentTime = new Date();
    const timeDifference = differenceInSeconds(intervalTime, currentTime);

    if (timeDifference <= 0) {
      clearInterval(interval);
      console.log(chalk.cyan("Timer has expired"));

      const startAgain = await inquirer.prompt({
        type: "confirm",
        name: "continue",
        message: chalk.cyan("Do you want to continue?"),
      });

      if (startAgain.continue) {
        main();
      }
      return;
    }

    const minutes = Math.floor(timeDifference / 60);
    const seconds = Math.floor(timeDifference % 60);
    console.log(
      chalk.magentaBright(
        `${minutes.toString().padStart(2, "0")} : ${seconds.toString().padStart(2, "0")}`
      )
    );
  }, 1000);
}

main();
