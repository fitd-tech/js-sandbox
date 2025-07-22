import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import Alert from '@mui/material/Alert'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import type { SelectChangeEvent } from '@mui/material/Select'

import ScrollList from '../components/ScrollList.tsx'
import DurationInfo from '../components/DurationInfo.tsx'
import { endpoints } from '../constants.ts'

export const Route = createFileRoute('/sort')({
  component: About,
})

const PAGE_SIZE = 100

function About() {
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
    setIsLoadingSortedList(false)
  }

  async function getSelectionSortIntuited() {
    getSortedList(endpoints.selectionSortIntuited)
    setSortEndpoint(endpoints.selectionSortIntuited)
    setSortName('Selection Sort')
  }

  async function getBubbleSortIntuited() {
    getSortedList(endpoints.bubbleSortIntuited)
    setSortEndpoint(endpoints.bubbleSortIntuited)
    setSortName('Bubble Sort')
  }

  async function getInsertionSortIntuited() {
    getSortedList(endpoints.insertionSortIntuited)
    setSortEndpoint(endpoints.insertionSortIntuited)
    setSortName('Insertion Sort')
  }

  async function getMergeSortIntuited() {
    getSortedList(endpoints.mergeSortIntuited)
    setSortEndpoint(endpoints.mergeSortIntuited)
    setSortName('Merge Sort')
  }

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

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Sorting Algorithms
      </Typography>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
          marginBottom: '20px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            marginTop: '28px',
          }}
        >
          <div>
            <Button variant="outlined" onClick={handleClickGetList}>
              Get list
            </Button>
          </div>
          <div>
            <Button variant="outlined" onClick={getSelectionSortIntuited}>
              Selection Sort
              <br />
              (intuited)
            </Button>
          </div>
          <div>
            <Button variant="outlined" onClick={getBubbleSortIntuited}>
              Bubble Sort
              <br />
              (intuited)
            </Button>
          </div>
          <div>
            <Button variant="outlined" onClick={getInsertionSortIntuited}>
              Insertion Sort
              <br />
              (intuited)
            </Button>
          </div>
          <div>
            <Button variant="outlined" onClick={getMergeSortIntuited}>
              Merge Sort
              <br />
              (intuited)
            </Button>
          </div>
          <div>
            <Link to="/">
              <Button variant="outlined">Home</Button>
            </Link>
          </div>
        </div>
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
          <DurationInfo
            isLoading={isLoadingSortedList}
            duration={duration}
            sortName={sortName}
          />
        </div>
      </div>
      {error && (
        <Alert
          severity="error"
          variant="filled"
          onClose={handleClickCloseErrorAlert}
        >
          {error}
        </Alert>
      )}
      <Dialog
        open={isGetListDialogOpen}
        onClose={handleCloseGetListDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Get List</DialogTitle>
        <DialogContent sx={{ paddingBottom: 0 }}>
          <DialogContentText sx={{ paddingBottom: '10px' }}>
            Choose a list size.
          </DialogContentText>
          <form onSubmit={getList}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Size</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
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
              </Select>
            </FormControl>
            <DialogActions>
              <Button onClick={handleCloseGetListDialog}>Cancel</Button>
              <Button type="submit">Ok</Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

// export default Route
