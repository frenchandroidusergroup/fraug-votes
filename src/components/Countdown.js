import React from 'react'
import { Box, useTheme } from '@material-ui/core'

export const Countdown = ({value}) => {
    const theme = useTheme()

    return <Box fontSize={150} bgcolor={theme.palette.primary.main}
                boxShadow="0 2px 4px rgba(0,0,0,0.5)"
                borderRadius={800}
                width={400}
                height={400}
                display="flex"
                alignItems="center"
                justifyContent="center"
                margin="auto"
    >
        {value}
    </Box>

}
