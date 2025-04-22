import { useCallback, useEffect, useRef } from "react";

export default function UIInputCheckbox({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.checked = checked;
    }
  }, [checked]);

  const onClick = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  }, []);

  return (
    <div
      className="cursor-pointer relative flex justify-center items-center border border-black rounded-full w-[24px] h-[24px] bg-white shrink-0 grow-0"
      onClick={onClick}
    >
      {checked && <div className="w-[16px] h-[16px] bg-grey-5 rounded-full" />}
      <input
        ref={inputRef}
        type="checkbox"
        className="hidden"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
    </div>
  );
}
