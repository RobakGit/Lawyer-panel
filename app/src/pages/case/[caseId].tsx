import TextEditor from "@/components/TextEditor";
import CaseHeaderPanel from "@/components/panels/CaseHeaderPanel";
import FilesPanelWithUploader from "@/components/panels/FilesPanelWithUploader";
import CaseActivityContainer from "@/containers/CaseActivityContainer";
import { Grid } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import DOMPurify from "isomorphic-dompurify";
import axios from "axios";
import { useRouter } from "next/router";
import { CaseDetailsType, File as FileType, UserType } from "@/types/case";

export default function CaseContainer() {
  const router = useRouter();
  const [caseData, setCaseData] = useState<CaseDetailsType | null>(null);
  const [description, setDescription] = useState<string | null>("");
  const [isDescriptionEditing, setIsDescriptionEditing] = useState(false);
  const [files, setFiles] = useState<FileType[]>([]);
  const [allUsers, setAllUsers] = useState<UserType[]>([]);
  const caseId = useRef<string>("");

  useEffect(() => {
    const actualCaseId = router.query.caseId;
    if (!actualCaseId || typeof actualCaseId !== "string") return;
    caseId.current = actualCaseId;

    axios.get(`/api/case/${actualCaseId}`).then((response) => {
      setCaseData(response.data);
      setFiles(response.data.files);
      setDescription(response.data.description);
    });

    axios.get("/api/users").then((response) => {
      setAllUsers(response.data);
    });
  }, [router]);

  const saveDescription = (content: string) => {
    setDescription(content);
    setIsDescriptionEditing(false);
    updateCaseData({ description: content });
  };

  const updateCaseData = async (data: {
    title?: string;
    destination?: string;
    status?: string;
    cooperator?: UserType;
    description?: string;
  }) => {
    return await axios.put(`/api/case/${caseId.current}`, data);
  };

  const sendComment = async (content: string) => {
    const newComment = await axios.post(`/api/comment/${caseId.current}`, {
      content: content,
    });
    return newComment.data.comment;
  };

  const uploadFiles = async (files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });
    axios
      .post(`/api/case/${caseId.current}/file`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        const filesData = response.data.filesData;
        setFiles((prevFiles) => [...prevFiles, ...filesData]);
      });
  };

  const downloadFile = async (uid: string) => {
    const response = await fetch(`/api/case/${caseId.current}/file/${uid}`);
    const fileName = response.headers.get("Content-Disposition")?.split("=")[1];
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName ?? uid;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Grid container>
      <Grid
        item
        container
        xs={8}
        direction={"column"}
        gap={2}
        // maxHeight={"100vh"}
        // overflow={"auto"}
      >
        <Grid item>
          {caseData && (
            <CaseHeaderPanel
              title={caseData.title}
              date={new Date(caseData.createdAt)}
              destination={caseData.destination}
              status={caseData.status}
              cooperators={caseData.users}
              allUsers={allUsers}
              nextEvent={undefined}
              updateCaseData={updateCaseData}
            />
          )}
        </Grid>
        <Grid
          onDoubleClick={() => setIsDescriptionEditing(true)}
          item
          p={1}
          textAlign={"justify"}
          fontSize={20}
          lineHeight={1.5}
        >
          {isDescriptionEditing ? (
            <TextEditor
              content={description ?? ""}
              save={(content) => saveDescription(content)}
            />
          ) : description &&
            description.length > 0 &&
            />[^<]{1,}/.test(description) ? (
            <div
              style={{ padding: "1rem" }}
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(description),
              }}
            ></div>
          ) : (
            "Brak opisu... Kliknij dwukrotnie, aby dodać."
          )}
        </Grid>
        <Grid item>
          <FilesPanelWithUploader
            files={files}
            uploadFiles={uploadFiles}
            onDownload={downloadFile}
          />
        </Grid>
      </Grid>
      <Grid item xs={4}>
        <CaseActivityContainer
          comments={caseData?.comments ?? []}
          sendComment={sendComment}
        />
      </Grid>
    </Grid>
  );
}