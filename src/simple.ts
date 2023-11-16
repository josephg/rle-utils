// This file exports 2 simple RLE types: SimpleRLESpan and SimpleKeyedSpan. They can be used to
// store simple RLE lists of items.

import { AllRLEMethods, MergeMethods, SplitMethods } from "./types.js"

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
  cloneItem: ({val, length}) => ({ val, length })
}

export type SimpleKeyedSpan<T> = { key: number } & SimpleRLESpan<T>

export const simpleKeyedSpanMethods: AllRLEMethods<SimpleKeyedSpan<any>> = {
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
  cloneItem: ({val, length, key}) => ({ val, length, key })
}