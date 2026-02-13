# nanoGPT LinkedIn Video - Talking Notes

**Total Duration:** 75-90 seconds
**Target Audience:** Software engineers who code but don't know ML
**Hook:** "The model behind ChatGPT? ~300 lines of Python."

---

## Segment 1: Architecture Overview (0:00 - 0:25)

**Visual:** `01_architecture.svg`
**Animation Duration:** ~10 seconds for full reveal

### Script

> "GPT looks complex, but the core is surprisingly simple."
>
> "Tokens go in, get embedded, pass through transformer blocks, and predict the next token."
>
> "Each transformer block? Just attention and an MLP with residual connections."
>
> "The whole model? About 300 lines of Python."

### Timing Cues
- 0:00-0:05 → Title appears, boxes start revealing
- 0:05-0:15 → Flow diagram animates left to right
- 0:15-0:20 → Transformer detail expands
- 0:20-0:25 → "~300 lines" code hint appears

---

## Segment 2: Training Loop (0:25 - 0:45)

**Visual:** `02_training.svg`
**Animation Duration:** ~17 seconds (existing animation)

### Script

> "Training is just gradient descent on text."
>
> "Feed it Shakespeare, it learns to predict the next character."
>
> "Watch the loss drop as it gets better at guessing what comes next."
>
> "That's it. Forward pass, compute loss, backprop, repeat."

### Timing Cues
- 0:25-0:28 → Title and chart frame appear
- 0:28-0:36 → Train/val loss lines draw
- 0:36-0:40 → Validation dots pop in with values
- 0:40-0:45 → Zoom to final "best" value with celebration

---

## Segment 3: Generation Demo (0:45 - 1:10)

**Visual:** `03_generation.svg`
**Animation Duration:** ~10 seconds for loop, then text generation

### Script

> "Generation is even simpler."
>
> "Predict the next token, sample from the probabilities, add it to the context, repeat."
>
> "That's the entire generation loop."
>
> "And just like that... Shakespeare."
>
> "That's it. That's GPT."

### Timing Cues
- 0:45-0:48 → Title appears
- 0:48-0:55 → Loop diagram builds (Context → Predict → Sample → Append)
- 0:55-0:58 → Return arrow draws, "repeat" label
- 0:58-1:05 → Characters appear one by one
- 1:05-1:10 → Code overlay: `model.generate()`

---

## Segment 4: Outro/CTA (1:10 - 1:30)

**Visual:** `04_outro.svg`
**Animation Duration:** ~5 seconds

### Script

> "This is nanoGPT by Andrej Karpathy."
>
> "The entire codebase fits in your head."
>
> "Link in comments. Try it yourself."

### Timing Cues
- 1:10-1:15 → "nanoGPT" title reveals with glow
- 1:15-1:20 → Author credit and GitHub link
- 1:20-1:25 → "Try it yourself!" CTA
- 1:25-1:30 → Hold on final frame

---

## Production Notes

### File Checklist
- [ ] `01_architecture.svg` - Architecture flow (~10s animation)
- [ ] `02_training.svg` - Training loss chart (~17s animation)
- [ ] `03_generation.svg` - Generation loop (~10s animation)
- [ ] `04_outro.svg` - Credits/CTA (~5s animation)

### Recording Tips
1. **Pacing:** Match your speech to the animation reveals
2. **Emphasis:** Hit "300 lines" and "That's it" with conviction
3. **Energy:** Start strong with the hook, build through training, peak at generation
4. **Pause:** Let the Shakespeare text generate before the final "That's GPT"

### Post-Production
- Screen record each SVG in Chrome (full screen, dark background matches)
- Stitch segments in order
- Add subtle background music (lo-fi or ambient electronic)
- Consider adding your webcam in corner for LinkedIn engagement

### Hashtags
```
#MachineLearning #GPT #Python #SoftwareEngineering #AI #DeepLearning #nanoGPT
```

---

## Quick Reference: Key Messages

| Segment | Core Message |
|---------|--------------|
| Architecture | "GPT is ~300 lines of Python" |
| Training | "Just gradient descent on text" |
| Generation | "Predict, sample, append, repeat" |
| Outro | "Try it yourself" |
