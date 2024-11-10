import { useMemo, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { File as FileType } from "@/types/case";

import { SortableContext } from "@dnd-kit/sortable";
import FileCard from "./FileCard";
import OutOfParentDroppable from "./OutOfParentDroppable";
import { createPortal } from "react-dom";
import File from "@/components/cards/FileCard";
import { Grid2 as Grid } from "@mui/material";

interface FilesGridProps {
  files: FileType[];
  directory: FileType | null;
  onDownload: (uid: string) => void;
  onDelete: (uid: string) => void;
  onChangeParent: (fileUid: string, newParentUid: string) => void;
  onOpenDirectory: (uid: string | null) => void;
  onFileView: (uid: string) => void;
}

export interface ActuallyDraggingFile extends FileType {
  type: "file" | "directory";
}

export function FilesGrid({
  files,
  directory,
  onDownload,
  onDelete,
  onChangeParent,
  onOpenDirectory,
  onFileView,
}: FilesGridProps) {
  const filesUid = useMemo(() => files.map((file) => file.uid), [files]);
  const [actuallyDragging, setActuallyDragging] =
    useState<null | ActuallyDraggingFile>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 15,
      },
    })
  );

  const onDragStart = (event: DragStartEvent) => {
    if (event.active.data.current) {
      setActuallyDragging(event.active.data.current as ActuallyDraggingFile);
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    setActuallyDragging(null);
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }
    const currentAtive = active.data.current;
    const currentOver = over.data.current;

    if (!currentAtive || !currentOver) {
      return;
    }

    if (currentOver.isDirectory) {
      onChangeParent(currentAtive.uid, currentOver.uid);
    } else {
      // change file order
    }
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <Grid container spacing={4}>
        {createPortal(
          <DragOverlay>
            {actuallyDragging && (
              <File
                {...actuallyDragging}
                filename={actuallyDragging.name}
                onDelete={() => {}}
                onDownload={() => {}}
                onOpenDirectory={() => {}}
                onFileView={() => {}}
              />
            )}
          </DragOverlay>,
          document.body
        )}
        {directory && (
          <OutOfParentDroppable
            file={directory}
            onOpenDirectory={onOpenDirectory}
          />
        )}
        <SortableContext items={filesUid}>
          {files.map((file) => (
            <FileCard
              key={file.uid}
              file={file}
              actuallyDragging={actuallyDragging}
              onDownload={onDownload}
              onDelete={onDelete}
              onOpenDirectory={onOpenDirectory}
              onFileView={onFileView}
            />
          ))}
        </SortableContext>
      </Grid>
    </DndContext>
  );
}
