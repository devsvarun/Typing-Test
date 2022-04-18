import React from 'react'
import { Icon } from '@iconify/react'

const ErrorPage = () => {
  return (
    <div className='ErrorPage'>
        <Icon icon="akar-icons:face-sad" width="200" height="200"/>
        <h1 id='error-msg'>Sorry! We are having some technical difficulties.</h1>
    </div>
  )
}

export default ErrorPage