import CooperatorsAvatars from "@/components/avatars/CooperatorsAvatars";
import CooperatorsSelector from "@/components/inputs/CooperatorsSelector";
import StatusSelector from "@/components/inputs/StatusSelector";
import styles from "@/styles/CaseHeaderPanel.module.css";
import { UserType } from "@/types/case";
import { AxiosResponse } from "axios";
import { useState } from "react";

export default function CaseHeaderPanel(
  props: Readonly<{
    title: string;
    date: Date;
    destination: string | null;
    status: string;
    cooperators: UserType[];
    allUsers: UserType[];
    nextEvent?: string;
    updateCaseData: (data: {
      title?: string;
      destination?: string;
      status?: string;
      cooperator?: UserType;
      description?: string;
    }) => Promise<AxiosResponse>;
  }>
) {
  const {
    title,
    date,
    destination,
    status,
    cooperators,
    allUsers,
    nextEvent,
    updateCaseData,
  } = props;

  const [edditedElement, setEdditedElement] = useState<string | null>(null);
  const [titleValue, setTitleValue] = useState(title);
  const [destinationValue, setDestinationValue] = useState(destination);
  const [statusValue, setStatusValue] = useState(status);
  const [cooperatorsValue, setCooperatorsValue] = useState(cooperators);

  const focusEdditedElement = (
    e: React.MouseEvent<HTMLElement>,
    valueType: "title" | "destination"
  ) => {
    setEdditedElement(valueType);
    const element = e.currentTarget;
    setTimeout(() => element.focus(), 0);
  };

  const onBlur = (
    e: React.FocusEvent<HTMLElement>,
    valueType: "title" | "destination"
  ) => {
    setEdditedElement(null);
    if (!e.target.textContent) return;

    const gettersNSetters = {
      title: { get: titleValue, set: setTitleValue },
      destination: { get: destinationValue, set: setDestinationValue },
    };

    const textContent = e.target.textContent.trim();
    if (gettersNSetters[valueType].get !== textContent) {
      gettersNSetters[valueType].set(textContent);
      updateCaseData({ [valueType]: textContent });
    }
  };

  const onStatusChange = (newStatus: string) => {
    if (statusValue === newStatus) return;
    setStatusValue(newStatus);
    updateCaseData({ status: newStatus });
  };

  const onUserClick = async (user: UserType) => {
    const response = await updateCaseData({ cooperator: user });
    setCooperatorsValue(response.data.users);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span
          contentEditable={edditedElement === "title"}
          suppressContentEditableWarning={true}
          onClick={(e) => focusEdditedElement(e, "title")}
          onBlur={(e) => onBlur(e, "title")}
          className={`${styles.editable} ${styles.title}`}
        >
          {titleValue}
        </span>
        <p>Data utworzenia: {date.toLocaleDateString()}</p>
      </div>
      <div className={styles.dataContainer}>
        <div className={styles.leftSide}>
          <p>
            Sąd:{" "}
            <i
              contentEditable={edditedElement === "destination"}
              suppressContentEditableWarning={true}
              onClick={(e) => focusEdditedElement(e, "destination")}
              onBlur={(e) => onBlur(e, "destination")}
              className={styles.editable}
            >
              {destinationValue}
            </i>
          </p>
          <div>
            Status:{" "}
            <StatusSelector
              statusValue={statusValue}
              onStatusChange={onStatusChange}
            />
          </div>
        </div>
        <div className={styles.rightSide}>
          <div>
            {/* Przypisani: <CooperatorsAvatars inline cooperators={cooperators} /> */}
            Przypisani:{" "}
            <CooperatorsSelector
              cooperators={cooperatorsValue}
              allUsers={allUsers}
              onUserClick={onUserClick}
            />
          </div>
          <p>
            Najbliższe wydarzenie: <i>{nextEvent}</i>
          </p>
        </div>
      </div>
    </div>
  );
}
