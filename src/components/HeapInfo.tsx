import { useEffect } from 'react'
import { Alert } from '@mui/material'

interface HeapInfoProps {
  severity: string
  isLoading?: boolean
  isOpen: boolean
  onClose: () => void
  children: React.ReactElement | React.ReactElement[] | string
}

export default function TimedAlert({
  isLoading,
  isOpen,
  onClose,
  children,
}: HeapInfoProps) {
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        onClose()
      }, 3000)
    }
  }, [isOpen, onClose])

  return !isLoading && !!isOpen ? (
    <Alert
      severity="success"
      variant="outlined"
      onClose={onClose}
      sx={{
        marginTop: '10px',
      }}
    >
      {children}
    </Alert>
  ) : null
}
