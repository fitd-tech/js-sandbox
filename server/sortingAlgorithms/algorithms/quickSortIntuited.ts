/*
  Quick Sort (intuited)
  https://www.geeksforgeeks.org/dsa/quick-sort-algorithm/

  Our initial implementation based on intuition of the sort method.
*/

export const PIVOT_PLACEMENT = {
  START: 'start',
  MIDDLE: 'middle',
  END: 'end',
  MEDIAN: 'median',
}
export type PivotPlacementOption =
  | typeof PIVOT_PLACEMENT.START
  | typeof PIVOT_PLACEMENT.MIDDLE
  | typeof PIVOT_PLACEMENT.END
  | typeof PIVOT_PLACEMENT.MEDIAN

interface QuickSortIntuitedOptions {
  pivotPlacement?: PivotPlacementOption
}

const DEBUG_RECURSIVE_ITERATION_LIMIT = null
let recursiveIterations = 0
const DEBUG_LOOP_ITERATION_LIMIT = null
let loopIterations = 0

function partition(array: number[], pivotPlacement?: PivotPlacementOption) {
  // console.log('array from partition', array)
  let pivotIndex = 0

  const pivotIndexOptions = {
    [PIVOT_PLACEMENT.START]: 0,
    [PIVOT_PLACEMENT.MIDDLE]: Math.floor(array.length / 2),
    [PIVOT_PLACEMENT.END]: array.length - 1,
  }
  let medianPivotPlacementOptions
  let sortedMedianPivotPlacementOptions
  let medianPivotPlacement
  let medianPivotIndex

  function swapValuesFromLeftOfPivot(
    pivotIndex: number,
    pivotValue: number,
    loopIndex: number,
    loopValue: number
  ) {
    let _pivotIndex = pivotIndex
    if (array.length === 2) {
      // console.log('array has 2 elements')
      array[_pivotIndex] = loopValue
      array[loopIndex] = pivotValue
      // console.log('array[i] after swap', array[i])
      // console.log('array[pivotIndex] after swap', array[pivotIndex])
    } else {
      // console.log('array has more than 2 elements')
      // Swap currentValue with the element left of pivot
      array[loopIndex] = array[_pivotIndex - 1]
      array[_pivotIndex - 1] = loopValue
      // console.log('array[i] after first swap', array[i])
      // console.log(
      //   'array[pivotIndex - 1] after first swap',
      //   array[pivotIndex - 1]
      // )
      // Swap pivotValue with the element left of pivot
      array[_pivotIndex] = array[_pivotIndex - 1]
      array[_pivotIndex - 1] = pivotValue
      // console.log('array[pivotIndex] after second swap', array[pivotIndex])
      // console.log(
      //   'array[pivotIndex - 1] after second swap',
      //   array[pivotIndex - 1]
      // )
    }
    _pivotIndex--
    return _pivotIndex
  }

  function swapValuesFromRightOfPivot(
    pivotIndex: number,
    pivotValue: number,
    loopIndex: number,
    loopValue: number
  ) {
    let _pivotIndex = pivotIndex
    if (array.length === 2) {
      // console.log('array has 2 elements')
      array[_pivotIndex] = loopValue
      array[loopIndex] = pivotValue
      // console.log('array[i] after swap', array[i])
      // console.log('array[pivotIndex] after swap', array[pivotIndex])
    } else {
      // console.log('array has more than 2 elements')
      // Swap currentValue with the element right of pivot
      array[loopIndex] = array[_pivotIndex + 1]
      array[_pivotIndex + 1] = loopValue
      // console.log('array[i] after first swap', array[i])
      // console.log(
      //   'array[pivotIndex - 1] after first swap',
      //   array[pivotIndex - 1]
      // )
      // Swap pivotValue with the element right of pivot
      array[_pivotIndex] = array[_pivotIndex + 1]
      array[_pivotIndex + 1] = pivotValue
      // console.log('array[pivotIndex] after second swap', array[pivotIndex])
      // console.log(
      //   'array[pivotIndex - 1] after second swap',
      //   array[pivotIndex - 1]
      // )
    }
    _pivotIndex++
    return _pivotIndex
  }

  function startPlacementLoop(pivotIndex: number) {
    let _pivotIndex = pivotIndex

    let i = array.length - 1
    while (i > _pivotIndex) {
      // console.log('array from while loop', array)
      // console.log('_pivotIndex from while loop', _pivotIndex)
      // console.log('i from while loop', i)

      if (
        DEBUG_LOOP_ITERATION_LIMIT &&
        loopIterations > DEBUG_LOOP_ITERATION_LIMIT
      ) {
        return _pivotIndex
      }
      loopIterations++

      const currentValue = array[i]
      const pivotValue = array[_pivotIndex]
      // console.log('currentValue from while loop', currentValue)
      // console.log('pivotValue from while loop', pivotValue)

      if (currentValue < pivotValue) {
        _pivotIndex = swapValuesFromRightOfPivot(
          _pivotIndex,
          pivotValue,
          i,
          array[i]
        )
        // console.log('_pivotIndex after swap', _pivotIndex)
      } else {
        // DEV: should this logic happen here?
        // Only increment i if we don't swap, because we need to compare the new currentValue to pivotValue
        i--
      }
    }
    return _pivotIndex
  }

  function middlePlacementLoop(pivotIndex: number) {
    let _pivotIndex = pivotIndex

    let i = 0
    while (i < array.length) {
      // console.log('array from while loop', array)
      // console.log('pivotIndex from while loop', pivotIndex)
      // console.log('i from while loop', i)

      if (
        DEBUG_LOOP_ITERATION_LIMIT &&
        loopIterations > DEBUG_LOOP_ITERATION_LIMIT
      ) {
        return _pivotIndex
      }
      loopIterations++

      const currentValue = array[i]
      const pivotValue = array[_pivotIndex]
      // console.log('currentValue from while loop', currentValue)
      // console.log('pivotValue from while loop', pivotValue)

      if (currentValue > pivotValue && i < _pivotIndex) {
        _pivotIndex = swapValuesFromLeftOfPivot(
          _pivotIndex,
          pivotValue,
          i,
          array[i]
        )
        // console.log('_pivotIndex after swap', _pivotIndex)
      } else if (currentValue < pivotValue && i > _pivotIndex) {
        _pivotIndex = swapValuesFromRightOfPivot(
          _pivotIndex,
          pivotValue,
          i,
          array[i]
        )
        // console.log('_pivotIndex after swap', _pivotIndex)
      } else {
        // DEV: should this logic happen here?
        // Only increment i if we don't swap, because we need to compare the new currentValue to pivotValue
        i++
      }
    }
    return _pivotIndex
  }

  function endPlacementLoop(pivotIndex: number) {
    // console.log('initial pivotIndex from endPlacementLoop', pivotIndex)

    let _pivotIndex = pivotIndex

    let i = 0
    while (i < _pivotIndex) {
      // console.log('array from while loop', array)
      // console.log('_pivotIndex from while loop', _pivotIndex)
      // console.log('i from while loop', i)

      if (
        DEBUG_LOOP_ITERATION_LIMIT &&
        loopIterations > DEBUG_LOOP_ITERATION_LIMIT
      ) {
        return _pivotIndex
      }
      loopIterations++

      const currentValue = array[i]
      const pivotValue = array[_pivotIndex]
      // console.log('currentValue from while loop', currentValue)
      // console.log('pivotValue from while loop', pivotValue)

      if (currentValue > pivotValue) {
        _pivotIndex = swapValuesFromLeftOfPivot(
          _pivotIndex,
          pivotValue,
          i,
          array[i]
        )
        // console.log('_pivotIndex after swap', _pivotIndex)
      } else {
        // DEV: should this logic happen here?
        // Only increment i if we don't swap, because we need to compare the new currentValue to pivotValue
        i++
      }
    }
    return _pivotIndex
  }

  // console.log('pivotPlacement before main switch', pivotPlacement)
  switch (pivotPlacement) {
    case PIVOT_PLACEMENT.MEDIAN:
      medianPivotPlacementOptions = [
        {
          placement: PIVOT_PLACEMENT.START,
          index: pivotIndexOptions[PIVOT_PLACEMENT.START],
          value: array[pivotIndexOptions[PIVOT_PLACEMENT.START]],
        },
        {
          placement: PIVOT_PLACEMENT.MIDDLE,
          index: pivotIndexOptions[PIVOT_PLACEMENT.MIDDLE],
          value: array[pivotIndexOptions[PIVOT_PLACEMENT.MIDDLE]],
        },
        {
          placement: PIVOT_PLACEMENT.END,
          index: pivotIndexOptions[PIVOT_PLACEMENT.END],
          value: array[pivotIndexOptions[PIVOT_PLACEMENT.END]],
        },
      ]
      // console.log('medianPivotPlacementOptions', medianPivotPlacementOptions)
      sortedMedianPivotPlacementOptions = medianPivotPlacementOptions.sort(
        (a, b) => b.value - a.value
      )
      // console.log(
      //   'sortedMedianPivotPlacementOptions',
      //   sortedMedianPivotPlacementOptions
      // )
      medianPivotPlacement = sortedMedianPivotPlacementOptions[1].placement
      // console.log('medianPivotPlacement', medianPivotPlacement)
      medianPivotIndex = sortedMedianPivotPlacementOptions[1].index
      // console.log('medianPivotIndex', medianPivotIndex)
      pivotIndex = medianPivotIndex

      switch (medianPivotPlacement) {
        case PIVOT_PLACEMENT.START:
          pivotIndex = startPlacementLoop(pivotIndex)
          break
        case PIVOT_PLACEMENT.MIDDLE:
          pivotIndex = middlePlacementLoop(pivotIndex)
          break
        case PIVOT_PLACEMENT.END:
          pivotIndex = endPlacementLoop(pivotIndex)
          break
        default:
          console.error(
            `Internal error: the pivot placement value '${medianPivotPlacement}' of sortedMedianPivotPlacementOptions is invalid`
          )
      }
      break
    case PIVOT_PLACEMENT.START:
      pivotIndex = pivotIndexOptions[pivotPlacement]
      pivotIndex = startPlacementLoop(pivotIndex)
      break
    case PIVOT_PLACEMENT.MIDDLE:
      pivotIndex = pivotIndexOptions[pivotPlacement]
      pivotIndex = middlePlacementLoop(pivotIndex)
      break
    case PIVOT_PLACEMENT.END:
      pivotIndex = pivotIndexOptions[pivotPlacement]
      pivotIndex = endPlacementLoop(pivotIndex)
      break
    default:
      pivotIndex = pivotIndexOptions[PIVOT_PLACEMENT.END]
      pivotIndex = endPlacementLoop(pivotIndex)
  }
  console.log('array after loop', array)

  // console.log('pivotIndex after for loop', pivotIndex)
  return pivotIndex
}

export function quickSortIntuited(
  list: number[],
  options?: QuickSortIntuitedOptions
): number[] {
  // console.log('list from quickSortIntuited', list)
  const { pivotPlacement } = options || {}
  const _list = [...list]

  // console.log('Beginning quick sort (intuited)...')
  // console.log('iterations from quickSortIntuited', iterations)
  if (
    DEBUG_RECURSIVE_ITERATION_LIMIT &&
    recursiveIterations > DEBUG_RECURSIVE_ITERATION_LIMIT
  ) {
    return _list
  }
  recursiveIterations++

  if (_list.length <= 1) {
    return _list
  }

  let pivotIndex = partition(_list, pivotPlacement)
  // console.log('pivotIndex from quickSortIntuited', pivotIndex)

  // Prevent the same array being recursed infinitely
  if (pivotIndex === 0) {
    pivotIndex++
  }

  const leftPartition = _list.slice(0, pivotIndex)
  const rightPartition = _list.slice(pivotIndex, _list.length)
  // console.log('leftPartition from quickSortIntuited', leftPartition)
  // console.log('rightPartition from quickSortIntuited', rightPartition)

  const leftResult = quickSortIntuited(leftPartition, options)
  const rightResult = quickSortIntuited(rightPartition, options)
  // console.log('leftResult from quickSortIntuited', leftResult)
  // console.log('rightResult from quickSortIntuited', rightResult)

  const newList = [...leftResult, ...rightResult]
  // console.log('newList from quickSortIntuited before return', newList)

  return newList
}
