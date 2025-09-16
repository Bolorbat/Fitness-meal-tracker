import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://xckfuynrivgknyshomeo.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhja2Z1eW5yaXZna255c2hvbWVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0NDY4NjIsImV4cCI6MjA3MjAyMjg2Mn0.C8jj7vWY9SuN2zL59MwVvhnFY0z4JDYrBB18ijNv7qc";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
