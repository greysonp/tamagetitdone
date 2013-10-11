content_script = tsc ts/*.ts ts/actions/*.ts --out js/content_script.js --sourcemap
newtab = tsc ts/newtab/*.ts --out js/newtab.js --sourcemap
stylus = stylus stylus/*.styl --out css/

all:
	# $(content_script)
	$(newtab)
	$(stylus)
