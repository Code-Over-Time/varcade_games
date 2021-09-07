.PHONY: build_test_image run_test_image run_tests stop_test_image clean

CONTAINER_ID := $$(docker ps -aqf "name=gameportal_tests")
 
build_test_image:
	docker build --network=host -f Dockerfile.Test -t gp_test_image .

run_test_image:
	docker run -d \
		--name gameportal_tests \
		gp_test_image

run_test_image_mounted:
	docker run -it -d \
		--name gameportal_tests \
		-v $(PWD)/game_portal:/test_game_portal/game_portal:Z  \
		-v $(PWD)/tests:/test_game_portal/tests:Z  \
		gp_test_image

run_tests:
	docker exec -t $(CONTAINER_ID) bash -c 'PYTHONPATH=./game_portal pytest tests -v -k "$(t)"'

run_coverage:
	docker exec -t $(CONTAINER_ID) bash -c 'PYTHONPATH=./game_portal pytest tests --cov --cov-report term-missing -k "$(t)"'

run_type_checking:
	docker exec -t $(CONTAINER_ID) bash -c '\
		echo "Running Mypy against web app" && \
		mypy game_portal'

stop_test_image:
	@echo >Stopping test container, ID: $(CONTAINER_ID)
	docker stop $(CONTAINER_ID) 

clean: stop_test_image
	docker rm gameportal_tests
