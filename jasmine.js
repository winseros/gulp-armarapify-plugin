const Reporter = require('jasmine-console-reporter');
const Jasmine = require('jasmine');
const jasmine = new Jasmine();

jasmine.loadConfig({
    spec_dir: 'dist',
    spec_files: ['**/*.spec.js']
});

jasmine.addReporter(new Reporter());
jasmine.execute();