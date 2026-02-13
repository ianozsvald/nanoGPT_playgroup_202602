# train a miniature character-level shakespeare model
# good for debugging and playing on macbooks and such

# This is re-parameterised to match
# https://bbycroft.net/llm
# where the nanoGPT diagram and walkthrough looks very similar to what we have here

out_dir = 'out-shakespeare-char'
eval_interval = 250 # keep frequent because we'll overfit
eval_iters = 200
log_interval = 10 # don't print too too often

# we expect to overfit on this small dataset, so only save when val improves
always_save_checkpoint = False

wandb_log = False # override via command line if you like
wandb_project = out_dir # 'shakespeare-char'
wandb_run_name = 'mini-gpt'

dataset = 'shakespeare_char'
gradient_accumulation_steps = 1
batch_size = 64
block_size = 11 # context of up to 11 previous characters, bbycroft uses T (time) as 11

# baby GPT model :)
n_layer = 3 # 3 repeating blocks are shown as Transformer 0, 1, 2, in code these are Blocks
n_head = 3 # Heads on bbycroft, the z-dimension pushing back into the screen
n_embd = 48 # C on bbycroft AKA "feature, dimension, embedding size"
dropout = 0.2 # maybe not used on bbycroft?

# code references
# 0.09M parameters, close to bbycroft's 85k, but their vocab is smaller
# Token Embed == wte (top of image, GPT.__init__)
# Position Embed == wpe (top of image, GPT.__init__)
# Layer Norm (TxC) is ln_f (, GPT.__init__) ??
# ?? is lm_head ??
# At the top of the image, the Token Embed + Position Embed -> Input Embed occurs in GPT.forward with tok_emb+pos_emb
# Next the 3 Layers are computed, this is in GPT.forward as the loop on x=block(x)
#  Each Layer has Self Attention (C) into a Layer Norm (TxC) and then MLP into a Layer Norm
#  In the code a Block has CausalSelfAttention and ln_1 and MLP and ln_2
#  Block.forward creates x=x+CausalSelfAttention(ln_1(x)), x=x+MLP(ln_2(x))
#  Each CausalSelfAttention contains the k/v/q matrices
# After the 3 layers, the LayerNorm is calculed in GPT.forward as self.transformer.ln_f(x)

learning_rate = 1e-3 # with baby networks can afford to go a bit higher
max_iters = 5000
lr_decay_iters = 5000 # make equal to max_iters usually
min_lr = 1e-4 # learning_rate / 10 usually
beta2 = 0.99 # make a bit bigger because number of tokens per iter is small

warmup_iters = 100 # not super necessary potentially

# do cpu so we can easily inspect all the values
device = 'cpu'  # run on cpu only
compile = False # do not torch compile the model
