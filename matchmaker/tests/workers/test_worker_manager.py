import pytest

from workers.worker_manager import AsyncWorker, WorkerManager


class TestMatchmakerWorker:
    def test_unimplemented_methods(self):
        mm = AsyncWorker()

        with pytest.raises(NotImplementedError):
            mm.run()

        with pytest.raises(NotImplementedError):
            mm.get_name()


class TestWorkerManager:
    def test_register_worker_success(self, dummy_worker_class):
        wm = WorkerManager()
        assert len(wm.active_workers) == 0
        wm.register_worker(dummy_worker_class())
        assert len(wm.active_workers) == 1

    def test_register_duplicate_worker(self, dummy_worker_class):
        wm = WorkerManager()
        assert len(wm.active_workers) == 0
        wm.register_worker(dummy_worker_class())
        assert len(wm.active_workers) == 1

        # This won't cause an error, but won't add the duplicate
        wm.register_worker(dummy_worker_class())
        assert len(wm.active_workers) == 1

    def test_register_worker_invalid_type(self):
        wm = WorkerManager()
        with pytest.raises(ValueError):
            wm.register_worker({})  # Not the right type

    def test_run_workers_empty_list(self):
        wm = WorkerManager()
        wm.run_workers()  # Nothing should happen

    def test_run_workers(self, dummy_worker_class):
        wm = WorkerManager()

        worker = dummy_worker_class()

        # The dummy worker class increments an int called 'run_call_count' every time
        # its run method is called - we can use this to verify proper behaviour
        assert worker.run_call_count == 0

        wm.register_worker(worker)
        wm.run_workers()

        assert worker.run_call_count == 1

    def test_active_workers_property(self, dummy_worker_class):
        wm = WorkerManager()
        assert wm.active_workers == set()
        wm.register_worker(dummy_worker_class())
        assert wm.active_workers == {"Dummy worker"}
