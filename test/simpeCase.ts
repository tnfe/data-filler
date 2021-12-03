import { fillDataByTemplate } from '../src/index';

describe('simple case', () => {

  test('when input miss keys, filled by template', () => {
    const data = { a: 1, b: 2 };
    const template = { a: 0, b: 0, c: 0, d: [] };
    const filled = fillDataByTemplate(data, template);

    expect(filled).toMatchObject({ a: 1, b: 2, c: 0, d: [] });
  });

  test('if some key of input and template has different type, use template type', () => {
    const data = { a: 1, b: 2, c: { c1: 100 } };
    const template = { a: 0, b: 0, c: 0 };
    const filled = fillDataByTemplate(data, template);

    expect(filled).toMatchObject({ a: 1, b: 2, c: 0 });
  });

  test('when miss some sub key of input, use template sub key default values', () => {
    const data = { a: 1, b: 2, c: { c1: 100 } };
    const template = { a: 0, b: 0, c: { c1: 0, c2: 0, c3: 0 } };
    const filled = fillDataByTemplate(data, template);

    expect(filled).toMatchObject({ a: 1, b: 2, c: { c1: 100, c2: 0, c3: 0 } });
  });

  test('when arr item miss key, use 3rd params arrItemTemplates to fill default values', () => {
    const data = { a: 1, b: 2, c: [{ c1: 1, c2: 1 }] };
    const template = { a: 0, b: 0, c: [] };
    const filled = fillDataByTemplate(data, template, { 'c': { c1: 100, c2: 100, c3: 100 } });

    expect(filled).toMatchObject({ a: 1, b: 2, c: [{ c1: 1, c2: 1, c3: 100 }] });
  });

  test('when arr item miss key, use 3rd params arrItemTemplates to fill default values', () => {
    const data = { a: 1, b: 2, c: [{ c1: 1, c2: [{ d1: 1 }] }] };
    const template = { a: 0, b: 0, c: [] };
    const filled = fillDataByTemplate(data, template, {
      'c': { c1: 100, c2: [], c3: 100 },
      'c.c2': { d1: 0, d2: 100 },
    });

    expect(filled).toMatchObject({ a: 1, b: 2, c: [{ c1: 1, c2: [{ d1: 1, d2: 100 }], c3: 100 }] });
  });

});
