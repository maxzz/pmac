import { color, exitProcess } from "../../utils";
import { programName } from "./3-help-text";

export namespace notes {

    const messages: string[] = []; // messages will be shown if any warnings happen.
    const processed: string[] = []; // processed will be shown if ${programName} processed more then one folder.

    export function add(note: string): void {
        messages.push(note);
    }

    export function addProcessed(note: string): void {
        processed.push(note);
    }

    export function buildMessage(): string {
        const pro = processed.length > 1 ? color.cyan(`\nProcessed:\n${processed.join('\n')}`) : ''; //blueBright
        const msg = messages.length ? color.yellow(`${messages.join('\n')}`) : '';
        const hasOutput = pro || msg;
        return hasOutput ? [pro, msg].join('\n') : `The ${programName} program has ended.`;
    }

    export async function showAndExit(): Promise<void> {
        let final = buildMessage();
        if (final) {
            await exitProcess(0, final);
        }
    }

} //namespace notes
