import SelectMenuList from "../SelectMenuList";
import FolderIcon from "@mui/icons-material/Folder";

const selectMenuList = [
  {
    element: { text: "Dodaj katalog", icon: <FolderIcon fontSize="small" /> },
    actionName: "newDirectory",
  },
];

export default function FilesContextMenu(
  props: Readonly<{
    anchorPosition?: { top: number; left: number };
    onClose: (e: React.MouseEvent<HTMLElement>) => void;
    onNewDirectory: () => void;
  }>
) {
  const { anchorPosition, onClose, onNewDirectory } = props;

  const onSelectMenuClick = (
    _e: React.MouseEvent<HTMLElement>,
    index: number
  ) => {
    const action = selectMenuList[index].actionName;
    if (action === "newDirectory") {
      onNewDirectory();
    }
  };

  return (
    <SelectMenuList
      isMenuOpen={!!anchorPosition}
      anchorPosition={anchorPosition}
      onClose={onClose}
      onClick={onSelectMenuClick}
      menuElements={selectMenuList.map((el) => el.element)}
    />
  );
}
