import { useRef, useState } from "react";
import SelectMenuList from "../SelectMenuList";
import { CaseStatus } from "@prisma/client";
import { Chip, colors, useTheme } from "@mui/material";

export default function StatusSelector(props: {
  statusValue: string;
  onStatusChange: (newStatus: CaseStatus) => void;
}) {
  const theme = useTheme();
  const { statusValue, onStatusChange } = props;
  const statusRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const statuses: {
    enum: string;
    displayName: string;
    color:
      | "default"
      | "primary"
      | "secondary"
      | "error"
      | "info"
      | "success"
      | "warning";
    sx: { color: string };
  }[] = [
    {
      enum: "waiting",
      displayName: "Oczekuje",
      color: "info",
      sx: { color: theme.palette.info.main },
    },
    {
      enum: "inProgress",
      displayName: "W trakcie",
      color: "success",
      sx: { color: theme.palette.success.main },
    },
    {
      enum: "done",
      displayName: "Zakończona",
      color: "default",
      sx: { color: theme.palette.text.primary },
    },
  ];
  const actualStatus = statuses.find((status) => status.enum === statusValue);

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
      <Chip
        ref={statusRef}
        variant="outlined"
        label={actualStatus?.displayName}
        color={actualStatus?.color}
        onClick={(e) => {
          onClick(e, true);
        }}
      />
      <SelectMenuList
        anchorEl={statusRef?.current}
        isMenuOpen={isMenuOpen}
        onClose={(e) => onClick(e, false)}
        onClick={(e, index) => onClick(e, index)}
        menuElements={statuses.map((status) => {
          return { text: status.displayName, sx: status.sx };
        })}
      />
    </>
  );
}
