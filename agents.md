# nanoGPT Agents Guide

## 0. GPU Monitoring

**List GPU devices:**
```sh
nvidia-smi
```

**Continuous monitoring with nvidia-smi (every 10 seconds):**
```sh
nvidia-smi -l 10
```

**Interactive GPU monitoring (like htop for GPUs):**
```sh
nvtop
```

## 1. Prepare a Training Set

Run the appropriate `prepare.py` script for your dataset. This tokenizes the raw text and produces `train.bin` and `val.bin` files.

**Shakespeare (character-level):**
```sh
python data/shakespeare_char/prepare.py
```

**Shakespeare (GPT-2 BPE tokenizer, for finetuning):**
```sh
python data/shakespeare/prepare.py
```

**OpenWebText (for reproducing GPT-2):**
```sh
python data/openwebtext/prepare.py
```

## 2. Train the Model

**GPU training (Shakespeare char-level):**
```sh
python train.py config/train_shakespeare_char.py
```

**CPU training (smaller model):**
```sh
python train.py config/train_shakespeare_char.py --device=cpu --compile=False --eval_iters=20 --log_interval=1 --block_size=64 --batch_size=12 --n_layer=4 --n_head=4 --n_embd=128 --max_iters=2000 --lr_decay_iters=2000 --dropout=0.0
```

**Apple Silicon (MPS):**
```sh
python train.py config/train_shakespeare_char.py --device=mps
```

**Finetuning a pretrained GPT-2 on Shakespeare:**
```sh
python train.py config/finetune_shakespeare.py
```

**Reproducing GPT-2 (124M) on OpenWebText (8x A100):**
```sh
torchrun --standalone --nproc_per_node=8 train.py config/train_gpt2.py
```

Checkpoints are written to the `--out_dir` directory (e.g. `out-shakespeare-char`).

## 3. Sample from the Model

**Sample from a trained checkpoint:**
```sh
python sample.py --out_dir=out-shakespeare-char
```

For CPU-only:
```sh
python sample.py --out_dir=out-shakespeare-char --device=cpu
```

**Sample from a pretrained GPT-2 model:**
```sh
python sample.py --init_from=gpt2-xl --start="What is the answer to life, the universe, and everything?" --num_samples=5 --max_new_tokens=100
```

**Sample with a prompt from a file:**
```sh
python sample.py --start=FILE:prompt.txt
```

## 4. Caches

### Huggingface model cache for GPT2

```
~/.cache/huggingface/hub
```
