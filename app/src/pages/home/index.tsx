import CaseCard from "@/components/cards/CaseCard";
import NumberStat from "@/components/statistics/NumberStat";
import { Box, Grid } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import styles from "@/styles/Home.module.css";
import { useEffect, useState } from "react";
import NotificationCard from "@/components/cards/NotificationCard";
import axios from "axios";
import { CaseBackendType, ClientOrOpponentType, UserType } from "@/types/case";
import NewCard from "@/components/cards/CaseCard/NewCard";
import DOMPurify from "isomorphic-dompurify";
import HomeDataGrid from "@/components/dataGrids/HomeDataGrid/HomeDataGrid";
import { Activity, CaseStatus } from "@prisma/client";
import HomeFilterPanel from "@/components/panels/HomeFilterPanel/HomeFilterPanel";

export default function Home() {
  const [cases, setCases] = useState<CaseBackendType[]>([]);
  const [allUsers, setAllUsers] = useState<UserType[]>([]);
  const [clientFilter, setClientFilter] = useState<string>("");
  const [opponentFilter, setOpponentFilter] = useState<string>("");
  const [allClients, setAllClients] = useState<ClientOrOpponentType[]>([]);
  const [allOpponents, setAllOpponents] = useState<ClientOrOpponentType[]>([]);
  const [notifications, setNotifications] = useState<Activity[]>([]);
  const [stats, setStats] = useState<{ inProgress: number; new: number }>({
    inProgress: 0,
    new: 0,
  });

  useEffect(() => {
    const queryParams =
      "?client=" + clientFilter + "&opponent=" + opponentFilter;
    axios.get(`/api/home${queryParams}`).then((response) => {
      setCases(response.data);
    });
    if (allUsers.length === 0) {
      axios.get("/api/users").then((response) => {
        setAllUsers(response.data);
      });
      axios.get("/api/client").then((response) => {
        setAllClients(response.data);
      });
      axios.get("/api/opponent").then((response) => {
        setAllOpponents(response.data);
      });
      axios.get("/api/notification").then((response) => {
        setNotifications(response.data);
      });
    }
  }, [clientFilter, opponentFilter]);

  useEffect(() => {
    setStats({
      inProgress: cases.filter((caseItem) => caseItem.status === "inProgress")
        .length,
      new: cases.filter((caseItem) => caseItem.status === "waiting").length,
    });
  }, [cases]);

  const [listType, setListType] = useState<"list" | "grid">("grid");

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

  const changeStatus = async (uid: string, newStatus: CaseStatus) => {
    await axios.put(`/api/case/${uid}`, { status: newStatus });
    setCases(
      cases.map((caseItem) =>
        caseItem.uid === uid ? { ...caseItem, status: newStatus } : caseItem
      )
    );
  };

  const changeUsers = async (uid: string, user: UserType) => {
    const response = await axios.put(`/api/case/${uid}`, { cooperator: user });
    setCases(
      cases.map((caseItem) =>
        caseItem.uid === uid
          ? { ...caseItem, users: response.data.users }
          : caseItem
      )
    );
  };

  return (
    <Grid className={styles.container} container spacing={2}>
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
            <Grid xs={12}>
              <HomeFilterPanel
                clients={allClients}
                opponents={allOpponents}
                setClientFilter={setClientFilter}
                setOpponentFilter={setOpponentFilter}
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
                      client={caseItem.client}
                      opponent={caseItem.opponent}
                      description={clearHTMLTagsAndLimit(caseItem.description)}
                      status={caseItem.status}
                      cooperators={caseItem.users}
                      allUsers={allUsers}
                      onStatusChange={changeStatus}
                      onUserClick={changeUsers}
                      nextEvent={undefined}
                    />
                  </Grid>
                ))}
              </>
            ) : (
              <HomeDataGrid
                cases={cases}
                clearHTMLTagsAndLimit={clearHTMLTagsAndLimit}
                allUsers={allUsers}
                onStatusChange={changeStatus}
                onUserClick={changeUsers}
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
            date={new Date(notification.createdAt)}
            type={notification.type}
            title={notification.title}
            message={notification.message}
          />
        ))}
      </Grid>
    </Grid>
  );
}
