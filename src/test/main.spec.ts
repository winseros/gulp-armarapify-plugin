import main = require('../main');

describe('main', () => {
    it('should return a new RapifyStream', () => {
        const stream1 = main();
        const stream2 = main();

        expect(stream1).toBeDefined();
        expect(stream2).toBeDefined();

        expect(stream1).not.toBe(stream2);
    });
});