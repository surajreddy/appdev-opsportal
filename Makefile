REPORTER = dot

test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
    --reporter $(REPORTER) \
    test/*.js

	@NODE_ENV=test mocha-phantomjs \
    -R $(REPORTER) \
    assets/opstools/RBAC/tests/test-all.html 

.PHONY: test
