'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUIStore } from '@/store/uiStore';
import { getSupabaseClient } from '@/lib/realtime/supabaseClient';

interface User {
    id: string;
    email?: string;
    user_metadata?: {
        display_name?: string;
    };
}

export function useSettings() {
    const settings = useUIStore((s) => s.settings);
    const updateSettings = useUIStore((s) => s.updateSettings);
    const supabase = getSupabaseClient();

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user as User | null);
            setLoading(false);
        };
        getUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user as User | null);
        });

        return () => subscription.unsubscribe();
    }, [supabase]);

    const signIn = useCallback(async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
    }, [supabase]);

    const signUp = useCallback(async (email: string, password: string, displayName?: string) => {
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { display_name: displayName } }
        });
        if (error) throw error;
    }, [supabase]);

    const signOut = useCallback(async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    }, [supabase]);

    return { settings, updateSettings, user, loading, signIn, signUp, signOut };
}
