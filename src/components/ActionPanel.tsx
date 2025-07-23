import { Button } from '@mui/material'
import { Link } from '@tanstack/react-router'

interface ButtonData {
  label: string | React.ReactElement
  onClick?: () => void
  to?: string
}

interface ActionPanelProps {
  buttonConfig?: ButtonData[]
  children?: React.ReactElement | React.ReactElement[] | string
}

export default function ActionPanel({
  buttonConfig,
  children,
}: ActionPanelProps) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '8px',
        marginBottom: '20px',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          marginTop: '28px',
        }}
      >
        {buttonConfig
          ? buttonConfig.map((button) => {
              if (button.to) {
                return (
                  <div>
                    <Link to={button.to} onClick={button.onClick}>
                      <Button variant="outlined">{button.label}</Button>
                    </Link>
                  </div>
                )
              }
              return (
                <div>
                  <Button variant="outlined" onClick={button.onClick}>
                    {button.label}
                  </Button>
                </div>
              )
            })
          : null}
      </div>
      {children}
    </div>
  )
}
