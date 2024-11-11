import styles from "@/styles/FileCard.module.css";
import Image from "next/image";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import { useState } from "react";
import SelectMenuList from "@/components/inputs/SelectMenuList";
import { DeleteForever, DriveFileRenameOutline } from "@mui/icons-material";
import ChangeNameDialog from "./ChangeNameDialog";

const filenameLimit = 30;

export default function FileCard(
  props: Readonly<{
    uid: string | null;
    filename: string;
    isDirectory: boolean;
    onDownload?: (uid: string) => void;
    onDelete?: (uid: string) => void;
    onOpenDirectory?: (uid: string | null) => void;
    onFileView?: (uid: string) => void;
    onChangeName?: (uid: string, newName: string) => void;
  }>
) {
  const {
    uid,
    filename,
    isDirectory,
    onDownload,
    onDelete,
    onOpenDirectory,
    onFileView,
    onChangeName,
  } = props;
  const fileExtension = filename.split(".").pop();
  const [moreIconRef, setMoreIconRef] = useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(moreIconRef);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);

  const selectMenuList = [
    {
      element: { text: "Podejrzyj", icon: <VisibilityIcon fontSize="small" /> },
      actionName: "view",
    },
    ...(!isDirectory
      ? [
          {
            element: {
              text: "Pobierz",
              icon: <DownloadIcon fontSize="small" />,
            },
            actionName: "download",
          },
        ]
      : []),
    {
      element: {
        text: "Zmień nazwę",
        icon: <DriveFileRenameOutline fontSize="small" />,
      },
      actionName: "rename",
    },
    {
      element: {
        text: "Usuń",
        icon: <DeleteForever fontSize="small" />,
        sx: {
          background: "#ff00003f",
          marginTop: "1rem",
          "&:hover": { background: "#ff0000af" },
        },
      },
      actionName: "delete",
    },
  ];

  const iconsWithAlt = {
    returnDir: { icon: "/exit-folder-icon.svg", alt: "exit folder" },
    dir: { icon: "/folder-icon.svg", alt: "folder icon" },
    pdf: { icon: "/pdf-icon.svg", alt: "pdf icon" },
    doc: { icon: "/doc-icon.svg", alt: "doc icon" },
    xls: { icon: "/xls-icon.svg", alt: "xls icon" },
  };

  const getFileIconData = (extension?: string) => {
    if (isDirectory) {
      if (filename === "..") {
        return iconsWithAlt.returnDir;
      } else {
        return iconsWithAlt.dir;
      }
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

  const download = (uid: string) => {
    onDownload && onDownload(uid);
  };

  const deleteFile = (uid: string) => {
    onDelete && onDelete(uid);
  };

  const openDirectory = (uid: string | null) => {
    onOpenDirectory && onOpenDirectory(uid);
  };

  const fileView = (uid: string) => {
    onFileView && onFileView(uid);
  };

  const onSelectMenuClick = (
    _e: React.MouseEvent<HTMLElement>,
    index: number
  ) => {
    if (!uid) return;
    const action = selectMenuList[index].actionName;
    if (action === "view") {
      if (isDirectory) {
        openDirectory(uid);
      } else {
        fileView(uid);
      }
    }
    if (action === "download") {
      download(uid);
    }
    if (action === "rename") {
      setIsRenameDialogOpen(true);
    }
    if (action === "delete") {
      deleteFile(uid);
    }
  };

  const onDoubleClick = () => {
    if (isDirectory) {
      openDirectory(uid);
    } else {
      if (uid) fileView(uid);
    }
  };

  const changeName = (newName: string) => {
    if (uid && newName && newName !== filename) {
      onChangeName && onChangeName(uid, newName);
    }
  };

  return (
    <>
      <div className={styles.fileCard} onDoubleClick={onDoubleClick}>
        {uid && (
          <MoreVertIcon
            onClick={(e) =>
              setMoreIconRef(e.currentTarget as unknown as HTMLElement)
            }
            className={styles.moreIcon}
          />
        )}
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
      <ChangeNameDialog
        open={isRenameDialogOpen}
        onClose={() => setIsRenameDialogOpen(false)}
        filename={filename}
        changeName={changeName}
      />
    </>
  );
}
