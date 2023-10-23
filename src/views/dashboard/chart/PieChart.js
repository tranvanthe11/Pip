import React from 'react'
import { CChart } from '@coreui/react-chartjs'

const PieChart = ({service_no1, service_no2}) => {
  const style = {
    width: "40vw",
    margin: "0 0 0 15vw",
  }
  return (
    <CChart
      style={style}
      type="pie"
      data={{
      labels: ['Đi lên sân bay', 'Đón tại sân bay'],
      datasets: [
          {
            backgroundColor: ['#011A4B', '#E46651'],
            data: [service_no1, service_no2],
          },
        ],
      }}
    />
  )
}

export default PieChart