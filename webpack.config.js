const path = require('path');

module.exports = {
	entry: './dist/the-datepicker.min.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'the-datepicker.module.min.js'
	}
};
