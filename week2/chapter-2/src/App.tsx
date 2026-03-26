import { useState } from 'react';

function App() {
  const[count, setCount] = useState(0);

  const countUp = () => {
    setCount(count + 1);
  }

  const countDown= () => {
    setCount(count - 1);
  }

  return (
    <>
      <h1>카운트 = {count}</h1>
      <button onClick={countUp}>+1 버튼</button>
      <button onClick={countDown}>-1 버튼</button>
    </>
  );
}

export default App;