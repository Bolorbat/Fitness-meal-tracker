import { db } from "@/database/services/DataBaseService";
import { useEffect, useState } from "react";

export function useOnboardingStatus(userId?: string, syncCompleted?: boolean) {
  const [status, setStatus] = useState<"loading" | "incomplete" | "done">(
    "loading"
  );

  useEffect(() => {
    if (!userId) {
      setStatus("loading");
      return;
    }

    db.users.getOnboardingStatus(userId).then((completed) => {
      setStatus(completed ? "done" : "incomplete");
    });
  }, [userId, syncCompleted]);

  return status;
}
