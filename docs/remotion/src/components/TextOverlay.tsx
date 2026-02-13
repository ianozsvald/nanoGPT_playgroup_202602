import React from "react";
import { useCurrentFrame, interpolate, Easing, spring, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/JetBrainsMono";

const { fontFamily } = loadFont();

interface TextOverlayProps {
  text: string;
  startFrame: number;
  durationFrames?: number;
  fontSize?: number;
  color?: string;
  position?: "top" | "center" | "bottom";
  animation?: "fade" | "slide" | "scale" | "typewriter";
}

export const TextOverlay: React.FC<TextOverlayProps> = ({
  text,
  startFrame,
  durationFrames = 90,
  fontSize = 48,
  color = "#00ff00",
  position = "center",
  animation = "fade",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const relativeFrame = frame - startFrame;

  if (relativeFrame < 0 || relativeFrame > durationFrames) {
    return null;
  }

  const fadeIn = interpolate(relativeFrame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(
    relativeFrame,
    [durationFrames - 15, durationFrames],
    [1, 0],
    { extrapolateLeft: "clamp" }
  );
  const opacity = Math.min(fadeIn, fadeOut);

  let transform = "";
  let displayText = text;

  switch (animation) {
    case "slide":
      const slideY = interpolate(relativeFrame, [0, 20], [50, 0], {
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.cubic),
      });
      transform = `translateY(${slideY}px)`;
      break;
    case "scale":
      const scale = spring({
        frame: relativeFrame,
        fps,
        config: { damping: 15, stiffness: 100 },
      });
      transform = `scale(${scale})`;
      break;
    case "typewriter":
      const charsToShow = Math.floor(relativeFrame * 0.8);
      displayText = text.slice(0, charsToShow);
      break;
    default:
      break;
  }

  const positionStyles: React.CSSProperties = {
    top: position === "top" ? 100 : position === "center" ? "50%" : "auto",
    bottom: position === "bottom" ? 100 : "auto",
    transform:
      position === "center"
        ? `translateY(-50%) ${transform}`
        : transform,
  };

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        ...positionStyles,
      }}
    >
      <div
        style={{
          fontFamily,
          fontSize,
          fontWeight: "bold",
          color,
          textAlign: "center",
          opacity,
          textShadow: `0 0 20px ${color}, 0 0 40px ${color}`,
          padding: "0 40px",
          maxWidth: "90%",
        }}
      >
        {displayText}
      </div>
    </div>
  );
};

interface StatOverlayProps {
  label: string;
  value: string | number;
  startFrame: number;
  durationFrames?: number;
  position?: { x: number; y: number };
}

export const StatOverlay: React.FC<StatOverlayProps> = ({
  label,
  value,
  startFrame,
  durationFrames = 90,
  position = { x: 50, y: 50 },
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const relativeFrame = frame - startFrame;

  if (relativeFrame < 0 || relativeFrame > durationFrames) {
    return null;
  }

  const scale = spring({
    frame: relativeFrame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const fadeOut = interpolate(
    relativeFrame,
    [durationFrames - 15, durationFrames],
    [1, 0],
    { extrapolateLeft: "clamp" }
  );

  return (
    <div
      style={{
        position: "absolute",
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: `translate(-50%, -50%) scale(${scale})`,
        opacity: fadeOut,
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontFamily,
          fontSize: 24,
          color: "#00ffff",
          textTransform: "uppercase",
          letterSpacing: 2,
          marginBottom: 8,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily,
          fontSize: 64,
          fontWeight: "bold",
          color: "#00ff00",
          textShadow: "0 0 30px #00ff00",
        }}
      >
        {value}
      </div>
    </div>
  );
};

interface HookTextProps {
  lines: string[];
  startFrame: number;
}

export const HookText: React.FC<HookTextProps> = ({ lines, startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const relativeFrame = frame - startFrame;

  if (relativeFrame < 0) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        textAlign: "center",
        width: "90%",
      }}
    >
      {lines.map((line, index) => {
        const lineDelay = index * 20;
        const lineFrame = relativeFrame - lineDelay;

        if (lineFrame < 0) return null;

        const opacity = interpolate(lineFrame, [0, 10], [0, 1], {
          extrapolateRight: "clamp",
        });

        const y = interpolate(lineFrame, [0, 15], [30, 0], {
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        });

        return (
          <div
            key={index}
            style={{
              fontFamily,
              fontSize: index === 0 ? 52 : 40,
              fontWeight: "bold",
              color: index === 0 ? "#00ff00" : "#00ffff",
              textShadow:
                index === 0
                  ? "0 0 30px #00ff00"
                  : "0 0 20px #00ffff",
              opacity,
              transform: `translateY(${y}px)`,
              marginBottom: 20,
            }}
          >
            {line}
          </div>
        );
      })}
    </div>
  );
};
