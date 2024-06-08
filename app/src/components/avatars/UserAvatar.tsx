import { UserType } from "@/types/case";
import { Avatar, SxProps } from "@mui/material";
import uniqolor from "uniqolor";

export default function UserAvatar(
  props: Readonly<{
    cooperator: UserType;
    sx?: SxProps;
  }>
) {
  const { cooperator, sx } = props;
  return (
    <Avatar
      sx={{
        ...sx,
        bgcolor: uniqolor(cooperator.uid, {
          lightness: [0, 30],
        }).color,
      }}
    >{`${cooperator.firstName[0]}${cooperator.lastName[0]}`}</Avatar>
  );
}
