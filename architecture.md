# nanoGPT Architecture

## Folder Structure

```
.
├── config/          Config files that override train.py defaults
│   ├── train_shakespeare_char.py
│   ├── train_gpt2.py
│   ├── train_python_char.py
│   ├── finetune_shakespeare.py
│   ├── eval_gpt2.py
│   ├── eval_gpt2_medium.py
│   ├── eval_gpt2_large.py
│   └── eval_gpt2_xl.py
├── data/            Dataset preparation scripts and tokenized data
│   ├── openwebtext/
│   ├── shakespeare/
│   ├── shakespeare_char/
│   └── python_char/
├── assets/          Images for the README
├── out-*/           Model checkpoint output directories (created by training)
├── train.py         Training loop
├── model.py         GPT model definition (~300 lines)
├── sample.py        Inference / text generation
├── configurator.py  CLI config override system
├── bench.py         Benchmarking and profiling
└── *.ipynb          Notebooks for scaling laws and transformer sizing
```

## Root Files

### configurator.py

A minimal configuration system that is `exec()`'d by both `train.py` and `sample.py`. It processes `sys.argv` and supports two kinds of arguments:

- **Config files** (positional args): e.g. `config/train_shakespeare_char.py` — the file is exec'd, overriding globals in the calling script.
- **Key=value flags**: e.g. `--batch_size=32` — overrides the matching global variable, with type checking.

This means every variable defined at the top of `train.py` or `sample.py` can be overridden from the command line or from a config file.

### train.py

The training loop (~300 lines). Key default config variables at the top:

- **I/O**: `out_dir`, `eval_interval`, `always_save_checkpoint`, `init_from` (`'scratch'`, `'resume'`, or `'gpt2*'`)
- **Data**: `dataset`, `batch_size`, `block_size`, `gradient_accumulation_steps`
- **Model**: `n_layer`, `n_head`, `n_embd`, `dropout`, `bias`
- **Optimizer**: `learning_rate`, `max_iters`, `weight_decay`, learning rate schedule params
- **System**: `device`, `dtype`, `compile` (torch.compile)

Supports single-GPU, multi-GPU via `torchrun` (DDP), and CPU/MPS. Loads data from `data/{dataset}/train.bin` and `val.bin`. Writes checkpoints to `out_dir`.

### sample.py

Text generation script. Key config variables:

- `init_from`: `'resume'` (load from `out_dir`) or a GPT-2 variant name (e.g. `'gpt2-xl'`)
- `out_dir`: checkpoint directory when resuming
- `start`: prompt string, or `"FILE:prompt.txt"` to read from file
- `num_samples`, `max_new_tokens`, `temperature`, `top_k`

Loads the model, runs autoregressive generation, and prints the output.
