import React from 'react'
import { Steps } from 'antd';
const StepComponent = ({current=0,items = []}) => {
  return  (
    <Steps
        current={current}
    >
        {items.map((item,index) => (
            <Steps.Step key={index} title={item.title} description={item.description} />
        ))}
    </Steps>
)
    
  
}

export default StepComponent