import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  Easing,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/JetBrainsMono";
import { Terminal } from "./components/Terminal";
import { LossChart } from "./components/LossChart";
import trainingData from "./data/training-loss.json";

const { fontFamily } = loadFont();

// Audio files for each section (place in public/audio/)
const AUDIO = {
  hook: "audio/01-hook.mp3",
  whatIsLLM: "audio/02-what-is-llm.mp3",
  training: "audio/03-training.mp3",
  architecture: "audio/04-architecture.mp3",
  fineTuning: "audio/05-finetuning.mp3",
  h100: "audio/06-h100.mp3",
  loss: "audio/07-loss.mp3",
  generation: "audio/08-generation.mp3",
  reveal: "audio/09-reveal.mp3",
  punchline: "audio/10-punchline.mp3",
  cta: "audio/11-cta.mp3",
};

// V3: Educational deep-dive (30fps, timing synced to audio)
const TIMING = {
  hook: { start: 0, duration: 52 },              // 1.7s
  whatIsLLM: { start: 52, duration: 193 },       // 6.4s
  trainingExplained: { start: 245, duration: 312 }, // 10.4s
  architectureVisual: { start: 557, duration: 363 }, // 12.1s
  fineTuning: { start: 920, duration: 196 },     // 6.5s
  h100: { start: 1116, duration: 103 },          // 3.4s
  lossChart: { start: 1219, duration: 180 },     // 6.0s
  generation: { start: 1399, duration: 152 },    // 5.1s
  reveal: { start: 1551, duration: 156 },        // 5.2s
  punchline: { start: 1707, duration: 214 },     // 7.1s
  cta: { start: 1921, duration: 199 },           // 6.6s
};

const Background: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at 50% ${30 + Math.sin(frame / 60) * 10}%, rgba(0, 50, 0, 0.3) 0%, transparent 60%)`,
        }}
      />
    </AbsoluteFill>
  );
};

// HOOK
const HookSection: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({ frame, fps, config: { damping: 12, stiffness: 100 } });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          fontFamily,
          fontSize: 52,
          fontWeight: "bold",
          color: "#00ff00",
          textAlign: "center",
          textShadow: "0 0 30px #00ff00",
          transform: `scale(${scale})`,
          lineHeight: 1.4,
        }}
      >
        How does GPT
        <br />
        <span style={{ color: "#00ffff" }}>actually work?</span>
      </div>
    </AbsoluteFill>
  );
};

// WHAT IS AN LLM - "Guess the next word"
const WhatIsLLM: React.FC = () => {
  const frame = useCurrentFrame();

  const sentence = "To be or not to";
  const correctWord = "be";

  const showSentence = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const showBlank = interpolate(frame, [30, 45], [0, 1], { extrapolateRight: "clamp" });
  const showAnswer = interpolate(frame, [70, 85], [0, 1], { extrapolateRight: "clamp" });
  const showExplanation = interpolate(frame, [100, 115], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 40 }}>
      <div style={{ fontFamily, textAlign: "center" }}>
        <div style={{ fontSize: 32, color: "#888", marginBottom: 50, opacity: showSentence }}>
          An LLM is a <span style={{ color: "#00ffff" }}>next-word predictor</span>
        </div>

        {/* The sentence */}
        <div style={{ fontSize: 42, color: "#00ff00", marginBottom: 40, opacity: showSentence }}>
          "{sentence}
          <span
            style={{
              display: "inline-block",
              width: 100,
              borderBottom: "3px solid #00ffff",
              marginLeft: 10,
              opacity: showBlank,
            }}
          >
            <span style={{ opacity: showAnswer, color: "#ff6b6b" }}>{correctWord}</span>
          </span>
          "
        </div>

        {/* Explanation */}
        <div
          style={{
            fontSize: 28,
            color: "#888",
            opacity: showExplanation,
            lineHeight: 1.6,
          }}
        >
          It predicts the most likely next word
          <br />
          based on all the text it's seen
        </div>
      </div>
    </AbsoluteFill>
  );
};

// TRAINING EXPLAINED - The learning loop
const TrainingExplained: React.FC = () => {
  const frame = useCurrentFrame();

  // Animation phases
  const phase1 = frame < 60;   // Show input
  const phase2 = frame >= 60 && frame < 120;  // Wrong guess
  const phase3 = frame >= 120 && frame < 180; // Adjustment
  const phase4 = frame >= 180; // Repeat millions of times

  const inputOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const guessOpacity = interpolate(frame, [30, 50], [0, 1], { extrapolateRight: "clamp" });
  const wrongOpacity = interpolate(frame, [60, 75], [0, 1], { extrapolateRight: "clamp" });
  const adjustOpacity = interpolate(frame, [120, 140], [0, 1], { extrapolateRight: "clamp" });
  const repeatOpacity = interpolate(frame, [180, 200], [0, 1], { extrapolateRight: "clamp" });
  const correctOpacity = interpolate(frame, [220, 240], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 40 }}>
      <div style={{ fontFamily, textAlign: "center" }}>
        <div style={{ fontSize: 36, color: "#00ffff", marginBottom: 50 }}>
          How does it learn?
        </div>

        {/* Step 1: Input */}
        <div style={{ marginBottom: 30, opacity: inputOpacity }}>
          <div style={{ fontSize: 28, color: "#888" }}>Input:</div>
          <div style={{ fontSize: 36, color: "#00ff00" }}>"The cat sat on the ___"</div>
        </div>

        {/* Step 2: Guess */}
        <div style={{ marginBottom: 30, opacity: guessOpacity }}>
          <div style={{ fontSize: 28, color: "#888" }}>Model guesses:</div>
          <div style={{ fontSize: 42, color: "#ff6b6b", opacity: wrongOpacity }}>
            "elephant"
            <span style={{ marginLeft: 20, opacity: wrongOpacity }}>❌</span>
          </div>
        </div>

        {/* Step 3: Adjust */}
        <div
          style={{
            fontSize: 32,
            color: "#00ffff",
            marginBottom: 30,
            opacity: adjustOpacity,
            padding: "15px 30px",
            border: "2px solid #00ffff",
            borderRadius: 12,
            display: "inline-block",
          }}
        >
          Adjust weights slightly →
        </div>

        {/* Step 4: Repeat */}
        <div style={{ opacity: repeatOpacity }}>
          <div style={{ fontSize: 28, color: "#888", marginBottom: 15 }}>
            Repeat billions of times...
          </div>
          <div style={{ fontSize: 42, color: "#00ff00", opacity: correctOpacity }}>
            "mat" <span style={{ marginLeft: 20 }}>✓</span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ARCHITECTURE VISUAL - Attention explained simply
const ArchitectureVisual: React.FC = () => {
  const frame = useCurrentFrame();

  const words = ["The", "king", "loved", "his", "queen"];
  const connections = [
    { from: 4, to: 1, strength: 0.9, label: "king → queen" },
    { from: 4, to: 2, strength: 0.6, label: "loved" },
  ];

  const showTitle = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const showWords = interpolate(frame, [30, 50], [0, 1], { extrapolateRight: "clamp" });
  const showConnections = interpolate(frame, [70, 100], [0, 1], { extrapolateRight: "clamp" });
  const showExplanation = interpolate(frame, [130, 150], [0, 1], { extrapolateRight: "clamp" });
  const showLayers = interpolate(frame, [180, 200], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 40 }}>
      <div style={{ fontFamily, textAlign: "center" }}>
        <div style={{ fontSize: 36, color: "#00ffff", marginBottom: 40, opacity: showTitle }}>
          The secret: <span style={{ color: "#00ff00" }}>Attention</span>
        </div>

        {/* Words in a row */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 30,
            marginBottom: 50,
            opacity: showWords,
            position: "relative",
          }}
        >
          {words.map((word, i) => (
            <div
              key={word}
              style={{
                fontSize: 36,
                color: i === 4 ? "#ff6b6b" : "#00ff00",
                padding: "15px 25px",
                border: `2px solid ${i === 4 ? "#ff6b6b" : "#00ff00"}`,
                borderRadius: 8,
                position: "relative",
              }}
            >
              {word}
            </div>
          ))}
        </div>

        {/* Connection explanation */}
        <div style={{ opacity: showConnections, marginBottom: 40 }}>
          <svg width="400" height="60" style={{ display: "block", margin: "0 auto" }}>
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#00ffff" />
              </marker>
            </defs>
            <path
              d="M 320 10 Q 200 -20 80 10"
              stroke="#00ffff"
              strokeWidth="2"
              fill="none"
              markerEnd="url(#arrowhead)"
              strokeDasharray={`${showConnections * 300} 300`}
            />
            <text x="200" y="55" fill="#888" fontSize="18" textAnchor="middle" fontFamily={fontFamily}>
              "queen" pays attention to "king"
            </text>
          </svg>
        </div>

        {/* Explanation */}
        <div style={{ fontSize: 28, color: "#888", opacity: showExplanation, lineHeight: 1.6 }}>
          Each word looks at other words
          <br />
          to understand <span style={{ color: "#00ffff" }}>context</span>
        </div>

        {/* Layers */}
        <div
          style={{
            marginTop: 40,
            opacity: showLayers,
            fontSize: 24,
            color: "#00ff00",
          }}
        >
          GPT-2 does this 36 times (layers) with 774M parameters
        </div>
      </div>
    </AbsoluteFill>
  );
};

// FINE-TUNING - Quick concept
const FineTuningSection: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const step1 = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const arrow = interpolate(frame, [30, 45], [0, 1], { extrapolateRight: "clamp" });
  const step2 = interpolate(frame, [50, 70], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 40 }}>
      <div style={{ fontFamily, textAlign: "center" }}>
        <div style={{ fontSize: 32, color: "#888", marginBottom: 40 }}>
          Fine-tuning = specialized training
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 40 }}>
          <div style={{ opacity: step1, textAlign: "center" }}>
            <div
              style={{
                fontSize: 36,
                color: "#00ff00",
                padding: "20px 30px",
                border: "2px solid #00ff00",
                borderRadius: 12,
              }}
            >
              GPT-2
            </div>
            <div style={{ fontSize: 20, color: "#666", marginTop: 10 }}>
              Knows English
            </div>
          </div>

          <div style={{ fontSize: 48, color: "#00ffff", opacity: arrow }}>→</div>

          <div style={{ opacity: step2, textAlign: "center" }}>
            <div
              style={{
                fontSize: 36,
                color: "#ff6b6b",
                padding: "20px 30px",
                border: "2px solid #ff6b6b",
                borderRadius: 12,
              }}
            >
              Shakespeare GPT
            </div>
            <div style={{ fontSize: 20, color: "#666", marginTop: 10 }}>
              Writes like the Bard
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// H100 - Quick flash
const H100Section: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({ frame, fps, config: { damping: 10, stiffness: 150 } });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{ fontFamily, textAlign: "center", transform: `scale(${scale})` }}>
        <div style={{ fontSize: 64, fontWeight: "bold", color: "#00ff00", textShadow: "0 0 30px #00ff00" }}>
          H100 GPU
        </div>
        <div style={{ fontSize: 32, color: "#888", marginTop: 20 }}>
          20 steps • 2 minutes
        </div>
      </div>
    </AbsoluteFill>
  );
};

// LOSS CHART
const LossChartSection: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 40 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 15 }}>
        <div
          style={{
            fontFamily,
            fontSize: 36,
            color: "#00ffff",
            opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          Loss = how wrong the guesses are
        </div>
        <LossChart
          data={trainingData.loss}
          startFrame={20}
          durationFrames={140}
          width={900}
          height={450}
        />
        <div
          style={{
            fontFamily,
            fontSize: 28,
            color: "#00ff00",
            opacity: interpolate(frame, [140, 160], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          Lower = better predictions ✓
        </div>
      </div>
    </AbsoluteFill>
  );
};

// GENERATION
const GenerationSection: React.FC = () => {
  const text = `ROMEO:
You're high.

LORIUS:
I am not a man of blood,
but a man of love.`;

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 40 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
        <div style={{ fontFamily, fontSize: 32, color: "#00ffff" }}>
          Now it generates Shakespeare:
        </div>
        <Terminal text={text} startFrame={20} charactersPerFrame={0.7} prefix=">>> " />
      </div>
    </AbsoluteFill>
  );
};

// REVEAL - Invented characters
const RevealSection: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const shake = frame < 20 ? Math.sin(frame * 3) * 4 : 0;
  const names = ["LORIUS", "PRINCETON"];

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{ fontFamily, textAlign: "center", transform: `translateX(${shake}px)` }}>
        <div style={{ fontSize: 48, color: "#ff6b6b", fontWeight: "bold", marginBottom: 40 }}>
          Wait... who?
        </div>

        {names.map((name, i) => {
          const delay = 40 + i * 30;
          const opacity = interpolate(frame, [delay, delay + 15], [0, 1], { extrapolateRight: "clamp" });

          return (
            <div
              key={name}
              style={{
                fontSize: 52,
                color: "#ff6b6b",
                fontWeight: "bold",
                textShadow: "0 0 20px #ff6b6b",
                opacity,
                marginBottom: 20,
              }}
            >
              {name}
            </div>
          );
        })}

        <div
          style={{
            fontSize: 28,
            color: "#00ff00",
            marginTop: 30,
            opacity: interpolate(frame, [120, 140], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          These don't exist in Shakespeare!
        </div>
      </div>
    </AbsoluteFill>
  );
};

// PUNCHLINE
const PunchlineSection: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 60 }}>
      <div style={{ fontFamily, textAlign: "center" }}>
        <div
          style={{
            fontSize: 44,
            color: "#00ff00",
            fontWeight: "bold",
            opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" }),
            lineHeight: 1.5,
          }}
        >
          It learned the <span style={{ color: "#00ffff" }}>pattern</span>
        </div>
        <div
          style={{
            fontSize: 44,
            color: "#ff6b6b",
            fontWeight: "bold",
            marginTop: 20,
            opacity: interpolate(frame, [30, 45], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          ...and made up the rest
        </div>
        <div
          style={{
            fontSize: 32,
            color: "#888",
            marginTop: 40,
            opacity: interpolate(frame, [70, 90], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          That's what LLMs do.
        </div>
      </div>
    </AbsoluteFill>
  );
};

// CTA
const CTASection: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 60 }}>
      <div style={{ fontFamily, textAlign: "center" }}>
        <div
          style={{
            display: "flex",
            gap: 40,
            marginBottom: 40,
            opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          {[
            { value: "774M", label: "params" },
            { value: "36", label: "layers" },
            { value: "20", label: "steps" },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 36, color: "#00ff00", fontWeight: "bold" }}>{stat.value}</div>
              <div style={{ fontSize: 16, color: "#666" }}>{stat.label}</div>
            </div>
          ))}
        </div>

        <div
          style={{
            fontSize: 28,
            color: "#00ffff",
            opacity: interpolate(frame, [40, 60], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          github.com/karpathy/nanoGPT
        </div>

        <div
          style={{
            fontSize: 24,
            color: "#888",
            marginTop: 30,
            opacity: interpolate(frame, [80, 100], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          Follow for more AI deep-dives
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Set to true once you've recorded all audio files
const AUDIO_ENABLED = true;

// Narration audio component - only renders if audio is enabled
const Narration: React.FC<{ src: string }> = ({ src }) => {
  if (!AUDIO_ENABLED) return null;
  return <Audio src={staticFile(src)} volume={1} />;
};

export const NanoGPTShort: React.FC = () => {
  return (
    <AbsoluteFill>
      <Background />

      {/* === VISUALS === */}
      <Sequence from={TIMING.hook.start} durationInFrames={TIMING.hook.duration}>
        <HookSection />
      </Sequence>

      <Sequence from={TIMING.whatIsLLM.start} durationInFrames={TIMING.whatIsLLM.duration}>
        <WhatIsLLM />
      </Sequence>

      <Sequence from={TIMING.trainingExplained.start} durationInFrames={TIMING.trainingExplained.duration}>
        <TrainingExplained />
      </Sequence>

      <Sequence from={TIMING.architectureVisual.start} durationInFrames={TIMING.architectureVisual.duration}>
        <ArchitectureVisual />
      </Sequence>

      <Sequence from={TIMING.fineTuning.start} durationInFrames={TIMING.fineTuning.duration}>
        <FineTuningSection />
      </Sequence>

      <Sequence from={TIMING.h100.start} durationInFrames={TIMING.h100.duration}>
        <H100Section />
      </Sequence>

      <Sequence from={TIMING.lossChart.start} durationInFrames={TIMING.lossChart.duration}>
        <LossChartSection />
      </Sequence>

      <Sequence from={TIMING.generation.start} durationInFrames={TIMING.generation.duration}>
        <GenerationSection />
      </Sequence>

      <Sequence from={TIMING.reveal.start} durationInFrames={TIMING.reveal.duration}>
        <RevealSection />
      </Sequence>

      <Sequence from={TIMING.punchline.start} durationInFrames={TIMING.punchline.duration}>
        <PunchlineSection />
      </Sequence>

      <Sequence from={TIMING.cta.start} durationInFrames={TIMING.cta.duration}>
        <CTASection />
      </Sequence>

      {/* === NARRATION AUDIO === */}
      {/* Each audio file plays at the start of its section */}
      <Sequence from={TIMING.hook.start}>
        <Narration src={AUDIO.hook} />
      </Sequence>

      <Sequence from={TIMING.whatIsLLM.start}>
        <Narration src={AUDIO.whatIsLLM} />
      </Sequence>

      <Sequence from={TIMING.trainingExplained.start}>
        <Narration src={AUDIO.training} />
      </Sequence>

      <Sequence from={TIMING.architectureVisual.start}>
        <Narration src={AUDIO.architecture} />
      </Sequence>

      <Sequence from={TIMING.fineTuning.start}>
        <Narration src={AUDIO.fineTuning} />
      </Sequence>

      <Sequence from={TIMING.h100.start}>
        <Narration src={AUDIO.h100} />
      </Sequence>

      <Sequence from={TIMING.lossChart.start}>
        <Narration src={AUDIO.loss} />
      </Sequence>

      <Sequence from={TIMING.generation.start}>
        <Narration src={AUDIO.generation} />
      </Sequence>

      <Sequence from={TIMING.reveal.start}>
        <Narration src={AUDIO.reveal} />
      </Sequence>

      <Sequence from={TIMING.punchline.start}>
        <Narration src={AUDIO.punchline} />
      </Sequence>

      <Sequence from={TIMING.cta.start}>
        <Narration src={AUDIO.cta} />
      </Sequence>
    </AbsoluteFill>
  );
};
