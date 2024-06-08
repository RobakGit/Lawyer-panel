import { useRef, useState } from "react";
import SelectMenuList from "../SelectMenuList";
import CooperatorsAvatars from "@/components/avatars/CooperatorsAvatars";
import { UserType } from "@/types/case";
import UserAvatar from "@/components/avatars/UserAvatar";

export default function CooperatorsSelector(props: {
  cooperators: UserType[];
  allUsers: UserType[];
  onUserClick: (user: UserType) => void;
}) {
  const { cooperators, allUsers, onUserClick } = props;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const cooperatorsRef = useRef<HTMLElement>(null);

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
      onUserClick(allUsers[valueToPass]);
    }
  };

  return (
    <>
      <CooperatorsAvatars
        ref={cooperatorsRef}
        cooperators={cooperators}
        onClick={(e) => onClick(e, true)}
      />
      {cooperatorsRef && (
        <SelectMenuList
          anchorEl={cooperatorsRef.current}
          isMenuOpen={isMenuOpen}
          onClose={(e) => onClick(e, false)}
          onClick={(e, index) => onClick(e, index)}
          menuElements={allUsers.map((user) => {
            return {
              text: user.firstName + " " + user.lastName,
              icon: (
                <UserAvatar
                  cooperator={user}
                  sx={{ fontSize: 12, marginRight: 1, width: 24, height: 24 }}
                />
              ),
              isActive: cooperators.some(
                (cooperator) => cooperator.uid === user.uid
              ),
            };
          })}
        />
      )}
    </>
  );
}
