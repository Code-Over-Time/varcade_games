# Setup
.EXPORT_ALL_VARIABLES:

-include .env.local
include .env

# Variables

.PHONY: list-apps build build_production start stop clean restart logs snapshot_game_portal_db import_game_portal_db \
	kube_build_env kube_generate kube_apply

# Managing the stack

build:
	@$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) build $(a)

build_production:
	@$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) -f $(PROD_DOCKER_COMPOSE_FILE) build $(a)

start:
	@$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) up -d $(a)

stop:
	@$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) stop $(a)

clean: 
	@$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) down --remove-orphans

restart: stop start

# Querying the stack
ls: list-apps

list-apps:
	@$(DOCKER_COMPOSE) config --services

logs:
	@$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) logs --tail=100 -f $(a)

ps: status

status:
	@$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) ps

# Managing data

snapshot_game_portal_db:
	docker exec game_portal_db /usr/bin/mysqldump -u root --password=password game_portal > /tmp/game_portal_db.sql

import_game_portal_db:
	docker exec -i gameportaldb mysql -u root --password=password game_portal < /tmp/game_portal_db.sql

# Working with Kubernetes

kube_build_env:
	minikube -p minikube docker-env

kube_apply:
	kubectl apply -f ./kube_config
