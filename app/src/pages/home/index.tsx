import NumberStat from "@/components/statistics/NumberStat";
import { Button, Grid2 as Grid } from "@mui/material";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import styles from "@/styles/Home.module.css";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { CaseBackendType, ClientOrOpponentType, UserType } from "@/types/case";
import DOMPurify from "isomorphic-dompurify";
import HomeDataGrid from "@/components/dataGrids/HomeDataGrid/HomeDataGrid";
import { Activity, CaseStatus } from "@prisma/client";
import HomeFilterPanel from "@/components/panels/HomeFilterPanel/HomeFilterPanel";
import { KanbanGrid } from "@/components/dragAndDrop/KanbanGrid";
import { Add, Notifications } from "@mui/icons-material";
import NotificationsPanel from "@/components/panels/NotificationsPanel";
import CustomAlert, {
  AlertData,
  alertOnCatchRequest,
} from "@/components/Alert";

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
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);
  const [alert, setAlert] = useState<AlertData | null>(null);
  const panelTransition = "all .2s ease-in-out";

  useEffect(() => {
    const queryParams =
      "?client=" + clientFilter + "&opponent=" + opponentFilter;
    axios.get(`/api/home${queryParams}`).then((response) => {
      setCases(response.data);
    });
    if (allUsers.length === 0) {
      axios.get("/api/user").then((response) => {
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

  const createNewCase = async () => {
    axios
      .post("/api/case")
      .then((response) => {
        window.location.href = `/case/${response.data.uid}`;
      })
      .catch((error: AxiosError<{ message: string }>) => {
        alertOnCatchRequest(error, setAlert);
      });
  };

  const clearHTMLTagsAndLimit = (text: string | null) => {
    const textLimit = 200;
    const clearText = DOMPurify.sanitize(text || "Brak", {
      ALLOWED_TAGS: [],
    }).replace(/\n/g, " ");
    return clearText.length > textLimit
      ? clearText.slice(0, textLimit) + "..."
      : clearText;
  };

  const changeStatus = async (uid: string, newStatus: CaseStatus) => {
    axios
      .put(`/api/case/${uid}`, { status: newStatus })
      .then(() => {
        setCases(
          cases.map((caseItem) =>
            caseItem.uid === uid ? { ...caseItem, status: newStatus } : caseItem
          )
        );
      })
      .catch((error: AxiosError<{ message: string }>) => {
        alertOnCatchRequest(error, setAlert);
      });
  };

  const changeUsers = async (uid: string, user: UserType) => {
    axios
      .put(`/api/case/${uid}`, { cooperator: user })
      .then((response) => {
        setCases(
          cases.map((caseItem) =>
            caseItem.uid === uid
              ? { ...caseItem, users: response.data.users }
              : caseItem
          )
        );
      })
      .catch((error: AxiosError<{ message: string }>) => {
        alertOnCatchRequest(error, setAlert);
      });
  };

  const getViewIconClass = (type: "list" | "grid") => {
    return `${styles.icon} ${
      styles[listType === type ? "activeViewIcon" : "inactiveViewIcon"]
    }`;
  };

  return (
    <Grid className={styles.container} container spacing={2}>
      <Grid
        size={{ md: isNotificationOpen ? 9 : 11.5 }}
        style={{ transition: panelTransition }}
      >
        <Grid container>
          <Grid size={{ xs: 10 }}>Sprawy</Grid>
          <Grid size={{ xs: 2 }}>{new Date().toLocaleDateString()}</Grid>
        </Grid>
        <Grid container>
          <Grid container size={{ lg: 10 }} spacing={2}>
            <NumberStat number={stats.inProgress} label={"W trakcie"} />
            <NumberStat number={stats.new} label={"Nowe"} />
            <NumberStat number={cases.length} label={"Wszystkie"} />
          </Grid>
          <Grid size={{ lg: 2 }}>
            <FormatListBulletedIcon
              className={getViewIconClass("list")}
              onClick={() => setListType("list")}
            />
            <ViewModuleIcon
              className={getViewIconClass("grid")}
              onClick={() => setListType("grid")}
            />
          </Grid>
          <Grid container size={{ xs: 12 }}>
            <Grid size={{ xs: 6 }}>
              <HomeFilterPanel
                clients={allClients}
                opponents={allOpponents}
                setClientFilter={setClientFilter}
                setOpponentFilter={setOpponentFilter}
              />
            </Grid>
            <Grid
              size={{ xs: 6 }}
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <Button
                onClick={createNewCase}
                variant="contained"
                startIcon={<Add />}
              >
                Dodaj sprawę
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid container spacing={1}>
          {listType === "grid" ? (
            <KanbanGrid
              cases={cases.map((caseItem) => ({
                uid: caseItem.uid,
                date: new Date(caseItem.createdAt),
                title: caseItem.title,
                destination: caseItem.destination,
                client: caseItem.client,
                opponent: caseItem.opponent,
                description: clearHTMLTagsAndLimit(caseItem.description),
                status: caseItem.status,
                cooperators: caseItem.users,
                allUsers: allUsers,
                onUserClick: changeUsers,
              }))}
              onDrop={changeStatus}
            />
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
      <Grid
        size={{ md: isNotificationOpen ? 3 : 0.5 }}
        style={{
          transition: panelTransition,
        }}
      >
        <div style={{ position: "sticky", top: 10 }}>
          <Notifications
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            cursor="pointer"
          />
          <NotificationsPanel
            notifications={notifications}
            isOpen={isNotificationOpen}
          />
        </div>
      </Grid>
      {alert && <CustomAlert {...alert} onClose={() => setAlert(null)} />}
    </Grid>
  );
}
