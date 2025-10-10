import { updateLocalRecords } from "./localDb";
import { supabase } from "./supabaseClient";

export const uploadToSupabase = async (
  tableName: string,
  key: string,
  records: any[]
): Promise<void> => {
  try {
    if (records.length === 0) {
      return;
    }

    const { error: upsertError } = await supabase
      .from(tableName)
      .upsert(records, { onConflict: key });

    if (upsertError) throw upsertError;

    const { data: remoteRecords, error: fetchError } = await supabase
      .from(tableName)
      .select(key);

    if (fetchError) throw fetchError;

    const localIds = new Set(records.map((r) => (r as any)[key]));
    const idsToDelete =
      remoteRecords
        ?.filter((r) => !localIds.has((r as any)[key]))
        .map((r) => (r as any)[key]) || [];

    if (tableName == "users") return;

    if (idsToDelete.length > 0) {
      const { error: deleteError } = await supabase
        .from(tableName)
        .delete()
        .in(key, idsToDelete);

      if (deleteError) throw deleteError;
    }
  } catch (error) {
    console.log(`Error syncing ${tableName}`, error);
    throw error;
  }
};

export const downloadFromSupabase = async (
  tableName: string,
  key: string,
  records: any[],
  uid: string
): Promise<void> => {
  const { data, error } = await supabase.from(tableName).select("*");

  if (error) {
    console.log(`Error downloading from ${tableName}`, error);
    throw error;
  }
  if (data && data.length > 0) {
    await updateLocalRecords(tableName, key, records, uid);
    console.log(`${tableName} is updated from supabase to local`);
  }
};
