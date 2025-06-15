build:
	docker-compose build

test:
	npm test

lint:
	npm run lint

deploy:
	docker-compose up -d

logs:
	docker-compose logs --tail=100 --follow