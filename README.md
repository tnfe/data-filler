## data-filler 🍋
make your backend response data shape reliable, with data-filler you can stay away from optional chain.

## Quick Start
install
```bash
npm i data-filler
```

- example 1   
missed level 1 key filled by template
```js
import { fillDataByTemplate } from 'data-filler';

const data = { a: 1, b: 2 };
const template = { a: 0, b: 0, c: 0, d: [] };
const filled = fillDataByTemplate(data, template);
// filled is: { a: 1, b: 2, c: 0, d: [] }
```

- example 2   
fixed incorrect type of key values by template
```js
import { fillDataByTemplate } from 'data-filler';

const data = { a: 1, b: 2, c: { c1: 100 } };
const template = { a: 0, b: 0, c: 0 };
const filled = fillDataByTemplate(data, template);
// filled is: { a: 1, b: 2, c: 0 }
```

- example 3   
missed child level key filled by template
```js
import { fillDataByTemplate } from 'data-filler';

const data = { a: 1, b: 2, c: { c1: 100 } };
const template = { a: 0, b: 0, c: { c1: 0, c2: 0, c3: 0 } };
const filled = fillDataByTemplate(data, template);
// filled is: { a: 1, b: 2, c: { c1: 100, c2: 0, c3: 0 } }
```

- example 4   
missed array item key filled by template
```js
import { fillDataByTemplate } from 'data-filler';

const data = { a: 1, b: 2, c: [{ c1: 1, c2: 1 }] };
const template = { a: 0, b: 0, c: [] };
const filled = fillDataByTemplate(data, template, { 'c': { c1: 100, c2: 100, c3: 100 } });
// filled is: { a: 1, b: 2, c: [{ c1: 1, c2: 1, c3: 100 }] }
```
> use 3rd param `arrItemTemplates` to describe array item data shape

- example 5   
missed child array item key filled by template
```js
import { fillDataByTemplate } from 'data-filler';

const data = { a: 1, b: 2, c: [{ c1: 1, c2: [{ d1: 1 }] }] };
const template = { a: 0, b: 0, c: [] };
const filled = fillDataByTemplate(data, template, {
  'c': { c1: 100, c2: [], c3: 100 },
  'c.c2': { d1: 0, d2: 100 },
});
// filled is: { a: 1, b: 2, c: [{ c1: 1, c2: [{ d1: 1, d2: 100 }], c3: 100 }] }
```
> 3rd param `arrItemTemplates` support key path to describe nested array item data shape



## License

concent is released under the MIT License. [http://www.opensource.org/licenses/mit-license](http://www.opensource.org/licenses/mit-license)
