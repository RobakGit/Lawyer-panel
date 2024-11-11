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
    onDownload: (uid: string) => void;
    onDelete: (uid: string) => void;
    onNewDirectory: () => void;
    onChangeParent: (fileUid: string, newParentUid: string) => void;
    onOpenDirectory: (uid: string | null) => void;
    onFileView: (uid: string) => void;
    onChangeName: (uid: string, newName: string) => void;
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
    onFileView,
    onChangeName,
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
          onDownload={onDownload}
          onDelete={onDelete}
          onChangeParent={onChangeParent}
          onOpenDirectory={onOpenDirectory}
          onFileView={onFileView}
          onChangeName={onChangeName}
        />
        <FilesContextMenu
          anchorPosition={fileConentMenuPosition}
          onClose={() => setFileContentMenuPosition(undefined)}
          onNewDirectory={onNewDirectory}
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
