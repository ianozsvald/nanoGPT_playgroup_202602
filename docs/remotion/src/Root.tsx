import { Composition } from "remotion";
import { NanoGPTShort } from "./NanoGPTShort";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="NanoGPTShort"
        component={NanoGPTShort}
        durationInFrames={2120} // ~70.7 seconds synced to audio
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
