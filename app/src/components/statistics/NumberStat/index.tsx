import { Card, CardContent, Grid2 as Grid, Typography } from "@mui/material";

export default function NumberStat(
  props: Readonly<{ number: number; label: string }>
) {
  const { number, label } = props;

  return (
    <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
      <Card variant="outlined" sx={{ height: "100%", flexGrow: 1 }}>
        <CardContent>
          <Typography component="h2" variant="subtitle2" gutterBottom>
            {label}
          </Typography>
          <Typography variant="h4" component="p">
            {number}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
}
