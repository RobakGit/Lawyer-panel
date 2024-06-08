import CaseCard from "@/components/cards/CaseCard";
import NumberStat from "@/components/statistics/NumberStat";
import { Box, Grid } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import styles from "@/styles/Home.module.css";
import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import NotificationCard from "@/components/cards/NotificationCard";
import axios from "axios";
import { CaseBackendType, UserType } from "@/types/case";
import NewCard from "@/components/cards/CaseCard/NewCard";
import DOMPurify from "isomorphic-dompurify";

export default function Home() {
  const [cases, setCases] = useState<CaseBackendType[]>([]);
  const [allUsers, setAllUsers] = useState<UserType[]>([]);
  const [stats, setStats] = useState<{ inProgress: number; new: number }>({
    inProgress: 0,
    new: 0,
  });

  useEffect(() => {
    axios.get("/api/home").then((response) => {
      setCases(response.data);
    });
    axios.get("/api/users").then((response) => {
      setAllUsers(response.data);
    });
  }, []);

  useEffect(() => {
    setStats({
      inProgress: cases.filter((caseItem) => caseItem.status === "inProgress")
        .length,
      new: cases.filter((caseItem) => caseItem.status === "waiting").length,
    });
  }, [cases]);

  const notifications = [
    {
      date: new Date(),
      type: "info",
      title: "Nowa sprawa",
      message: "Zostałeś dopisany do nowej sprawy",
    },
    {
      date: new Date(),
      type: "event",
      title: "Zbliżajaca się rozprawa",
      message: "Rozprawa w czwartek",
    },
  ];
  const [listType, setListType] = useState<"list" | "grid">("grid");

  const columns = [
    { field: "date", headerName: "Data", width: 150 },
    { field: "title", headerName: "Tytuł", width: 150 },
    { field: "destination", headerName: "Miejsce", width: 150 },
    { field: "description", headerName: "Opis", width: 150 },
    { field: "status", headerName: "Status", width: 150 },
    { field: "cooperators", headerName: "Współpracownicy", width: 150 },
    { field: "nextEvent", headerName: "Następne wydarzenie", width: 150 },
  ];

  const createNewCase = () => {
    axios.post("/api/case").then((response) => {
      window.location.href = `/case/${response.data.uid}`;
    });
  };

  const clearHTMLTagsAndLimit = (text: string | null) => {
    return (
      DOMPurify.sanitize(text || "Brak", {
        ALLOWED_TAGS: [],
      })
        .replace(/\n/g, " ")
        .slice(0, 100) + "..."
    );
  };

  return (
    <Grid container spacing={2}>
      <Grid item xl={9}>
        <Grid container>
          <Grid item container>
            <Grid item xs={10}>
              Sprawy
            </Grid>
            <Grid item xs={2}>
              {new Date().toLocaleDateString()}
            </Grid>
          </Grid>
          <Grid item container>
            <Grid item lg={10}>
              <Box display={"flex"} flexDirection={"row"}>
                <NumberStat number={stats.inProgress} label={"W trakcie"} />
                <NumberStat number={stats.new} label={"Nowe"} />
                <NumberStat number={cases.length} label={"Wszystkie"} />
              </Box>
            </Grid>
            <Grid item lg={2}>
              {/* Dodać sortowanie/filtrowanie po klientach lub firmach ubezpieczeniowych */}
              <FormatListBulletedIcon
                className={styles.icon}
                sx={
                  listType === "list"
                    ? { bgcolor: "black", color: "white" }
                    : { ":hover": { bgcolor: "grey", color: "white" } }
                }
                onClick={() => {
                  setListType("list");
                }}
              />
              <ViewModuleIcon
                className={styles.icon}
                sx={
                  listType === "grid"
                    ? { bgcolor: "black", color: "white" }
                    : { ":hover": { bgcolor: "grey", color: "white" } }
                }
                onClick={() => {
                  setListType("grid");
                }}
              />
            </Grid>
          </Grid>
          <Grid item container spacing={1}>
            {listType === "grid" ? (
              <>
                <Grid item xs={6} md={4} xl={3}>
                  <NewCard onClick={createNewCase} />
                </Grid>
                {cases.map((caseItem) => (
                  <Grid key={caseItem.uid} item xs={6} md={4} xl={3}>
                    <CaseCard
                      uid={caseItem.uid}
                      date={new Date(caseItem.createdAt)}
                      title={caseItem.title}
                      destination={caseItem.destination}
                      description={clearHTMLTagsAndLimit(caseItem.description)}
                      status={caseItem.status}
                      cooperators={caseItem.users}
                      allUsers={allUsers}
                      nextEvent={undefined}
                    />
                  </Grid>
                ))}
              </>
            ) : (
              <DataGrid
                rows={cases.map((caseItem, index) => {
                  return {
                    ...caseItem,
                    description: clearHTMLTagsAndLimit(caseItem.description),
                    id: index,
                  };
                })}
                columns={columns}
              />
            )}
          </Grid>
        </Grid>
      </Grid>
      <Grid item xl={3}>
        Powiadomienia
        {notifications.map((notification) => (
          <NotificationCard
            key={uuidv4()}
            date={notification.date}
            type={notification.type}
            title={notification.title}
            message={notification.message}
          />
        ))}
      </Grid>
    </Grid>
  );
}
