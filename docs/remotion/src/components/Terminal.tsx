import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  AbsoluteFill,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/JetBrainsMono";

const { fontFamily } = loadFont();

const CURSOR_BLINK_FRAMES = 16;

type TerminalProps = {
  text: string;
  startFrame?: number;
  charactersPerFrame?: number;
  prefix?: string;
  highlightCharacters?: boolean;
};

export const Terminal: React.FC<TerminalProps> = ({
  text,
  startFrame = 0,
  charactersPerFrame = 0.5,
  prefix = "",
  highlightCharacters = true,
}) => {
  const frame = useCurrentFrame();
  const relativeFrame = Math.max(0, frame - startFrame);

  const charsToShow = Math.floor(relativeFrame * charactersPerFrame);
  const displayedText = text.slice(0, charsToShow);
  const isComplete = charsToShow >= text.length;
  const hasStarted = frame >= startFrame;

  // Frame-based cursor blink (not CSS animation)
  const cursorOpacity = interpolate(
    frame % CURSOR_BLINK_FRAMES,
    [0, CURSOR_BLINK_FRAMES / 2, CURSOR_BLINK_FRAMES],
    [1, 0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Render text with character name highlighting
  const renderText = () => {
    if (!highlightCharacters) {
      return <span>{displayedText}</span>;
    }

    const lines = displayedText.split("\n");
    return lines.map((line, i) => {
      // Check if line starts with a character name (CAPS followed by colon)
      const match = line.match(/^([A-Z]+):(.*)$/);
      if (match) {
        return (
          <div key={i} style={{ marginBottom: 8 }}>
            <span style={{ color: "#00ffff", fontWeight: "bold" }}>
              {match[1]}:
            </span>
            <span style={{ color: "#00ff00" }}>{match[2]}</span>
          </div>
        );
      }
      return (
        <div key={i} style={{ marginBottom: 8 }}>
          {line || "\u00A0"}
        </div>
      );
    });
  };

  return (
    <div
      style={{
        fontFamily,
        fontSize: 32,
        color: "#00ff00",
        backgroundColor: "#0a0a0a",
        padding: 40,
        borderRadius: 12,
        border: "2px solid #00ff00",
        boxShadow: "0 0 30px rgba(0, 255, 0, 0.3)",
        width: "90%",
        minHeight: 200,
        position: "relative",
      }}
    >
      {/* Scanline effect */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 0, 0.03) 2px, rgba(0, 255, 0, 0.03) 4px)",
          pointerEvents: "none",
          borderRadius: 10,
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        {prefix && (
          <span style={{ color: "#00ffff", opacity: 0.7 }}>{prefix}</span>
        )}
        <div
          style={{
            whiteSpace: "pre-wrap",
            textShadow: "0 0 10px #00ff00",
            lineHeight: 1.5,
          }}
        >
          {renderText()}
        </div>
        {hasStarted && !isComplete && (
          <span
            style={{
              display: "inline-block",
              width: 12,
              height: 28,
              backgroundColor: "#00ff00",
              marginLeft: 2,
              opacity: cursorOpacity,
            }}
          />
        )}
      </div>
    </div>
  );
};

type MultiLineTerminalProps = {
  lines: { text: string; delay: number }[];
  startFrame?: number;
  charactersPerFrame?: number;
};

export const MultiLineTerminal: React.FC<MultiLineTerminalProps> = ({
  lines,
  startFrame = 0,
  charactersPerFrame = 0.5,
}) => {
  const frame = useCurrentFrame();

  // Frame-based cursor blink
  const cursorOpacity = interpolate(
    frame % CURSOR_BLINK_FRAMES,
    [0, CURSOR_BLINK_FRAMES / 2, CURSOR_BLINK_FRAMES],
    [1, 0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        fontFamily,
        fontSize: 28,
        color: "#00ff00",
        backgroundColor: "#0a0a0a",
        padding: 40,
        borderRadius: 12,
        border: "2px solid #00ff00",
        boxShadow: "0 0 30px rgba(0, 255, 0, 0.3)",
        width: "90%",
        minHeight: 400,
        position: "relative",
      }}
    >
      {/* Scanline effect */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 0, 0.03) 2px, rgba(0, 255, 0, 0.03) 4px)",
          pointerEvents: "none",
          borderRadius: 10,
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        {lines.map((line, index) => {
          const lineStartFrame = startFrame + line.delay;
          const relativeFrame = Math.max(0, frame - lineStartFrame);
          const charsToShow = Math.floor(relativeFrame * charactersPerFrame);
          const displayedText = line.text.slice(0, charsToShow);
          const isTyping =
            frame >= lineStartFrame && charsToShow < line.text.length;

          if (frame < lineStartFrame) return null;

          // Check if it's a character name line
          const match = displayedText.match(/^([A-Z]+):(.*)$/s);

          return (
            <div key={index} style={{ marginBottom: 16 }}>
              {match ? (
                <>
                  <span style={{ color: "#00ffff", fontWeight: "bold" }}>
                    {match[1]}:
                  </span>
                  <span
                    style={{
                      whiteSpace: "pre-wrap",
                      textShadow: "0 0 10px #00ff00",
                    }}
                  >
                    {match[2]}
                  </span>
                </>
              ) : (
                <span
                  style={{
                    whiteSpace: "pre-wrap",
                    textShadow: "0 0 10px #00ff00",
                  }}
                >
                  {displayedText}
                </span>
              )}
              {isTyping && (
                <span
                  style={{
                    display: "inline-block",
                    width: 10,
                    height: 24,
                    backgroundColor: "#00ff00",
                    marginLeft: 2,
                    opacity: cursorOpacity,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const TerminalWindow: React.FC<
  TerminalProps & { title?: string }
> = ({ title = "sample.txt", ...props }) => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0a0a",
        justifyContent: "center",
        alignItems: "center",
        padding: 40,
      }}
    >
      <div style={{ width: "100%", maxWidth: 1000 }}>
        {/* Window header */}
        <div
          style={{
            backgroundColor: "#1a1a1a",
            padding: "12px 20px",
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
            borderBottom: "1px solid #333",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", gap: 8 }}>
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: "#ff5f56",
              }}
            />
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: "#ffbd2e",
              }}
            />
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: "#27ca40",
              }}
            />
          </div>
          <span
            style={{
              fontFamily,
              fontSize: 14,
              color: "#888",
            }}
          >
            {title}
          </span>
        </div>
        <Terminal {...props} />
      </div>
    </AbsoluteFill>
  );
};
