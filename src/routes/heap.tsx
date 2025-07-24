import { useMemo, useCallback, useState } from 'react'
import { Alert, CircularProgress, TextField, Typography } from '@mui/material'
import { createFileRoute } from '@tanstack/react-router'
import ActionPanel, {
  type ActionPanelButtons,
} from '../components/ActionPanel.tsx'
import { endpoints } from '../constants.ts'
import HeapInfo from '../components/HeapInfo.tsx'
import FormDialog from '../components/FormDialog.tsx'

// const LIST_SIZE = 31
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
  const [previousHeap, setPreviousHeap] = useState([])
  const [currentHeap, setCurrentHeap] = useState([])
  const [hasHeapified, setHasHeapified] = useState(false)
  const [isGetListDialogOpen, setIsGetListDialogOpen] = useState(false)
  const [listSize, setListSize] = useState('')
  const [isInsertValueDialogOpen, setIsInsertValueDialogOpen] = useState(false)
  const [valueToInsert, setValueToInsert] = useState('')
  const [isLoadingUnsortedHeap, setIsLoadingUnsortedHeap] = useState(false)
  const [isLoadingCurrentHeap, setIsLoadingCurrentHeap] = useState(false)
  const [actionName, setActionName] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  console.log('listSize', listSize)

  let isListSizeValid: boolean = true
  const isListSizeNumber = !Number.isNaN(listSize)
  if (listSize) {
    isListSizeValid =
      isListSizeNumber && Number(listSize) >= 0 && Number(listSize) <= 31
  }
  console.log('isListSizeValid', isListSizeValid)

  let isValueToInsertValid: boolean = true
  const isValueToInsertNumber = !Number.isNaN(valueToInsert)
  if (valueToInsert) {
    isValueToInsertValid =
      isValueToInsertNumber &&
      Number(valueToInsert) >= -1000 &&
      Number(valueToInsert) <= 1000
  }
  console.log('isValueToInsertValid', isValueToInsertValid)

  async function getList(event?: React.FormEvent<HTMLFormElement>) {
    event?.preventDefault()
    if (!isListSizeValid) {
      return
    }
    setIsGetListDialogOpen(false)
    setError(null)
    setIsLoadingUnsortedHeap(true)
    setActionName(null)
    const data = {
      listSize,
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
      setPreviousHeap(list)
      setCurrentHeap([])
      setHasHeapified(false)
    } else {
      const responseJson = await response.json()
      setError(responseJson.error)
    }
    setIsLoadingUnsortedHeap(false)
  }

  const getUpdatedHeap = useCallback(
    async (endpoint: string, payload?: Record<string, string | number>) => {
      setIsLoadingCurrentHeap(true)
      const data = {
        pageSize: PAGE_SIZE,
        ...(payload || {}),
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
      // We need the user to heapify first. This populates the "Current heap" panel and allows other operations to complete successfully.
      if (endpoint !== endpoints.heap.heapify) {
        setPreviousHeap(currentHeap)
      } else {
        setHasHeapified(true)
      }
      setCurrentHeap(heap)
      setIsLoadingCurrentHeap(false)
    },
    [currentHeap]
  )

  const handleClickGetList = useCallback(() => {
    setIsGetListDialogOpen(true)
  }, [])

  const handleClickHeapify = useCallback(() => {
    getUpdatedHeap(endpoints.heap.heapify)
    setActionName('heapify')
  }, [getUpdatedHeap])

  const handleClickInsert = useCallback(() => {
    setIsInsertValueDialogOpen(true)
  }, [])

  const buttonConfig: ActionPanelButtons = useMemo(
    // DEV: This type isn't enforcing that unlisted object keys shouldn't be present
    () => [
      {
        label: 'Get Raw List',
        onClick: handleClickGetList,
      },
      {
        label: 'Heapify',
        onClick: handleClickHeapify,
        disabled: !previousHeap.length || hasHeapified,
      },
      {
        label: 'Insert',
        onClick: handleClickInsert,
        disabled: !hasHeapified,
      },
      {
        label: 'Home',
        to: '/',
      },
    ],
    [
      handleClickGetList,
      handleClickHeapify,
      handleClickInsert,
      hasHeapified,
      previousHeap.length,
    ]
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
      // If we don't have enough elements to fill the current we have to push empty nodes for alignment purposes
      // DEV: We can make empty nodes invisible
      const populatedNodes = columns.map((element, index) => (
        <HeapNode key={`node-${index}`} label={element} />
      ))
      // Create another array of empty nodes here (the difference between nodes.length and columnsInCurrentRow) and add it to nodes
      const emptyNodes = []
      for (let i = 0; i < columnsInCurrentRow - populatedNodes.length; i++) {
        emptyNodes.push(<HeapNode key={`empty-node-${i}`} label={' '} />)
      }
      const nodes = [...populatedNodes, ...emptyNodes]
      renderArray.push(<HeapRow key={columnsInCurrentRow}>{nodes}</HeapRow>)
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
        {previousHeap.length ? 'Choose a heap action!' : 'Click Get Raw Heap!'}
      </Typography>
    </div>
  )

  // DEV: We can use a hook to provide these handlers
  function handleChangeListSizeInput(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    setListSize(event.target.value)
  }

  function handleCloseGetListDialog() {
    setIsGetListDialogOpen(false)
  }

  function handleChangeInsertValueInput(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    setValueToInsert(event.target.value)
  }

  const handleInsertHeapValue = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      if (!isValueToInsertValid) {
        return
      }
      const payload = {
        value: Number(valueToInsert),
      }
      await getUpdatedHeap(endpoints.heap.insert, payload) // DEV: We need to provide the value to insert here somehow
      setActionName('insert')
      setIsInsertValueDialogOpen(false)
    },
    [getUpdatedHeap, isValueToInsertValid, valueToInsert]
  )

  function handleCloseInsertValueDialog() {
    setIsInsertValueDialogOpen(false)
  }

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Heap Data Structure
      </Typography>
      <ActionPanel buttonConfig={buttonConfig} column>
        <div>
          <Typography variant="subtitle1">Previous heap</Typography>
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
              {previousHeap.length
                ? renderHeap(previousHeap, isLoadingUnsortedHeap)
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
      <FormDialog
        isOpen={isGetListDialogOpen}
        onClose={handleCloseGetListDialog}
        title="Get Raw List"
        onSubmit={getList}
      >
        <TextField
          autoFocus
          required
          id="list-size-input"
          label="Enter an initial size for the heap"
          variant="outlined"
          helperText="Choose a number between 0 and 31."
          onChange={handleChangeListSizeInput}
          error={!!listSize && !isListSizeValid}
          sx={{
            marginTop: '5px',
          }}
        />
      </FormDialog>
      <FormDialog
        isOpen={isInsertValueDialogOpen}
        onClose={handleCloseInsertValueDialog}
        title="Insert a Value"
        onSubmit={handleInsertHeapValue}
      >
        <TextField
          autoFocus
          required
          id="insert-value-input"
          label="Enter a value to add to the heap"
          variant="outlined"
          helperText="Choose a number between -1000 and 1000."
          onChange={handleChangeInsertValueInput}
          error={!!valueToInsert && !isValueToInsertValid}
          sx={{
            marginTop: '5px',
          }}
        />
      </FormDialog>
      {/* TODO: Add heap type dialog here (MIN/MAX) */}
    </>
  )
}
