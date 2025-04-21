export type Toast = {
  id?: string;
  createdAt?: number;

  duration?: number;
  status: "success" | "warning" | "error" | "info";

  text: string;
  timerRef?: React.MutableRefObject<NodeJS.Timeout | null>;
};
