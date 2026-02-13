# Narration Script - nanoGPT YouTube Short

Record each section as a separate audio file. Keep it conversational and energetic.

---

## File Naming Convention
Save files as: `01-hook.mp3`, `02-what-is-llm.mp3`, etc.

---

## 01-hook.mp3
**Duration:** 2 seconds
**Timing:** 0:00 - 0:02

> "How does GPT actually work?"

---

## 02-what-is-llm.mp3
**Duration:** 5 seconds
**Timing:** 0:02 - 0:07

> "At its core, an LLM is just a next-word predictor. Given 'To be or not to...' it predicts 'be'. That's it."

---

## 03-training.mp3
**Duration:** 9 seconds
**Timing:** 0:07 - 0:16

> "But how does it learn? You show it text, it guesses the next word. Wrong guess? Adjust the weights slightly. Do this billions of times, and it gets really good at guessing."

---

## 04-architecture.mp3
**Duration:** 8 seconds
**Timing:** 0:16 - 0:24

> "The secret sauce is attention. Each word looks at every other word to understand context. 'Queen' pays attention to 'king'. GPT-2 does this 36 times with 774 million parameters."

---

## 05-finetuning.mp3
**Duration:** 4 seconds
**Timing:** 0:24 - 0:28

> "Fine-tuning means taking a model that already knows English and specializing it. We fed it Shakespeare."

---

## 06-h100.mp3
**Duration:** 2 seconds
**Timing:** 0:28 - 0:30

> "H100 in the cloud. 20 steps. Two minutes."

---

## 07-loss.mp3
**Duration:** 6 seconds
**Timing:** 0:30 - 0:36

> "Loss measures how wrong the predictions are. Watch it drop as the model learns. Lower is better."

---

## 08-generation.mp3
**Duration:** 8 seconds
**Timing:** 0:36 - 0:44

> "Now let's generate some Shakespeare... Romeo says 'You're high.' And then... Lorius?"

---

## 09-reveal.mp3
**Duration:** 6 seconds
**Timing:** 0:44 - 0:50

> "Wait. Who is Lorius? Princeton? These characters don't exist in any Shakespeare play."

---

## 10-punchline.mp3
**Duration:** 5 seconds
**Timing:** 0:50 - 0:55

> "The model learned the pattern - character names in caps, poetic dialogue. And made up the rest. That's how LLMs work."

---

## 11-cta.mp3
**Duration:** 5 seconds
**Timing:** 0:55 - 1:00

> "774 million parameters. 36 layers. 20 training steps. Link to nanoGPT in the comments."

---

## Recording Tips

1. **Environment:** Quiet room, no echo
2. **Mic:** Close to mouth, pop filter if possible
3. **Energy:** Slightly more animated than normal conversation
4. **Pacing:** Match the timing above - you can adjust video timing later if needed
5. **Format:** Export as MP3 or WAV, 44.1kHz

## After Recording

Place files in:
```
docs/remotion/public/audio/
├── 01-hook.mp3
├── 02-what-is-llm.mp3
├── 03-training.mp3
├── 04-architecture.mp3
├── 05-finetuning.mp3
├── 06-h100.mp3
├── 07-loss.mp3
├── 08-generation.mp3
├── 09-reveal.mp3
├── 10-punchline.mp3
└── 11-cta.mp3
```

Then run `npm run dev` to preview with audio.
