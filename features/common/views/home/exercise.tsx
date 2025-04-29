import { twMerge } from "@/utils/twMerge";
import Link from "next/link";

export default function HomeExercise({
  label,
  href,
  className,
  index,
}: {
  label: string;
  href: string;
  className?: string;
  index: number;
}) {
  return (
    <Link
      href={href}
      className="absolute top-0 w-full flex justify-center items-center hover:mt-[-5dvh] transition-all duration-150 max-w-[500px]"
      style={{
        transform: `translateY(${index * 10}dvh)`,
      }}
    >
      <div
        className={twMerge(
          "bg-white rounded-[16px] p-[20px] w-full h-dvh",
          className
        )}
      >
        <p className="text-[28px] text-left">{label}</p>
      </div>
    </Link>
  );
}
