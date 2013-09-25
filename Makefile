content_script = tsc ts/*.ts --out js/content_script.js --sourcemap

all:
	$(content_script)
