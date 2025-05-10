import React, { useState, useEffect } from "react";
import { FixedSizeGrid as Grid } from "react-window";
// import { useWindowSize } from 'react-use';
import Confetti from "react-confetti";
import "./App.css";

const totalNumbers = 1000000;
const winningNumber = 9;
const paddingRem = 2;
const cellSize = 60;

function App() {
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [result, setResult] = useState(null);
  const [showFireworks, setShowFireworks] = useState(false);
  const [selectedNumbers, setSelectedNumbers] = useState([1,7]);
  const [gridWidth, setGridWidth] = useState(0);
  const [gridHeight, setGridHeight] = useState(0);
  const [guessed, setGuessed] = useState(false);
  // const { width, height } = useWindowSize();

  const updateGridSize = () => {
    const paddingPx = paddingRem * 16 * 2; // 2rem on left + 2rem on right = 64px
    setGridWidth(window.innerWidth - paddingPx);
    setGridHeight(window.innerHeight - paddingPx - 100); // 2rem top/bottom + approx. header
  };

  useEffect(() => {
    updateGridSize();
    window.addEventListener("resize", updateGridSize);
    return () => window.removeEventListener("resize", updateGridSize);
  }, []);

  const columnCount = Math.floor(gridWidth / cellSize);
  const rowCount = Math.ceil(totalNumbers / columnCount);

  const Cell = ({ columnIndex, rowIndex, style }) => {
    const number = rowIndex * columnCount + columnIndex + 1;
    if (number > totalNumbers) return null;

    const isSelected = selectedNumbers.includes(number);
    const isWinning = number === winningNumber;

    return (
      <div
      className={(isSelected) ? 'is-disabled' : ''}
        style={{
          ...style,
          // backgroundColor: isWinning
          //   ? "#ffd700"
          //   : isSelected
          //   ? "#add8e6"
          //   : "#fff",
          border: "1px solid #ddd",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          // fontWeight: isWinning ? "bold" : "normal",
          cursor: "pointer",
          fontSize: "14px",
        }}
        onClick={() => {
          setSelectedNumber(number);
          if (number === winningNumber) {
            setShowFireworks(true);
            setTimeout(() => setShowFireworks(false), 10000);
          }
          setGuessed(true);
          setResult(number === winningNumber ? "🎉 You Win!" : "Not Today. Try Again Tomorrow");
        }}
      >
        {number}
      </div>
    );
  };

  return (
    <div>
      <header style={{ padding: "10px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "Dancing Script" }}>Won In A Million</h2>
        <p>Selected: {selectedNumber ?? "-"}</p>
        <p>{result}</p>
        {showFireworks && (
          <div className="victory-overlay">
            <div
              style={{
                minHeight: 200,
              }}
            >
              <Confetti
                gravity={0.1}
                height={928}
                initialVelocityX={2}
                initialVelocityY={2}
                numberOfPieces={200}
                opacity={1}
                recycle
                run
                width={1620}
                wind={0}
              />
            </div>
            <div className="victory-message">You have WON in a Million!</div>
          </div>
        )}
      </header>

      {/* <div className="grid-container"> */}
      <div className={`grid-container ${guessed ? 'table-is-disabled': ''}`}>
        <Grid
          columnCount={columnCount}
          columnWidth={cellSize}
          height={gridHeight}
          rowCount={rowCount}
          rowHeight={cellSize}
          width={gridWidth}
        >
          {Cell}
        </Grid>
      </div>
    </div>
  );
}

export default App;
