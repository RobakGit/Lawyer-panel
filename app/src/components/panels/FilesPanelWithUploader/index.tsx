import styles from "@/styles/FilesPanelWithUploader.module.css";
import { Button } from "@mui/material";
import { useDropzone } from "react-dropzone";
import { File as FileType } from "@/types/case";
import { useState } from "react";
import FilesContextMenu from "@/components/inputs/FilesContextMenu";
import { FilesGrid } from "@/components/dragAndDrop/FilesGrid";

export default function FilesPanelWithUploader(
  props: Readonly<{
    files: FileType[];
    directory: FileType | null;
    uploadFiles: (files: File[]) => void;
    onDownload?: (uid: string) => void;
    onDelete?: (uid: string) => void;
    onNewDirectory?: () => void;
    onChangeParent?: (fileUid: string, newParentUid: string) => void;
    onOpenDirectory?: (uid: string | null) => void;
  }>
) {
  const {
    files,
    directory,
    uploadFiles,
    onDownload,
    onDelete,
    onNewDirectory,
    onChangeParent,
    onOpenDirectory,
  } = props;

  const [fileConentMenuPosition, setFileContentMenuPosition] = useState<
    | {
        top: number;
        left: number;
      }
    | undefined
  >(undefined);

  const onDrop = (acceptedFiles: File[]) => {
    uploadFiles(acceptedFiles);
  };
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    noClick: true,
  });

  const download = (uid: string) => {
    onDownload && onDownload(uid);
    return;
  };

  const deleteFile = (uid: string) => {
    onDelete && onDelete(uid);
    return;
  };

  const changeParent = (fileUid: string, newParentUid: string) => {
    onChangeParent && onChangeParent(fileUid, newParentUid);
    return;
  };

  const openDirectory = (uid: string | null) => {
    onOpenDirectory && onOpenDirectory(uid);
    return;
  };

  const newDirectory = () => {
    onNewDirectory && onNewDirectory();
    return;
  };

  const FileGridHandleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setFileContentMenuPosition({ top: e.clientY, left: e.clientX });
  };

  return (
    <div
      className={styles.container}
      {...getRootProps()}
      style={
        isDragActive
          ? { background: "rgba(0, 0, 0, 0.1)" }
          : { background: "white" }
      }
    >
      <h3>Pliki:</h3>
      <div
        style={{ minHeight: "100px" }}
        onContextMenu={FileGridHandleContextMenu}
      >
        <FilesGrid
          files={files}
          directory={directory}
          onDownload={download}
          onDelete={deleteFile}
          onChangeParent={changeParent}
          onOpenDirectory={openDirectory}
        />
        <FilesContextMenu
          anchorPosition={fileConentMenuPosition}
          onClose={() => setFileContentMenuPosition(undefined)}
          onNewDirectory={newDirectory}
        />
      </div>
      <span className={styles.uploadPrompt}>
        Aby dodać plik, przeciągnij go tutaj lub kliknij poniżej
      </span>
      <input {...getInputProps()} />
      <Button variant="contained" color="primary" onClick={open}>
        Dodaj plik
      </Button>
    </div>
  );
}
