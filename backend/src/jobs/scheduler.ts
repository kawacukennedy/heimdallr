import cron from 'node-cron';
import { pollOpenSky } from './opensky';
import { pollADSBExchange } from './adsbx';
import { fetchTLEs } from './celestrak';

export function startScheduler(): void {
    console.log('[Scheduler] Starting cron jobs...');

    // Poll OpenSky every 15 seconds for civilian flights
    cron.schedule('*/15 * * * * *', async () => {
        await pollOpenSky();
    });

    // Poll ADS-B Exchange every 15 seconds for military flights
    cron.schedule('*/15 * * * * *', async () => {
        await pollADSBExchange();
    });

    // Fetch TLEs daily at midnight UTC
    cron.schedule('0 0 * * *', async () => {
        await fetchTLEs();
    });

    // Initial TLE fetch on startup
    setTimeout(async () => {
        console.log('[Scheduler] Running initial TLE fetch...');
        await fetchTLEs();
    }, 5000);

    console.log('[Scheduler] Cron jobs registered:');
    console.log('  - OpenSky poll:    every 15 seconds');
    console.log('  - ADS-B Exchange:  every 15 seconds');
    console.log('  - Celestrak TLEs:  daily at 00:00 UTC');
}
