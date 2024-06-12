import uniqolor from "uniqolor";
import styles from "@/styles/CaseCard.module.css";
import CooperatorsAvatars from "@/components/avatars/CooperatorsAvatars";
import StatusSelector from "@/components/inputs/StatusSelector";
import { UserType } from "@/types/case";
import DOMPurify from "isomorphic-dompurify";
import axios from "axios";
import { useState } from "react";
import CooperatorsSelector from "@/components/inputs/CooperatorsSelector";
import { CaseStatus } from "@prisma/client";

export default function CaseCard(
  props: Readonly<{
    uid: string;
    date: Date;
    title: string;
    destination: string | null;
    description: string | null;
    status: string;
    cooperators: UserType[];
    allUsers: UserType[];
    onStatusChange: (uid: string, newStatus: CaseStatus) => void;
    onUserClick: (uid: string, user: UserType) => void;
    nextEvent?: string;
  }>
) {
  const {
    uid,
    date,
    title,
    destination,
    description,
    status,
    cooperators,
    allUsers,
    onStatusChange,
    onUserClick,
    nextEvent,
  } = props;

  return (
    <div
      className={styles.container}
      style={{
        backgroundColor:
          // kolor będzie z uid
          uniqolor(uid, {
            saturation: 30,
            lightness: [70, 92],
            differencePoint: 40,
          }).color + "5A",
      }}
      onClick={() => (window.location.href = `/case/${uid}`)}
    >
      <div className={styles.date}>{date.toLocaleDateString()}</div>
      <div className={styles.title}>{title}</div>
      <div className={styles.destination}>{destination}</div>
      <div className={styles.description}>{description}</div>
      <div className={styles.status}>
        <StatusSelector
          statusValue={status}
          onStatusChange={(status) => onStatusChange(uid, status)}
        />
      </div>
      <div className={styles.footerSection}>
        <div className={styles.cooperators}>
          <CooperatorsSelector
            cooperators={cooperators}
            allUsers={allUsers}
            onUserClick={(user) => onUserClick(uid, user)}
          />
        </div>
        <div className={styles.event}>{nextEvent}</div>
      </div>
    </div>
  );
}
