.PHONY: dist build

all:
	@echo "make server"

install:
	@wget http://dl.nwjs.io/v0.12.2/nwjs-v0.12.2-osx-x64.zip
	@unzip nwjs-v0.12.2-osx-x64.zip
	@mv nwjs-v0.12.2-osx-x64/nwjs.app .
	@rm -rf nwjs-v0.12.2-osx-x64 nwjs-v0.12.2-osx-x64.zip

deps: npm bower

npm:
	@npm install

bower:
	@node_modules/bower/bin/bower install

dist:
	@node_modules/.bin/gulp

run: dist
	@open nwjs.app

icon:
	@bash scripts/icon.sh

build: dist icon
	@bash scripts/build.sh

bower-init:
	@node_modules/bower/bin/bower init

clean:
	@rm -rf build
	@rm -rf dist

clean-all: clean
	@rm -rf bower_components
	@rm -rf node_modules
