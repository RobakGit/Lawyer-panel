import styles from "@/styles/FilesPanelWithUploader.module.css";
import FileCard from "../../cards/FileCard";
import { Button } from "@mui/material";
import { useDropzone } from "react-dropzone";
import { File as FileType } from "@/types/case";

export default function FilesPanelWithUploader(
  props: Readonly<{
    files: FileType[];
    uploadFiles: (files: File[]) => void;
    onDownload?: (uid: string) => void;
    onDelete?: (uid: string) => void;
  }>
) {
  const { files, uploadFiles, onDownload, onDelete } = props;

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
      <div className={styles.filesGridContainer}>
        {files.map((file) => (
          <FileCard
            key={file.uid}
            uid={file.uid}
            filename={file.name}
            onDownload={download}
            onDelete={deleteFile}
          />
        ))}
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
