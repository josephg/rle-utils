import assert from 'node:assert/strict'
import { rleIterRange, rlePush } from '../src/rlelist.js';
import { testRLEMethods } from '../src/testhelpers.js'
import { SimpleKeyedSpan, simpleKeyedSpanMethods } from '../src/simple.js';


// testRLEMethods({ length: 10, val: 'hi' }, simpleRLESpanMethods)
testRLEMethods({ length: 10, val: 'hi', key: 100 }, simpleKeyedSpanMethods)

{
  const list: SimpleKeyedSpan<string>[] = []
  rlePush(list, simpleKeyedSpanMethods, {key: 10, length: 2, val: 'a'})
  rlePush(list, simpleKeyedSpanMethods, {key: 12, length: 2, val: 'a'})
  assert(list.length === 1)
  assert(list[0].length === 4)
}

{
  const list: SimpleKeyedSpan<string>[] = []

  const empty = [...rleIterRange(list, simpleKeyedSpanMethods, 11, 13)]
  assert(empty.length === 0)

  rlePush(list, simpleKeyedSpanMethods, {key: 10, length: 2, val: 'a'})
  rlePush(list, simpleKeyedSpanMethods, {key: 12, length: 2, val: 'b'})
  const iterResult1 = [...rleIterRange(list, simpleKeyedSpanMethods, 11, 13)]
  assert.deepEqual(iterResult1, [
    {key: 11, length: 1, val: 'a'},
    {key: 12, length: 1, val: 'b'}
  ])

  assert.deepEqual([...rleIterRange(list, simpleKeyedSpanMethods, 5, 12)], [
    {key: 10, length: 2, val: 'a'}
  ])
  assert.deepEqual([...rleIterRange(list, simpleKeyedSpanMethods, 10, 12)], [
    {key: 10, length: 2, val: 'a'}
  ])
  assert.deepEqual([...rleIterRange(list, simpleKeyedSpanMethods, 0, 10000)], [
    {key: 10, length: 2, val: 'a'},
    {key: 12, length: 2, val: 'b'}
  ])
}
