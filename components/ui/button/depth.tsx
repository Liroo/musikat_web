import { twMerge } from "@/utils/twMerge";

export default function UIButtonDepth({
  className,
  children,
  containerClassName,
  onClick,
}: {
  className?: string;
  containerClassName?: string;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      className={twMerge(
        "bg-black cursor-pointer relative rounded-[6px]",
        containerClassName
      )}
      onClick={onClick}
    >
      <div
        className={twMerge(
          "border rounded-[6px] border-black h-full w-full bg-white flex justify-center items-center px-[50px] py-[25px] translate-x-[-2px] translate-y-[-2px] transition-all duration-150 hover:translate-x-0 hover:translate-y-0",
          className
        )}
      >
        {children}
      </div>
    </button>
  );
}
