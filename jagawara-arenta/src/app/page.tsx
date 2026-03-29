import Image from "next/image";
import Weather from "@/src/components/weatherPrediction"

export default function Home() {
  return (
    <div>
      <div className="sticky p-2 lg:p-4 bg-white w-full h-fit shadow-xl items-center flex justify-between lg:justify-start lg:gap-4">
        <div className="w-10 h-10 lg:w-14 lg:h-14 relative items-center order-1">
          <Image
            src="/icon/mountain.svg" alt="icon"
            fill className="object-contain"
          />
        </div>
        <div className="flex flex-col justify-center text-center lg:text-left leading-tight order-2 lg:order-3">
          <h1 className="text-[#0B592F] text-[24px] lg:text-[36px] font-bold">JAGAWARA ARENTA</h1>
          <h3 className="text-[#936440] text-[14px] lg:text-[20px] font-semi-bold">Sensor Dashboard</h3>
        </div>
        <div className="w-10 h-10 lg:w-14 lg:h-14 relative items-center order-3 lg:order-2">
          <Image
            src="/icon/CloudRain.svg" alt="icon"
            fill className="object-contain"
          />
        </div>
      </div>
      <div className="flex min-h-screen w-full flex-col items-center justify-between py-12 xl:py-32 px-4 xl:px-16 bg-desk sm:items-start">
        <Weather/>
      </div>
    </div>
  );
}
