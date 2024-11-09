import NotificationCard from "@/components/cards/NotificationCard";
import { Activity } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

export default function NotificationsPanel({
  notifications,
  isOpen,
}: Readonly<{
  notifications: Activity[];
  isOpen: boolean;
}>) {
  return (
    <>
      {isOpen && <div>Powiadomienia</div>}
      <div
        style={{
          height: isOpen ? "calc(97vh - 2rem)" : "0px",
          overflow: "auto",
          transition: "height .5s ease-in-out",
        }}
      >
        {isOpen &&
          notifications.map((notification) => (
            <NotificationCard
              key={uuidv4()}
              date={new Date(notification.createdAt)}
              type={notification.type}
              title={notification.title}
              message={notification.message}
            />
          ))}
      </div>
    </>
  );
}
