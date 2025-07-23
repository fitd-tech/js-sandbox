import { Typography } from '@mui/material'

interface HeapInfoProps {
  isLoading: boolean
  actionName: string | null
}

export default function HeapInfo({ isLoading, actionName }: HeapInfoProps) {
  let content
  if (isLoading) {
    content = `Loading ${actionName}...`
  } else if (actionName) {
    content = `Performed ${actionName}`
  } else {
    content = null
  }

  return <Typography variant="subtitle2">{content}</Typography>
}
