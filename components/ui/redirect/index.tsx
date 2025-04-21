import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function UIRedirect({ to }: { to: string }) {
  const router = useRouter();

  useEffect(() => {
    router.replace(to);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [to]);

  return null;
}
