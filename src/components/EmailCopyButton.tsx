import { Check, Copy, TriangleAlert } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Lang } from "../types";

type CopyStatus = "idle" | "copied" | "failed";

async function copyText(value: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(value);
      return;
    } catch {
      // Fall through for browsers that expose Clipboard API but deny access.
    }
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();

  try {
    if (!document.execCommand("copy")) throw new Error("Copy command failed");
  } finally {
    textarea.remove();
  }
}

interface Props {
  email: string;
  lang: Lang;
  label: string;
  className: string;
}

export default function EmailCopyButton({ email, lang, label, className }: Props) {
  const [status, setStatus] = useState<CopyStatus>("idle");
  const resetTimer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (resetTimer.current !== null) window.clearTimeout(resetTimer.current);
    },
    []
  );

  const handleCopy = async () => {
    try {
      await copyText(email);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }

    if (resetTimer.current !== null) window.clearTimeout(resetTimer.current);
    resetTimer.current = window.setTimeout(() => setStatus("idle"), 2200);
  };

  const statusLabel =
    status === "copied"
      ? lang === "ko"
        ? "주소 복사됨"
        : "Email copied"
      : status === "failed"
        ? lang === "ko"
          ? "복사 실패"
          : "Copy failed"
        : label;

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={className}
      aria-label={`${statusLabel}: ${email}`}
      title={email}
    >
      {status === "copied" ? (
        <Check size={16} strokeWidth={1.75} />
      ) : status === "failed" ? (
        <TriangleAlert size={16} strokeWidth={1.75} />
      ) : (
        <Copy size={16} strokeWidth={1.75} />
      )}
      <span aria-live="polite">{statusLabel}</span>
    </button>
  );
}
