import { useMemo } from "react";
import { Card, CardContent, Grid2 as Grid, Typography } from "@mui/material";
import { SortableContext } from "@dnd-kit/sortable";
import KanbanCard from "./KanbanCard";
import { useDroppable } from "@dnd-kit/core";
import { CardState } from ".";

export interface KanbanCardsContainerProps {
  title: string;
  cards: CardState[];
}

export default function KanbanCardsContainer({
  title,
  cards,
}: KanbanCardsContainerProps) {
  const cardsUid = useMemo(() => cards.map((card) => card.uid), [cards]);

  const { setNodeRef } = useDroppable({
    id: title,
    data: { type: "container", status: title },
  });

  return (
    <Grid ref={setNodeRef} size={{ xs: 12, md: 4 }}>
      <Card sx={{ flexGrow: 1, padding: 1 }}>
        <CardContent>
          <Typography
            component="h5"
            variant="h5"
            gutterBottom
            sx={{ color: "text.secondary" }}
          >
            {title}
          </Typography>
          <Grid container spacing={2}>
            <SortableContext items={cardsUid}>
              {cards.map((card) => (
                <KanbanCard key={card.uid} {...card} />
              ))}
            </SortableContext>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
}
