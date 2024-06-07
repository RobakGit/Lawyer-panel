import styles from "@/styles/NotificationCard.module.css";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { Avatar } from "@mui/material";

export default function NotificationCard(
  props: Readonly<{ date: Date; type: string; title: string; message: string }>
) {
  const { date, type, title, message } = props;

  const typesIcon: Record<string, JSX.Element> = {
    info: <NotificationsNoneIcon />,
    event: <CalendarMonthIcon />,
  };

  return (
    <div className={styles.container}>
      <div className={styles.date}>{date.toLocaleDateString()}</div>
      <div className={styles.type}>
        <Avatar>{typesIcon[type] ?? <NotificationsNoneIcon />}</Avatar>
      </div>
      <div className={styles.title}>{title}</div>
      <div className={styles.message}>{message}</div>
    </div>
  );
}
