import React, { forwardRef } from "react";
import { Input } from "antd";

const InputComponent = forwardRef(({ size, placeholder, style, ...rest }, ref) => { 
  return (
    <Input 
      size={size} 
      placeholder={placeholder} 
      style={style}
      ref={ref} 
      {...rest}
    />
  );
});

export default InputComponent;
