import { useState, useMemo, useCallback } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import Alert from '@mui/material/Alert'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Typography from '@mui/material/Typography'

import type { SelectChangeEvent } from '@mui/material/Select'

import ScrollList from '../components/ScrollList.tsx'
import SortDurationInfo from '../components/SortDurationInfo.tsx'
import { endpoints } from '../constants.ts'
import ActionPanel from '../components/ActionPanel.tsx'
import FormDialog from '../components/FormDialog.tsx'
import TimedAlert from '../components/HeapInfo.tsx'

export const Route = createFileRoute('/sort')({
  component: Sort,
})

const PAGE_SIZE = 100

function Sort() {
  const [isGetListDialogOpen, setIsGetListDialogOpen] = useState(false)
  const [listSize, setListSize] = useState('')
  const [list, setList] = useState<number[]>([])
  const [isLoadingList, setIsLoadingList] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [listPage, setListPage] = useState(1)
  const [sortedListPage, setSortedListPage] = useState(1)
  const [hasMorePages, setHasMorePages] = useState(false)
  const [sortEndpoint, setSortEndpoint] = useState<string | null>(null)
  const [sortName, setSortName] = useState<string | null>(null)
  const [isLoadingSortedList, setIsLoadingSortedList] = useState(false)
  const [shouldDisplayInfoAlert, setShouldDisplayInfoAlert] = useState(false)
  const [sortedList, setSortedList] = useState<number[]>([])
  const [duration, setDuration] = useState(null)
  const [error, setError] = useState<string | null>(null)

  function handleClickGetList() {
    setIsGetListDialogOpen(true)
  }

  async function getList(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsGetListDialogOpen(false)
    setError(null)
    setIsLoadingList(true)
    setDuration(null)
    setSortEndpoint(null)
    setSortedList([])
    const data = {
      listSize: Number(listSize),
      pageSize: PAGE_SIZE,
    }
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}${endpoints.list}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    )
    if (response.ok) {
      const responseJson = await response.json()
      const { list, page, hasMorePages } = responseJson
      setList(list)
      setListPage(page)
      setHasMorePages(hasMorePages)
    } else {
      const responseJson = await response.json()
      setError(responseJson.error)
    }
    setIsLoadingList(false)
  }

  async function getMore(
    endpoint: string,
    setListFunc: React.Dispatch<React.SetStateAction<number[]>>,
    _listPage: number,
    setListPageFunc: React.Dispatch<React.SetStateAction<number>>
  ) {
    setIsLoadingMore(true)
    const data = {
      page: _listPage + 1,
      pageSize: PAGE_SIZE,
    }
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}${endpoint}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    )
    if (response.ok) {
      const responseJson = await response.json()
      const { list: nextList, page, hasMorePages } = responseJson
      setListFunc((previous) => {
        return [...previous, ...nextList]
      })
      setListPageFunc(page)
      setHasMorePages(hasMorePages)
    } else {
      setError('There was an error. Please try again.')
    }
    setIsLoadingMore(false)
  }

  function getMoreList() {
    getMore(endpoints.list, setList, listPage, setListPage)
  }

  async function getSortedList(endpoint: string) {
    setIsLoadingSortedList(true)
    setDuration(null)
    const data = {
      pageSize: PAGE_SIZE,
    }
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}${endpoint}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    )
    const { list: sortedList, duration } = await response.json()
    setSortedList(sortedList)
    setDuration(duration)
    setShouldDisplayInfoAlert(true)
    setIsLoadingSortedList(false)
  }

  const handleClickSelectionSortIntuited = useCallback(() => {
    getSortedList(endpoints.selectionSortIntuited)
    setSortEndpoint(endpoints.selectionSortIntuited)
    setSortName('Selection Sort')
  }, [])

  const handleClickBubbleSortIntuited = useCallback(() => {
    getSortedList(endpoints.bubbleSortIntuited)
    setSortEndpoint(endpoints.bubbleSortIntuited)
    setSortName('Bubble Sort')
  }, [])

  const handleClickInsertionSortIntuited = useCallback(() => {
    getSortedList(endpoints.insertionSortIntuited)
    setSortEndpoint(endpoints.insertionSortIntuited)
    setSortName('Insertion Sort')
  }, [])

  const handleClickMergeSortIntuited = useCallback(() => {
    getSortedList(endpoints.mergeSortIntuited)
    setSortEndpoint(endpoints.mergeSortIntuited)
    setSortName('Merge Sort')
  }, [])

  const handleClickHeapSortIntuited = useCallback(() => {
    getSortedList(endpoints.heapSortIntuited)
    setSortEndpoint(endpoints.heapSortIntuited)
    setSortName('Heap Sort')
  }, [])

  const handleClickQuickSortIntuited = useCallback(() => {
    getSortedList(endpoints.quickSortIntuited)
    setSortEndpoint(endpoints.quickSortIntuited)
    setSortName('Quick Sort')
  }, [])

  function getMoreSortedList() {
    if (sortEndpoint !== null) {
      getMore(sortEndpoint, setSortedList, sortedListPage, setSortedListPage)
    }
  }

  function handleClickCloseErrorAlert() {
    setError(null)
  }

  function handleCloseGetListDialog() {
    setIsGetListDialogOpen(false)
  }

  function handleChangeListSize(event: SelectChangeEvent) {
    setListSize(event.target.value as string)
  }

  const listPlaceholder = (
    <div className="list-placeholder">
      <Typography variant="subtitle2">The list is empty.</Typography>
      <Typography variant="subtitle2">Click Get list!</Typography>
    </div>
  )

  const sortedListPlaceholder = (
    <div className="list-placeholder">
      <Typography variant="subtitle2">The list is empty.</Typography>
      <Typography variant="subtitle2">
        {list.length ? 'Choose a sort method!' : 'Click Get list!'}
      </Typography>
    </div>
  )

  const buttonConfig = useMemo(
    () => [
      {
        label: 'Get List',
        onClick: handleClickGetList,
      },
      {
        label: (
          <>
            Selection Sort
            <br />
            (intuited)
          </>
        ),
        onClick: handleClickSelectionSortIntuited,
        disabled: !list.length,
      },
      {
        label: (
          <>
            Bubble Sort
            <br />
            (intuited)
          </>
        ),
        onClick: handleClickBubbleSortIntuited,
        disabled: !list.length,
      },
      {
        label: (
          <>
            Insertion Sort
            <br />
            (intuited)
          </>
        ),
        onClick: handleClickInsertionSortIntuited,
        disabled: !list.length,
      },
      {
        label: (
          <>
            Merge Sort
            <br />
            (intuited)
          </>
        ),
        onClick: handleClickMergeSortIntuited,
        disabled: !list.length,
      },
      {
        label: (
          <>
            Heap Sort
            <br />
            (intuited)
          </>
        ),
        onClick: handleClickHeapSortIntuited,
        disabled: !list.length,
      },
      {
        label: (
          <>
            Quick Sort
            <br />
            (intuited)
          </>
        ),
        onClick: handleClickQuickSortIntuited,
        disabled: !list.length,
      },
      {
        label: 'Home',
        to: '/',
      },
    ],
    [
      handleClickBubbleSortIntuited,
      handleClickHeapSortIntuited,
      handleClickInsertionSortIntuited,
      handleClickMergeSortIntuited,
      handleClickQuickSortIntuited,
      handleClickSelectionSortIntuited,
      list.length,
    ]
  )

  function handleCloseInfoAlert() {
    setShouldDisplayInfoAlert(false)
  }

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Sorting Algorithms
      </Typography>
      <ActionPanel buttonConfig={buttonConfig}>
        <div>
          <Typography variant="subtitle1">Original list</Typography>
          <ScrollList
            list={list}
            isLoading={isLoadingList}
            isLoadingMore={isLoadingMore}
            placeholder={listPlaceholder}
            getMore={getMoreList}
            hasMorePages={hasMorePages}
          />
          {listSize && (
            <Typography variant="subtitle2">
              <b>List size</b>: {Number(listSize).toLocaleString()}
            </Typography>
          )}
        </div>
        <div>
          <Typography variant="subtitle1">Sorted list</Typography>
          <ScrollList
            list={sortedList}
            isLoading={isLoadingSortedList}
            isLoadingMore={isLoadingMore}
            placeholder={sortedListPlaceholder}
            getMore={getMoreSortedList}
            hasMorePages={hasMorePages}
          />
          <SortDurationInfo
            isLoading={isLoadingSortedList}
            duration={duration}
            sortName={sortName}
          />
          <TimedAlert
            severity="success"
            isLoading={isLoadingSortedList}
            isOpen={shouldDisplayInfoAlert}
            onClose={handleCloseInfoAlert}
          >
            {`Performed ${sortName}`}
          </TimedAlert>
          <div>
            {error && (
              <Alert
                severity="error"
                variant="filled"
                onClose={handleClickCloseErrorAlert}
              >
                {error}
              </Alert>
            )}
          </div>
        </div>
      </ActionPanel>
      <FormDialog
        isOpen={isGetListDialogOpen}
        onClose={handleCloseGetListDialog}
        title="Get List"
        contentText="Choose a list size."
        onSubmit={getList}
      >
        <InputLabel id="list-size-select-label">Size</InputLabel>
        <Select
          labelId="list-size-select-label"
          id="list-size-select"
          value={listSize}
          label="Size"
          onChange={handleChangeListSize}
        >
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={100}>100</MenuItem>
          <MenuItem value={1000}>1,000</MenuItem>
          <MenuItem value={10000}>10,000</MenuItem>
          <MenuItem value={100000}>100,000</MenuItem>
          <MenuItem value={1000000}>1,000,000</MenuItem>
          <MenuItem value={10000000}>10,000,000</MenuItem>
          {/* <MenuItem value={100000000}>100,000,000</MenuItem> */}
          {/* <MenuItem value={1000000000}>1,000,000,000</MenuItem> */}
        </Select>
      </FormDialog>
    </>
  )
}
