import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <div className="z-20 flex flex-col items-center justify-start min-h-screen py-2 mt-10">
      <div className="flex flex-col justify-center items-center my-5">
        <div className="relative">
          <div
            className={cn(
              "absolute inset-0 -z-10 opacity-30 dark:opacity-20 rounded-3xl",
              "bg-[linear-gradient(to_right,#ef4444_1px,transparent_1px),linear-gradient(to_bottom,#ef4444_1px,transparent_1px)]",
              "bg-size-[4rem_4rem]",
              "mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black_40%,transparent_100%)",
              "overflow-hidden"
            )}
          />
          <Image
            src={"/hero.svg"}
            alt="hero"
            height={600}
            width={600}
            className="relative z-10"
          />
        </div>
        <h1 className=" z-20 text-6xl mt-5 font-extrabold text-center bg-clip-text text-transparent bg-linear-to-r from-red-600 via-rose-600 to-red-500 dark:from-red-500 dark:via-rose-500 dark:to-red-400 tracking-tight leading-[1.3] ">
          Vibe Code it.
        </h1>
        <p className="mt-2 text-lg text-center text-red-700/80 dark:text-red-300/80 px-5 py-10 max-w-2xl">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora
          repellat et incidunt, harum saepe quod, dolor dignissimos, quisquam
          ipsam ad illum. Cupiditate odio inventore eos tenetur omnis soluta
          facilis eligendi?
        </p>
        <Link href={"/dashboard"}>
          <Button
            variant={"default"}
            className="mb-4 bg-red-600 hover:bg-red-700 text-white dark:bg-red-500 dark:hover:bg-red-600"
            size={"lg"}
          >
            Get Started
            <ArrowUpRight className="size-3.5 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
