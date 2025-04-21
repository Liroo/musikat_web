import LottieLoadingJson from "@/assets/lottie/loading.json";
import { flatten } from "lottie-colorify";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("react-lottie"), { ssr: false });

export default function UILoading({
  loading,
  size = 50,
  color = "#FFFFFF",
}: {
  loading: boolean;
  size?: number;
  color?: string;
}) {
  if (!loading) return null;

  return (
    <Lottie
      options={{
        loop: true,
        autoplay: true,
        animationData: flatten(color, LottieLoadingJson),
      }}
      width={size}
      height={size}
    />
  );
}
