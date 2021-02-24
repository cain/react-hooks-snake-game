import "./styles.css";
import { useState, useEffect, useRef } from "react";

const BOARD = {
  x: 20,
  y: 20
};

const SNAKE = {
  width: 2
};

// Taken from https://overreacted.io/making-setinterval-declarative-with-react-hooks/
function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

function calculateSnakeBody(snakeHeadLocation, snakeSize) {
  console.log(snakeSize);
  return Array.from(Array(snakeSize)).map(
    (v, i) => snakeHeadLocation[snakeHeadLocation.length - 2]
  );
}

export default function App() {
  const [tickCount, setTickCount] = useState(0);
  const [snakeBody, setSnakeBody] = useState([]);
  const [snakeSize, setSnakeSize] = useState(1);
  const [snakeHeadLocation, setSnakeHeadLocation] = useState([]);
  const [snakeDirection, setSnakeDirection] = useState("left");
  const [snakeLocation, setSnakeLocation] = useState([
    BOARD.x - 1,
    BOARD.y - 1
  ]);

  function divs() {
    const snake = snakeBody;
    // console.log(snakeBody);
    const row = (rowIndex) =>
      Array.from(Array(BOARD.x)).map((v, squareIndex) => {
        const isSnake = snakeBody.reduce(
          (prev, curr) =>
            curr && curr[0] === rowIndex && curr[1] === squareIndex,
          false
        );
        return (
          <div
            key={"row" + squareIndex}
            className={"square " + (isSnake ? "snake" : "")}
          ></div>
        );
      });

    return Array.from(Array(BOARD.y)).map((v, i) => (
      <div key={"col" + i} className="col">
        {row(i)}
      </div>
    ));
  }
  let jsx = divs();

  function isGameValid() {}
  let stopTick = false;
  useEffect(() => {
    function onChangeDirection(event) {
      console.log(event);

      switch (event.code) {
        case "ArrowLeft":
          setSnakeDirection("left");
          break;

        case "ArrowRight":
          setSnakeDirection("right");
          break;

        case "ArrowDown":
          setSnakeDirection("down");
          break;

        case "ArrowUp":
          setSnakeDirection("up");
          break;
        case "Space":
          stopTick = true;
          break;
        default:
          break;
      }
    }
    window.addEventListener("keydown", onChangeDirection, false);

    return () =>
      window.removeEventListener("keydown", onChangeDirection, false);
  }, []);
  useInterval(() => {
    // tick();
    // return;
    if (stopTick) return;
    setTickCount(tickCount + 1);
    let newCordinates = [];
    const [x, y] = snakeLocation;
    // set snake location
    switch (snakeDirection) {
      case "left":
        newCordinates = [x - 1, y];
        isGameValid();
        break;
      case "right":
        newCordinates = [x + 1, y];
        isGameValid();
        break;
      case "down":
        newCordinates = [x, y + 1];
        isGameValid();
        break;
      case "up":
        newCordinates = [x, y - 1];
        isGameValid();
        break;

      default:
        break;
    }
    // console.log(tickCount + "rendered");

    setSnakeLocation(newCordinates);
    setSnakeHeadLocation([...snakeHeadLocation, newCordinates]);
    setSnakeBody(calculateSnakeBody(snakeHeadLocation, snakeSize));
    jsx = divs();
  }, 500);
  return (
    <div className="App">
      <h1>Snake</h1>
      tick {tickCount}
      {/* <button onClick={() => setCount(count + 1)}>Add count</button> */}
      <div className="board">{jsx}</div>
    </div>
  );
}
