import { ReactNode } from "react";

// These tags are available
type Tag = "br";

type UIRichTextProps = {
  children(tags: Record<Tag, (chunks: ReactNode) => ReactNode>): ReactNode;
};

export default function UIRichText({ children }: UIRichTextProps) {
  return (
    <>
      {children({
        br: () => <br />,
      })}
    </>
  );
}
