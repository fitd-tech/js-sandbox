import { useMemo, useCallback, useState } from 'react'
import { Alert, CircularProgress, Typography } from '@mui/material'
import { createFileRoute } from '@tanstack/react-router'
import ActionPanel from '../components/ActionPanel.tsx'
import { endpoints } from '../constants.ts'
import HeapInfo from '../components/HeapInfo.tsx'

const LIST_SIZE = 31
const PAGE_SIZE = 31

/* const DEV_MOCK_HEAP_ARRAY = [
  5, 3, 8, 4, 24, 776, 42, 87, 34, 87, 34, 87, 3, 8, 4,
] */

export const Route = createFileRoute('/heap')({
  component: Heap,
})

interface HeapRowProps {
  children: React.ReactElement | React.ReactElement[]
}

function HeapRow({ children }: HeapRowProps) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%',
      }}
    >
      {children}
    </div>
  )
}

interface HeapNodeProps {
  label: string | number
}

function HeapNode({ label }: HeapNodeProps) {
  return (
    <div
      style={{
        width: '25px',
        height: '25px',
        minWidth: '25px',
        minHeight: '25px',
        margin: '5px',
        padding: '5px',
        border: '1px solid white',
        borderRadius: '100px',
      }}
    >
      <Typography>{label}</Typography>
    </div>
  )
}

/* const DEV_MOCK_HEAP = (
  <>
    <HeapRow>
      <HeapNode label={DEV_MOCK_HEAP_ARRAY[0]} />
    </HeapRow>
    <HeapRow>
      <HeapNode label={DEV_MOCK_HEAP_ARRAY[1]} />
      <HeapNode label={DEV_MOCK_HEAP_ARRAY[2]} />
    </HeapRow>
    <HeapRow>
      <HeapNode label={DEV_MOCK_HEAP_ARRAY[3]} />
      <HeapNode label={DEV_MOCK_HEAP_ARRAY[4]} />
      <HeapNode label={DEV_MOCK_HEAP_ARRAY[5]} />
      <HeapNode label={DEV_MOCK_HEAP_ARRAY[6]} />
    </HeapRow>
    <HeapRow>
      <HeapNode label={DEV_MOCK_HEAP_ARRAY[7]} />
      <HeapNode label={DEV_MOCK_HEAP_ARRAY[8]} />
      <HeapNode label={DEV_MOCK_HEAP_ARRAY[9]} />
      <HeapNode label={DEV_MOCK_HEAP_ARRAY[10]} />
      <HeapNode label={DEV_MOCK_HEAP_ARRAY[11]} />
      <HeapNode label={DEV_MOCK_HEAP_ARRAY[12]} />
      <HeapNode label={DEV_MOCK_HEAP_ARRAY[13]} />
      <HeapNode label={DEV_MOCK_HEAP_ARRAY[14]} />
    </HeapRow>
  </>
) */

function Heap() {
  const [unsortedHeap, setUnsortedHeap] = useState([])
  const [currentHeap, setCurrentHeap] = useState([])
  const [isLoadingUnsortedHeap, setIsLoadingUnsortedHeap] = useState(false)
  const [isLoadingCurrentHeap, setIsLoadingCurrentHeap] = useState(false)
  const [actionName, setActionName] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function getList() {
    setError(null)
    setIsLoadingUnsortedHeap(true)
    setCurrentHeap([])
    setActionName(null)
    const data = {
      listSize: LIST_SIZE,
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
      const { list } = responseJson
      console.log('list from getList', list)
      setUnsortedHeap(list)
    } else {
      const responseJson = await response.json()
      setError(responseJson.error)
    }
    setIsLoadingUnsortedHeap(false)
  }

  async function getUpdatedHeap(endpoint: string) {
    setIsLoadingCurrentHeap(true)
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
    const { heap } = await response.json()
    console.log('heap from getUpdatedHeap response', heap)
    setCurrentHeap(heap)
    setIsLoadingCurrentHeap(false)
  }

  // DEV: Allow user to choose MIN or MAX
  const handleClickGetList = useCallback(() => {
    getList()
  }, [])

  const handleClickHeapify = useCallback(() => {
    getUpdatedHeap(endpoints.heapify)
    setActionName('heapify')
  }, [])

  const buttonConfig = useMemo(
    () => [
      {
        label: 'Get Raw Heap',
        onClick: handleClickGetList,
      },
      {
        label: 'Heapify',
        onClick: handleClickHeapify,
      },
      {
        label: 'Home',
        to: '/',
      },
    ],
    [handleClickGetList, handleClickHeapify]
  )

  function renderHeap(heapArray: string[] | number[], isLoading: boolean) {
    if (isLoading) {
      return (
        <div
          style={{
            marginTop: '220px',
          }}
        >
          <CircularProgress />
        </div>
      )
    }
    const renderArray: React.ReactElement[] = []
    let firstColumnIndex = 0
    let columnsInCurrentRow = 1
    while (firstColumnIndex < heapArray.length) {
      const columns = heapArray.slice(
        firstColumnIndex,
        firstColumnIndex + columnsInCurrentRow
      )
      renderArray.push(
        <HeapRow key={columnsInCurrentRow}>
          {columns.map((element, index) => (
            <HeapNode key={index} label={element} />
          ))}
        </HeapRow>
      )
      firstColumnIndex += columnsInCurrentRow
      columnsInCurrentRow *= 2
    }
    return renderArray
  }

  function handleClickCloseErrorAlert() {
    setError(null)
  }

  const heapPlaceholder = (
    <div className="heap-placeholder">
      <Typography variant="subtitle2">The heap is empty.</Typography>
      <Typography variant="subtitle2">Click Get Raw Heap!</Typography>
    </div>
  )

  const currentHeapPlaceholder = (
    <div className="heap-placeholder">
      <Typography variant="subtitle2">The heap is empty.</Typography>
      <Typography variant="subtitle2">
        {unsortedHeap.length ? 'Choose a heap action!' : 'Click Get Raw Heap!'}
      </Typography>
    </div>
  )

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Heap Data Structure
      </Typography>
      <ActionPanel buttonConfig={buttonConfig} column>
        <div>
          <Typography variant="subtitle1">Unsorted heap</Typography>
          <div // DEV: This should be its own component, since it wraps this pane in the sort route as well
            style={{
              height: '300px', // DEV: The height and width are different between sort and heap here
              width: '800px',
              border: '1px solid rgba(255, 255, 255, 0.87)',
              borderRadius: '5px',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {unsortedHeap.length
                ? renderHeap(unsortedHeap, isLoadingUnsortedHeap)
                : heapPlaceholder}
            </div>
          </div>
        </div>
        <div>
          <Typography variant="subtitle1">Current heap</Typography>
          <div
            style={{
              height: '300px',
              width: '800px',
              border: '1px solid rgba(255, 255, 255, 0.87)',
              borderRadius: '5px',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {currentHeap.length
                ? renderHeap(currentHeap, isLoadingCurrentHeap)
                : currentHeapPlaceholder}
            </div>
          </div>
          <HeapInfo isLoading={isLoadingCurrentHeap} actionName={actionName} />
        </div>
      </ActionPanel>
      {error && (
        <Alert
          severity="error"
          variant="filled"
          onClose={handleClickCloseErrorAlert}
        >
          {error}
        </Alert>
      )}
    </>
  )
}
