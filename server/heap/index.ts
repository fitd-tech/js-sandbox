// A JavaScript implementation of a heap data structure and its operations
// https://en.wikipedia.org/wiki/Heap_(data_structure)
// https://www.youtube.com/watch?v=pLIajuc31qk

// Not supported in Node: https://github.com/nodejs/amaro/issues/22
/* export enum HeapTypes {
  MIN,
  MAX,
} */

export const HEAP_TYPES = {
  MIN: 'MIN',
  MAX: 'MAX',
} as const
type HeapTypesOptions = typeof HEAP_TYPES.MIN | typeof HEAP_TYPES.MAX

interface CompareValuesOptions {
  includeEqual: boolean
}

export class Heap {
  heapArray: number[] = []
  type: HeapTypesOptions = HEAP_TYPES.MAX

  constructor(array: number[], type: HeapTypesOptions) {
    console.log('type from constructor', type)
    if (type) {
      this.type = type
    }

    if (array) {
      this.heapify(array)
    }
  }

  // BASIC

  findMax() {}

  insert() {}

  extractMax() {}

  deleteMax() {}

  replace() {}

  // CREATION

  createHeap() {
    this.heapArray = []
    return this.heapArray
  }

  // We need to sift down as we traverse the array backwards
  heapify(array) {
    console.log('this.type from heapify', this.type)
    this.heapArray = [...array]
    console.log('this.heapArray.length from heapify', this.heapArray.length)

    const DEBUG_ITERATION_LIMIT = null
    // DEV: This loop should begin where 2i + 1 will give a valid array element
    for (let i = this.heapArray.length - 1; i >= 0; i--) {
      console.log('array.length - i from heapify', array.length - i)
      if (
        DEBUG_ITERATION_LIMIT &&
        this.heapArray.length - i > DEBUG_ITERATION_LIMIT
      ) {
        break
      }
      this.siftDown(i)
    }
  }

  merge() {}

  meld() {}

  // INSPECTION

  size() {
    return this.heapArray.length
  }

  isEmpty() {
    return this.heapArray.length === 0
  }

  // INTERNAL

  // Performs increase-key if a max-heap or decrease-key if a min-heap
  incrementKey() {}

  delete() {}

  siftUp() {}

  siftDown(index) {
    console.log('called siftDown')
    let leftChild = this.getLeftChild(index)
    let rightChild = this.getRightChild(index)
    console.log('leftChild from siftDown', leftChild)
    console.log('rightChild from siftDown', rightChild)
    if (leftChild.value === undefined && rightChild.value === undefined) {
      return
    }
    let currentIndex = index
    let currentValue = this.heapArray[currentIndex]
    console.log('currentIndex from siftDown', currentIndex)
    console.log('currentValue from siftDown', currentValue)
    const getShouldWhileContinue = () => {
      console.log('currentIndex from getShouldWhileContinue', currentIndex)
      console.log('currentValue from getShouldWhileContinue', currentValue)
      console.log(
        'leftChild.value from getShouldWhileContinue',
        leftChild.value
      )
      console.log(
        'rightChild.value from getShouldWhileContinue',
        rightChild.value
      )
      const noValidChildValue =
        leftChild.value === undefined && rightChild.value === undefined
      const leftChildShouldSwap = this.getShouldSwapValuesVertically(
        currentValue,
        leftChild.value
      )
      const rightChildShouldSwap = this.getShouldSwapValuesVertically(
        currentValue,
        rightChild.value
      )
      console.log(
        'leftChildShouldSwap from getShouldWhileContinue',
        leftChildShouldSwap
      )
      console.log(
        'rightChildShouldSwap from getShouldWhileContinue',
        rightChildShouldSwap
      )
      // DEV: This can be refined to remove the check for the right child once we know we will never create a heap where a right child exists without the left
      const shouldWhileContinue =
        !noValidChildValue && (leftChildShouldSwap || rightChildShouldSwap)
      console.log(
        'shouldWhileContinue from getShouldWhileContinue',
        shouldWhileContinue
      )
      return shouldWhileContinue
    }
    const DEBUG_ITERATION_LIMIT = null
    let iteration = 0
    while (
      getShouldWhileContinue() &&
      (!DEBUG_ITERATION_LIMIT || iteration < DEBUG_ITERATION_LIMIT)
    ) {
      console.log('iteration from while loop', iteration)
      console.log('currentIndex from while loop', currentIndex)
      console.log('currentValue from while loop', currentValue)
      console.log('leftChild.index from while loop', leftChild.index)
      console.log('leftChild.value from while loop', leftChild.value)
      console.log('rightChild.index from while loop', rightChild.index)
      console.log('rightChild.value from while loop', rightChild.value)
      if (rightChild.value === undefined) {
        console.log('There is no right child')
        this.swapElementValues(currentIndex, leftChild.index)
        currentIndex = leftChild.index
        currentValue = leftChild.value
        leftChild = this.getLeftChild(currentIndex)
        rightChild = this.getRightChild(currentIndex)
      } else if (leftChild.value === undefined) {
        // This case should never be met in a valid heap
        console.log('There is no left child')
        this.swapElementValues(currentIndex, rightChild.index)
        currentIndex = rightChild.index
        currentValue = rightChild.value
        leftChild = this.getLeftChild(currentIndex)
        rightChild = this.getRightChild(currentIndex)
      } else if (
        this.compareValuesHorizontally(leftChild.value, rightChild.value)
      ) {
        console.log('Left child should be swapped')
        this.swapElementValues(currentIndex, leftChild.index)
        currentIndex = leftChild.index
        currentValue = leftChild.value
        leftChild = this.getLeftChild(currentIndex)
        rightChild = this.getRightChild(currentIndex)
      } else {
        console.log('Right child should be swapped')
        this.swapElementValues(currentIndex, rightChild.index)
        currentIndex = rightChild.index
        currentValue = leftChild.value
        leftChild = this.getLeftChild(currentIndex)
        rightChild = this.getRightChild(currentIndex)
      }
      iteration++
    }
    console.log('this.validateHeap() from siftDown', this.validateHeap())
  }

  // META

  getHeapElement(targetIndex) {
    const leftChildValue = this.heapArray[targetIndex]

    return {
      index: targetIndex,
      value: leftChildValue,
    }
  }

  getParent(sourceIndex) {
    const leftChildIndex = (sourceIndex - 1) / 2
    return this.getHeapElement(leftChildIndex)
  }

  getLeftChild(sourceIndex) {
    const leftChildIndex = 2 * sourceIndex + 1
    return this.getHeapElement(leftChildIndex)
  }

  getRightChild(sourceIndex) {
    const rightChildIndex = 2 * sourceIndex + 2
    return this.getHeapElement(rightChildIndex)
  }

  swapElementValues(index1, index2) {
    console.log(
      'this.heapArray[index1] from swapElementValues',
      this.heapArray[index1]
    )
    console.log(
      'this.heapArray[index2] from swapElementValues',
      this.heapArray[index2]
    )
    const index1Value = this.heapArray[index1]
    this.heapArray[index1] = this.heapArray[index2]
    this.heapArray[index2] = index1Value
    console.log(
      'this.heapArray[index1] after swap from swapElementValues',
      this.heapArray[index1]
    )
    console.log(
      'this.heapArray[index2] after swap from swapElementValues',
      this.heapArray[index2]
    )
  }

  validateHeap() {
    let heapValid = true
    for (let i = 0; i < this.heapArray.length; i++) {
      const leftChild = this.getLeftChild(i)
      const rightChild = this.getRightChild(i)
      const leftChildExists = leftChild.index < this.heapArray.length
      const rightChildExists = rightChild.index < this.heapArray.length
      if (leftChildExists && leftChild.value === undefined) {
        heapValid = false
        break
      }
      if (rightChildExists && rightChild.value === undefined) {
        heapValid = false
        break
      }
      if (
        leftChildExists &&
        this.getShouldSwapValuesVertically(this.heapArray[i], leftChild.value)
      ) {
        heapValid = false
        break
      }
      if (
        rightChildExists &&
        this.getShouldSwapValuesVertically(this.heapArray[i], rightChild.value)
      ) {
        heapValid = false
        break
      }
    }

    return heapValid
  }

  compareValues(
    value1,
    value2,
    { includeEqual }: CompareValuesOptions = { includeEqual: false }
  ) {
    console.log('value1 from compareValues', value1)
    console.log('value2 from compareValues', value2)
    console.log('this.type from compareValues', this.type)
    if (this.type === HEAP_TYPES.MIN) {
      if (includeEqual) {
        return value1 <= value2
      } else {
        return value1 < value2
      }
    } else {
      if (includeEqual) {
        return value1 >= value2
      } else {
        return value1 > value2
      }
    }
  }

  getShouldSwapValuesVertically(
    currentValue,
    childValue,
    { includeEqual }: CompareValuesOptions = { includeEqual: false }
  ) {
    return !this.compareValues(currentValue, childValue, { includeEqual })
  }

  compareValuesHorizontally(
    leftSibling,
    rightSibling,
    { includeEqual }: CompareValuesOptions = { includeEqual: false }
  ) {
    return this.compareValues(leftSibling, rightSibling, { includeEqual })
  }

  get array() {
    return this.heapArray
  }
}
