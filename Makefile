.PHONY: stop logs restart bash prune dev development development-build staging production utility fix-ssh clean clean-all

DOCKER_CONTAINERS=$(shell docker ps -a -q)
DOCKER_IMAGES=$(shell docker images -q)

DOCKER_HAYSTACK=haystack

UTILITY_IP=174.138.59.180
PORT_FORWARDING=5000

stop:
	docker stop $(DOCKER_HAYSTACK)

logs:
	docker logs $(DOCKER_HAYSTACK) -f --tail 50

restart:
	docker restart $(DOCKER_HAYSTACK)

bash:
	docker exec -it $(DOCKER_HAYSTACK) bash

prune:
	docker system prune

dev:
	make development

development:
	docker-compose -f docker-compose.yml -f docker-compose.development.yml up -d

development-build:
	docker-compose -f docker-compose.yml -f docker-compose.development.yml up -d --build

staging:
	docker-compose -f docker-compose.yml -f docker-compose.staging.yml up -d

production:
	docker-compose -f docker-compose.yml -f docker-compose.production.yml up -d

utility-portfoward:
	ssh -L $(PORT_FORWARDING):$(UTILITY_IP):$(PORT_FORWARDING) root@$(UTILITY_IP)

utility:
	ssh root@$(UTILITY_IP)

clean:
	docker stop $(DOCKER_HAYSTACK) || true
	docker rm $(DOCKER_HAYSTACK) || true
	docker rmi $(DOCKER_HAYSTACK) || true

clean-all:
	docker stop $(DOCKER_CONTAINERS)   || true
	docker rm $(DOCKER_CONTAINERS)   || true
	docker rmi $(DOCKER_IMAGES)   || true

