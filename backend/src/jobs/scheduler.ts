import cron from 'node-cron';
import { pollOpenSky } from './opensky';
import { pollADSBExchange } from './adsbx';
import { fetchTLEs } from './celestrak';
import { pollAIS } from './ais';
import { detectGpsJamming } from './gpsJamming';
import { recordHistoricalPositions } from './historical';

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

    // Poll AIS every 60 seconds for maritime ship tracking
    cron.schedule('*/60 * * * * *', async () => {
        await pollAIS();
    });

    // Detect GPS jamming every 30 seconds
    cron.schedule('*/30 * * * * *', async () => {
        await detectGpsJamming();
    });

    // Record historical positions every 60 seconds for 4D playback
    cron.schedule('*/60 * * * * *', async () => {
        await recordHistoricalPositions();
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

    // Initial AIS fetch on startup
    setTimeout(async () => {
        console.log('[Scheduler] Running initial AIS poll...');
        await pollAIS();
    }, 8000);

    console.log('[Scheduler] Cron jobs registered:');
    console.log('  - OpenSky poll:        every 15 seconds');
    console.log('  - ADS-B Exchange:      every 15 seconds');
    console.log('  - AIS Ship Tracking:   every 60 seconds');
    console.log('  - GPS Jamming Scanner: every 30 seconds');
    console.log('  - Historical Recorder: every 60 seconds');
    console.log('  - Celestrak TLEs:      daily at 00:00 UTC');
}
