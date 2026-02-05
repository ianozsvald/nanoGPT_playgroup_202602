with open('input.txt', 'w') as f:
    for a in range(200):
        for b in range(200):
            f.write(f"{a} * {b} = {a * b}\n")
