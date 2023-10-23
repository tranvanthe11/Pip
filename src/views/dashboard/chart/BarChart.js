import React from 'react'
import { CChart } from '@coreui/react-chartjs'

const BarChart = ({data, label}) => {
  return (
    <div>
        <CChart
            type="bar"
            data={{
                labels: label,
                datasets: [
                {
                    label: 'orders',
                    backgroundColor: '#011A4B',
                    data: data,
                },
                ],
            }}
            labels="MONTHS"
        />
    </div>
  )
}

export default BarChart