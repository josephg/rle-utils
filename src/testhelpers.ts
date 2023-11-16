import assert from 'node:assert/strict'
import { cloneItem, itemLen } from './rlelist.js';
import { AllRLEMethods, MergeMethods, SplitMethods } from './types.js';


// TODO: Consider exporting these types too.
export type SimpleRLESpan<T> = { val: T, length: number }

export const simpleRLESpanMethods: MergeMethods<SimpleRLESpan<any>> & SplitMethods<SimpleRLESpan<any>> = {
  // len: (item) => item.length,
  tryAppend(to, from) {
    if (to.val === from.val) {
      to.length += from.length
      return true
    } else return false
  },
  truncateKeepingLeft(item, offset) { item.length = offset },
  truncateKeepingRight(item, offset) { item.length -= offset },
}

export type SimpleKeyedRLESpan<T> = { key: number } & SimpleRLESpan<T>

export const simpleKeyedSpanMethods: AllRLEMethods<SimpleKeyedRLESpan<any>> = {
  // len: (item) => item.length,
  keyStart: item => item.key,
  keyEnd: item => item.key + item.length,
  tryAppend(to, from) {
    if (to.val === from.val && to.key + to.length === from.key) {
      to.length += from.length
      return true
    } else return false
  },
  truncateKeepingLeft(item, offset) { item.length = offset },
  truncateKeepingRight(item, offset) {
    item.length -= offset
    item.key += offset
  },
}


// Taken from the diamond-types rust code.
export function testRLEMethods<T>(entry: T, m: AllRLEMethods<T>) {
  const len = itemLen(entry, m)
  assert(len >= 2, "Call this with a larger entry");
  // dbg!(&entry);

  for (let i = 1; i < len; i++) {
      // Split here and make sure we get the expected results.
      let start = cloneItem(entry, m)
      m.truncateKeepingLeft(start, i)

      let end = cloneItem(entry, m)
      m.truncateKeepingRight(end, i)

      // dbg!(&start, &end)

      assert.equal(itemLen(start, m), i)
      assert.equal(itemLen(end, m), len - i)

      const merged = cloneItem(start, m)
      // console.log(start, end, merged)
      assert(m.tryAppend(merged, end))

      assert.deepEqual(merged, entry)

      // let mut merge_prepend = end.clone()
      // merge_prepend.prepend(start.clone())
      // assert.equal(merge_prepend, entry)

      // Split using truncate_keeping_right. We should get the same behaviour.
      // let mut end2 = entry.clone()
      // let start2 = end2.truncate_keeping_right_ctx(i, ctx)
      // assert.equal(end2, end)
      // assert.equal(start2, start)
    }
}

export const assertRLEPacked = <T extends Record<string, any>>(entries: T[], m: MergeMethods<T>) => {
  for (let i = 1; i < entries.length; i++) {
    // Clone the entry so we don't modify the causal graph in the process.
    let prev: T = {...entries[i - 1]}

    // tryAppend should return false every time.
    assert.equal(m.tryAppend(prev, entries[i]), false)
  }
}