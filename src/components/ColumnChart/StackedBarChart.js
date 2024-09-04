import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

export default React.memo(function ColumnChart() {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      d3.select(chartRef.current).selectAll("*").remove();

      const width = chartRef.current.clientWidth;
      const height = chartRef.current.clientHeight;
      const margin = { top: 20, right: 30, bottom: 40, left: 40 };

      const svg = d3
        .select(chartRef.current)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      const data = [
        { taluka: "Bardoli", values: [144] },
        { taluka: "Chorasi", values: [84] },
        { taluka: "Jalalpor", values: [] },
        { taluka: "Kamrej", values: [50, 30] },
        { taluka: "Mandvi", values: [253, 100] },
        { taluka: "Mangrol", values: [242, 163] },
        { taluka: "Mahuva", values: [182] },
        { taluka: "Navsari", values: [] },
        { taluka: "Olpad", values: [123] },
        { taluka: "Palsana", values: [138] },
        { taluka: "Surat City", values: [] },
        { taluka: "Umarpada", values: [304] },
      ];

      const stack = d3.stack().keys(d3.range(5)).value((d, key) => d.values[key] || 0);

      const series = stack(data);

      const x = d3
        .scaleBand()
        .range([0, width - margin.left - margin.right])
        .padding(0.1)
        .domain(data.map((d) => d.taluka));

      const y = d3
        .scaleLinear()
        .range([height - margin.top - margin.bottom, 0])
        .domain([0, d3.max(series, (d) => d3.max(d, (d) => d[1]))]);

      const color = d3.scaleOrdinal(d3.schemeCategory10);

      svg
        .append("g")
        .attr("transform", `translate(0,${height - margin.top - margin.bottom})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

      svg.append("g").call(d3.axisLeft(y));

      svg
        .append("g")
        .selectAll("g")
        .data(series)
        .enter()
        .append("g")
        .attr("fill", (d, i) => color(i))
        .selectAll("rect")
        .data((d) => d)
        .enter()
        .append("rect")
        .attr("x", (d) => x(d.data.taluka))
        .attr("y", (d) => y(d[1]))
        .attr("height", (d) => y(d[0]) - y(d[1]))
        .attr("width", x.bandwidth());

      // Add legend
      const legend = svg
        .append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "end")
        .selectAll("g")
        .data(["ENG GRANT", "15th Finance Commission", "District Panchayat Self-Funding", "MGNREGA & DMF Grant", "MGNREGA Grant & Other"])
        .enter()
        .append("g")
        .attr("transform", (d, i) => `translate(0,${i * 20})`);

      legend
        .append("rect")
        .attr("x", width - margin.right - 19)
        .attr("width", 19)
        .attr("height", 19)
        .attr("fill", (d, i) => color(i));

      legend
        .append("text")
        .attr("x", width - margin.right - 24)
        .attr("y", 9.5)
        .attr("dy", "0.32em")
        .text((d) => d);
    }
  }, []);

  return <div ref={chartRef} style={{ width: "100%", height: "40vh" }}></div>;
});