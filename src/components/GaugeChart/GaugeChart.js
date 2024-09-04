import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const GaugeChart = ({ value, maxValue, title, color }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      d3.select(chartRef.current).selectAll("*").remove();

      const width = chartRef.current.clientWidth;
      const height = width / 2;
      const radius = Math.min(width, height) / 2;

      const svg = d3
        .select(chartRef.current)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2},${height / 1.5})`);

      const scale = d3.scaleLinear().domain([0, maxValue]).range([0, 180]);

      const arc = d3
        .arc()
        .innerRadius(radius * 0.6)
        .outerRadius(radius)
        .startAngle(-Math.PI / 2)
        .endAngle((d) => (scale(d) * Math.PI) / 180 - Math.PI / 2);

      // Background arc
      svg.append("path").datum(maxValue).attr("fill", "#e6e6e6").attr("d", arc);

      // Value arc
      svg.append("path").datum(value).attr("fill", color).attr("d", arc);

      // Title
      svg
        .append("text")
        .attr("text-anchor", "middle")
        .attr("dy", `-${radius * 0.8}px`)
        .style("font-size", "16px")
        .text(title);

      // Value
      svg
        .append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "0.3em")
        .style("font-size", "24px")
        .text(value);

      // Min value (0)
      svg
        .append("text")
        .attr("text-anchor", "start")
        .attr("x", -radius + 10)
        .attr("y", radius * 0.6)
        .style("font-size", "12px")
        .text("0");

      // Max value
      svg
        .append("text")
        .attr("text-anchor", "end")
        .attr("x", radius - 10)
        .attr("y", radius * 0.6)
        .style("font-size", "12px")
        .text(maxValue);
    }
  }, [value, maxValue, title, color]);

  return <div ref={chartRef} style={{ width: "100%", height: "200px", marginBottom: "20px" }}></div>;
};

export default React.memo(GaugeChart);
