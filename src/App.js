import './App.css';
import { useEffect, useState, useCallback, useRef, useContext } from 'react';
import Text from './components/Text'
import Finish from './components/Finish';
import { Icon } from '@iconify/react';
import { ThemeContext } from './contexts/ThemeContext';
import ErrorPage from './components/ErrorPage';

function App() {
  const [wordString, setWordString] = useState("")
  const [correct, setCorrect] = useState(false)
  const [backspace, setBackspace] = useState(false)
  const [index, setIndex] = useState(0)
  const [finished, setFinished] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [totalCorrect, setTotalCorrect] = useState(1)
  const [netWPM, setNetWPM] = useState(0)
  const [startTimer, setStartTimer] = useState(false)
  const [audioOn, setAudioOn] = useState(true)
  const [{ theme }, toggleTheme] = useContext(ThemeContext)
  const [fetchFailed, setFetchFailed] = useState(false)
  const [capsOn, setCapsOn] = useState(false)
  const timer = useRef(null)
  useEffect(() => {
    if (startTimer) {
      timer.current = setInterval(() => {
        setSeconds(prev => prev + 1)
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [startTimer]);

  useEffect(() => {
    if (finished) {
      clearInterval(timer.current)
      const grossWPM = (wordString.length / 5) / (seconds / 60)
      const uncorrErrors = ((wordString.length - totalCorrect) / 5) / (seconds / 60)
      setNetWPM(parseInt(grossWPM - uncorrErrors))
    }
  }, [finished])



  useEffect(() => {
    async function getWords() {
      const res = await fetch("https://random-word-api.herokuapp.com/word?number=30")
      const data = await res.json();
      setWordString(prev => data.join(" "))
      setIndex(0)
    }
    Promise.race([
      getWords(),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 5000)) // Wait for 5 seconds
    ]).catch(function fetchFailedHandler() {
      setFetchFailed(true);
    })
  }, [])

  const handleKeypress = useCallback((e) => {
    setStartTimer(true)
    if (e.getModifierState("CapsLock")) {
      setCapsOn(true)
      return false
    }
    else {
      setCapsOn(false)
    }
    if (index === wordString.length) {
      setFinished(true)
      return false
    }
    else if (index === -1) {
      setIndex(0)
    }
    else if (wordString) {
      if (wordString.charAt(index) === e.key) {
        setIndex(prev => prev + 1)
        setCorrect(true)
        setBackspace(false)
      }
      else if (e.keyCode === 8 && index >= 0) {
        setIndex(prev => prev - 1)
        setBackspace(true)
      }
      else if (e.keyCode === 32 || (e.keyCode > 64 && e.keyCode < 91)) {
        setIndex(prev => prev + 1)
        setCorrect(false)
        setBackspace(false)
      }

      if (audioOn) {
        try {
          let audio;
          if (e.code === "Space") {
            audio = new Audio(require(`./key-sounds/${e.code}.mp3`))
          }
          else {
            audio = new Audio(require(`./key-sounds/${e.key}.mp3`))
          }
          audio.play()
        }
        catch {
          console.log("Audio not found")
        }
      }
    }
    else {
      console.log("word string not ready")
    }
  }, [wordString, index, audioOn])

  useEffect(() => {
    if (correct) {
      setTotalCorrect(prev => prev + 1)
    }
  }, [handleKeypress, correct])

  useEffect(() => {
    document.addEventListener("keydown", handleKeypress)
    return () => document.removeEventListener("keydown", handleKeypress)
  }, [handleKeypress])
  function handleAudioButton() {
    localStorage.setItem("audioOn", JSON.stringify(!audioOn))
    setAudioOn(!audioOn)
  }
  useEffect(() => {
    const audioOn = localStorage.getItem("audioOn") === "true";
    setAudioOn(audioOn)
  }, [])


  return (
    <div className="App" style={{ backgroundColor: theme.backgroundColor, color: theme.color }}>
      {!fetchFailed ?
        <>
          {capsOn && <h3>Caps Lock On</h3>}
          <Text wordString={wordString} correct={correct} index={index} backspace={backspace} finished={finished} />
          <div className='audio-btn' onClick={handleAudioButton}><Icon icon={audioOn ? "akar-icons:sound-on" :
            "akar-icons:sound-off"} width="30" height="30" /></div>
          <div className='theme-btn' onClick={toggleTheme}><Icon icon="ep:moon-night" width="30" height="30" /></div>
          {finished && <Finish netWPM={netWPM} />}
        </>
        :
        <ErrorPage />
      }

    </div>
  );
}

export default App;
