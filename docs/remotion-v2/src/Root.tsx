import { Composition } from "remotion";
import { NanoGPTShort } from "./NanoGPTShort";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="NanoGPTShort"
        component={NanoGPTShort}
        durationInFrames={60 * 30} // 60 seconds at 30fps
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
