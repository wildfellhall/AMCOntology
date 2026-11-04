import katex from "katex";
import { useMemo } from "react";
export function MathText({
  children,
  className = "",
}: {
  children: string;
  className?: string;
}) {
  const parts = useMemo(
    () =>
      children.split(/(\$[^$]+\$)/g).map((part, i) =>
        part.startsWith("$") && part.endsWith("$") ? (
          <span
            key={i}
            dangerouslySetInnerHTML={{
              __html: katex.renderToString(part.slice(1, -1), {
                throwOnError: false,
                trust: false,
                output: "htmlAndMathml",
              }),
            }}
          />
        ) : (
          <span key={i}>{part}</span>
        ),
      ),
    [children],
  );
  return <span className={className}>{parts}</span>;
}
export const M = MathText;
