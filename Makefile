REPORTER = dot

test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
    --reporter $(REPORTER) \
    test/*.js

ifeq ("x","y")
	@NODE_ENV=test mocha-phantomjs \
    -R $(REPORTER) \
    assets/opstools/RBAC/tests/test-all.html 
endif

.PHONY: test
