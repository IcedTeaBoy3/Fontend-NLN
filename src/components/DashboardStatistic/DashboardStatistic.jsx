import React from 'react'
import StatisticRevenue from '../StatisticRevenue/StatisticRevenue'
import StaticPaidvsUnPaid from '../StaticPaidvsUnpaid/StaticPaidvsUnpaid'
const DashboardStatistic = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px' }}>
        <StatisticRevenue />
        <StaticPaidvsUnPaid />
    </div>
  )
}

export default DashboardStatistic