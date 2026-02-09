---
theme: default
background: '#1a1a2e'
class: text-center
highlighter: shiki
lineNumbers: false
drawings:
  persist: false
transition: fade-out
title: Finetuning GPT-2 on Shakespeare
mdc: true
---

# Finetuning GPT-2 on Shakespeare

<div class="text-xl text-gray-400 mt-4">
What I learned from nanoGPT
</div>

<div class="abs-br m-6 text-gray-500 text-sm">
@your_handle
</div>

---

# The Hook

<v-clicks>

- ChatGPT seems like magic
- But the core model? **~300 lines of Python**
- I finetuned GPT-2 Large (774M params) on Shakespeare
- In **20 iterations**
- On my laptop

</v-clicks>

---
layout: image
image: /architecture.svg
backgroundSize: contain
---

<!-- Architecture diagram - let it breathe -->

---

# What is nanoGPT?

<v-clicks>

- Andrej Karpathy's minimal GPT implementation
- Training code: `train.py` (~300 lines)
- Model code: `model.py` (~300 lines)
- That's it. That's the whole thing.

</v-clicks>

<div v-click class="mt-8 text-2xl text-cyan-400">
"The most educational codebase in ML"
</div>

---

# The Experiment

<div class="grid grid-cols-2 gap-8 mt-8">

<div v-click>

### Setup
- GPT-2 Large (774M params)
- Shakespeare's complete works (~1MB text)
- Learning rate: 3e-5
- Batch size: 1 (it's a laptop!)

</div>

<div v-click>

### Goal
- Take a pretrained model
- Teach it to write like Shakespeare
- See how fast it learns

</div>

</div>

---
layout: image
image: /training.svg
backgroundSize: contain
---

<!-- Training curves - the story is in the numbers -->

---

# What the curves tell us

<v-clicks>

- **Started at 3.66 loss** → model knows English, not Shakespeare
- **Dropped to 2.86** → 22% improvement in 20 steps
- Train loss is noisy (batch size 1)
- Val loss is smooth (we're actually learning)

</v-clicks>

<div v-click class="mt-8 p-4 bg-gray-800 rounded-lg">
<code class="text-green-400">python train.py config/finetune_shakespeare.py</code>
</div>

---

# The Training Loop

```python {all|2|3|4|5|6|all}
for iter in range(max_iters):
    X, Y = get_batch('train')        # grab some text
    logits, loss = model(X, Y)       # forward pass
    loss.backward()                   # compute gradients
    optimizer.step()                  # update weights
    optimizer.zero_grad()             # reset for next iter
```

<v-click>

That's it. That's training.

</v-click>

---
layout: image
image: /generation.svg
backgroundSize: contain
---

<!-- Generation loop - even simpler -->

---

# Generation is simpler

```python {all|1|2|3|4|all}
for _ in range(max_new_tokens):
    logits = model(context)           # predict next token
    next_token = sample(logits)       # pick one
    context = concat(context, next_token)  # append
```

<v-click>

Predict → Sample → Append → Repeat

</v-click>

---

# The Output

<div class="mt-8 p-6 bg-gray-800 rounded-lg font-mono text-sm">

<div v-click>
<span class="text-gray-500">Prompt:</span> ROMEO:
</div>

<div v-click class="mt-4 text-yellow-400">

ROMEO: You're high.<br><br>
LORIUS: I pray you'll be there.<br><br>
PRINCETON: Come on, then, tell me what she went to?<br><br>
LORIUS: She went in a lie by a fig tree with an arrow<br>
of the palm of his hand.

</div>

</div>

<div v-click class="mt-4 text-gray-400">
It invented LORIUS and PRINCETON. Shakespeare vibes, not Shakespeare.
</div>

---

# What I learned

<v-clicks>

1. **Finetuning is fast** — 20 iterations, not 20,000
2. **Small batches work** — gradient noise is fine
3. **The code is simple** — no magic, just math
4. **Reading the source > reading papers**

</v-clicks>

---

# Try it yourself

<div class="mt-8">

```bash
git clone https://github.com/karpathy/nanoGPT
cd nanoGPT
python data/shakespeare/prepare.py
python train.py config/finetune_shakespeare.py
python sample.py --out_dir=out-shakespeare
```

</div>

<div v-click class="mt-8 text-xl">
30 minutes from clone to Shakespeare
</div>

---
layout: center
class: text-center
---

# nanoGPT

<div class="text-gray-400 mt-4">
by Andrej Karpathy
</div>

<div class="mt-8 text-cyan-400">
github.com/karpathy/nanoGPT
</div>

<div class="mt-12 text-gray-500">
@your_handle
</div>

---

# Resources

- [nanoGPT repo](https://github.com/karpathy/nanoGPT)
- [Karpathy's YouTube walkthrough](https://youtube.com/...)
- [GPT-2 paper](https://openai.com/research/gpt-2)

<div class="mt-8 text-gray-400">
Questions?
</div>
