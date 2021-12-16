
import './Main.css';

import React, { useRef, useEffect } from "react";
import { Runtime, Inspector } from "@observablehq/runtime";
import notebook from "@81c6116a5d579dd4/smooth-contours";

function Main() {
  const chartRef = useRef();

  useEffect(() => {
    const runtime = new Runtime();
    runtime.module(notebook, name => {
      if (name === "chart") return new Inspector(chartRef.current);
    });

    return () => runtime.dispose();
  }, []);


  return (
    <>
      <main className="Main" ref={chartRef} />
    </>
  );
}

export default Main;
