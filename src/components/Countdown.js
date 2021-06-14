import React, { useEffect, useState } from 'react'
import { Box, useTheme } from '@material-ui/core'
import { usePrevious } from '../utils/usePrevious'

export const Countdown = ({
    value,
    size,
    fontSize,
    onCountdownEnd = () => {},
}) => {
    const theme = useTheme()
    const [bgColor, setBGColor] = useState(theme.palette.primary.main)
    const prevValue = usePrevious(value)

    useEffect(() => {
        if (value === 0) {
            setBGColor('#FF0000')
        } else if (bgColor !== theme.palette.primary.main) {
            setBGColor(theme.palette.primary.main)
        }
    }, [value, onCountdownEnd, bgColor, theme.palette.primary.main])

    useEffect(() => {
        if (prevValue === 1 && value === 0) {
            onCountdownEnd()
        }
    }, [prevValue, value, onCountdownEnd])

    return (
        <Box
            fontSize={fontSize}
            bgcolor={bgColor}
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
