import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  Easing,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/JetBrainsMono";
import { Terminal } from "./components/Terminal";
import { LossChart } from "./components/LossChart";
import { HookText, TextOverlay } from "./components/TextOverlay";
import trainingData from "./data/training-loss.json";

const { fontFamily } = loadFont();

// SNAPPIER TIMING (30fps, 60 seconds = 1800 frames)
const TIMING = {
  hook: { start: 0, duration: 60 },           // 0-2s - punchy hook
  fineTuneExplainer: { start: 60, duration: 150 }, // 2-7s - what is fine-tuning?
  h100Flash: { start: 210, duration: 75 },    // 7-9.5s - H100 cloud flex
  lossChart: { start: 285, duration: 240 },   // 9.5-17.5s - faster loss animation
  generation: { start: 525, duration: 360 },  // 17.5-29.5s - combined generation
  inventedReveal: { start: 885, duration: 180 }, // 29.5-35.5s - "wait, who?"
  moreExamples: { start: 1065, duration: 240 }, // 35.5-43.5s - more invented names
  punchline: { start: 1305, duration: 195 },  // 43.5-50s - payoff
  cta: { start: 1500, duration: 300 },        // 50-60s - CTA
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
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.1) 2px, rgba(0, 0, 0, 0.1) 4px)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};

// HOOK - Punchy, 2 seconds
const HookSection: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({ frame, fps, config: { damping: 12, stiffness: 100 } });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          fontFamily,
          fontSize: 56,
          fontWeight: "bold",
          color: "#00ff00",
          textAlign: "center",
          textShadow: "0 0 30px #00ff00",
          transform: `scale(${scale})`,
          lineHeight: 1.4,
        }}
      >
        I fine-tuned GPT-2
        <br />
        <span style={{ color: "#00ffff" }}>on Shakespeare</span>
      </div>
    </AbsoluteFill>
  );
};

// FINE-TUNE EXPLAINER - Visual diagram
const FineTuneExplainer: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const step1 = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const arrow1 = interpolate(frame, [25, 40], [0, 1], { extrapolateRight: "clamp" });
  const step2 = interpolate(frame, [45, 65], [0, 1], { extrapolateRight: "clamp" });
  const arrow2 = interpolate(frame, [70, 85], [0, 1], { extrapolateRight: "clamp" });
  const step3 = interpolate(frame, [90, 110], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 40 }}>
      <div style={{ fontFamily, textAlign: "center" }}>
        {/* Title */}
        <div
          style={{
            fontSize: 36,
            color: "#888",
            marginBottom: 60,
            opacity: step1,
          }}
        >
          What is fine-tuning?
        </div>

        {/* Visual flow */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
          {/* Step 1: GPT-2 */}
          <div
            style={{
              opacity: step1,
              transform: `translateY(${(1 - step1) * 20}px)`,
            }}
          >
            <div
              style={{
                fontSize: 42,
                color: "#00ff00",
                padding: "20px 40px",
                border: "2px solid #00ff00",
                borderRadius: 12,
                textShadow: "0 0 15px #00ff00",
              }}
            >
              GPT-2 (774M params)
            </div>
            <div style={{ fontSize: 24, color: "#666", marginTop: 10 }}>
              Already knows English
            </div>
          </div>

          {/* Arrow 1 */}
          <div style={{ fontSize: 48, color: "#00ffff", opacity: arrow1 }}>↓</div>

          {/* Step 2: Shakespeare data */}
          <div
            style={{
              opacity: step2,
              transform: `translateY(${(1 - step2) * 20}px)`,
            }}
          >
            <div
              style={{
                fontSize: 36,
                color: "#00ffff",
                padding: "15px 30px",
                border: "2px solid #00ffff",
                borderRadius: 12,
              }}
            >
              + Shakespeare text
            </div>
            <div style={{ fontSize: 24, color: "#666", marginTop: 10 }}>
              40,000 lines of plays
            </div>
          </div>

          {/* Arrow 2 */}
          <div style={{ fontSize: 48, color: "#00ffff", opacity: arrow2 }}>↓</div>

          {/* Step 3: Result */}
          <div
            style={{
              opacity: step3,
              transform: `translateY(${(1 - step3) * 20}px)`,
            }}
          >
            <div
              style={{
                fontSize: 42,
                color: "#ff6b6b",
                fontWeight: "bold",
                textShadow: "0 0 20px #ff6b6b",
              }}
            >
              Writes like the Bard
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// H100 FLASH - Quick hardware flex
const H100Flash: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({ frame, fps, config: { damping: 10, stiffness: 150 } });
  const pulse = 1 + Math.sin(frame / 5) * 0.02;

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{ fontFamily, textAlign: "center", transform: `scale(${scale})` }}>
        <div
          style={{
            fontSize: 72,
            fontWeight: "bold",
            color: "#00ff00",
            textShadow: "0 0 40px #00ff00",
            transform: `scale(${pulse})`,
          }}
        >
          H100
        </div>
        <div style={{ fontSize: 32, color: "#00ffff", marginTop: 20 }}>
          in the cloud
        </div>
        <div
          style={{
            fontSize: 48,
            color: "#888",
            marginTop: 30,
            opacity: interpolate(frame, [30, 45], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          20 iterations • 2 minutes
        </div>
      </div>
    </AbsoluteFill>
  );
};

// LOSS CHART - Faster animation
const LossChartSection: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 40 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
        <div
          style={{
            fontFamily,
            fontSize: 42,
            color: "#00ffff",
            textShadow: "0 0 20px #00ffff",
            opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          Training...
        </div>
        <LossChart
          data={trainingData.loss}
          startFrame={15}
          durationFrames={200}
          width={950}
          height={550}
        />
      </div>
    </AbsoluteFill>
  );
};

// GENERATION - Combined, faster typing
const GenerationSection: React.FC = () => {
  const frame = useCurrentFrame();
  const text = `ROMEO:
You're high.

LORIUS:
I am not a man of blood,
but a man of love.`;

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 40 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
        <div
          style={{
            fontFamily,
            fontSize: 36,
            color: "#00ffff",
            opacity: interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          Let's generate some Shakespeare...
        </div>
        <Terminal
          text={text}
          startFrame={20}
          charactersPerFrame={0.8}
          prefix=">>> "
        />
      </div>
    </AbsoluteFill>
  );
};

// INVENTED REVEAL - "Wait, who?"
const InventedReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const shake = frame < 30 ? Math.sin(frame * 2) * 3 : 0;
  const scale = spring({ frame, fps, config: { damping: 8, stiffness: 200 } });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{ fontFamily, textAlign: "center", transform: `translateX(${shake}px)` }}>
        <div
          style={{
            fontSize: 64,
            fontWeight: "bold",
            color: "#ff6b6b",
            textShadow: "0 0 30px #ff6b6b",
            transform: `scale(${scale})`,
          }}
        >
          Wait...
        </div>
        <div
          style={{
            fontSize: 48,
            color: "#00ffff",
            marginTop: 40,
            opacity: interpolate(frame, [40, 60], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          Who is <span style={{ color: "#ff6b6b", fontWeight: "bold" }}>LORIUS</span>?
        </div>
        <div
          style={{
            fontSize: 36,
            color: "#888",
            marginTop: 30,
            opacity: interpolate(frame, [80, 100], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          Not in any Shakespeare play...
        </div>
      </div>
    </AbsoluteFill>
  );
};

// MORE EXAMPLES - Rapid fire invented names
const MoreExamples: React.FC = () => {
  const frame = useCurrentFrame();
  const names = ["LORIUS", "PRINCETON", "VARIUS", "SOLANIO II"];

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{ fontFamily, textAlign: "center" }}>
        <div style={{ fontSize: 32, color: "#888", marginBottom: 40 }}>
          The model invented:
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {names.map((name, i) => {
            const delay = i * 15;
            const opacity = interpolate(frame, [delay, delay + 10], [0, 1], { extrapolateRight: "clamp" });
            const x = interpolate(frame, [delay, delay + 15], [-50, 0], {
              extrapolateRight: "clamp",
              easing: Easing.out(Easing.cubic),
            });

            return (
              <div
                key={name}
                style={{
                  fontSize: 52,
                  fontWeight: "bold",
                  color: "#ff6b6b",
                  textShadow: "0 0 20px #ff6b6b",
                  opacity,
                  transform: `translateX(${x}px)`,
                }}
              >
                {name}
              </div>
            );
          })}
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#00ff00",
            marginTop: 50,
            opacity: interpolate(frame, [100, 120], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          None of these exist in Shakespeare!
        </div>
      </div>
    </AbsoluteFill>
  );
};

// PUNCHLINE - The insight
const PunchlineSection: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 60 }}>
      <div style={{ fontFamily, textAlign: "center" }}>
        <div
          style={{
            fontSize: 52,
            fontWeight: "bold",
            color: "#00ff00",
            textShadow: "0 0 30px #00ff00",
            opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" }),
            lineHeight: 1.4,
          }}
        >
          It learned the pattern.
        </div>
        <div
          style={{
            fontSize: 52,
            fontWeight: "bold",
            color: "#00ffff",
            textShadow: "0 0 30px #00ffff",
            marginTop: 30,
            opacity: interpolate(frame, [25, 40], [0, 1], { extrapolateRight: "clamp" }),
            lineHeight: 1.4,
          }}
        >
          Made up the rest.
        </div>
        <div
          style={{
            fontSize: 36,
            color: "#ff6b6b",
            marginTop: 50,
            opacity: interpolate(frame, [60, 80], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          That's how LLMs work.
        </div>
      </div>
    </AbsoluteFill>
  );
};

// CTA - Clean ending
const CTASection: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = 1 + Math.sin(frame / 10) * 0.02;

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 60 }}>
      <div style={{ fontFamily, textAlign: "center" }}>
        {/* Stats row */}
        <div
          style={{
            display: "flex",
            gap: 50,
            marginBottom: 60,
            opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          {[
            { value: "774M", label: "params" },
            { value: "~330", label: "lines" },
            { value: "20", label: "steps" },
            { value: "H100", label: "GPU" },
          ].map((stat, i) => (
            <div key={stat.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 36, color: "#00ff00", fontWeight: "bold" }}>{stat.value}</div>
              <div style={{ fontSize: 16, color: "#666" }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Repo */}
        <div
          style={{
            fontSize: 32,
            color: "#00ffff",
            opacity: interpolate(frame, [40, 60], [0, 1], { extrapolateRight: "clamp" }),
            transform: `scale(${pulse})`,
          }}
        >
          github.com/karpathy/nanoGPT
        </div>

        {/* Follow CTA */}
        <div
          style={{
            fontSize: 28,
            color: "#888",
            marginTop: 40,
            opacity: interpolate(frame, [80, 100], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          Follow for more AI experiments
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const NanoGPTShort: React.FC = () => {
  return (
    <AbsoluteFill>
      <Background />

      <Sequence from={TIMING.hook.start} durationInFrames={TIMING.hook.duration}>
        <HookSection />
      </Sequence>

      <Sequence from={TIMING.fineTuneExplainer.start} durationInFrames={TIMING.fineTuneExplainer.duration}>
        <FineTuneExplainer />
      </Sequence>

      <Sequence from={TIMING.h100Flash.start} durationInFrames={TIMING.h100Flash.duration}>
        <H100Flash />
      </Sequence>

      <Sequence from={TIMING.lossChart.start} durationInFrames={TIMING.lossChart.duration}>
        <LossChartSection />
      </Sequence>

      <Sequence from={TIMING.generation.start} durationInFrames={TIMING.generation.duration}>
        <GenerationSection />
      </Sequence>

      <Sequence from={TIMING.inventedReveal.start} durationInFrames={TIMING.inventedReveal.duration}>
        <InventedReveal />
      </Sequence>

      <Sequence from={TIMING.moreExamples.start} durationInFrames={TIMING.moreExamples.duration}>
        <MoreExamples />
      </Sequence>

      <Sequence from={TIMING.punchline.start} durationInFrames={TIMING.punchline.duration}>
        <PunchlineSection />
      </Sequence>

      <Sequence from={TIMING.cta.start} durationInFrames={TIMING.cta.duration}>
        <CTASection />
      </Sequence>
    </AbsoluteFill>
  );
};
