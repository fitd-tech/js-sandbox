import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import Typography from '@mui/material/Typography'

export const Route = createRootRoute({
    component: () => (
        <>
            <Typography variant="h2">JavaScript Sandbox</Typography>
            <hr />
            <Outlet />
            <TanStackRouterDevtools />
        </>
    ),
})

// export default Route
