import styles from "@/styles/TextEditor.module.css";
import { ReactElement } from "react";

export default function FunctionButton(
  props: Readonly<{ icon: ReactElement; onClick?: () => void }>
) {
  const { icon, onClick } = props;

  return (
    <div className={styles.functionButton} onClick={onClick}>
      {icon}
    </div>
  );
}
