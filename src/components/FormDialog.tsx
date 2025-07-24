import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Typography,
} from '@mui/material'

interface DialogProps {
  isOpen: boolean
  onClose: React.MouseEventHandler<HTMLButtonElement>
  title?: string
  children: React.ReactElement | React.ReactElement[]
  onSubmit: React.FormEventHandler<HTMLFormElement>
  description?: string | React.ReactElement | React.ReactElement[]
  enableFieldAutofocus?: boolean
}

export default function FormDialog({
  isOpen,
  onClose,
  title,
  children,
  onSubmit,
  description,
  enableFieldAutofocus,
}: DialogProps) {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      disableRestoreFocus={enableFieldAutofocus} // https://github.com/mui/material-ui/issues/33004#issuecomment-1455260156
    >
      {title && <DialogTitle>{title}</DialogTitle>}
      <DialogContent sx={{ paddingBottom: 0 }}>
        {description && (
          <Typography sx={{ marginBottom: '20px' }}>{description}</Typography>
        )}
        <form onSubmit={onSubmit}>
          <FormControl fullWidth>{children}</FormControl>
          <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="submit">Ok</Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  )
}
