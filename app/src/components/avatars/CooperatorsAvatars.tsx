import { UserType } from "@/types/case";
import { AvatarGroup } from "@mui/material";
import { forwardRef } from "react";
import UserAvatar from "./UserAvatar";

export default forwardRef<HTMLDivElement, any>(function CooperatorsAvatars(
  props: Readonly<{
    cooperators: UserType[];
    onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
    inline?: boolean;
  }>,
  ref
) {
  const { cooperators, inline, onClick } = props;
  return (
    <AvatarGroup
      ref={ref}
      max={3}
      sx={{
        display: inline ? "inline-flex" : "flex",
        "& .MuiAvatar-root": { width: 24, height: 24, fontSize: 12 },
        ...(onClick && { cursor: "pointer" }),
      }}
      onClick={(e) => {
        if (onClick) onClick(e);
      }}
    >
      {cooperators.map((cooperator) => (
        <UserAvatar cooperator={cooperator} key={cooperator.uid} />
      ))}
    </AvatarGroup>
  );
});
