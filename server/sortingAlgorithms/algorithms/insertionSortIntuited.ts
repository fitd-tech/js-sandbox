/*
  Insertion Sort (intuited)
  https://www.geeksforgeeks.org/dsa/insertion-sort-algorithm/

  Our initial implementation based on intuition of the sort method.
*/

export function insertionSortIntuited(list) {
  console.log("Beginning insertion sort (intuited)...");
  const _list = [...list];

  // Begin iteration of the array at the second element, and continue until the entire array has been iterated.
  for (
    let incrementingIndex = 1;
    incrementingIndex < _list.length - 1;
    incrementingIndex++
  ) {
    // console.log('incrementingIndex from outer for loop', incrementingIndex)
    // As long as the current element is less than the element before it, swap their places.
    for (
      let decrementingIndex = incrementingIndex;
      decrementingIndex >= 0;
      decrementingIndex--
    ) {
      //  console.log('decrementingIndex from inner for loop', decrementingIndex)
      // console.log('_list[decrementingIndex] from inner for loop', _list[decrementingIndex])
      // console.log('_list[decrementingIndex - 1] from inner for loop', _list[decrementingIndex - 1])
      if (_list[decrementingIndex] >= _list[decrementingIndex - 1]) {
        break;
      }

      const lowerValue = _list[decrementingIndex];
      _list[decrementingIndex] = _list[decrementingIndex - 1];
      _list[decrementingIndex - 1] = lowerValue;
    }
  }

  return _list;
}
