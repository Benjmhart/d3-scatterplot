/* global fetch */
import * as d3 from "d3";
import "d3-selection-multi";
import "./index.scss";

const height = window.innerHeight * 0.7;
const width = window.innerWidth * 0.7;
const svg = d3
  .select("body")
  .append("svg")
  .attrs({
    height,
    width
  });

fetch(
  "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
)
  .then(r => r.json())
  .then(j => {
    const timesArr = j.map(i => i.Seconds);
    const fastestTime = d3.min(timesArr);
    const pad = 40;
    const rankArr = j.map(i => i.Place);

    const xscale = d3
      .scaleLinear()
      .domain([d3.max(timesArr) + 40, fastestTime])
      .range([pad, width - pad * 3]);

    const yscale = d3
      .scaleLinear()
      .domain([d3.min(rankArr), d3.max(rankArr) + 1])
      .range([pad, height - pad]);

    const secsArray = timesArr.map(i => i - timesArr[0]);

    const timeScale = d3
      .scaleLinear()
      .domain([d3.max(secsArray) + 40, secsArray[0]])
      .range([pad, width - pad * 3]);

    svg
      .selectAll("circle.datapoints")
      .data(j)
      .enter()
      .append("circle")
      .attrs({
        id: (d, i) => `point${i}`,
        class: "datapoints",
        r: 4,
        cx: d => xscale(d.Seconds),
        cy: d => yscale(d.Place),
        fill: d => (d.Doping ? "red" : "black")
      });
    svg
      .selectAll("text.datapoints")
      .data(j)
      .enter()
      .append("text")
      .attrs({
        id: (d, i) => `text${i}`,
        class: "datapoints",
        x: d => xscale(d.Seconds) + 10,
        y: d => yscale(d.Place) + 3,
        "font-size": "0.5em"
      })
      .text(d => `${d.Name}`);

    const xaxis = d3.axisBottom(timeScale);
    svg
      .append("g")
      .attrs({
        transform: `translate(${[0, height - pad]})`
      })
      .call(xaxis);
    const yaxis = d3.axisLeft(yscale);
    svg
      .append("g")
      .attrs({
        transform: `translate(${[pad, 0]})`
      })
      .call(yaxis);
    svg
      .append("text")
      .attrs({
        fill: "black",
        "text-anchor": "center",
        x: width / 2 - pad * 3,
        y: height - pad / 8
      })
      .text("Minutes Behind Fastest Time");

    svg
      .append("text")
      .attrs({
        fill: "black",
        x: -350,
        y: pad / 3,
        transform: "rotate(-90)"
      })
      .text("Ranking");

    svg
      .append("text")
      .attrs({
        x: width * 0.7,
        y: height * 0.5
      })
      .text("LEGEND");
    // legend for no doping
    svg.append("circle").attrs({
      cx: width * 0.68,
      cy: height * 0.53,
      r: 4,
      fill: "black"
    });
    // legend for doping
    svg.append("circle").attrs({
      cx: width * 0.68,
      cy: height * 0.56,
      r: 4,
      fill: "red"
    });

    svg
      .append("text")
      .attrs({
        x: width * 0.68 + 10,
        y: height * 0.53 + 3,
        "font-size": "0.5em"
      })
      .text("No doping allegations");
    // legend for doping
    svg
      .append("text")
      .attrs({
        x: width * 0.68 + 10,
        y: height * 0.56 + 3,
        "font-size": "0.5em"
      })
      .text("Doping allegations");

    function handleMouseOver(d) {
      const fo = svg.append("foreignObject").attrs({
        fill: "black",
        x: pad + 3,
        y: pad,
        width: 175,
        class: "svg-tooltip",
        height: 200
      });
      const div = fo
        .append("xhtml:div")
        .append("div")
        .attrs({ class: "tooltip", "background-color": "black" });

      div
        .append("p")
        .attrs({
          color: "pink"
        })
        .text(`${d.Name}:${d.Nationality}`);

      div
        .append("p")
        .attrs({
          color: "pink"
        })
        .text(`Year:${d.Year} Time:${d.Time}`);

      div
        .append("p")
        .attrs({
          class: "doping",
          color: "pink",
          width: 200
        })
        .text(d.Doping);
    }
    function handleMouseOut() {
      d3.select(".svg-tooltip").remove();
    }

    const datapoints = svg
      .selectAll(".datapoints")
      .on("mouseover", (d) => handleMouseOver(d));

    datapoints.on("mouseout", () => handleMouseOut());
  });
