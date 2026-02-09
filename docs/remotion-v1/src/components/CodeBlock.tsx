import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/JetBrainsMono";

const { fontFamily } = loadFont();

interface CodeBlockProps {
  code: string;
  startFrame: number;
  highlightLines?: number[];
  scrollSpeed?: number;
  title?: string;
}

const syntaxHighlight = (code: string): React.ReactNode[] => {
  const lines = code.split("\n");

  return lines.map((line, lineIndex) => {
    const tokens: React.ReactNode[] = [];
    let remaining = line;
    let keyIndex = 0;

    const patterns: { regex: RegExp; color: string }[] = [
      { regex: /^(\s*#.*)$/, color: "#6a9955" }, // Comments
      { regex: /^(\s*""".*"""|\s*'''.*''')$/, color: "#6a9955" }, // Docstrings
      { regex: /(def |class |return |import |from |if |else |for |in |while |with |as |assert |try |except |raise |pass |break |continue |and |or |not |is |None |True |False |self )/, color: "#c586c0" }, // Keywords
      { regex: /(@\w+)/, color: "#dcdcaa" }, // Decorators
      { regex: /(\d+\.?\d*)/, color: "#b5cea8" }, // Numbers
      { regex: /(["'].*?["'])/, color: "#ce9178" }, // Strings
      { regex: /(\w+)\s*\(/, color: "#dcdcaa" }, // Function calls
    ];

    // Simple tokenization
    const words = remaining.split(/(\s+|[()[\]{},.:=+\-*/<>])/);

    words.forEach((word, i) => {
      if (!word) return;

      let color = "#d4d4d4"; // Default

      // Keywords
      if (/^(def|class|return|import|from|if|else|elif|for|in|while|with|as|assert|try|except|raise|pass|break|continue|and|or|not|is|lambda|yield|global|nonlocal|async|await)$/.test(word)) {
        color = "#c586c0";
      }
      // Built-in constants
      else if (/^(None|True|False|self)$/.test(word)) {
        color = "#569cd6";
      }
      // Numbers
      else if (/^\d+\.?\d*$/.test(word)) {
        color = "#b5cea8";
      }
      // Strings
      else if (/^["'].*["']$/.test(word)) {
        color = "#ce9178";
      }
      // Comments (simplified)
      else if (word.startsWith("#")) {
        color = "#6a9955";
      }
      // Decorators
      else if (word.startsWith("@")) {
        color = "#dcdcaa";
      }

      tokens.push(
        <span key={`${lineIndex}-${keyIndex++}`} style={{ color }}>
          {word}
        </span>
      );
    });

    return (
      <div key={lineIndex} style={{ minHeight: "1.5em" }}>
        {tokens.length > 0 ? tokens : "\u00A0"}
      </div>
    );
  });
};

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  startFrame,
  highlightLines = [],
  scrollSpeed = 0,
  title = "model.py",
}) => {
  const frame = useCurrentFrame();
  const relativeFrame = Math.max(0, frame - startFrame);

  const scrollOffset = scrollSpeed > 0 ? relativeFrame * scrollSpeed : 0;

  const opacity = interpolate(relativeFrame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  const lines = code.split("\n");

  return (
    <div
      style={{
        backgroundColor: "#1e1e1e",
        borderRadius: 12,
        overflow: "hidden",
        width: "90%",
        maxHeight: 800,
        opacity,
        boxShadow: "0 0 30px rgba(0, 255, 0, 0.2)",
        border: "1px solid #00ff00",
      }}
    >
      {/* Title bar */}
      <div
        style={{
          backgroundColor: "#2d2d2d",
          padding: "12px 20px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          borderBottom: "1px solid #404040",
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

      {/* Code content */}
      <div
        style={{
          padding: 20,
          fontFamily,
          fontSize: 18,
          lineHeight: 1.5,
          overflow: "hidden",
          transform: `translateY(-${scrollOffset}px)`,
        }}
      >
        {lines.map((line, index) => {
          const isHighlighted = highlightLines.includes(index + 1);
          const highlightProgress = isHighlighted
            ? interpolate(
                relativeFrame,
                [10, 25],
                [0, 1],
                { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
              )
            : 0;

          return (
            <div
              key={index}
              style={{
                display: "flex",
                backgroundColor: isHighlighted
                  ? `rgba(0, 255, 0, ${0.15 * highlightProgress})`
                  : "transparent",
                marginLeft: -20,
                marginRight: -20,
                paddingLeft: 20,
                paddingRight: 20,
                borderLeft: isHighlighted
                  ? `3px solid rgba(0, 255, 0, ${highlightProgress})`
                  : "3px solid transparent",
              }}
            >
              <span
                style={{
                  color: "#858585",
                  width: 40,
                  textAlign: "right",
                  marginRight: 20,
                  userSelect: "none",
                }}
              >
                {index + 1}
              </span>
              <span style={{ color: "#d4d4d4", flex: 1 }}>
                {syntaxHighlight(line)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const CodeStats: React.FC<{
  startFrame: number;
  lines: number;
  parameters: string;
}> = ({ startFrame, lines, parameters }) => {
  const frame = useCurrentFrame();
  const relativeFrame = Math.max(0, frame - startFrame);

  const opacity = interpolate(relativeFrame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  const countProgress = interpolate(relativeFrame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const displayLines = Math.floor(lines * countProgress);

  return (
    <div
      style={{
        display: "flex",
        gap: 60,
        opacity,
        fontFamily,
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontSize: 64,
            fontWeight: "bold",
            color: "#00ff00",
            textShadow: "0 0 20px #00ff00",
          }}
        >
          ~{displayLines}
        </div>
        <div
          style={{
            fontSize: 20,
            color: "#00ffff",
            textTransform: "uppercase",
            letterSpacing: 2,
          }}
        >
          Lines of Code
        </div>
      </div>
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontSize: 64,
            fontWeight: "bold",
            color: "#00ff00",
            textShadow: "0 0 20px #00ff00",
          }}
        >
          {parameters}
        </div>
        <div
          style={{
            fontSize: 20,
            color: "#00ffff",
            textTransform: "uppercase",
            letterSpacing: 2,
          }}
        >
          Parameters
        </div>
      </div>
    </div>
  );
};
