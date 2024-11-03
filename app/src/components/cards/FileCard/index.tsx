import styles from "@/styles/FileCard.module.css";
import Image from "next/image";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import { useState } from "react";
import SelectMenuList from "@/components/inputs/SelectMenuList";
import { DeleteForever } from "@mui/icons-material";

const selectMenuList = [
  {
    element: { text: "Podejrzyj", icon: <VisibilityIcon fontSize="small" /> },
    actionName: "view",
  },
  {
    element: { text: "Pobierz", icon: <DownloadIcon fontSize="small" /> },
    actionName: "download",
  },
  {
    element: {
      text: "Usuń",
      icon: <DeleteForever fontSize="small" />,
      sx: { background: "#ff00003f", "&:hover": { background: "#ff0000af" } },
    },
    actionName: "delete",
  },
];

const filenameLimit = 30;

export default function FileCard(
  props: Readonly<{
    uid: string;
    filename: string;
    isDirectory: boolean;
    onDownload: (uid: string) => void;
    onDelete: (uid: string) => void;
  }>
) {
  const { uid, filename, isDirectory, onDownload, onDelete } = props;
  const fileExtension = filename.split(".").pop();
  const [moreIconRef, setMoreIconRef] = useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(moreIconRef);

  const iconsWithAlt = {
    dir: { icon: "/folder-icon.svg", alt: "folder icon" },
    pdf: { icon: "/pdf-icon.svg", alt: "pdf icon" },
    doc: { icon: "/doc-icon.svg", alt: "doc icon" },
    xls: { icon: "/xls-icon.svg", alt: "xls icon" },
  };

  const getFileIconData = (extension?: string) => {
    if (isDirectory) {
      return iconsWithAlt.dir;
    } else if (extension?.includes("pdf")) {
      return iconsWithAlt.pdf;
    } else if (extension?.includes("doc")) {
      return iconsWithAlt.doc;
    } else if (extension?.includes("xls")) {
      return iconsWithAlt.xls;
    } else {
      return { icon: "/file-icon.svg", alt: "file icon" };
    }
  };

  const onSelectMenuClick = (
    _e: React.MouseEvent<HTMLElement>,
    index: number
  ) => {
    const action = selectMenuList[index].actionName;
    if (action === "view") {
      isDirectory ? console.log("open dir") : console.log("viewing file");
    }
    if (action === "download") {
      onDownload(uid);
    }
    if (action === "delete") {
      console.log("deleting file");
      onDelete(uid);
    }
  };

  return (
    <div className={styles.fileCard}>
      <MoreVertIcon
        onClick={(e) =>
          setMoreIconRef(e.currentTarget as unknown as HTMLElement)
        }
        className={styles.moreIcon}
      />
      <SelectMenuList
        anchorEl={moreIconRef}
        isMenuOpen={isMenuOpen}
        onClose={() => setMoreIconRef(null)}
        onClick={onSelectMenuClick}
        menuElements={selectMenuList.map((el) => el.element)}
      />
      <Image
        width={60}
        height={60}
        src={getFileIconData(fileExtension).icon}
        alt={getFileIconData(fileExtension).alt}
        className={styles.fileImage}
      />
      <span className={styles.filename}>
        {filename.length - (fileExtension?.length ?? 0) < filenameLimit
          ? filename
          : `${filename.slice(0, filenameLimit)}...${fileExtension}`}
      </span>
    </div>
  );
}
