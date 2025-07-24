import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
} from '@mui/material'

interface DialogProps {
  isOpen: boolean
  onClose: React.MouseEventHandler<HTMLButtonElement>
  title?: string
  contentText?: string | React.ReactElement | React.ReactElement[]
  children: React.ReactElement | React.ReactElement[]
  onSubmit: React.FormEventHandler<HTMLFormElement>
  enableFieldAutofocus?: boolean
}

export default function FormDialog({
  isOpen,
  onClose,
  title,
  contentText,
  children,
  onSubmit,
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
        {contentText && (
          <DialogContentText sx={{ marginBottom: '20px' }}>
            {contentText}
          </DialogContentText>
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
