import React, { useState } from 'react';
import { Button, Statistic } from 'antd';

const { Countdown } = Statistic
const  Verification = ({canClick, onClick}: {
  canClick: boolean;
  onClick?: () => void
}) => {
  const [ value, setValue ] = useState<number>(0)
  const [ waiting, setWaiting ] = useState<boolean>(false)

  const handleGetVerification = () => {
    setValue(Date.now() + 1000 * 60)
    setWaiting(true)
    if (onClick) {
      onClick()
    }
  }

  const handleFinish = () => {
    setWaiting(false)
  }

  if (waiting) {
    return <Countdown value={value} format={'获取验证码（s秒）'} onFinish={handleFinish} valueStyle={{fontSize: 'unset'}}/>
  }
  return <Button type={'link'} disabled={!canClick} onClick={handleGetVerification}>获取验证码</Button>
}

export default Verification
