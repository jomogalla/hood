
import './Main.css';

import {Runtime, Inspector} from "@observablehq/runtime";
import define from "./notebook";

function Main() {
  const runtime = new Runtime();
  const main = runtime.module(define, Inspector.into(document.main));

  return (
    <main class="Main">

    </main>
  );
}

export default Main;
