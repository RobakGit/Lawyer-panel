import { Grid2 as Grid } from "@mui/material";
import { useDroppable } from "@dnd-kit/core";
import { File as FileType } from "@/types/case";
import FileCard from "@/components/cards/FileCard";

export default function OutOfParentDroppable({
  file,
  onOpenDirectory,
}: {
  file: FileType;
  onOpenDirectory: (uid: string | null) => void;
}) {
  const { setNodeRef } = useDroppable({
    id: file.uid,
    data: {
      type: "directory",
      ...file,
      uid: file.directory?.uid ?? null,
    },
  });

  return (
    <Grid ref={setNodeRef} size={{ xs: 2 }}>
      <FileCard
        uid={file.directory?.uid ?? null}
        filename=".."
        isDirectory={true}
        onDownload={() => {}}
        onDelete={() => {}}
        onOpenDirectory={onOpenDirectory}
      />
    </Grid>
  );
}
