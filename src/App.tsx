import React, { useState, useEffect } from "react";
import { FixedSizeGrid as Grid } from "react-window";
import Confetti from "react-confetti";
import "./App.css";

const totalNumbers = 1000000;
const winningNumber = 9;
const paddingRem = 2;
const cellSize = 60;

function App() {
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [showFireworks, setShowFireworks] = useState<boolean>(false);
  // const [selectedNumbers, setSelectedNumbers] = useState<number[]>([1, 7, 19,21,24,32,42,44,50,58,74,78,81,85, 89, 90, 91, 98,99,100]);
  const selectedNumbers = [1, 7, 19,21,24,32,42,44,50,58,74,78,81,85, 89, 90, 91, 98,99,100];
  const [gridWidth, setGridWidth] = useState<number>(0);
  const [gridHeight, setGridHeight] = useState<number>(0);
  const [guessed, setGuessed] = useState<boolean>(false);

  const updateGridSize = () => {
    const paddingPx = paddingRem * 16 * 2; // 2rem on left + 2rem on right = 64px
    setGridWidth(Math.max(window.innerWidth - paddingPx, cellSize));
    setGridHeight(Math.max(window.innerHeight - paddingPx - 100, cellSize));
  };

  useEffect(() => {
    updateGridSize();
    window.addEventListener("resize", updateGridSize);
    return () => window.removeEventListener("resize", updateGridSize);
  }, []);

  // Prevent division by zero
  const columnCount = Math.max(1, Math.floor(gridWidth / cellSize));
  const rowCount = Math.ceil(totalNumbers / columnCount);

  interface CellProps {
    columnIndex: number;
    rowIndex: number;
    style: React.CSSProperties;
  }

  const Cell: React.FC<CellProps> = ({ columnIndex, rowIndex, style }) => {
    const number = rowIndex * columnCount + columnIndex + 1;
    if (number > totalNumbers) return null;

    const isSelected = selectedNumbers.includes(number);
    // const isWinning = number === winningNumber;

    return (
      <div
        className={isSelected ? "is-disabled" : ""}
        style={{
          ...style,
          border: "1px solid #ddd",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: guessed ? "not-allowed" : "pointer",
          fontSize: "14px",
          // backgroundColor: isWinning
          //   ? "#ffd700"
          //   : isSelected
          //   ? "#add8e6"
          //   : "#fff",
          // fontWeight: isWinning ? "bold" : "normal",
          // pointerEvents: guessed ? "none" : "auto",
        }}
        onClick={() => {
          if (guessed) return;
          setSelectedNumber(number);
          if (number === winningNumber) {
            setShowFireworks(true);
            setTimeout(() => setShowFireworks(false), 30000);
          }
          setGuessed(true);
          setResult(
            number === winningNumber
              ? "🎉 You Win!"
              : "Not Today. Try Again Tomorrow"
          );
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
            <div style={{ minHeight: 200 }}>
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
      <div className={`grid-container ${guessed ? "table-is-disabled" : ""}`}>
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
