.PHONY: build_test_image run_test_image run_tests stop_test_image clean

CONTAINER_ID := $$(docker ps -aqf "name=matchmaker_tests")
 
build_test_image:
	docker build --network=host -f Dockerfile.Test -t mm_test_image .

run_test_image:
	docker run -d \
		--name matchmaker_tests \
		mm_test_image

run_test_image_mounted:
	docker run -it -d \
		--name matchmaker_tests \
		-v $(PWD)/tests:/matchmaker/tests:Z\
		-v $(PWD)/matchmaker:/matchmaker/matchmaker:Z\
		mm_test_image

run_tests:
	docker exec -t $(CONTAINER_ID) bash -c 'PYTHONPATH=matchmaker pytest -v -k "$(t)"'

run_coverage:
	docker exec -t $(CONTAINER_ID) bash -c 'PYTHONPATH=matchmaker pytest --cov=matchmaker --cov-report term-missing -k '$(t)' tests/'

run_type_checking:
	docker exec -t $(CONTAINER_ID) bash -c 'cd matchmaker && \
		echo "Running Mypy against web app" && \
		mypy --ignore-missing-imports app.py && \
		echo "Running Mypy against game worker" && \
		mypy --ignore-missing-imports game_worker.py'

stop_test_image:
	@echo >Stopping test container, ID: $(CONTAINER_ID)
	docker stop $(CONTAINER_ID) 

clean: stop_test_image
	docker rm matchmaker_tests
