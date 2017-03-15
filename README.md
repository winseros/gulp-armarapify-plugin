[![node][node-image]][node-url] [![npm][npm-image]][npm-url] [![Travis branch][travis-image]][travis-url] [![Coveralls branch][coveralls-image]][coveralls-url] [![Dependencies][david-image]][david-url]

# Gulp Arma Rapify plugin

[![Greenkeeper badge](https://badges.greenkeeper.io/winseros/gulp-armarapify-plugin.svg)](https://greenkeeper.io/)

The plugin's goal is to [rapify (binarize)](https://community.bistudio.com/wiki/raP_File_Format_-_OFP) Arma2/Arma3 configuration files using [Gulp](http://gulpjs.com).

## Installation
```
npm install gulp-armarapify
```

## Usage
```
var gulp = require('gulp');
var rapify = require('gulp-armarapify');

gulp.task('rapify', function(){
    return gulp.src(['mission.sqm', 'description.ext'])
        .pipe(rapify())
        .pipe(gulp.dest('./dist/'));
});
```

## Dealing with preprocessor commands
If your files contain [preprocesor instructions](https://community.bistudio.com/wiki/PreProcessor_Commands), you should use a [gulp-armapreprocessor](https://github.com/winseros/gulp-armapreprocessor-plugin) plugin to resolve them first.

## Plugin API
rapify()

[node-url]: https://nodejs.org
[node-image]: https://img.shields.io/node/v/gulp-armarapify.svg

[npm-url]: https://www.npmjs.com/package/gulp-armarapify
[npm-image]: https://img.shields.io/npm/v/gulp-armarapify.svg

[travis-url]: https://travis-ci.org/winseros/gulp-armarapify-plugin
[travis-image]: https://img.shields.io/travis/winseros/gulp-armarapify-plugin/master.svg

[coveralls-url]: https://coveralls.io/github/winseros/gulp-armarapify-plugin
[coveralls-image]: https://img.shields.io/coveralls/winseros/gulp-armarapify-plugin/master.svg

[david-url]: https://david-dm.org/winseros/gulp-armarapify-plugin
[david-image]: https://david-dm.org/winseros/gulp-armarapify-plugin/master.svg