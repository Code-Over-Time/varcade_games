.PHONY: build_test_image run_test_image run_tests stop_test_image clean

CONTAINER_ID := $$(docker ps -aqf "name=stats_tracker_tests")
 
build_test_image:
	docker build --network=host -f Dockerfile.Test -t st_test_image .

run_test_image:
	docker run -d \
		--name stats_tracker_tests \
		st_test_image

run_test_image_mounted:
	docker run -it -d \
		--name stats_tracker_tests \
		-v $(PWD)/tests:/stats_tracker/tests:Z\
		-v $(PWD)/stats_tracker:/stats_tracker/stats_tracker:Z\
		st_test_image

run_tests:
	docker exec -t $(CONTAINER_ID) bash -c 'PYTHONPATH=stats_tracker pytest -v -k "$(t)"'

run_coverage:
	docker exec -t $(CONTAINER_ID) bash -c 'PYTHONPATH=stats_tracker pytest --cov=stats_tracker --cov-report term-missing -k '$(t)' tests/'

run_type_checking:
	docker exec -t $(CONTAINER_ID) bash -c 'cd stats_tracker && \
		echo "Running Mypy against web app" && \
		mypy --ignore-missing-imports app.py && \
		echo "Running Mypy against game worker" && \
		mypy --ignore-missing-imports stats_worker.py'

stop_test_image:
	@echo >Stopping test container, ID: $(CONTAINER_ID)
	docker stop $(CONTAINER_ID) 

clean: stop_test_image
	docker rm $(CONTAINER_ID)
