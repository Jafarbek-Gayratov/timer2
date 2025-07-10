import React, { useState, useRef } from "react";
import "./Timer.css";

const Timer = () => {
  const [time, setTime] = useState({ hour: 0, minute: 0, second: 0 });
  const [remaining, setRemaining] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newValue = Math.max(0, parseInt(value) || 0);
    setTime({ ...time, [name]: newValue });
  };

  const startTimer = () => {
    const total = time.hour * 3600 + time.minute * 60 + time.second;
    if (total <= 0) return;
    setRemaining(total);
    setIsRunning(true);
    setIsFinished(false);

    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          setIsRunning(false);
          setIsFinished(true);
          if (audioRef.current) {
            audioRef.current.play();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const resetToInput = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setRemaining(0);
    setIsFinished(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const formatTime = (val) => String(val).padStart(2, "0");
  const getDisplay = () => {
    const hrs = Math.floor(remaining / 3600);
    const mins = Math.floor((remaining % 3600) / 60);
    const secs = remaining % 60;
    return {
      hour: formatTime(hrs),
      minute: formatTime(mins),
      second: formatTime(secs),
    };
  };

  const display = getDisplay();

  return (
    <div
      className={`timer-container ${isRunning || isFinished ? "running" : ""}`}
    >
      {/* ✅ Internetdan audio signal */}
      <audio
        ref={audioRef}
        src="https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3"
        preload="auto"
      />

      {/* === Boshlanish holati === */}
      {!isRunning && !isFinished && (
        <>
          <h1>⏱ Hakaton Timer</h1>
          <p>Vaqtingizni boshqaring va muvaffaqiyatga erishing!</p>

          <div className="circle-timer">
            <span>{display.hour}</span>
            <span>:</span>
            <span>{display.minute}</span>
            <span>:</span>
            <span>{display.second}</span>
            <div className="labels">
              <span>SOAT</span>
              <span>MINUT</span>
              <span>SEKUND</span>
            </div>
          </div>

          <div className="set-time">
            <label>
              <input
                type="number"
                name="hour"
                value={time.hour}
                onChange={handleChange}
              />
              Soat
            </label>
            <label>
              <input
                type="number"
                name="minute"
                value={time.minute}
                onChange={handleChange}
              />
              Minut
            </label>
            <label>
              <input
                type="number"
                name="second"
                value={time.second}
                onChange={handleChange}
              />
              Sekund
            </label>
          </div>

          <div className="buttons">
            <button onClick={startTimer}>▶ Boshlash</button>
            <button onClick={resetToInput}>↻ Reset</button>
          </div>

          {remaining === 0 && (
            <p className="hint">Timer o'rnatish uchun vaqt kiriting</p>
          )}
        </>
      )}

      {/* === Ishlayotgan yoki tugagan holat === */}
      {(isRunning || isFinished) && (
        <div className="full-timer-view">
          {!isFinished ? (
            <div className="big-timer">
              {display.hour} : {display.minute} : {display.second}
            </div>
          ) : (
            <div className="time-up-text">⏰ Vaqt tugadi!</div>
          )}

          <button className="back-btn" onClick={resetToInput}>
            ⬅ Orqaga qaytish
          </button>
        </div>
      )}
    </div>
  );
};

export default Timer;
