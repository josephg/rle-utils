import assert from 'node:assert/strict'
import { rleIterRange, rlePush } from '../src/rlelist.js';
import { testRLEMethods } from '../src/testhelpers.js'
import { IndexedMap, SimpleKeyedSpan, indexedMapRLE, simpleKeyedSpanRLE } from '../src/simple.js';


// testRLEMethods({ length: 10, val: 'hi' }, simpleRLESpanMethods)
testRLEMethods({ length: 10, val: 'hi', key: 100 }, simpleKeyedSpanRLE)

{
  const list: SimpleKeyedSpan<string>[] = []
  rlePush(list, simpleKeyedSpanRLE, {key: 10, length: 2, val: 'a'})
  rlePush(list, simpleKeyedSpanRLE, {key: 12, length: 2, val: 'a'})
  assert(list.length === 1)
  assert(list[0].length === 4)
}

{
  const list: SimpleKeyedSpan<string>[] = []

  const empty = [...rleIterRange(list, simpleKeyedSpanRLE, 11, 13)]
  assert(empty.length === 0)

  rlePush(list, simpleKeyedSpanRLE, {key: 10, length: 2, val: 'a'})
  rlePush(list, simpleKeyedSpanRLE, {key: 12, length: 2, val: 'b'})
  const iterResult1 = [...rleIterRange(list, simpleKeyedSpanRLE, 11, 13)]
  assert.deepEqual(iterResult1, [
    {key: 11, length: 1, val: 'a'},
    {key: 12, length: 1, val: 'b'}
  ])

  assert.deepEqual([...rleIterRange(list, simpleKeyedSpanRLE, 5, 12)], [
    {key: 10, length: 2, val: 'a'}
  ])
  assert.deepEqual([...rleIterRange(list, simpleKeyedSpanRLE, 10, 12)], [
    {key: 10, length: 2, val: 'a'}
  ])
  assert.deepEqual([...rleIterRange(list, simpleKeyedSpanRLE, 0, 10000)], [
    {key: 10, length: 2, val: 'a'},
    {key: 12, length: 2, val: 'b'}
  ])
}

testRLEMethods(<IndexedMap>{
  keyStart: 20,
  keyEnd: 30,
  val: 100, // version 100-110.
}, indexedMapRLE)
