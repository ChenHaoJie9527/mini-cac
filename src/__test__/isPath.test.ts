import { describe, it } from "vitest";
import * as path from "node:path";
describe('should path', () => {
  it('takes path', () => {
    const sep = path.sep;
    console.log('sep', sep);
    const parse = path.parse('D:/cac/cac-test/src');
    console.log('parse', parse);
  })
})
