import CaseCard from "@/components/cards/CaseCard";
import { useSortable } from "@dnd-kit/sortable";
import { Grid2 as Grid } from "@mui/material";
import { CardState } from ".";

export default function KanbanCard({
  uid,
  title,
  destination,
  description,
  date,
  allUsers,
  client,
  opponent,
  cooperators,
  status,
}: CardState) {
  const { setNodeRef, attributes, listeners, transform, transition } =
    useSortable({
      id: uid,
      data: {
        type: "card",
        status,
        uid,
        title,
        destination,
        description,
        date,
        allUsers,
        client,
        opponent,
        cooperators,
      },
    });

  const style = {
    transform: transform
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
      size={{ xs: 12 }}
    >
      <CaseCard
        uid={uid}
        title={title}
        destination={destination}
        description={description}
        date={date}
        allUsers={allUsers}
        client={client}
        opponent={opponent}
        cooperators={cooperators}
        onUserClick={() => {}}
      />
    </Grid>
  );
}
