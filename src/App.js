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
    (v, i) => {
      // console.log('test', (snakeHeadLocation.length - 1), (snakeSize - (i + 1)));
      return snakeHeadLocation[(snakeHeadLocation.length - 1) - (snakeSize - (i + 1))]
    }
  );
}

function test() {
  // console.log('test1', calculateSnakeBody([[15, 15], [15, 14], [15, 13]], 2))
}

test();

export default function App() {
  const [tickCount, setTickCount] = useState(0);
  const [snakeBody, setSnakeBody] = useState([]);
  const [snakeSize, setSnakeSize] = useState(2);
  const [snakeHeadLocation, setSnakeHeadLocation] = useState([[15, 15], [14, 15], [13, 15]]);
  const [snakeDirection, setSnakeDirection] = useState("left");
  // const [snakeLocation, setSnakeLocation] = useState([[15, 15], [15, 14], [15, 13]]);

  function divs() {
    const snake = snakeBody;
    // console.log(snakeBody);
    const row = (rowIndex) =>
      Array.from(Array(BOARD.x)).map((v, squareIndex) => {
        // debugger;
        const isSnake = snakeBody.findIndex((curr) => ((curr[0] === rowIndex) && (curr[1] === squareIndex)));
        // console.log('coords', {rowIndex, squareIndex, snakeBody})
        return (
          <div
            key={"row" + squareIndex}
            className={"square " + (isSnake > -1 ? "snake" : "")}
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
    setTickCount(tickCount + 1);
    if (tickCount > 2) return;

    let newCordinates = [];
    const [x, y] = snakeHeadLocation[snakeHeadLocation.length - 1];
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

    // setSnakeLocation(newCordinates);
    setSnakeHeadLocation([...snakeHeadLocation, newCordinates]);
    setSnakeBody(calculateSnakeBody(snakeHeadLocation, snakeSize));
    console.log(snakeBody)
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
