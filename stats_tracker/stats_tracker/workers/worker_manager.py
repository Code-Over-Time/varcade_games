from __future__ import annotations

import logging


class AsyncWorker:
    """Base class that needs to be implemented in order for an object to be registered
    with the Worker Manager.
    """

    def run(self):
        raise NotImplementedError()

    def get_name(self):
        raise NotImplementedError()


class WorkerManager:
    def __init__(self):
        self._workers = []
        self._worker_names = set()

    @property
    def active_workers(self) -> List[AsyncWorker]:
        return self._worker_names

    def register_worker(self, worker: AsyncWorker) -> WorkerManager:
        """Register a worker so that it's run method will be called when 'run_workers' is called along with
        any other registered workers.

        Duplicate workers are not allowed - a warning will be logged but execution will continue.

        :param worker:      An object with the base class AsyncWorker
        :return:            self
        :raises ValueError: If the given worker is not of type AsyncWorker
        """
        if not isinstance(worker, AsyncWorker):
            raise ValueError(
                "WorkerManager: Unable to register worker - it is not of type AsyncWorker"
            )

        if worker.get_name() not in self._worker_names:
            logging.info(f"WorkerManager: Registering worker '{worker.get_name()}'")
            self._workers.append(worker)
            self._worker_names.add(worker.get_name())
        else:
            logging.warning(
                f"WorkerManager: Unable to register worker. A worker with the name {worker.get_name()} was already registered."
            )

        # Return self so that calling code can easily chain registration
        return self

    def run_workers(self) -> int:
        events_processed = 0
        for worker in self._workers:
            logging.debug(f"WorkerManager: Running worker: {worker.get_name()}")
            try:
                events_processed += worker.run()
            except Exception as e:
                logging.error(
                    f"An error occurred running worker: {worker.get_name()} "
                    f"Error: {e.message}"
                )
            logging.debug(f"WorkerManager: Finished worker: {worker.get_name()}")
        return events_processed
