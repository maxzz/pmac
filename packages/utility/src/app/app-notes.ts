import color from 'picocolors';
import { exitProcess } from "../utils/utils-errors";
import { programName } from "./app-help";

export namespace notes {

    let messages: string[] = []; // messages will be shown if any warnings happen.
    let processed: string[] = []; // processed will be shown if ${programName} processed more then one folder.

    export function add(note: string): void {
        messages.push(note);
    }

    export function addProcessed(note: string): void {
        processed.push(note);
    }

    export function buildMessage(): string {
        let pro = processed.length > 1 ? color.cyan(`\nProcessed:\n${processed.join('\n')}`) : ''; //blueBright
        let msg = messages.length ? color.yellow(`\nNotes:\n${messages.join('\n')}`) : '';
        let hasOutput = pro || msg;
        return hasOutput ? [pro, msg].join('\n') : `Program ${programName} finished.\n\n`;
    }

    export async function showAndExit(): Promise<void> {
        let final = buildMessage();
        if (final) {
            await exitProcess(0, final);
        }
    }

} //namespace notes
