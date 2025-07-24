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

  findRoot() {
    return this.heapArray[0]
  }

  insert(value) {
    // Push a the new value to heapArray
    this.heapArray.push(value)
    // Perform siftUp on the node to move it up to its proper place
    this.siftUp(this.heapArray.length - 1)
  }

  extractRoot() {
    // Swap the values in the first and last indices of the array
    this.swapElementValues(0, this.heapArray.length - 1)
    // Pop the array and save it
    const rootValue = this.heapArray.pop()
    // Sift down from the root node
    this.siftDown(0)

    return rootValue
  }

  // This is listed in the wiki, but it seems to be the same as extractRoot with no return value.
  // deleteRoot() {}

  // DEV: Pay attention to the description in the wiki. It does not describe the same operation as the below update method.
  replace() {}

  // This method doesn't seem to listed in the wiki, but is its methodology is described in the video.
  update(index, value) {
    // Save the value of the node at this index.
    const originalValue = this.heapArray[index]
    // Replace the value of the node.
    this.heapArray[index] = value
    // Compare the new and old node values.
    // If the values are the same, do nothing.
    // Otherwise, get the sift direction
    if (originalValue === value) {
      return
    }
    const siftFunc = this.getUpdateSiftFunc(value, originalValue).bind(this) // bind this to maintain scope in returned function
    siftFunc(index)
  }

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
      // console.log('array.length - i from heapify', array.length - i)
      if (
        !!DEBUG_ITERATION_LIMIT &&
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

  siftUp(index) {
    console.log('called siftUp')
    // Store the current index
    let currentIndex = index
    console.log('currentIndex from siftUp', currentIndex)
    // Get the value of the current node
    const currentValue = this.heapArray[currentIndex]
    // Get the parent of the current node
    let currentParent = this.getParent(currentIndex)
    console.log('currentParent from siftUp', currentParent)
    // While the node has a parent and the parent value should be swapped with the node value, continue
    const getShouldSwapParentAndChild = () => {
      const doesParentExist = currentParent.value !== undefined
      console.log('doesParentExist from siftUp', doesParentExist)
      console.log(
        'currentParent.value from getShouldSwapParentAndChild in siftUp',
        currentParent.value
      )
      console.log(
        'currentValue from getShouldSwapParentAndChild in siftUp',
        currentValue
      )
      const shouldSwapParentAndChild = this.getShouldSwapValuesVertically(
        currentParent.value,
        currentValue
      )
      console.log(
        'shouldSwapParentAndChild from siftUp',
        shouldSwapParentAndChild
      )
      return doesParentExist && shouldSwapParentAndChild
    }
    const DEBUG_ITERATION_LIMIT = null
    let debugIteration = 0
    while (
      getShouldSwapParentAndChild() &&
      (!DEBUG_ITERATION_LIMIT || debugIteration < DEBUG_ITERATION_LIMIT)
    ) {
      console.log('currentValue from siftUp while loop', currentValue)
      console.log('currentIndex from siftUp while loop', currentIndex)
      console.log('currentParent from siftUp while loop', currentParent)
      // Swap the node value and the parent value
      this.swapElementValues(currentParent.index, currentIndex)
      console.log(
        'currentParent after swap from siftUp while loop',
        currentParent
      )
      // Set the current index to the parent index (currentValue remains the same, as we are moving with it)
      currentIndex = currentParent.index
      console.log('currentValue after swap in siftUp while loop', currentValue)
      console.log('currentIndex after swap in siftUp while loop', currentIndex)
      currentParent = this.getParent(currentIndex)
      debugIteration++
    }
    // Validate the heap
    this.validateHeap()
  }

  siftDown(index) {
    console.log('called siftDown')
    console.log('index from siftDown', index)
    // Get the initial children
    let leftChild = this.getLeftChild(index)
    let rightChild = this.getRightChild(index)
    // console.log('leftChild from siftDown', leftChild)
    // console.log('rightChild from siftDown', rightChild)
    // If both children don't exist, no need to sift
    if (leftChild.value === undefined && rightChild.value === undefined) {
      return
    }
    let currentIndex = index
    let currentValue = this.heapArray[currentIndex]
    // console.log('currentIndex from siftDown', currentIndex)
    // console.log('currentValue from siftDown', currentValue)
    // While loop should only continue if at least on child exists and it should be swapped with its parent
    const getShouldWhileContinue = () => {
      // console.log('currentIndex from getShouldWhileContinue', currentIndex)
      // console.log('currentValue from getShouldWhileContinue', currentValue)
      // console.log(
      //   'leftChild.value from getShouldWhileContinue',
      //   leftChild.value
      // )
      // console.log(
      //   'rightChild.value from getShouldWhileContinue',
      //   rightChild.value
      // )
      const noValidChildValue =
        leftChild.value === undefined && rightChild.value === undefined
      const leftChildShouldSwap =
        leftChild.value !== undefined &&
        this.getShouldSwapValuesVertically(currentValue, leftChild.value)
      const rightChildShouldSwap =
        rightChild.value !== undefined &&
        this.getShouldSwapValuesVertically(currentValue, rightChild.value)
      // console.log(
      //   'leftChildShouldSwap from getShouldWhileContinue',
      //   leftChildShouldSwap
      // )
      // console.log(
      //   'rightChildShouldSwap from getShouldWhileContinue',
      //   rightChildShouldSwap
      // )
      // DEV: This can be refined to remove the check for the right child once we know we will never create a heap where a right child exists without the left
      const shouldWhileContinue =
        !noValidChildValue && (leftChildShouldSwap || rightChildShouldSwap)
      // console.log(
      //   'shouldWhileContinue from getShouldWhileContinue',
      //   shouldWhileContinue
      // )
      return shouldWhileContinue
    }
    const DEBUG_ITERATION_LIMIT = null
    let debugIteration = 0
    while (
      getShouldWhileContinue() &&
      (!DEBUG_ITERATION_LIMIT || debugIteration < DEBUG_ITERATION_LIMIT)
    ) {
      // console.log('iteration from while loop', iteration)
      // console.log('currentIndex from while loop', currentIndex)
      // console.log('currentValue from while loop', currentValue)
      // console.log('leftChild.index from while loop', leftChild.index)
      // console.log('leftChild.value from while loop', leftChild.value)
      // console.log('rightChild.index from while loop', rightChild.index)
      // console.log('rightChild.value from while loop', rightChild.value)
      if (rightChild.value === undefined) {
        // console.log('There is no right child')
        // Swap the parent value with the child value
        this.swapElementValues(currentIndex, leftChild.index)
        // Set the current value to the former swapped child value
        // DEV: De we really need to set these values?
        currentValue = this.getLeftChild(currentIndex).value
        // Set the current index to the index of the swapped child
        currentIndex = leftChild.index
        // Get the new children
        leftChild = this.getLeftChild(currentIndex)
        rightChild = this.getRightChild(currentIndex)
      } else if (leftChild.value === undefined) {
        console.warn('There is no left child. This should not happen here.')
        // DEV: This case should never be met in a valid heap (since we never enter the while loop if both child values are undefined)
        this.swapElementValues(currentIndex, rightChild.index)
        currentValue = this.getRightChild(currentIndex).value
        currentIndex = rightChild.index
        leftChild = this.getLeftChild(currentIndex)
        rightChild = this.getRightChild(currentIndex)
      } else if (
        this.compareValuesHorizontally(leftChild.value, rightChild.value)
      ) {
        // DEV: We may be able to refine this condition, because we already look at the values of the children in getShouldWhileContinue
        // console.log('Left child should be swapped')
        this.swapElementValues(currentIndex, leftChild.index)
        currentValue = this.getLeftChild(currentIndex).value
        currentIndex = leftChild.index
        leftChild = this.getLeftChild(currentIndex)
        rightChild = this.getRightChild(currentIndex)
      } else {
        // console.log('Right child should be swapped')
        this.swapElementValues(currentIndex, rightChild.index)
        currentValue = this.getRightChild(currentIndex).value
        currentIndex = rightChild.index
        leftChild = this.getLeftChild(currentIndex)
        rightChild = this.getRightChild(currentIndex)
      }
      debugIteration++
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
    // https://en.wikipedia.org/wiki/Binary_heap#Heap_implementation
    const leftChildIndex = Math.floor((sourceIndex - 1) / 2)
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
    // console.log(
    //   'this.heapArray[index1] from swapElementValues',
    //   this.heapArray[index1]
    // )
    // console.log(
    //   'this.heapArray[index2] from swapElementValues',
    //   this.heapArray[index2]
    // )
    const index1Value = this.heapArray[index1]
    this.heapArray[index1] = this.heapArray[index2]
    this.heapArray[index2] = index1Value
    // console.log(
    //   'this.heapArray[index1] after swap from swapElementValues',
    //   this.heapArray[index1]
    // )
    // console.log(
    //   'this.heapArray[index2] after swap from swapElementValues',
    //   this.heapArray[index2]
    // )
  }

  // DEV: This should be recursive to traverse all children
  validateHeap() {
    console.log('called validateHeap')
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
    // console.log('value1 from compareValues', value1)
    // console.log('value2 from compareValues', value2)
    // console.log('this.type from compareValues', this.type)
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
    parentValue,
    childValue,
    { includeEqual }: CompareValuesOptions = { includeEqual: false }
  ) {
    // console.log('currentValue from getShouldSwapValuesVertically', currentValue)
    // console.log('childValue from getShouldSwapValuesVertically', childValue)
    return !this.compareValues(parentValue, childValue, { includeEqual })
  }

  compareValuesHorizontally(
    leftSiblingValue,
    rightSiblingValue,
    { includeEqual }: CompareValuesOptions = { includeEqual: false }
  ) {
    // console.log(
    //   'leftSiblingValue from compareValuesHorizontally',
    //   leftSiblingValue
    // )
    // console.log(
    //   'rightSiblingValue from compareValuesHorizontally',
    //   rightSiblingValue
    // )
    return this.compareValues(leftSiblingValue, rightSiblingValue, {
      includeEqual,
    })
  }

  getUpdateSiftFunc(newValue, originalValue) {
    /*
      Sift direction:
        MIN-HEAP
          newValue < originalValue -> UP
          newValue > originalValue -> DOWN
        MAX-HEAP
          newValue < originalValue -> DOWN
          newValue > originalValue -> UP

      this.compareValues return values:
        MIN-HEAP
          newValue < originalValue -> true
          newValue > originalValue -> false
        MAX-HEAP
          newValue < originalValue -> false
          newValue > originalValue -> true
        
      Therefore:
        true -> UP
        false -> DOWN
    */
    const siftDirectionBoolean = this.compareValues(newValue, originalValue)
    if (siftDirectionBoolean) {
      return this.siftUp
    }
    return this.siftDown
  }

  get array() {
    return this.heapArray
  }
}
