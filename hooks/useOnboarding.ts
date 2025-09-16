import { db } from "@/database/services/DataBaseService";
import { useEffect, useState } from "react";

export function useOnboardingStatus(userId?: string) {
  const [status, setStatus] = useState<"loading" | "incomplete" | "done">(
    "loading"
  );

  useEffect(() => {
    if (!userId) {
      setStatus("loading");
      return;
    }

    db.goal.findByUserId(userId).then((completed) => {
      setStatus(completed ? "done" : "incomplete");
    });
  }, [userId]);

  return status;
}
