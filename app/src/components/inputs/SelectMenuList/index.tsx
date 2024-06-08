import { ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import { ReactElement } from "react";

export default function SelectMenuList(
  props: Readonly<{
    anchorEl: null | HTMLElement;
    isMenuOpen: boolean;
    onClose: (e: React.MouseEvent<HTMLElement>) => void;
    onClick: (e: React.MouseEvent<HTMLElement>, index: number) => void;
    menuElements: Array<{
      text: string;
      icon?: ReactElement;
      isActive?: boolean;
    }>;
  }>
) {
  const { anchorEl, isMenuOpen, onClose, onClick, menuElements } = props;

  const onMenuItemClick = (e: React.MouseEvent<HTMLElement>, index: number) => {
    onClick(e, index);
    onClose(e);
  };

  return (
    <Menu anchorEl={anchorEl} open={isMenuOpen} onClose={onClose}>
      {menuElements.map((element, index) => (
        <MenuItem
          key={element.text}
          onClick={(e) => onMenuItemClick(e, index)}
          sx={{ backgroundColor: element.isActive ? "#eee" : undefined }}
        >
          {element.icon && <ListItemIcon>{element.icon}</ListItemIcon>}
          <ListItemText>{element.text}</ListItemText>
        </MenuItem>
      ))}
    </Menu>
  );
}
