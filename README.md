# Gulp Arma Rapify plugin

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
