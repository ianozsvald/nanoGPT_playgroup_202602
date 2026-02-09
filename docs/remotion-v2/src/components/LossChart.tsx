import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/JetBrainsMono";

const { fontFamily } = loadFont();

interface LossDataPoint {
  step: number;
  train: number;
  val: number | null;
}

interface LossChartProps {
  data: LossDataPoint[];
  startFrame: number;
  durationFrames: number;
  width?: number;
  height?: number;
}

export const LossChart: React.FC<LossChartProps> = ({
  data,
  startFrame,
  durationFrames,
  width = 900,
  height = 500,
}) => {
  const frame = useCurrentFrame();
  const relativeFrame = Math.max(0, frame - startFrame);

  const progress = interpolate(
    relativeFrame,
    [0, durationFrames],
    [0, 1],
    {
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  const padding = { top: 40, right: 40, bottom: 60, left: 80 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const trainValues = data.map((d) => d.train);
  const minLoss = Math.min(...trainValues) - 0.1;
  const maxLoss = Math.max(...trainValues) + 0.1;
  const maxStep = Math.max(...data.map((d) => d.step));

  const scaleX = (step: number) => (step / maxStep) * chartWidth;
  const scaleY = (loss: number) =>
    chartHeight - ((loss - minLoss) / (maxLoss - minLoss)) * chartHeight;

  const pointsToShow = Math.ceil(data.length * progress);
  const visibleData = data.slice(0, pointsToShow);

  const pathD = visibleData
    .map((d, i) => `${i === 0 ? "M" : "L"} ${scaleX(d.step)} ${scaleY(d.train)}`)
    .join(" ");

  const currentLoss = visibleData.length > 0
    ? visibleData[visibleData.length - 1].train
    : data[0].train;

  return (
    <div
      style={{
        backgroundColor: "#0a0a0a",
        padding: 30,
        borderRadius: 12,
        border: "1px solid #00ff00",
        boxShadow: "0 0 20px rgba(0, 255, 0, 0.2)",
      }}
    >
      <svg width={width} height={height}>
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((t) => {
          const y = padding.top + t * chartHeight;
          const loss = maxLoss - t * (maxLoss - minLoss);
          return (
            <g key={t}>
              <line
                x1={padding.left}
                y1={y}
                x2={width - padding.right}
                y2={y}
                stroke="#1a3a1a"
                strokeWidth={1}
              />
              <text
                x={padding.left - 10}
                y={y + 5}
                fill="#00ff00"
                fontSize={14}
                textAnchor="end"
                fontFamily={fontFamily}
              >
                {loss.toFixed(2)}
              </text>
            </g>
          );
        })}

        {/* X-axis labels */}
        {[0, 5, 10, 15, 20].map((step) => (
          <text
            key={step}
            x={padding.left + scaleX(step)}
            y={height - 20}
            fill="#00ff00"
            fontSize={14}
            textAnchor="middle"
            fontFamily={fontFamily}
          >
            {step}
          </text>
        ))}

        {/* Axis labels */}
        <text
          x={width / 2}
          y={height - 5}
          fill="#00ffff"
          fontSize={16}
          textAnchor="middle"
          fontFamily={fontFamily}
        >
          Training Steps
        </text>
        <text
          x={20}
          y={height / 2}
          fill="#00ffff"
          fontSize={16}
          textAnchor="middle"
          fontFamily={fontFamily}
          transform={`rotate(-90, 20, ${height / 2})`}
        >
          Loss
        </text>

        {/* Loss curve */}
        <g transform={`translate(${padding.left}, ${padding.top})`}>
          <path
            d={pathD}
            fill="none"
            stroke="#00ff00"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              filter: "drop-shadow(0 0 8px #00ff00)",
            }}
          />

          {/* Current point glow */}
          {visibleData.length > 0 && (
            <>
              <circle
                cx={scaleX(visibleData[visibleData.length - 1].step)}
                cy={scaleY(visibleData[visibleData.length - 1].train)}
                r={8}
                fill="#00ff00"
                style={{
                  filter: "drop-shadow(0 0 15px #00ff00)",
                }}
              />
              <circle
                cx={scaleX(visibleData[visibleData.length - 1].step)}
                cy={scaleY(visibleData[visibleData.length - 1].train)}
                r={4}
                fill="#ffffff"
              />
            </>
          )}
        </g>
      </svg>

      {/* Current loss display */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: 20,
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 36,
          color: "#00ff00",
          textShadow: "0 0 20px #00ff00",
        }}
      >
        Loss: {currentLoss.toFixed(3)}
      </div>
    </div>
  );
};
