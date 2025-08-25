/*
  Quick Sort (intuited)
  https://www.geeksforgeeks.org/dsa/quick-sort-algorithm/

  Our initial implementation based on intuition of the sort method.
*/

const DEBUG_ITERATION_LIMIT = null
let iterations = 0

function partition(array) {
  // console.log('array from partition', array)
  let pivotIndex = array.length - 1
  // console.log('initial pivotIndex from partition', pivotIndex)

  let i = 0
  while (i < array.length) {
    // console.log('array from while loop', array)
    // console.log('pivotIndex from while loop', pivotIndex)
    // console.log('i from while loop', i)
    const currentValue = array[i]
    const pivotValue = array[pivotIndex]
    // console.log('currentValue from partition for loop', currentValue)
    // console.log('pivotValue from partition for loop', pivotValue)

    if (i === pivotIndex) {
      break
    }

    if (currentValue > pivotValue && array.length > 2) {
      // console.log('array has more than 2 elements')
      // Swap currentValue with the element left of pivot
      array[i] = array[pivotIndex - 1]
      array[pivotIndex - 1] = currentValue
      // console.log('array[i] after first swap', array[i])
      // console.log(
      //   'array[pivotIndex - 1] after first swap',
      //   array[pivotIndex - 1]
      // )
      // Swap pivotValue with the element left of pivot
      array[pivotIndex] = array[pivotIndex - 1]
      array[pivotIndex - 1] = pivotValue
      // console.log('array[pivotIndex] after second swap', array[pivotIndex])
      // console.log(
      //   'array[pivotIndex - 1] after second swap',
      //   array[pivotIndex - 1]
      // )
      pivotIndex--
    } else if (currentValue > pivotValue && array.length == 2) {
      // console.log('array has 2 elements')
      array[pivotIndex] = currentValue
      array[i] = pivotValue
      // console.log('array[i] after swap', array[i])
      // console.log('array[pivotIndex] after swap', array[pivotIndex])
    } else {
      // DEV: should this logic happen here?
      // Only increment i if we don't swap, because we need to compare the new currentValue to pivotValue
      i++
    }
  }

  // console.log('pivotIndex after for loop', pivotIndex)
  return pivotIndex
}

export function quickSortIntuited(list) {
  // console.log('Beginning quick sort (intuited)...')
  // console.log('list from quickSortIntuited', list)
  // console.log('iterations from quickSortIntuited', iterations)
  if (DEBUG_ITERATION_LIMIT && iterations > DEBUG_ITERATION_LIMIT) {
    return list
  }
  iterations++

  if (list.length <= 1) {
    return list
  }

  const pivotIndex = partition(list)
  // console.log('pivotIndex from quickSortIntuited', pivotIndex)

  const left = list.slice(0, pivotIndex)
  const right = list.slice(pivotIndex + 1, list.length)
  // console.log('left from quickSortIntuited', left)
  // console.log('right from quickSortIntuited', right)

  const leftPartition = quickSortIntuited(left)
  const rightPartition = quickSortIntuited(right)
  // console.log('leftPartition from quickSortIntuited', leftPartition)
  // console.log('rightPartition from quickSortIntuited', rightPartition)

  const newList = [...leftPartition, list[pivotIndex], ...rightPartition]
  // console.log('newList from quickSortIntuited before return', newList)

  return newList
}
