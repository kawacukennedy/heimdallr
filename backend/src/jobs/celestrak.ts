import axios from 'axios';
import { getSupabaseClient } from '../config/supabase';
import { env } from '../config/env';

interface TLEEntry {
    id: string;
    name: string;
    line1: string;
    line2: string;
}

export async function fetchTLEs(): Promise<void> {
    try {
        console.log('[Celestrak] Fetching TLE data...');

        const response = await axios.get(env.CELESTRAK_URL, {
            timeout: 60000,
            responseType: 'text',
        });

        const text = response.data as string;
        const lines = text.split('\n').map((l: string) => l.trim()).filter((l: string) => l.length > 0);

        const tles: TLEEntry[] = [];
        let idCounter = 0;

        for (let i = 0; i < lines.length; i += 3) {
            if (i + 2 < lines.length) {
                const name = lines[i];
                const line1 = lines[i + 1];
                const line2 = lines[i + 2];

                // Validate TLE format (line 1 starts with '1', line 2 starts with '2')
                if (line1.startsWith('1') && line2.startsWith('2')) {
                    tles.push({
                        id: `sat-${idCounter++}`,
                        name: name.trim(),
                        line1,
                        line2,
                    });
                }
            }
        }

        if (tles.length === 0) {
            console.warn('[Celestrak] No valid TLE entries found');
            return;
        }

        // Store in Supabase
        const supabase = getSupabaseClient();

        const { error } = await supabase.from('tle_snapshots').insert({
            tle_data: tles,
        });

        if (error) {
            console.error('[Celestrak] Failed to store TLEs:', error.message);
            return;
        }

        // Clean up old snapshots (keep last 7 days)
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
        await supabase.from('tle_snapshots').delete().lt('fetched_at', sevenDaysAgo);

        console.log(`[Celestrak] Stored ${tles.length} TLE entries`);
    } catch (error: any) {
        console.error('[Celestrak] TLE fetch failed:', error.message);
    }
}
