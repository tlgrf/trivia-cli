// src/game.js
import readline from "readline/promises";
import { questions } from "./questions.js";
import { startCountdown } from "./timer.js";

export async function runGame() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const results = [];

  console.log("Welcome to Trivia CLI!");
  await rl.question("Press Enter to begin…");

  for (const [i, q] of questions.entries()) {
    console.log(`\nQuestion ${i + 1}: ${q.prompt}`);
    q.choices.forEach((c, idx) => console.log(`  ${idx + 1}. ${c}`));

    // race the prompt against a 15s timeout
    const answerPromise = rl.question("Your answer (1–4): ").then(str => str.trim());

    let cancelTimer;
    const timeoutPromise = new Promise(resolve => {
      cancelTimer = startCountdown(
        15,
        sec => console.log(`⏳ ${sec}s left`),
        () => resolve(null)
      );
    });

    const resp = await Promise.race([answerPromise, timeoutPromise]);
    cancelTimer();  // stop the countdown

    if (resp === null) {
      console.log("⌛ Chop Chop! We don't have all day! 👴👵🪦");
      results.push(false);
      continue;
    }

    // validate numeric choice
    const idx = Number(resp) - 1;
    if (![0, 1, 2, 3].includes(idx)) {
      console.log("❗️ Invalid choice—counting as incorrect.");
      results.push(false);
      continue;
    }

    // check answer correctness
    const correct = idx === q.answerIndex;
    if (correct) {
      console.log("✅ Yoohoo! Intelligence +5 !");
    } else {
      console.log(`❌ OH NO! You messed up! 🤡 It was "${q.choices[q.answerIndex]}".`);
    }
    results.push(correct);
  }

  // compute final score with reduce
  const score = results.reduce((sum, ok) => sum + (ok ? 1 : 0), 0);
  console.log(`\nGame over! You scored ${score}/${questions.length}`);
  rl.close();
}