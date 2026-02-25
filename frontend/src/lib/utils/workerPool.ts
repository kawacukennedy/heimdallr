// Worker pool — manages Web Worker lifecycle
export class WorkerPool {
    private workers: Worker[] = [];
    private queue: Array<{ data: any; resolve: (v: any) => void }> = [];
    private available: Worker[] = [];

    constructor(private workerFactory: () => Worker, private poolSize = navigator.hardwareConcurrency || 4) {
        for (let i = 0; i < poolSize; i++) {
            const worker = workerFactory();
            this.workers.push(worker);
            this.available.push(worker);
        }
    }

    async exec(data: any): Promise<any> {
        return new Promise((resolve) => {
            const worker = this.available.pop();
            if (worker) { this.dispatch(worker, data, resolve); }
            else { this.queue.push({ data, resolve }); }
        });
    }

    private dispatch(worker: Worker, data: any, resolve: (v: any) => void) {
        worker.onmessage = (e) => {
            resolve(e.data);
            const next = this.queue.shift();
            if (next) { this.dispatch(worker, next.data, next.resolve); }
            else { this.available.push(worker); }
        };
        worker.postMessage(data);
    }

    terminate() {
        this.workers.forEach(w => w.terminate());
        this.workers = [];
        this.available = [];
        this.queue = [];
    }
}
