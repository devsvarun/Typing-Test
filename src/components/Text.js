import React, { useState, useContext } from 'react'
import { ThemeContext } from '../contexts/ThemeContext'

const Text = ({ wordString, correct, index, backspace, finished }) => {
  const [{ theme, isDark }, toggleTheme] = useContext(ThemeContext)
  const wrongColor = (isDark ? "rgb(218, 0, 55)" : "rgb(255, 99, 99)")
  const rightColor = (isDark ? "rgb(52, 103, 81)" : "rgb(33, 159, 148)")
  const finishedColor = (isDark ? "rgb(201, 150, 204)" : "rgb(200, 200, 200)")
  let elem;
  let prevElem;
  if (backspace) {
    elem = document.getElementById(index)
    prevElem = document.getElementById(index - 1)
    if (elem) {
      elem.style.boxShadow = ""
      if (prevElem) {
        prevElem.style.boxShadow = ("2px 0 0 " + theme.color);
      }
      elem.style.color = theme.color
    }
  }
  else if (finished) {
    elem = document.getElementById(wordString.length - 1)
    elem.style.boxShadow = ""
  }
  else {
    elem = document.getElementById(index - 1)
    prevElem = document.getElementById(index - 2)
    if (elem) {
      elem.style.boxShadow = ("2px 0 0 " + theme.color)
      if (prevElem) {
        prevElem.style.boxShadow = "";
      }
      if (elem.style.color !== finishedColor) {
        if (correct) {
          elem.style.color = rightColor
        }
        else if (!correct) {
          elem.style.color = wrongColor
        }
      }
    }

    if (wordString.charAt(index) === ' ') {
      for (let i = 0; i < index; i++) {
        const corrElem = document.getElementById(i)
        if (corrElem.style.color === rightColor) {
          corrElem.style.color = finishedColor
        }
      }
    }
  }

  const spans = [...wordString].map((ch, i) => {
    return <span style={{ color: theme.color }} id={i}>{ch}</span>
  })
  return (
    <div className='Text'><h2>{spans}
    </h2></div>
  )
}

export default Text