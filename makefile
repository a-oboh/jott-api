docker-up:
	docker-compose up -d
docker-up-build:
	docker-compose build
docker-up-prod:
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up
docker-up-test:
	docker-compose -f docker-compose.yml -f docker-compose.test.yml up
docker-down: 
	docker-compose down