// TLE Parser Worker
// Parses Celestrak bulk TLE text into structured JSON
// Runs in a Web Worker to avoid blocking the main thread during large file parsing

interface ParsedTLE {
    id: string;
    name: string;
    line1: string;
    line2: string;
    noradId: string;
    classification: string;
    epochYear: number;
    epochDay: number;
    meanMotion: number;
    eccentricity: number;
    inclination: number;
    orbitType: 'LEO' | 'MEO' | 'GEO';
}

function classifyOrbit(meanMotionRevPerDay: number): 'LEO' | 'MEO' | 'GEO' {
    if (meanMotionRevPerDay > 11.25) return 'LEO';
    if (meanMotionRevPerDay > 2) return 'MEO';
    return 'GEO';
}

function parseFloat8(str: string): number {
    // TLE format uses implicit decimal: e.g., "17149-4" means "0.17149e-4"
    const trimmed = str.trim();
    if (trimmed.includes('.')) return parseFloat(trimmed);
    // Handle assumed decimal notation
    const match = trimmed.match(/^([+-]?)(\d+)([+-]\d+)?$/);
    if (match) {
        const sign = match[1] === '-' ? -1 : 1;
        const mantissa = parseFloat('0.' + match[2]);
        const exponent = match[3] ? parseInt(match[3]) : 0;
        return sign * mantissa * Math.pow(10, exponent);
    }
    return parseFloat(trimmed);
}

self.onmessage = (e: MessageEvent) => {
    const { type } = e.data;

    if (type === 'parse') {
        const rawText: string = e.data.text;
        const lines = rawText.split('\n').map((l: string) => l.trim()).filter((l: string) => l.length > 0);
        const tles: ParsedTLE[] = [];
        let parseErrors = 0;

        for (let i = 0; i < lines.length - 2; i += 3) {
            try {
                const name = lines[i].trim();
                const line1 = lines[i + 1];
                const line2 = lines[i + 2];

                // Validate line numbers
                if (!line1.startsWith('1 ') || !line2.startsWith('2 ')) {
                    parseErrors++;
                    continue;
                }

                const noradId = line1.substring(2, 7).trim();
                const classification = line1.substring(7, 8);
                const epochYear = parseInt(line1.substring(18, 20));
                const epochDay = parseFloat(line1.substring(20, 32));
                const meanMotion = parseFloat(line2.substring(52, 63));
                const eccentricity = parseFloat('0.' + line2.substring(26, 33).trim());
                const inclination = parseFloat(line2.substring(8, 16));

                tles.push({
                    id: `sat-${noradId}`,
                    name,
                    line1,
                    line2,
                    noradId,
                    classification,
                    epochYear: epochYear > 57 ? 1900 + epochYear : 2000 + epochYear,
                    epochDay,
                    meanMotion,
                    eccentricity,
                    inclination,
                    orbitType: classifyOrbit(meanMotion),
                });
            } catch {
                parseErrors++;
            }
        }

        // Group by orbit type
        const byOrbit = {
            LEO: tles.filter((t) => t.orbitType === 'LEO').length,
            MEO: tles.filter((t) => t.orbitType === 'MEO').length,
            GEO: tles.filter((t) => t.orbitType === 'GEO').length,
        };

        self.postMessage({
            type: 'parsed',
            tles,
            stats: {
                total: tles.length,
                errors: parseErrors,
                byOrbit,
            },
        });
    }
};
