import { useAuth } from "@/contexts/autoContext";
import { db } from "@/database/services/DataBaseService";
import { UserGoal } from "@/models/usergoals";
import { useEffect, useState } from "react";

export function useUserGoal() {
  const [userGoal, setUserGoal] = useState<UserGoal | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchUser() {
      if (user?.uid) {
        try {
          const fetchedUser = await db.goal.findByUserId(user?.uid);
          setUserGoal(fetchedUser || null);
        } catch (err) {
          console.error("Error getting user: ", err);
        } finally {
          setLoading(false);
        }
      } else {
        setUserGoal(null);
        setLoading(false);
      }
    }
    fetchUser();
  }, [user]);

  return { userGoal, loading };
}
