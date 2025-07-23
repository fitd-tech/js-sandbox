import { useMemo, useCallback } from 'react'
import { Typography } from '@mui/material'
import { createFileRoute } from '@tanstack/react-router'
import ActionPanel from '../components/ActionPanel.tsx'

const DEV_MOCK_HEAP_ARRAY = [
  5, 3, 8, 4, 24, 776, 42, 87, 34, 87, 34, 87, 3, 8, 4,
]

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

const DEV_MOCK_HEAP = (
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
)

function Heap() {
  const handleClickGetList = useCallback(() => {
    console.log('clicked Get List')
  }, [])

  const handleClickHeapify = useCallback(() => {
    console.log('clicked Heapify')
  }, [])

  const buttonConfig = useMemo(
    () => [
      {
        label: 'Get List',
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

  function renderHeap(heapArray: string[] | number[]) {
    const renderArray: React.ReactElement[] = []
    let firstColumnIndex = 0
    let columnsInCurrentRow = 1
    while (firstColumnIndex < heapArray.length) {
      console.log('firstColumnIndex from renderHeap', firstColumnIndex)
      console.log('columnsInCurrentRow from renderHeap', columnsInCurrentRow)
      const columns = heapArray.slice(
        firstColumnIndex,
        firstColumnIndex + columnsInCurrentRow
      )
      console.log('columns', columns)
      renderArray.push(
        <HeapRow>
          {columns.map((element) => (
            <HeapNode label={element} />
          ))}
        </HeapRow>
      )
      firstColumnIndex += columnsInCurrentRow
      columnsInCurrentRow *= 2
    }
    return renderArray
  }

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Heap Data Structure
      </Typography>
      <ActionPanel buttonConfig={buttonConfig}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {renderHeap(DEV_MOCK_HEAP_ARRAY)}
        </div>
      </ActionPanel>
    </>
  )
}
