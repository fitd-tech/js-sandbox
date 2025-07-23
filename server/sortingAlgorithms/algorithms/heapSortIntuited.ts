import { Heap, HEAP_TYPES } from '../../heap/index.ts'

export function heapSortIntuited(list) {
  const _list: number[] = [...list]
  console.log('_list from heapSortIntuited', _list)
  const heap = new Heap(_list, HEAP_TYPES.MIN)
  console.log('heap.array from heapSortIntuited', heap.array)

  return heap.array
}
