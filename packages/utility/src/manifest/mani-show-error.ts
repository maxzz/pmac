import chalk from "chalk";

export function showError(error: any) {
    console.log(chalk.red('tm-error:\n'), error);
}
