import { useEffect, useState } from "react";
import { CaseStatus } from "@prisma/client";
import { Grid2 as Grid } from "@mui/material";
import KanbanCardsContainer from "./KanbanCardContainer";
import { createPortal } from "react-dom";
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
import CaseCard, { CaseCardProps } from "@/components/cards/CaseCard";

interface KanbanGridProps {
  cases: CardState[];
  onDrop: (uid: string, newStatus: CaseStatus) => void;
}

interface ContainerState {
  title: CaseStatus;
}

export interface CardState extends CaseCardProps {
  status: CaseStatus;
}

export function KanbanGrid({ cases, onDrop }: KanbanGridProps) {
  const [actuallyDragging, setActuallyDragging] = useState<any>(null);
  const [cards, setCards] = useState<CardState[]>([]);
  const [containers, _setContainers] = useState<ContainerState[]>([
    { title: "waiting" },
    { title: "inProgress" },
    { title: "done" },
  ]);

  useEffect(() => {
    setCards([...cases]);
  }, [cases]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 15,
      },
    })
  );

  const onDragStart = (event: DragStartEvent) => {
    if (event.active.data.current) {
      setActuallyDragging(event.active.data.current);
    }
  };

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }
    if (!active.data.current || !over.data.current) {
      return;
    }
    const currentOver = over.data.current;
    const currentActive = active.data.current;

    if (currentActive?.status !== currentOver?.status) {
      const newCards = cards.map((card) =>
        card.uid === currentActive?.uid
          ? { ...card, status: currentOver?.status }
          : card
      );
      setCards([...newCards]);
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    setActuallyDragging(null);
    const { active, over } = event;
    if (!over) {
      return;
    }
    const currentActive = active.data.current;
    const activeOriginalCase = cases.find(
      (caseItem) => caseItem.uid === currentActive?.uid
    );

    if (
      activeOriginalCase &&
      activeOriginalCase.status !== currentActive?.status
    ) {
      onDrop(currentActive?.uid, currentActive?.status);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
    >
      <Grid container spacing={4} width={"100%"}>
        {createPortal(
          <DragOverlay>
            {actuallyDragging && (
              <CaseCard
                {...actuallyDragging}
                onStatusChange={() => {}}
                onUserClick={() => {}}
              />
            )}
          </DragOverlay>,
          document.body
        )}
        {containers.map(({ title }, index) => (
          <KanbanCardsContainer
            title={title}
            cards={[...cards.filter((card) => card.status === title)]}
            key={index}
          />
        ))}
      </Grid>
    </DndContext>
  );
}
