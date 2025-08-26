export const LIST_DIRECTION = {
  ASCENDING: 'asc',
  DESCENDING: 'desc',
}
type ListDirection =
  | typeof LIST_DIRECTION.ASCENDING
  | typeof LIST_DIRECTION.DESCENDING

export function checkSortedList(list: number[], listDirection: ListDirection) {
  let lastElement: number | null = null
  let listIsSorted = true

  if (listDirection === LIST_DIRECTION.ASCENDING) {
    for (let i = 0; i < list.length; i++) {
      if (lastElement !== null && list[i] < lastElement) {
        listIsSorted = false
        break
      }
      lastElement = list[i]
    }
  } else {
    for (let i = 0; i < list.length; i++) {
      if (lastElement && list[i] > lastElement) {
        listIsSorted = false
        break
      }
      lastElement = list[i]
    }
  }
  return listIsSorted
}
