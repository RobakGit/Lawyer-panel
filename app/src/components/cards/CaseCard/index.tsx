import styles from "@/styles/CaseCard.module.css";
import { ClientOrOpponentType, UserType } from "@/types/case";
import CooperatorsSelector from "@/components/inputs/CooperatorsSelector";
import { Box, Card, CardActions, CardContent, Typography } from "@mui/material";

export interface CaseCardProps {
  uid: string;
  date: Date;
  title: string;
  destination: string | null;
  client: ClientOrOpponentType | null;
  opponent: ClientOrOpponentType | null;
  description: string | null;
  cooperators: UserType[];
  allUsers: UserType[];
  onUserClick: (uid: string, user: UserType) => void;
}

export default function CaseCard({
  uid,
  date,
  title,
  destination,
  client,
  opponent,
  description,
  cooperators,
  allUsers,
  onUserClick,
}: CaseCardProps) {
  return (
    <Card
      className={styles.container}
      variant="outlined"
      onClick={() => (window.location.href = `/case/${uid}`)}
    >
      <CardContent>
        <Typography component="h6" variant="h6" fontWeight={600}>
          {title}
        </Typography>
        <Typography
          component="p"
          variant="subtitle2"
          gutterBottom
          sx={{ color: "text.secondary" }}
        >
          {destination}
        </Typography>
        <Typography component="p" variant="body2" gutterBottom>
          {description}
        </Typography>
        <Box
          sx={{
            marginTop: 2,
            display: "flex",
            alignItems: "center",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <Typography
            component="p"
            variant="subtitle2"
            gutterBottom
            sx={{ color: "text.secondary" }}
          >
            {opponent?.displayName}
          </Typography>
          <Typography
            component="p"
            variant="subtitle2"
            gutterBottom
            sx={{ color: "text.secondary" }}
          >
            {client?.displayName}
          </Typography>
        </Box>
      </CardContent>
      <CardActions>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            width: "90%",
            margin: "0 auto",
            justifyContent: "space-between",
          }}
        >
          <Typography component="p" variant="body2" gutterBottom>
            {date.toLocaleDateString()}
          </Typography>
          <CooperatorsSelector
            cooperators={cooperators}
            allUsers={allUsers}
            onUserClick={(user) => onUserClick(uid, user)}
          />
        </Box>
      </CardActions>
    </Card>
  );
}
