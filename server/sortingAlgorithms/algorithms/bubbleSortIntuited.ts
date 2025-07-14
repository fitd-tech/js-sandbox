/*
  Bubble Sort (intuited)
  https://www.geeksforgeeks.org/dsa/bubble-sort-algorithm/

  Our initial implementation based on intuition of the sort method.
*/

export function bubbleSortIntuited(list) {
  console.log("Beginning bubble sort (intuited)...");
  const _list = [...list];

  // Set the target index to the end of the array and decrement until we reach index 0.
  for (
    let decrementingIndex = _list.length - 1;
    decrementingIndex >= 0;
    decrementingIndex--
  ) {
    // console.log('decrementingIndex from outer for loop', decrementingIndex)
    // Iterate through the array up to the target index.
    for (
      let incrementingIndex = 0;
      incrementingIndex < decrementingIndex;
      incrementingIndex++
    ) {
      // console.log('incrementingIndex from inner for loop', incrementingIndex)
      // If the n+1 element is less than the n element, swap them.
      // console.log('_list[incrementingIndex] from inner for loop', _list[incrementingIndex])
      // console.log('_list[incrementingIndex + 1] from inner for loop', _list[incrementingIndex + 1])
      if (_list[incrementingIndex] > _list[incrementingIndex + 1]) {
        const greaterValue = _list[incrementingIndex];
        _list[incrementingIndex] = _list[incrementingIndex + 1];
        _list[incrementingIndex + 1] = greaterValue;
      }
    }
  }

  return _list;
}
