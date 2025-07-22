import { Typography } from '@mui/material'

interface DurationInfoProps {
  isLoading: boolean
  duration: number | null
  sortName: string | null
}

export default function DurationInfo({
  isLoading,
  duration,
  sortName,
}: DurationInfoProps) {
  let content
  if (isLoading) {
    content = `Loading ${sortName}...`
  } else if (!duration) {
    content = 'Choose a sort method to calculate duration.'
  } else {
    content = `${duration.toLocaleString(undefined, { minimumFractionDigits: 2 })} ms (${sortName})`
  }

  return (
    <Typography variant="subtitle2">
      <b>Duration</b>: {content}
    </Typography>
  )
}
