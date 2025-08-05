"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const SupabaseContext = createContext({});

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function SupabaseProvider({ children }) {
    return (
        <SupabaseContext.Provider value={{ supabase }}>
            {children}
        </SupabaseContext.Provider>
    );
}

export const useSupabase = () => useContext(SupabaseContext);
