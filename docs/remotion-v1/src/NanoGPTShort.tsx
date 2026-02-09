import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  interpolate,
  Easing,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/JetBrainsMono";
import { Terminal, TerminalWindow } from "./components/Terminal";
import { LossChart } from "./components/LossChart";
import { HookText, TextOverlay, StatOverlay } from "./components/TextOverlay";
import { CodeBlock, CodeStats } from "./components/CodeBlock";
import trainingData from "./data/training-loss.json";

const { fontFamily } = loadFont();

// Frame timing (30fps, 60 seconds = 1800 frames)
const TIMING = {
  hook: { start: 0, duration: 90 }, // 0-3s
  codeIntro: { start: 90, duration: 150 }, // 3-8s
  lossChart: { start: 240, duration: 360 }, // 8-20s
  generation1: { start: 600, duration: 450 }, // 20-35s
  generation2: { start: 1050, duration: 450 }, // 35-50s
  punchline: { start: 1500, duration: 300 }, // 50-60s
};

const Background: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0a0a",
        overflow: "hidden",
      }}
    >
      {/* Subtle animated gradient */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(ellipse at 50% ${30 + Math.sin(frame / 60) * 10}%, rgba(0, 50, 0, 0.3) 0%, transparent 60%)`,
        }}
      />

      {/* Scanlines overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.1) 2px, rgba(0, 0, 0, 0.1) 4px)",
          pointerEvents: "none",
        }}
      />

      {/* Corner decorations */}
      <div
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          width: 60,
          height: 60,
          borderLeft: "2px solid #00ff00",
          borderTop: "2px solid #00ff00",
          opacity: 0.5,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          width: 60,
          height: 60,
          borderRight: "2px solid #00ff00",
          borderTop: "2px solid #00ff00",
          opacity: 0.5,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 20,
          left: 20,
          width: 60,
          height: 60,
          borderLeft: "2px solid #00ff00",
          borderBottom: "2px solid #00ff00",
          opacity: 0.5,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
          width: 60,
          height: 60,
          borderRight: "2px solid #00ff00",
          borderBottom: "2px solid #00ff00",
          opacity: 0.5,
        }}
      />
    </AbsoluteFill>
  );
};

const HookSection: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <HookText
        lines={[
          "I taught GPT-2",
          "to write Shakespeare.",
          "It invented its own",
          "characters.",
        ]}
        startFrame={0}
      />
    </AbsoluteFill>
  );
};

const CodeIntroSection: React.FC = () => {
  const codeSnippet = `@dataclass
class GPTConfig:
    block_size: int = 1024
    vocab_size: int = 50304
    n_layer: int = 12
    n_head: int = 12
    n_embd: int = 768
    dropout: float = 0.0
    bias: bool = True`;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        padding: 40,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 40,
        }}
      >
        <TextOverlay
          text="nanoGPT"
          startFrame={0}
          durationFrames={150}
          fontSize={72}
          position="top"
          animation="scale"
        />
        <CodeBlock
          code={codeSnippet}
          startFrame={15}
          title="model.py"
          highlightLines={[2, 3, 4, 5]}
        />
        <CodeStats startFrame={45} lines={330} parameters="774M" />
      </div>
    </AbsoluteFill>
  );
};

const LossChartSection: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        padding: 40,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 30,
        }}
      >
        <div
          style={{
            fontFamily,
            fontSize: 48,
            color: "#00ffff",
            textShadow: "0 0 20px #00ffff",
            opacity: interpolate(frame, [0, 20], [0, 1], {
              extrapolateRight: "clamp",
            }),
          }}
        >
          Watch it learn...
        </div>
        <LossChart
          data={trainingData.loss}
          startFrame={30}
          durationFrames={300}
          width={950}
          height={600}
        />
        <div
          style={{
            display: "flex",
            gap: 80,
            marginTop: 20,
            fontFamily,
            opacity: interpolate(frame, [60, 80], [0, 1], {
              extrapolateRight: "clamp",
            }),
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 36, color: "#00ff00" }}>20</div>
            <div style={{ fontSize: 18, color: "#00ffff" }}>iterations</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 36, color: "#00ff00" }}>22%</div>
            <div style={{ fontSize: 18, color: "#00ffff" }}>loss reduction</div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const GenerationSection1: React.FC = () => {
  const generatedText = `ROMEO:
You're high.

LORIUS:
I am not a man of blood,
but a man of love.`;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        padding: 40,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 30,
        }}
      >
        <TextOverlay
          text="Generated Output"
          startFrame={0}
          durationFrames={450}
          fontSize={42}
          color="#00ffff"
          position="top"
        />
        <Terminal
          text={generatedText}
          startFrame={30}
          charactersPerFrame={0.4}
          prefix=">>> generate(prompt='ROMEO:')\n\n"
        />
        <div
          style={{
            position: "absolute",
            bottom: 150,
            fontFamily,
            fontSize: 28,
            color: "#ff6b6b",
            textShadow: "0 0 15px #ff6b6b",
            opacity: interpolate(
              useCurrentFrame(),
              [200, 220],
              [0, 1],
              { extrapolateRight: "clamp" }
            ),
          }}
        >
          ⚠️ LORIUS is not a Shakespeare character!
        </div>
      </div>
    </AbsoluteFill>
  );
};

const GenerationSection2: React.FC = () => {
  const generatedText = `PRINCETON:
What say you to this?
Is it not strange
That we should speak of
things we cannot see?`;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        padding: 40,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 30,
        }}
      >
        <Terminal
          text={generatedText}
          startFrame={30}
          charactersPerFrame={0.35}
          prefix=">>> generate(prompt='PRINCETON:')\n\n"
        />
        <div
          style={{
            position: "absolute",
            bottom: 150,
            fontFamily,
            fontSize: 28,
            color: "#ff6b6b",
            textShadow: "0 0 15px #ff6b6b",
            opacity: interpolate(
              useCurrentFrame(),
              [180, 200],
              [0, 1],
              { extrapolateRight: "clamp" }
            ),
          }}
        >
          ⚠️ PRINCETON? Also invented!
        </div>
      </div>
    </AbsoluteFill>
  );
};

const PunchlineSection: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        padding: 60,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 40,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily,
            fontSize: 52,
            fontWeight: "bold",
            color: "#00ff00",
            textShadow: "0 0 30px #00ff00",
            opacity: interpolate(frame, [0, 20], [0, 1], {
              extrapolateRight: "clamp",
            }),
            lineHeight: 1.4,
          }}
        >
          It learned the format.
        </div>
        <div
          style={{
            fontFamily,
            fontSize: 52,
            fontWeight: "bold",
            color: "#00ffff",
            textShadow: "0 0 30px #00ffff",
            opacity: interpolate(frame, [30, 50], [0, 1], {
              extrapolateRight: "clamp",
            }),
            lineHeight: 1.4,
          }}
        >
          Invented the characters.
        </div>

        {/* Stats recap */}
        <div
          style={{
            display: "flex",
            gap: 60,
            marginTop: 40,
            opacity: interpolate(frame, [80, 100], [0, 1], {
              extrapolateRight: "clamp",
            }),
          }}
        >
          <div
            style={{
              fontFamily,
              textAlign: "center",
              padding: "20px 40px",
              border: "2px solid #00ff00",
              borderRadius: 12,
            }}
          >
            <div style={{ fontSize: 42, color: "#00ff00" }}>774M</div>
            <div style={{ fontSize: 18, color: "#888" }}>params</div>
          </div>
          <div
            style={{
              fontFamily,
              textAlign: "center",
              padding: "20px 40px",
              border: "2px solid #00ff00",
              borderRadius: 12,
            }}
          >
            <div style={{ fontSize: 42, color: "#00ff00" }}>~330</div>
            <div style={{ fontSize: 18, color: "#888" }}>lines</div>
          </div>
          <div
            style={{
              fontFamily,
              textAlign: "center",
              padding: "20px 40px",
              border: "2px solid #00ff00",
              borderRadius: 12,
            }}
          >
            <div style={{ fontSize: 42, color: "#00ff00" }}>20</div>
            <div style={{ fontSize: 18, color: "#888" }}>steps</div>
          </div>
        </div>

        {/* CTA */}
        <div
          style={{
            fontFamily,
            fontSize: 32,
            color: "#888",
            marginTop: 60,
            opacity: interpolate(frame, [150, 170], [0, 1], {
              extrapolateRight: "clamp",
            }),
          }}
        >
          github.com/karpathy/nanoGPT
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const NanoGPTShort: React.FC = () => {
  return (
    <AbsoluteFill>
      <Background />

      {/* Hook: "I taught GPT-2 to write Shakespeare" */}
      <Sequence from={TIMING.hook.start} durationInFrames={TIMING.hook.duration} premountFor={30}>
        <HookSection />
      </Sequence>

      {/* Code intro with stats */}
      <Sequence from={TIMING.codeIntro.start} durationInFrames={TIMING.codeIntro.duration} premountFor={30}>
        <CodeIntroSection />
      </Sequence>

      {/* Animated loss chart */}
      <Sequence from={TIMING.lossChart.start} durationInFrames={TIMING.lossChart.duration} premountFor={30}>
        <LossChartSection />
      </Sequence>

      {/* Generated text 1: ROMEO + LORIUS */}
      <Sequence from={TIMING.generation1.start} durationInFrames={TIMING.generation1.duration} premountFor={30}>
        <GenerationSection1 />
      </Sequence>

      {/* Generated text 2: PRINCETON */}
      <Sequence from={TIMING.generation2.start} durationInFrames={TIMING.generation2.duration} premountFor={30}>
        <GenerationSection2 />
      </Sequence>

      {/* Punchline + CTA */}
      <Sequence from={TIMING.punchline.start} durationInFrames={TIMING.punchline.duration} premountFor={30}>
        <PunchlineSection />
      </Sequence>
    </AbsoluteFill>
  );
};
