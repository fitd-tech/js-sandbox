/*
  Merge Sort (intuited)
  https://www.geeksforgeeks.org/dsa/merge-sort/

  Our initial implementation based on intuition of the sort method.
*/

function mergeArrays(array1, array2) {
  // console.log('array1', array1)
  // console.log('array2', array2)
  const mergedArray: number[] = [];

  let mergedArrayIndex = 0;
  let arrayIndex1 = 0;
  let arrayIndex2 = 0;
  while (arrayIndex1 < array1.length || arrayIndex2 < array2.length) {
    // console.log('mergedArrayIndex', mergedArrayIndex)
    // console.log('arrayIndex1', arrayIndex1)
    // console.log('arrayIndex2', arrayIndex2)
    // console.log('array1[arrayIndex1]', array1[arrayIndex1])
    // console.log('array2[arrayIndex2]', array2[arrayIndex2])
    if (array1[arrayIndex1] === undefined) {
      mergedArray[mergedArrayIndex] = array2[arrayIndex2];
      mergedArrayIndex++;
      arrayIndex2++;
    } else if (array2[arrayIndex2] === undefined) {
      mergedArray[mergedArrayIndex] = array1[arrayIndex1];
      mergedArrayIndex++;
      arrayIndex1++;
    } else if (array1[arrayIndex1] < array2[arrayIndex2]) {
      mergedArray[mergedArrayIndex] = array1[arrayIndex1];
      mergedArrayIndex++;
      arrayIndex1++;
    } else {
      mergedArray[mergedArrayIndex] = array2[arrayIndex2];
      mergedArrayIndex++;
      arrayIndex2++;
    }
  }
  // console.log('mergedArray', mergedArray)
  return mergedArray;
}

export function mergeSortIntuited(list) {
  // console.log('Beginning merge sort (intuited)...')
  if (list.length <= 1) {
    return list;
  }
  const midpoint = Math.floor(list.length / 2);
  // console.log('midpoint', midpoint)
  const left = list.slice(0, midpoint);
  // console.log('left', left)
  const right = list.slice(midpoint, list.length);
  // console.log('right', right)

  const sortedLeft = mergeSortIntuited(left);
  const sortedRight = mergeSortIntuited(right);

  return mergeArrays(sortedLeft, sortedRight);
}
