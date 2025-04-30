import { twMerge } from "@/utils/twMerge";

export default function UIButton({
  className,
  children,
  onClick,
  disabled,
}: {
  className?: string;
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      disabled={disabled}
      className={twMerge(
        "border rounded-[6px] border-black h-full w-full bg-white flex justify-center items-center px-[50px] py-[25px] transition-all cursor-pointer hover:opacity-80",
        className
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
