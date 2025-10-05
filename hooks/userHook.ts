import { useAuth } from "@/contexts/autoContext";
import { db } from "@/database/services/DataBaseService";
import { User } from "@/models/user";
import { useEffect, useState } from "react";

export function useUser() {
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchUser() {
      if (user?.uid) {
        try {
          const fetchedUser = await db.users.findByID(user?.uid);
          setUserData(fetchedUser || null);
        } catch (err) {
          console.error("Error getting user: ", err);
        } finally {
          setLoading(false);
        }
      } else {
        setUserData(null);
        setLoading(false);
      }
    }
    fetchUser();
  }, [user]);

  return { userData, loading };
}
