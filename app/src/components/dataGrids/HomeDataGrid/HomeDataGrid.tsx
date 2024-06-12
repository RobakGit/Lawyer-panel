import CooperatorsSelector from "@/components/inputs/CooperatorsSelector";
import StatusSelector from "@/components/inputs/StatusSelector";
import styles from "@/styles/HomeDataGrid.module.css";

import { CaseBackendType, UserType } from "@/types/case";
import { Visibility } from "@mui/icons-material";
import { styled } from "@mui/material";
import {
  DataGrid,
  GridCellParams,
  GridColDef,
  GridValidRowModel,
  gridClasses,
} from "@mui/x-data-grid";
import { CaseStatus } from "@prisma/client";

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  [`& .${gridClasses.row}.even`]: {
    backgroundColor: theme.palette.grey[200],
    "&:hover": {
      backgroundColor: theme.palette.grey[300],
    },
  },
  [`& .${gridClasses.cell}`]: {
    "&:focus": {
      outline: "none",
    },
    "&:focus-within": {
      outline: "none",
    },
  },
}));

export default function HomeDataGrid(
  props: Readonly<{
    cases: CaseBackendType[];
    clearHTMLTagsAndLimit: (html: string | null) => string;
    allUsers: UserType[];
    onStatusChange: (uid: string, newStatus: CaseStatus) => void;
    onUserClick: (uid: string, user: UserType) => void;
  }>
) {
  const {
    cases,
    clearHTMLTagsAndLimit,
    allUsers,
    onStatusChange,
    onUserClick,
  } = props;

  const columns: GridColDef[] = [
    { field: "createdAt", headerName: "Data", width: 200 },
    { field: "title", headerName: "Tytuł", width: 200 },
    { field: "destination", headerName: "Miejsce", width: 150 },
    { field: "description", headerName: "Opis", width: 250 },
    {
      field: "status",
      headerName: "Status",
      width: 100,
      align: "center",
      renderCell: (params: GridCellParams<GridValidRowModel, string>) =>
        params.value && (
          <StatusSelector
            statusValue={params.value}
            onStatusChange={(status) => onStatusChange(`${params.id}`, status)}
          />
        ),
    },
    {
      field: "cooperators",
      headerName: "Współpracownicy",
      width: 100,
      align: "center",
      renderCell: (params: GridCellParams<GridValidRowModel, UserType[]>) =>
        params.value && (
          <CooperatorsSelector
            cooperators={params.value}
            allUsers={allUsers}
            onUserClick={(user) => onUserClick(`${params.id}`, user)}
          />
        ),
    },
    { field: "nextEvent", headerName: "Następne wydarzenie", width: 150 },
    {
      field: "actions",
      headerName: "Akcje",
      width: 100,
      align: "center",
      renderCell: (params: GridCellParams) => (
        <Visibility
          sx={{ cursor: "pointer" }}
          onClick={() => (window.location.href = `/case/${params.id}`)}
        />
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <StyledDataGrid
        rows={cases.map((caseItem, index) => {
          return {
            ...caseItem,
            createdAt: new Date(caseItem.createdAt).toLocaleString(),
            description: clearHTMLTagsAndLimit(caseItem.description),
            cooperators: caseItem.users,
            id: caseItem.uid,
          };
        })}
        columns={columns}
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
        }
        disableRowSelectionOnClick
      />
    </div>
  );
}
