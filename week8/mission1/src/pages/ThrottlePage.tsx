import {useEffect, useState} from "react";
import useThrottle from "lodash/throttle";
const ThrottlePage=()=> {
    const[scrollY, setScrollY]=useState<number>(0);
    const handleScroll=useThrottle(()=>{
      setScrollY(window.scrollY);
    }, 2000) //2초마다 호출하여 보고 싶을 때

useEffect(()=>{
    window.addEventListener("scroll", handleScroll);
    return()=>window.removeEventListener("scroll", handleScroll); //항상 같은 값 줘야함
},[handleScroll])
  return (
    <div className="h-dvh flex flex-col items-center justify-center">
        <h1>쓰로틀링이 무엇일까요?</h1>
        <p>ScrollY:{scrollY}px</p>
    </div>
  )
};
export default ThrottlePage;
