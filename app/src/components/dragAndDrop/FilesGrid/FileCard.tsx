import { useSortable } from "@dnd-kit/sortable";
import { Grid2 as Grid } from "@mui/material";
import File from "@/components/cards/FileCard";
import { ActuallyDraggingFile } from ".";
import { File as FileType } from "@/types/case";

interface SortableContext {
  id: string;
  data: ActuallyDraggingFile;
}

interface DraggableFileCardProps {
  actuallyDragging: ActuallyDraggingFile | null;
  file: FileType;
  onDownload: (uid: string) => void;
  onDelete: (uid: string) => void;
  onOpenDirectory: (uid: string | null) => void;
  onFileView: (uid: string) => void;
}

export default function FileCard({
  actuallyDragging,
  file,
  onDownload,
  onDelete,
  onOpenDirectory,
  onFileView,
}: DraggableFileCardProps) {
  const sortableData: SortableContext = {
    id: file.uid,
    data: {
      type: file.isDirectory ? "directory" : "file",
      ...file,
    },
  };
  const { setNodeRef, attributes, listeners, transform, transition } =
    useSortable(sortableData);

  const style = {
    transform:
      transform && (!file.isDirectory || actuallyDragging?.uid === file.uid)
        ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
        : undefined,
    transition,
  };

  return (
    <Grid
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      size={{ xs: 2 }}
    >
      <File
        key={file.uid}
        uid={file.uid}
        filename={file.name}
        isDirectory={file.isDirectory}
        onDownload={onDownload}
        onDelete={onDelete}
        onOpenDirectory={onOpenDirectory}
        onFileView={onFileView}
      />
    </Grid>
  );
}
