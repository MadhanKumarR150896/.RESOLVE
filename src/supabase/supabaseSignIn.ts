import { supabase } from "./supabaseClient";

export const supabaseSignIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (data) console.log(data);
  if (error) console.log(error);
};
