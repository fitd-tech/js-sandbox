import { useMemo, useCallback, useState } from 'react'
import {
  Alert,
  CircularProgress,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  type SelectChangeEvent,
} from '@mui/material'
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
  index?: number
}

function HeapNode({ label, index }: HeapNodeProps) {
  return (
    <div
      style={{
        position: 'relative', // For absolute positioning of the array index marker
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
      {index !== undefined && (
        <Typography
          variant="caption"
          sx={{
            position: 'absolute',
            top: -18,
            left: 0,
            right: 0,
          }}
        >
          {index}
        </Typography>
      )}
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
  const [listSize, setListSize] = useState('30')
  const [isHeapifyDialogOpen, setIsHeapifyDialogOpen] = useState(false)
  const [heapType, setHeapType] = useState('MIN')
  const [isInsertValueDialogOpen, setIsInsertValueDialogOpen] = useState(false)
  const [valueToInsert, setValueToInsert] = useState('')
  const [isUpdateNodeDialogOpen, setIsUpdateNodeDialogOpen] = useState(false)
  const [nodeIndexToUpdate, setNodeIndexToUpdate] = useState('')
  const [nodeUpdateValue, setNodeUpdateValue] = useState('')
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

  let isNodeIndexToUpdateValid: boolean = true
  const isNodeIndexToUpdateNumber = !Number.isNaN(nodeIndexToUpdate)
  if (nodeIndexToUpdate) {
    isNodeIndexToUpdateValid =
      isNodeIndexToUpdateNumber &&
      Number(nodeIndexToUpdate) >= -1000 &&
      Number(nodeIndexToUpdate) <= 1000
  }
  console.log('isNodeIndexToUpdateValid', isNodeIndexToUpdateValid)

  let isNodeUpdateValueValid: boolean = true
  const isNodeUpdateValueNumber = !Number.isNaN(nodeUpdateValue)
  if (nodeUpdateValue) {
    isNodeUpdateValueValid =
      isNodeUpdateValueNumber &&
      Number(nodeUpdateValue) >= -1000 &&
      Number(nodeUpdateValue) <= 1000
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
        setPreviousHeap([...currentHeap])
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
    setIsHeapifyDialogOpen(true)
  }, [])

  const handleClickInsert = useCallback(() => {
    setIsInsertValueDialogOpen(true)
  }, [])

  const handleClickExtractRoot = useCallback(() => {
    getUpdatedHeap(endpoints.heap.extractRoot)
    setActionName('extract root')
  }, [getUpdatedHeap])

  const handleClickUpdateNode = useCallback(() => {
    setIsUpdateNodeDialogOpen(true)
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
        label: 'Extract Root',
        onClick: handleClickExtractRoot,
        disabled: !hasHeapified,
      },
      {
        label: 'Update Node',
        onClick: handleClickUpdateNode,
        disabled: !hasHeapified,
      },
      {
        label: 'Home',
        to: '/',
      },
    ],
    [
      handleClickExtractRoot,
      handleClickGetList,
      handleClickHeapify,
      handleClickInsert,
      handleClickUpdateNode,
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
    // We need to keep track of the original array indices of each node for the index prop that provides the label to the page element.
    // We want to do this without performing increment side-effects inside of the loops if possible.
    // a. We could write formulas to determine the indices based on row number <-- X
    // b. We could simply map a new array at the beginning that holds the original indices. <-- this would be easier to understand and maintain
    const indexedHeapArray = heapArray.map((value, index) => ({
      index,
      value,
    }))
    console.log('indexedHeapArray', indexedHeapArray)
    while (firstColumnIndex < indexedHeapArray.length) {
      const columns = indexedHeapArray.slice(
        firstColumnIndex,
        firstColumnIndex + columnsInCurrentRow
      )
      // If we don't have enough elements to fill the current we have to push empty nodes for alignment purposes.
      // DEV: We can make empty nodes invisible?
      const populatedNodes = columns.map((element) => (
        <HeapNode
          key={element.index}
          label={element.value}
          index={element.index}
        />
      ))
      // Create another array of empty nodes (the difference between nodes.length and columnsInCurrentRow) and add it to nodes.
      const emptyNodes = []
      for (let i = 0; i < columnsInCurrentRow - populatedNodes.length; i++) {
        emptyNodes.push(
          <HeapNode
            key={indexedHeapArray.length + i}
            label={' '}
            index={indexedHeapArray.length + i}
          />
        )
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

  const emptyHeapMessage = 'The heap is empty.'
  const initialPrompt = 'Click Get Raw List!'

  const heapPlaceholder = (
    <div className="heap-placeholder">
      <Typography variant="subtitle2">{emptyHeapMessage}</Typography>
      <Typography variant="subtitle2">{initialPrompt}</Typography>
    </div>
  )

  const currentHeapPlaceholder = (
    <div className="heap-placeholder">
      <Typography variant="subtitle2">{emptyHeapMessage}</Typography>
      <Typography variant="subtitle2">
        {previousHeap.length ? 'Choose a heap action!' : initialPrompt}
      </Typography>
    </div>
  )

  // DEV: We can use a hook to provide these handlers
  function handleChangeListSizeInput(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    setListSize(event.target.value)
  }

  function handleChangeUpdateNodeIndexInput(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    setNodeIndexToUpdate(event.target.value)
  }

  function handleChangeUpdateNodeValueInput(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    setNodeUpdateValue(event.target.value)
  }

  function handleCloseGetListDialog() {
    setIsGetListDialogOpen(false)
  }

  function handleChangeHeapType(event: SelectChangeEvent) {
    setHeapType(event.target.value as string)
  }

  const handleHeapify = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      const payload = {
        type: heapType,
      }
      // DEV: Why are we awaiting?
      await getUpdatedHeap(endpoints.heap.heapify, payload)
      setActionName('heapify')
      setIsHeapifyDialogOpen(false)
    },
    [getUpdatedHeap, heapType]
  )

  function handleCloseHeapifyDialog() {
    setIsHeapifyDialogOpen(false)
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
      await getUpdatedHeap(endpoints.heap.insert, payload)
      setActionName('insert')
      setIsInsertValueDialogOpen(false)
    },
    [getUpdatedHeap, isValueToInsertValid, valueToInsert]
  )

  function handleCloseInsertValueDialog() {
    setIsInsertValueDialogOpen(false)
  }

  const handleUpdateNode = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      if (!isNodeIndexToUpdateValid || !isNodeUpdateValueValid) {
        return
      }
      const payload = {
        index: Number(nodeIndexToUpdate),
        value: Number(nodeUpdateValue),
      }
      await getUpdatedHeap(endpoints.heap.updateNode, payload)
      setActionName('update node')
      setIsUpdateNodeDialogOpen(false)
    },
    [
      getUpdatedHeap,
      isNodeIndexToUpdateValid,
      isNodeUpdateValueValid,
      nodeIndexToUpdate,
      nodeUpdateValue,
    ]
  )

  function handleCloseUpdateNodeDialog() {
    setIsUpdateNodeDialogOpen(false)
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
              paddingTop: '20px',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '10px',
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
              paddingTop: '20px',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '10px',
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
        enableFieldAutofocus
      >
        <TextField
          autoFocus
          required
          id="list-size-input"
          label="Enter an initial size for the heap"
          variant="outlined"
          helperText="Choose a number between 0 and 31."
          value={listSize}
          onChange={handleChangeListSizeInput}
          error={!!listSize && !isListSizeValid}
          sx={{
            marginTop: '5px',
          }}
        />
      </FormDialog>
      <FormDialog
        isOpen={isHeapifyDialogOpen}
        onClose={handleCloseHeapifyDialog}
        title="Heapify"
        onSubmit={handleHeapify}
        description="Choose the type of heap you want to generate. A min-heap has the
          lowest value at the root, and a max-heap has the highest."
      >
        <InputLabel id="heap-type-select-label">Type</InputLabel>
        <Select
          labelId="heap-type-select-label"
          id="heap-type-select"
          value={heapType}
          label="Type"
          onChange={handleChangeHeapType}
        >
          <MenuItem value="MIN">MIN</MenuItem>
          <MenuItem value="MAX">MAX</MenuItem>
        </Select>
      </FormDialog>
      <FormDialog
        isOpen={isInsertValueDialogOpen}
        onClose={handleCloseInsertValueDialog}
        title="Insert a Value"
        onSubmit={handleInsertHeapValue}
        enableFieldAutofocus
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
      <FormDialog
        isOpen={isUpdateNodeDialogOpen}
        onClose={handleCloseUpdateNodeDialog}
        title="Update a Node"
        onSubmit={handleUpdateNode}
        enableFieldAutofocus
      >
        <TextField
          autoFocus
          required
          id="update-node-index-input"
          label="Enter the index of the node to update"
          variant="outlined"
          helperText={`Choose a number between 0 and ${currentHeap.length - 1}.`}
          onChange={handleChangeUpdateNodeIndexInput}
          error={!!nodeIndexToUpdate && !isNodeIndexToUpdateValid}
          sx={{
            marginTop: '5px',
          }}
        />
        <TextField
          required
          id="update-node-value-input"
          label="Enter a new value for the node"
          variant="outlined"
          helperText="Choose a number between -1000 and 1000."
          onChange={handleChangeUpdateNodeValueInput}
          error={!!nodeUpdateValue && !isNodeUpdateValueValid}
          sx={{
            marginTop: '15px',
          }}
        />
      </FormDialog>
      {/* TODO: Add heap type dialog here (MIN/MAX) */}
    </>
  )
}
