import styles from "@/styles/FileCard.module.css";
import Image from "next/image";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import { useState } from "react";
import SelectMenuList from "@/components/inputs/SelectMenuList";

const selectMenuList = [
  {
    element: { text: "Podejrzyj", icon: <VisibilityIcon fontSize="small" /> },
    actionName: "view",
  },
  {
    element: { text: "Pobierz", icon: <DownloadIcon fontSize="small" /> },
    actionName: "download",
  },
];

export default function FileCard(
  props: Readonly<{
    uid: string;
    filename: string;
    onDownload?: (uid: string) => void;
  }>
) {
  const { uid, filename, onDownload } = props;
  const fileExtension = filename.split(".").pop();
  const [moreIconRef, setMoreIconRef] = useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(moreIconRef);

  const iconsWithAlt = {
    pdf: { icon: "/pdf-icon.svg", alt: "pdf icon" },
    doc: { icon: "/doc-icon.svg", alt: "doc icon" },
    xls: { icon: "/xls-icon.svg", alt: "xls icon" },
  };

  const getFileIconData = (extension?: string) => {
    if (extension?.includes("pdf")) {
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
    e: React.MouseEvent<HTMLElement>,
    index: number
  ) => {
    const action = selectMenuList[index].actionName;
    if (action === "view") {
      console.log("viewing file");
    }
    if (action === "download") {
      onDownload && onDownload(uid);
    }
    return;
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
      <span className={styles.filename}>{filename}</span>
    </div>
  );
}
