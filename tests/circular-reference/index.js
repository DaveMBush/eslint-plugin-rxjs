const util = require('util');
const rxjs = require('@smarttools/eslint-plugin-rxjs');

const result =util.inspect(rxjs, { depth: null });

if (result.includes('[Circular')) {
  console.log('Circular reference found');
  console.log(result);
  process.exit(1);
} else {
  console.log('No circular reference found');
  process.exit(0);
}

