import React from 'react'
import { Icon } from '@iconify/react'
const Finish = ({ netWPM }) => {
  return (
    <div className='Finish'>
      <div className='wpm'>
        <Icon icon="ic:baseline-speed" width="50" height="50" />
        {netWPM}
      </div>
      <div className='restart-btn' onClick={() => window.location.reload(false)}>
        <Icon icon="codicon:debug-restart" width="30" height="30" />
      </div>
    </div>
  )
}

export default Finish