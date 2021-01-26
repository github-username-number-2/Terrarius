const WebWorkers = {
  workers: [],
  queuedWorkers: [],

  initialize() {
    this.totalWorkerCount = navigator.hardwareConcurrency || 4;

    for (let i = 0; i < this.totalWorkerCount; i++) {
      this.workers.push({
        worker: new Worker("WorkerManager.js"),
        running: false,
      });
    }
  },
};

export default WebWorkers;