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
  column?: boolean
}

export default function ActionPanel({
  buttonConfig,
  children,
  column,
}: ActionPanelProps) {
  function renderChildren() {
    if (column) {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          {children}
        </div>
      )
    }
    return children
  }

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
          ? buttonConfig.map((button, index) => {
              if (button.to) {
                return (
                  <div key={index}>
                    <Link to={button.to} onClick={button.onClick}>
                      <Button variant="outlined">{button.label}</Button>
                    </Link>
                  </div>
                )
              }
              return (
                <div key={index}>
                  <Button variant="outlined" onClick={button.onClick}>
                    {button.label}
                  </Button>
                </div>
              )
            })
          : null}
      </div>
      {renderChildren()}
    </div>
  )
}
