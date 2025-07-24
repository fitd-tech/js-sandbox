import { Heap, HEAP_TYPES } from '../../heap/index.ts'

export function heapSortIntuited(list) {
  const _list: number[] = [...list]
  console.log('_list from heapSortIntuited', _list)
  const heap = new Heap(_list, HEAP_TYPES.MIN)
  console.log('heap.array from heapSortIntuited', heap.array)
  const sortedList: number[] = []
  let isHeapEmpty = heap.isEmpty()
  console.log('isHeapEmpty from heapSortIntuited', isHeapEmpty)
  while (!isHeapEmpty) {
    const rootValue = heap.extractRoot()
    console.log('rootValue from heapSortIntuited while loop', rootValue)
    if (rootValue !== undefined) {
      sortedList.push(rootValue)
    } else {
      isHeapEmpty = true
    }
    console.log(
      'sortedList after push from heapSortIntuited while loop',
      sortedList
    )
  }

  return sortedList
}
