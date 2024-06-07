import styles from "@/styles/NumberStat.module.css";

export default function NumberStat(
  props: Readonly<{ number: number; label: string }>
) {
  const { number, label } = props;

  return (
    <div className={styles.container}>
      <div className={styles.number}>{number}</div>
      <div className={styles.label}>{label}</div>
    </div>
  );
}
