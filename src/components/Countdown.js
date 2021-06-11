import React from 'react'
import { Box, useTheme } from '@material-ui/core'

export const Countdown = ({ value, size, fontSize }) => {
    const theme = useTheme()

    return (
        <Box
            fontSize={fontSize}
            bgcolor={theme.palette.primary.main}
            boxShadow="0 2px 4px rgba(0,0,0,0.5)"
            borderRadius={800}
            width={size}
            height={size}
            display="flex"
            alignItems="center"
            justifyContent="center"
            margin="auto">
            {value}
        </Box>
    )
}
