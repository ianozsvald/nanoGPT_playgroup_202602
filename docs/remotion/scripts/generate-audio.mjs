import OpenAI from "openai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const openai = new OpenAI();

// Voice options: alloy, echo, fable, onyx, nova, shimmer
// "fable" has a British English quality
const VOICE = "fable";
const MODEL = "tts-1-hd"; // or "tts-1" for faster/cheaper

// Narration scripts for each section
const NARRATIONS = [
  {
    id: "01-hook",
    text: "How does GPT actually work?",
  },
  {
    id: "02-what-is-llm",
    text: "At its core, an LLM is just a next-word predictor. Given 'To be or not to'... it predicts 'be'. That's it.",
  },
  {
    id: "03-training",
    text: "But how does it learn? You show it text, it guesses the next word. Wrong guess? Adjust the weights slightly. Do this billions of times, and it gets really good at guessing.",
  },
  {
    id: "04-architecture",
    text: "The secret sauce is attention. Each word looks at every other word to understand context. 'Queen' pays attention to 'king'. GPT-2 does this 36 times with 774 million parameters.",
  },
  {
    id: "05-finetuning",
    text: "Fine-tuning means taking a model that already knows English and specializing it. We fed it Shakespeare.",
  },
  {
    id: "06-h100",
    text: "H100 in the cloud. 20 steps. Two minutes.",
  },
  {
    id: "07-loss",
    text: "Loss measures how wrong the predictions are. Watch it drop as the model learns. Lower is better.",
  },
  {
    id: "08-generation",
    text: "Now let's generate some Shakespeare... Romeo says 'You're high.' And then... Lorius?",
  },
  {
    id: "09-reveal",
    text: "Wait. Who is Lorius? Princeton? These characters don't exist in any Shakespeare play.",
  },
  {
    id: "10-punchline",
    text: "The model learned the pattern. Character names in caps, poetic dialogue. And made up the rest. That's how LLMs work.",
  },
  {
    id: "11-cta",
    text: "774 million parameters. 36 layers. 20 training steps. Link to nanoGPT in the comments.",
  },
];

const OUTPUT_DIR = path.join(__dirname, "..", "public", "audio");

async function generateAudio(narration) {
  console.log(`Generating: ${narration.id}...`);

  const response = await openai.audio.speech.create({
    model: MODEL,
    voice: VOICE,
    input: narration.text,
    speed: 1.0, // 0.25 to 4.0
  });

  const buffer = Buffer.from(await response.arrayBuffer());
  const outputPath = path.join(OUTPUT_DIR, `${narration.id}.mp3`);
  fs.writeFileSync(outputPath, buffer);

  console.log(`  ✓ Saved: ${outputPath}`);
}

async function main() {
  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  console.log(`\nGenerating ${NARRATIONS.length} audio files...\n`);
  console.log(`Voice: ${VOICE}`);
  console.log(`Model: ${MODEL}`);
  console.log(`Output: ${OUTPUT_DIR}\n`);

  for (const narration of NARRATIONS) {
    await generateAudio(narration);
  }

  console.log("\n✅ All audio files generated!");
  console.log("\nNext steps:");
  console.log("1. Set AUDIO_ENABLED = true in NanoGPTShort.tsx");
  console.log("2. Run: npm run dev");
  console.log("3. Preview with audio!\n");
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
