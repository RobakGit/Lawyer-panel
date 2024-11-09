import AutoCompleteInput from "@/components/inputs/AutoCompleteInput";
import CooperatorsSelector from "@/components/inputs/CooperatorsSelector";
import StatusSelector from "@/components/inputs/StatusSelector";
import styles from "@/styles/CaseHeaderPanel.module.css";
import {
  ClientOrOpponentPayloadType,
  ClientOrOpponentType,
  UserType,
} from "@/types/case";
import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";

export default function CaseHeaderPanel(
  props: Readonly<{
    title: string;
    date: Date;
    destination: string | null;
    client: ClientOrOpponentType | null;
    opponent: ClientOrOpponentType | null;
    status: string;
    cooperators: UserType[];
    allUsers: UserType[];
    nextEvent?: string;
    updateCaseData: (data: {
      title?: string;
      destination?: string;
      client?: string;
      opponent?: string;
      status?: string;
      cooperator?: UserType;
      description?: string;
    }) => Promise<AxiosResponse>;
  }>
) {
  const {
    title,
    date,
    destination,
    client,
    opponent,
    status,
    cooperators,
    allUsers,
    nextEvent,
    updateCaseData,
  } = props;

  const [edditedElement, setEdditedElement] = useState<string | null>(null);
  const [titleValue, setTitleValue] = useState(title);
  const [destinationValue, setDestinationValue] = useState(destination);
  const [statusValue, setStatusValue] = useState(status);
  const [cooperatorsValue, setCooperatorsValue] = useState(cooperators);
  const [allClients, setAllClients] = useState<ClientOrOpponentType[]>([]);
  const [allOpponents, setAllOpponents] = useState<ClientOrOpponentType[]>([]);

  useEffect(() => {
    axios.get("/api/client").then((response) => {
      setAllClients(response.data);
    });
    axios.get("/api/opponent").then((response) => {
      setAllOpponents(response.data);
    });
  }, []);

  const focusEdditedElement = (
    e: React.MouseEvent<HTMLElement>,
    valueType: "title" | "destination"
  ) => {
    setEdditedElement(valueType);
    const element = e.currentTarget;
    setTimeout(() => element.focus(), 0);
  };

  const onBlur = (
    e: React.FocusEvent<HTMLElement>,
    valueType: "title" | "destination"
  ) => {
    setEdditedElement(null);
    if (!e.target.textContent) return;

    const gettersNSetters = {
      title: { get: titleValue, set: setTitleValue },
      destination: { get: destinationValue, set: setDestinationValue },
    };

    const textContent = e.target.textContent.trim();
    if (gettersNSetters[valueType].get !== textContent) {
      gettersNSetters[valueType].set(textContent);
      updateCaseData({ [valueType]: textContent });
    }
  };

  const onStatusChange = (newStatus: string) => {
    if (statusValue === newStatus) return;
    setStatusValue(newStatus);
    updateCaseData({ status: newStatus });
  };

  const onUserClick = async (user: UserType) => {
    const response = await updateCaseData({ cooperator: user });
    setCooperatorsValue(response.data.users);
  };

  const createNewClient = async (data: ClientOrOpponentPayloadType) => {
    const response = await axios.post("/api/client", data);
    setAllClients((prev) => [...prev, response.data]);
    return response.data.uid;
  };

  const createNewOpponent = async (data: ClientOrOpponentPayloadType) => {
    const response = await axios.post("/api/opponent", data);
    setAllOpponents((prev) => [...prev, response.data]);
    return response.data.uid;
  };

  const selectClient = async (value: string) => {
    updateCaseData({ client: value });
  };

  const selectOpponent = async (value: string) => {
    updateCaseData({ opponent: value });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span
          contentEditable={edditedElement === "title"}
          suppressContentEditableWarning={true}
          onClick={(e) => focusEdditedElement(e, "title")}
          onBlur={(e) => onBlur(e, "title")}
          className={`${styles.editable} ${styles.title}`}
        >
          {titleValue}
        </span>
        <p>Data utworzenia: {date.toLocaleDateString()}</p>
      </div>
      <div className={styles.dataContainer}>
        <div className={styles.leftSide}>
          <p>
            Sąd:{" "}
            <i
              contentEditable={edditedElement === "destination"}
              suppressContentEditableWarning={true}
              onClick={(e) => focusEdditedElement(e, "destination")}
              onBlur={(e) => onBlur(e, "destination")}
              className={styles.editable}
            >
              {destinationValue}
            </i>
          </p>
          <AutoCompleteInput
            label="Klient"
            options={allClients}
            value={client?.uid ?? null}
            selectOption={selectClient}
            createNewOption={createNewClient}
          />
          <AutoCompleteInput
            label="Przeciwnik"
            options={allOpponents}
            value={opponent?.uid ?? null}
            selectOption={selectOpponent}
            createNewOption={createNewOpponent}
          />
        </div>
        <div className={styles.rightSide}>
          <div>
            Przypisani:{" "}
            <CooperatorsSelector
              inline
              cooperators={cooperatorsValue}
              allUsers={allUsers}
              onUserClick={onUserClick}
            />
          </div>
          <p>
            Najbliższe wydarzenie: <i>{nextEvent ?? "Brak"}</i>
          </p>
          <div>
            Status:{" "}
            <StatusSelector
              statusValue={statusValue}
              onStatusChange={onStatusChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
