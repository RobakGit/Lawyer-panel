import styles from "@/styles/StatusSelector.module.css";
import { useRef, useState } from "react";
import SelectMenuList from "../SelectMenuList";
import { CaseStatus } from "@prisma/client";

export default function StatusSelector(props: {
  statusValue: string;
  onStatusChange: (newStatus: CaseStatus) => void;
}) {
  const { statusValue, onStatusChange } = props;
  const statusRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const statuses = [
    { enum: "waiting", displayName: "Oczekuje" },
    { enum: "inProgress", displayName: "W trakcie" },
    { enum: "done", displayName: "Zakończona" },
  ];

  const onSelect = (index: number) => {
    onStatusChange(statuses[index].enum as CaseStatus);
  };

  const onClick = (
    e: React.MouseEvent<HTMLElement>,
    valueToPass: boolean | number
  ) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    if (typeof valueToPass === "boolean") {
      setIsMenuOpen(valueToPass);
    } else {
      onSelect(valueToPass);
      setIsMenuOpen(false);
    }
  };

  return (
    <>
      <div
        ref={statusRef}
        className={styles.statusSelector}
        onClick={(e) => {
          onClick(e, true);
        }}
      >
        {statuses.find((status) => status.enum === statusValue)?.displayName}
      </div>
      <SelectMenuList
        anchorEl={statusRef?.current}
        isMenuOpen={isMenuOpen}
        onClose={(e) => onClick(e, false)}
        onClick={(e, index) => onClick(e, index)}
        menuElements={statuses.map((status) => {
          return { text: status.displayName };
        })}
      />
    </>
  );
}
