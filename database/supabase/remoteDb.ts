import { updateLocalRecords } from "./localDb";
import { supabase } from "./supabaseClient";

export const uploadToSupabase = async (
  tableName: string,
  primaryKey: string,
  records: any[]
): Promise<void> => {
  try {
    // Get all remote records
    const { data: remoteRecords, error: fetchError } = await supabase
      .from(tableName)
      .select(primaryKey);

    if (fetchError) throw fetchError;

    const hasSyncedColumn = "synced" in records[0];

    const syncedRecords = hasSyncedColumn 
      ? records.map((r) => ({...r, synced : 1}))
      : records;

    // Upsert local records
    const { error: upsertError } = await supabase
      .from(tableName)
      .upsert(syncedRecords, { onConflict: primaryKey });

    if (upsertError) throw upsertError;

    // Find and delete records that exist remotely but not locally
    const localIds = new Set(records.map((r) => ((r as any))[primaryKey]));
    const idsToDelete =
      remoteRecords
        ?.filter((r) => !localIds.has((r as any)[primaryKey]))
        .map((r) => (r as any)[primaryKey]) || [];

    if (idsToDelete.length > 0) {
      const { error: deleteError } = await supabase
        .from(tableName)
        .delete()
        .in(primaryKey, idsToDelete);

      if (deleteError) throw deleteError;
    }
  } catch (error) {
    console.log(`Error syncing ${tableName}`, error);
    throw error;
  }
};

export const downloadFromSupabase = async (
  tableName: string,
  primaryKey: string,
  records: any[]
): Promise<void> => {
  const { data, error } = await supabase.from(tableName).select("*");

  if (error) {
    console.log(`Error downloading from ${tableName}`, error);
    throw error;
  }
  if (data && data.length > 0) {
    await updateLocalRecords(tableName, primaryKey, records);
    console.log(`${tableName} is updated from supabase to local`);
  }
};
