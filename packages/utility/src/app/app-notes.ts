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
        let p = processed.length > 1 ? color.blue(`Processed:\n${processed.join('\n')}\n`) : ''; //blueBright
        let s = messages.length ? color.yellow(`\nNotes:\n${messages.join('\n')}\n`) : '';
        let f = `${p}${s}`;
        return f ? `${programName} program finished.\n\n${f}` : '';
    }

    export async function show(): Promise<void> {
        let final = buildMessage();
        if (final) {
            await exitProcess(0, final);
        }
    }
    
} //namespace notes
