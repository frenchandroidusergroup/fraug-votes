import React from 'react'
import { ResponsiveBar } from '@nivo/bar'
import { getGraphColor } from '../utils/getGraphColor'
import { useTheme } from '@material-ui/core'

export const BarGraph = ({ data = [], keys = [], indexBy, ...otherProps }) => {
    const theme = useTheme()

    return (
        <ResponsiveBar
            data={data}
            keys={keys}
            indexBy={indexBy}
            theme={{
                fontSize: 35,
            }}
            colors={getGraphColor(theme)}
            margin={{
                top: 50,
                right: 130,
                bottom: 50,
                left: 170,
            }}
            padding={0.25}
            minValue={0}
            height={400}
            layout="horizontal"
            valueScale={{ type: 'linear' }}
            indexScale={{ round: true }}
            borderRadius={10}
            axisTop={null}
            axisRight={null}
            axisLeft={{
                tickSize: 0,
                tickPadding: 15,
            }}
            enableGridY={false}
            enableLabel={false}
            animate={true}
            {...otherProps}
        />
    )
}
