import { useEffect, useState } from 'react';
import './index.css';

export default function App() {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [timerLabel, setTimerLabel] = useState("SESSION");
  const [isRunning, setIsRunning] = useState(false);
  const [startStop, setStartStop] = useState("Start");

  function toggleTimer() {
    setIsRunning(prev => !prev);
    const beep = document.getElementById("beep");
        if (beep) {
          
          beep.pause();
          beep.currentTime = 0;
          
        }
  }

  function reset() {
    setBreakLength(5);
    setSessionLength(25);
    setTimeLeft(25 * 60);
    setTimerLabel("SESSION");
    setIsRunning(false);
    setStartStop("Start");

    const beep = document.getElementById("beep");
    if (beep) {
      beep.pause();
      beep.currentTime = 0;
    }
  }

  useEffect(() => {
    let interval = null;

    if (isRunning) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev === 0) {
            const beep = document.getElementById("beep");
            if (beep) {
              beep.currentTime = 0;
              beep.play();
            }

            if (timerLabel === "SESSION") {
              setTimerLabel("BREAK");
              return breakLength * 60;
            } else {
              setTimerLabel("SESSION");
              return sessionLength * 60;
            }
          } else {
            return prev - 1;
          }
        });
      }, 1000);
      setStartStop("Stop");
    } else {
      clearInterval(interval);
      setStartStop("Start");
    }

    return () => clearInterval(interval);
  }, [isRunning, breakLength, sessionLength, timerLabel]);

  function increaseBreakLength() {
    if (!isRunning && breakLength < 60) setBreakLength(prev => prev + 1);
  }

  function decreaseBreakLength() {
    if (!isRunning && breakLength > 1) setBreakLength(prev => prev - 1);
  }

  function increaseSessionLength() {
    if (!isRunning && sessionLength < 60) {
      setSessionLength(prev => prev + 1);
      setTimeLeft((sessionLength + 1) * 60);
    }
  }

  function decreaseSessionLength() {
    if (!isRunning && sessionLength > 1) {
      setSessionLength(prev => prev - 1);
      setTimeLeft((sessionLength - 1) * 60);
    }
  }

  function formatTime(time) {
    const minutes = String(Math.floor(time / 60)).padStart(2, "0");
    const seconds = String(time % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  }

  return (
    <>
      <audio
        id="beep"
        preload="auto"
        src="https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg"
        loop
      />

      <div className="relative min-h-screen bg-[#1b0824] overflow-hidden flex justify-center items-center">
        <div className="nebula-glow w-[500px] h-[500px] -top-20 -left-20"></div>
        <div className="nebula-glow-secondary w-[400px] h-[400px] bottom-0 right-0"></div>

        <div className="relative z-10 px-15 p-8 text-purple-200 text-center bg-white/5 shadow-[0_0_30px_rgba(255,255,255,0.1)] rounded-3xl border border-[#9b42c4]">
          <h1 className="text-4xl font-medium text-center">25 + 5 Clock</h1>
          <p className='-tracking-[-3px] mt-4 text-sm'>{timerLabel}</p>
          <h1 className='font-semibold mt-3 text-6xl '>{formatTime(timeLeft)}</h1>
          <div className='flex space-x-3 text-xl mt-7 items-center'>
            <button onClick={toggleTimer} className='w-1/2 bg-gradient-to-tr from-[#8242b3] to-[#5e2f92] px-4 flex-grow py-1 rounded-xl hover:shadow-2xl transition duration-200'>{startStop}</button>
            <button onClick={reset} className='w-1/2 bg-gradient-to-tr from-[#e85b6c] to-[#d2393b] px-4 flex-grow py-1 rounded-xl hover:shadow-2xl'>Reset</button>
          </div>
          <div className='flex space-x-4 mt-7 text-lg'>
            <div className='space-y-2'>
              <p>&nbsp;Break&nbsp;&nbsp;Length&nbsp;</p>
              <div className='flex flex-grow space-x-0.5 items-center justify-center'>
                <button onClick={decreaseBreakLength} className='flex-grow bg-white/10 rounded-l-xl p-1'>-</button>
                <button className='flex-grow bg-white/10 p-1'>{breakLength}</button>
                <button onClick={increaseBreakLength} className='flex-grow bg-white/10 rounded-r-xl p-1'>+</button>
              </div>
            </div>
            <div className='space-y-2'>
              <p className='text-lg'>Session Length</p>
              <div className='flex flex-grow space-x-0.5 items-center justify-center'>
                <button onClick={decreaseSessionLength} className='flex-grow bg-white/10 rounded-l-xl p-1'>-</button>
                <button className='flex-grow bg-white/10 p-1'>{sessionLength}</button>
                <button onClick={increaseSessionLength} className='flex-grow bg-white/10 rounded-r-xl p-1'>+</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
