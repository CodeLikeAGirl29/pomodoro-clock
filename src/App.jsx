import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import './App.css';

const App = () => {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timeLeft, setTimeLeft] = useState(sessionLength * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isSession, setIsSession] = useState(true);
  const [audio] = useState(new Audio('https://www.soundjay.com/button/sounds/beep-07.mp3'));

  useEffect(() => {
    if (timeLeft === 0) {
      if (isSession) {
        setIsSession(false);
        setTimeLeft(breakLength * 60);
      } else {
        setIsSession(true);
        setTimeLeft(sessionLength * 60);
      }
      audio.play();
    }
  }, [timeLeft, isSession, breakLength, sessionLength, audio]);

  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleReset = () => {
    setBreakLength(5);
    setSessionLength(25);
    setTimeLeft(25 * 60);
    setIsRunning(false);
    audio.pause();
    audio.currentTime = 0;
  };

  const handleSessionIncrement = () => {
    if (sessionLength < 60) {
      setSessionLength(sessionLength + 1);
      if (!isRunning) {
        setTimeLeft((sessionLength + 1) * 60);
      }
    }
  };

  const handleSessionDecrement = () => {
    if (sessionLength > 1) {
      setSessionLength(sessionLength - 1);
      if (!isRunning) {
        setTimeLeft((sessionLength - 1) * 60);
      }
    }
  };

  const handleBreakIncrement = () => {
    if (breakLength < 60) {
      setBreakLength(breakLength + 1);
    }
  };

  const handleBreakDecrement = () => {
    if (breakLength > 1) {
      setBreakLength(breakLength - 1);
    }
  };

  const handleStartStop = () => {
    setIsRunning((prev) => !prev);
  };
  const progress = (timeLeft / (isSession ? sessionLength * 60 : breakLength * 60)) * 100;
  return (
    <main className="relative flex flex-col justify-center items-center">
      <h1>25 + 5 Clock</h1>
      <div id="break-label">Break Length</div>
      <div>
        <button className='minus' id="break-decrement" onClick={handleBreakDecrement}>-</button>
        <span id="break-length" className='count'>{breakLength}</span>
        <button className='plus' id="break-increment" onClick={handleBreakIncrement}>+</button>
      </div>
      <div id="session-label">Session Length</div>
      <div>
        <button className='minus' id="session-decrement" onClick={handleSessionDecrement}>-</button>
        <span className='count' id="session-length">{sessionLength}</span>
        <button className='plus' id="session-increment" onClick={handleSessionIncrement}>+</button>
      </div>
      <div style={{ width: '200px', height: '200px', margin: '10px auto' }}>
      <CircularProgressbar
        strokeWidth={2}
        trailColor="transparent"
        value={progress}
        text={formatTime(timeLeft)}
        styles={buildStyles({
          textColor: '#fff',
          trailColor: "transparent",
          pathColor: "#f87070",
        })}/>
        </div>
        <div className='flex justify-center'>
        <button type="button" className='tw-infoContainer btn bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full inline-flex justify-center items-center gap-2 -ml-px first:rounded-l-lg first:ml-0 last:rounded-r-lg border' id="start_stop" onClick={handleStartStop}>
        {isRunning ? "Pause" : "Start"}
      </button>
        <button type="button" className='tw-infoContainer btn bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full inline-flex justify-center items-center gap-2 -ml-px first:rounded-l-lg first:ml-0 last:rounded-r-lg border' id="reset" onClick={handleReset}>Reset</button>
      </div>
      <audio id="beep" src="https://www.soundjay.com/button/sounds/beep-07.mp3" preload="auto"></audio>
    </main>
  );
};

export default App;