import assert from 'node:assert/strict'
import { cloneItem, itemLen } from './rlelist.js';
import { AllRLEMethods, Keyed, MergeMethods, SplitMethods } from './types.js';



// Taken from the diamond-types rust code.
// We need the item length to split and merge, but I don't need the item here to be RLE keyed. Bleh.
export function testRLEMethods<T>(entry: T, m: SplitMethods<T> & MergeMethods<T> & {len?: (item: T) => number} & Partial<Keyed<T>>) {
  const calcLen = (item: T) => {
    if (m.len) return m.len(item)
    if (m.keyStart && m.keyEnd) return itemLen(item, m as Keyed<T>)
    else throw Error('Cannot calculate length. Bleh.')
  }

  const len = calcLen(entry)
  assert(len >= 2, "Call this with a larger entry");
  // dbg!(&entry);

  for (let i = 1; i < len; i++) {
      // Split here and make sure we get the expected results.
      let start = cloneItem(entry, m)
      m.truncateKeepingLeft(start, i)
      assert.equal(calcLen(start), i, 'Item length incorrect after truncating keeping left')

      let end = cloneItem(entry, m)
      m.truncateKeepingRight(end, i)
      assert.equal(calcLen(end), len - i, 'Item length incorrect after truncating keeping right')

      const merged = cloneItem(start, m)
      // console.log(start, end, merged)
      assert(m.tryAppend(merged, end), 'Cannot merge item after splitting')

      assert.deepEqual(merged, entry, 'Split and merged entry has unexpectedly changed the entry')

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