import styles from "@/styles/NewCard.module.css";
import { AddCircle } from "@mui/icons-material";

export default function NewCard(props: { onClick: () => void }) {
  const { onClick } = props;
  return (
    <button className={styles.container} onClick={onClick}>
      <div className={styles.title}>Dodaj nową sprawę</div>
      <div className={styles.icon}>
        <AddCircle fontSize="inherit" />
      </div>
    </button>
  );
}
