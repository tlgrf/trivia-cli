#!/usr/bin/env node
import { runGame } from "../src/game.js";

runGame().catch(err => {
  console.error("❗️ Error:", err);
  process.exit(1);
});