docker-up:
	docker-compose up -d
docker-up-prod:
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up
docker-down: 
	docker-compose down