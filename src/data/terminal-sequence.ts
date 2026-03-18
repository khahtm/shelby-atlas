/** CLI command sequence for the Workshop MiniTerminal typewriter effect */
export interface TerminalLine {
  type: "command" | "output" | "blank";
  text: string;
  /** Delay in ms before this line appears (after previous line completes) */
  delay: number;
}

export const TERMINAL_LINES: TerminalLine[] = [
  { type: "command", text: "$ shelby context use shelbynet", delay: 0 },
  { type: "output", text: "> Switched to shelbynet", delay: 800 },
  { type: "blank", text: "", delay: 400 },
  { type: "command", text: "$ shelby upload ./game-assets/hero.png", delay: 1200 },
  { type: "output", text: "> Uploading 1 file...", delay: 600 },
  { type: "output", text: "> Encoded with Clay erasure coding", delay: 800 },
  { type: "output", text: "> Stored across 16 providers - took 1.53s", delay: 1000 },
  { type: "output", text: "> explorer.shelby.xyz/shelbynet/account/0xfc...", delay: 500 },
];

/** Total loop time including final pause before restart */
export const TERMINAL_LOOP_PAUSE_MS = 3000;

/** Typing speed for command lines (ms per character) */
export const TYPING_SPEED_MS = 45;
