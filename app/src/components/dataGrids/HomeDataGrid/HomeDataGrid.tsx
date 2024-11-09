import CooperatorsSelector from "@/components/inputs/CooperatorsSelector";
import StatusSelector from "@/components/inputs/StatusSelector";

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
import { useEffect, useRef, useState } from "react";

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
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const [gridWidth, setGridWidth] = useState<number>(0);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setGridWidth(entry.contentRect.width);
      }
    });

    if (gridContainerRef.current) {
      resizeObserver.observe(gridContainerRef.current);
    }

    return () => {
      if (gridContainerRef.current) {
        resizeObserver.unobserve(gridContainerRef.current);
      }
      resizeObserver.disconnect();
    };
  }, []);

  const columns: GridColDef[] = [
    {
      field: "createdAt",
      headerName: "Data",
      width: 100,
    },
    { field: "title", headerName: "Tytuł", width: 200 },
    { field: "destination", headerName: "Miejsce", width: 150 },
    {
      field: "description",
      headerName: "Opis",
      minWidth: 250,
      width: gridWidth - 1002,
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
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
      width: 90,
      align: "center",
      renderCell: (params: GridCellParams<GridValidRowModel, UserType[]>) =>
        params.value && (
          <CooperatorsSelector
            inline
            cooperators={params.value}
            allUsers={allUsers}
            onUserClick={(user) => onUserClick(`${params.id}`, user)}
          />
        ),
    },
    { field: "client", headerName: "Klient", width: 125 },
    { field: "opponent", headerName: "Strona przeciwna", width: 125 },
    {
      field: "actions",
      headerName: "Akcje",
      width: 90,
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
    <div ref={gridContainerRef} style={{ width: "100%" }}>
      <StyledDataGrid
        rows={cases.map((caseItem, index) => {
          return {
            ...caseItem,
            createdAt: new Date(caseItem.createdAt).toLocaleDateString(),
            description: clearHTMLTagsAndLimit(caseItem.description),
            cooperators: caseItem.users,
            client: caseItem.client?.displayName,
            opponent: caseItem.opponent?.displayName,
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
