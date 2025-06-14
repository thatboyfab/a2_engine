build:
	docker-compose build

test:
	for d in ./services/* ./libs/*; do \
		if [ -f $$d/package.json ]; then \
			cd $$d && npm test || exit 1; \
			cd - > /dev/null; \
		fi; \
	done

lint:
	for d in ./services/* ./libs/*; do \
		if [ -f $$d/package.json ]; then \
			cd $$d && npm run lint || exit 1; \
			cd - > /dev/null; \
		fi; \
	done

deploy:
	docker-compose up -d

logs:
	docker-compose logs --tail=100 --follow