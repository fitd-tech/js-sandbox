import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
} from '@mui/material'

interface DialogProps {
  isOpen: boolean
  onClose: React.MouseEventHandler<HTMLButtonElement>
  title?: string
  children: React.ReactElement | React.ReactElement[]
  onSubmit: React.FormEventHandler<HTMLFormElement>
}

export default function FormDialog({
  isOpen,
  onClose,
  title,
  children,
  onSubmit,
}: DialogProps) {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      disableRestoreFocus // https://github.com/mui/material-ui/issues/33004#issuecomment-1455260156
    >
      {title && <DialogTitle>{title}</DialogTitle>}
      <DialogContent sx={{ paddingBottom: 0 }}>
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
