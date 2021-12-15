export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["mthood.json",new URL("./files/1790f37295bd72b5f588aca009fe8091b522ff58d0497b7b84799e4704cd190f108c3f4ecc62688fd340c2188d98bbcb17b0db126308ebfd0de1417d609c5d75",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], function(md){return(
md`# Smooth Contours

[*contours*.smooth](https://github.com/d3/d3-contour/blob/master/README.md#contours_smooth) applies linear interpolation to the computed contour lines. This is useful for low-density data such as the [Maungawhau elevation dataset](/@d3/volcano-contours) shown here. Enabled by default, you may want to disable smoothing for faster contour computation on [high-density data](/@d3/geotiff-contours).`
)});
  main.variable(observer("viewof smooth")).define("viewof smooth", ["html"], function(html){return(
Object.assign(html`<form style="font: 12px var(--sans-serif); display: flex; flex-direction: column; justify-content: center; min-height: 33px;"><label style="display: flex; align-items: center;">${Object.assign(html`<input style="margin: 0 0.4em 0 0;" type=checkbox name=i>`, {checked: true, onclick() { this.form.value = this.checked; this.form.dispatchEvent(new CustomEvent("input")); }})}${document.createTextNode("smooth contours")}`, {value: true})
)});
  main.variable(observer("smooth")).define("smooth", ["Generators", "viewof smooth"], (G, _) => G.input(_));
  main.variable(observer("chart")).define("chart", ["width","height","DOM","wide","d3","scale","duration","thresholds","contours","data","color"], function*(width,height,DOM,wide,d3,scale,duration,thresholds,contours,data,color)
{
  const r = width / height;
  const context = DOM.context2d(width, wide ? height : width * r);

  if (!wide) {
    context.translate(width / 2, height / 2);
    context.rotate(Math.PI / 2);
    context.translate(-height / 2, -width / 2);
    context.scale(r, r);
  }

  const path = d3.geoPath(null, context);

  context.scale(scale, scale);
  context.lineWidth = 0.5 / scale;
  context.strokeStyle = "#fff";

  while (true) {
    const t = (performance.now() / duration) % 1;

    for (const [a, b] of d3.pairs(thresholds)) {
      const d = a * (1 - t) + b * t;
      context.beginPath();
      path(contours.contour(data.values, d));
      context.fillStyle = color(d);
      context.fill();
      context.stroke();
    }

    yield context.canvas;
  }
}
);
  main.variable(observer("contours")).define("contours", ["d3","data","smooth"], function(d3,data,smooth){return(
d3.contours().size([data.width, data.height]).smooth(smooth)
)});
  main.variable(observer("height")).define("height", ["data","width"], function(data,width){return(
Math.round(data.height / data.width * width)
)});
  main.variable(observer("scale")).define("scale", ["width","data"], function(width,data){return(
width / data.width
)});
  main.variable(observer("duration")).define("duration", function(){return(
2000
)});
  main.variable(observer("wide")).define("wide", ["Generators","innerWidth","addEventListener","removeEventListener"], function(Generators,innerWidth,addEventListener,removeEventListener){return(
Generators.observe(notify => {
  let wide;
  function resized() {
    let w = innerWidth > 640;
    if (w !== wide) notify(wide = w);
  }
  resized();
  addEventListener("resize", resized);
  return () => removeEventListener("resize", resized);
})
)});
  main.variable(observer("color")).define("color", ["d3","data"], function(d3,data){return(
d3.scaleSequential(d3.interpolateGreens).domain(d3.extent(data.values)).nice()
)});
  main.variable(observer("thresholds")).define("thresholds", ["color"], function(color){return(
color.ticks(50)
)});
  main.variable(observer("data")).define("data", ["FileAttachment"], function(FileAttachment){return(
FileAttachment("mthood.json").json()
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@6")
)});
  return main;
}
