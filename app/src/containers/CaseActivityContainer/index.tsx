import CommentInput from "@/components/inputs/CommentInput";
import { Activity } from "@/types/activityTypes";
import { Card } from "@mui/material";
import { useEffect, useState } from "react";
import styles from "@/styles/CaseActivityContainer.module.css";
import { Comment } from "@/types/case";

export default function CaseActivityContainer(props: {
  comments: Comment[];
  sendComment: (comment: string) => Promise<Comment>;
}) {
  const { comments, sendComment } = props;
  const [activities, setActivities] = useState<Activity[]>([]);
  const [inputHeight, setInputHeight] = useState(0);

  useEffect(() => {
    const activities: Activity[] = comments.map((comment) => ({
      ...comment,
      type: "comment",
    }));
    setActivities(activities);
  }, [comments]);

  const addComment = async (comment: string) => {
    const newComment = await sendComment(comment);
    setActivities((prev: Activity[]) => [
      ...prev,
      { ...newComment, type: "comment" },
    ]);
  };

  return (
    <div className={styles.container}>
      <h2>Aktywność</h2>
      <div
        className={styles.activityContainer}
        style={{ height: `calc(97vh - 5.6rem - 20px - ${inputHeight}px)` }}
      >
        {activities.map((activity) => (
          <Card key={activity.uid} className={styles.activityCard}>
            <p>{activity.createdAt.toLocaleString()}</p>
            {activity.content}
          </Card>
        ))}
      </div>
      <CommentInput onSend={addComment} onHeightChange={setInputHeight} />
    </div>
  );
}
