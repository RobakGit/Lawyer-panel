import { useRef } from "react";
import styles from "@/styles/CommentInput.module.css";
import { Button } from "@mui/material";

export default function CommentInput(
  props: Readonly<{
    onSend: (value: string) => void;
    onHeightChange?: (height: number) => void;
  }>
) {
  const { onSend, onHeightChange } = props;
  const spanElement = useRef<HTMLSpanElement>(null);
  const spanDefaultHeight = spanElement.current?.offsetHeight;
  onHeightChange && onHeightChange(spanDefaultHeight ?? 0);

  const onSpanInput = (e: React.FormEvent<HTMLSpanElement>) => {
    if (onHeightChange) {
      const spanTarget = e.currentTarget;
      onHeightChange(spanTarget.offsetHeight);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
    if (e.key === "Enter" && !e.shiftKey && spanElement.current) {
      e.preventDefault();
      sendText();
    }
  };

  const sendText = () => {
    if (spanElement.current) {
      onSend(spanElement.current.innerText);
      spanElement.current.textContent = "";
    }
  };

  return (
    <div className={styles.container}>
      <span
        ref={spanElement}
        className={styles.input}
        role="textbox"
        contentEditable
        onInput={onSpanInput}
        onKeyDown={onKeyDown}
        // @ts-ignore
        placeholder="Napisz komentarz..."
      ></span>
      <Button className={styles.button} variant="contained" onClick={sendText}>
        Wyślij
      </Button>
    </div>
  );
}
