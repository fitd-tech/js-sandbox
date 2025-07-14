/*
  Selection Sort (intuited)
  https://www.geeksforgeeks.org/dsa/selection-sort-algorithm-2/

  Our initial implementation based on intuition of the sort method.
*/

export function selectionSortIntuited(list) {
  console.log("Beginning selection sort (intuited)...");
  // Create a copy of the passed array with a new reference to avoid mutation of the original.
  const _list = [...list];

  // Iterate through the array starting with the nth element (beginning at 0) of the array.
  // Continue until the nth index reaches the length of the array.
  for (let targetIndex = 0; targetIndex < _list.length; targetIndex++) {
    // console.log('targetIndex from while loop', targetIndex)
    let indexOfSmallest = targetIndex;
    // Iterate through the following elements in the list to find the smallest value.
    for (
      let seekingIndex = targetIndex;
      seekingIndex < list.length;
      seekingIndex++
    ) {
      // console.log('seekingIndex from for loop', seekingIndex)
      if (_list[seekingIndex] < _list[indexOfSmallest]) {
        indexOfSmallest = seekingIndex;
      }
      // console.log('indexOfSmallest after assignment', indexOfSmallest)
    }
    // Swap it with the nth element of the array.
    if (indexOfSmallest !== targetIndex) {
      const valueOfSmallest = _list[indexOfSmallest];
      _list[indexOfSmallest] = _list[targetIndex];
      _list[targetIndex] = valueOfSmallest;
    }
  }

  return _list;
}
