import Image from "next/image";
import Weather from "@/src/components/weatherPrediction"

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-between py-32 px-16 bg-desk sm:items-start">
      <Weather/>
    </div>
  );
}
