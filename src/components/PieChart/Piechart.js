import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

export default React.memo(function PieChart() {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      d3.select(chartRef.current).selectAll("*").remove();

      const width = chartRef.current.clientWidth;
      const height = chartRef.current.clientHeight;
      const radius = Math.min(width, height) / 2 * 0.8;

      const svg = d3
        .select(chartRef.current)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`);

      const data = [
        { label: "Category 1", value: 30 },
        { label: "Category 2", value: 50 },
        { label: "Category 3", value: 20 },
      ];

      const color = d3.scaleOrdinal(d3.schemeCategory10);

      const pie = d3
        .pie()
        .value((d) => d.value)
        .sort(null);

      const arc = d3.arc().innerRadius(0).outerRadius(radius);
      const outerArc = d3.arc().innerRadius(radius * 1.1).outerRadius(radius * 1.1);

      const arcs = svg
        .selectAll("arc")
        .data(pie(data))
        .enter()
        .append("g")
        .attr("class", "arc");

      arcs
        .append("path")
        .attr("d", arc)
        .attr("fill", (d, i) => color(i));

      function midAngle(d) {
        return d.startAngle + (d.endAngle - d.startAngle) / 2;
      }

      arcs
        .append("text")
        .attr("transform", function(d, i) {
          const pos = outerArc.centroid(d);
          pos[0] = radius * (midAngle(d) < Math.PI ? 1.1 : -1.1);
          
          const percent = (d.endAngle - d.startAngle) / (2 * Math.PI) * 100;
          if (percent < 3) {
            pos[1] += i * 15;
          }
          return "translate(" + pos + ")";
        })
        .text((d) => d.data.label)
        .attr("font-size", "10px")
        .attr("fill", (d, i) => color(i))
        .attr("text-anchor", (d) => midAngle(d) < Math.PI ? "start" : "end")
        .attr("dx", (d) => midAngle(d) < Math.PI ? 5 : -5)
        .attr("dy", 5);

      arcs
        .append("polyline")
        .attr("points", function(d, i) {
          const pos = outerArc.centroid(d);
          pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
          const o = outerArc.centroid(d);
          const percent = (d.endAngle - d.startAngle) / (2 * Math.PI) * 100;
          if (percent < 3) {
            pos[1] += i * 15;
          }
          return [arc.centroid(d), [o[0], pos[1]], pos];
        })
        .style("fill", "none")
        .attr("stroke", (d, i) => color(i))
        .style("stroke-width", "1px");
    }
  }, []);

  return <div ref={chartRef} style={{ width: "100%", height: "35vh" }}></div>;
});

