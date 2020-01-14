// function multiSeriesLineChart(config) {
//   function setReSizeEvent(data) {
//     let resizeTimer;
//     window.removeEventListener("resize", function () {
//       //cool
//     });
//     window.addEventListener("resize", function (event) {

//       if (resizeTimer !== false) {
//         clearTimeout(resizeTimer);
//       }
//       resizeTimer = setTimeout(function () {
//         $(data.mainDiv).empty();
//         drawmultiSeriesLineChartCharts(data);
//         clearTimeout(resizeTimer);
//       }, 500);
//     });
//   }

//   drawmultiSeriesLineChartCharts(config);
//   setReSizeEvent(config);
// }

// function createmultiSeriesLineChartLegend(mainDiv, columnsInfo, colorRange) {
//   const z = d3.scaleOrdinal()
//     .range(colorRange);
//   const mainDivName = mainDiv.substr(1, mainDiv.length);
//   $(mainDiv).before("<div id='Legend_" + mainDivName + "' class='pmd-card-body' style='margin-top:0; margin-bottom:0;'></div>");
//   const keys = Object.keys(columnsInfo);
//   keys.forEach(function (d) {
//     const cloloCode = z(d);
//     $("#Legend_" + mainDivName).append("<span class='team-graph team1' style='display: inline-block; margin-right:10px;'>\
//         <span style='background:" + cloloCode + ";width: 10px;height: 10px;display: inline-block;vertical-align: middle;'>&nbsp;</span>\
//         <span style='padding-top: 0;font-family:Source Sans Pro, sans-serif;font-size: 13px;display: inline;'>" + columnsInfo[d] + " </span>\
//       </span>");
//   });

// }

// function drawmultiSeriesLineChartCharts(config) {
//   var keys = Object.keys(config.data[0]);
//   const tempObj = {};
//   keys.forEach(function (d) {
//     tempObj[d] = 0;
//   });
//   config.data.splice(0, 0, tempObj);
//   const data = config.data;
//   const columnsInfo = config.columnsInfo;
//   const xAxis = config.xAxis;
//   const yAxis = config.yAxis;
//   const colorRange = config.colorRange;
//   const mainDiv = config.mainDiv;
//   const mainDivName = mainDiv.substr(1, mainDiv.length);
//   const label = config.label;
//   const requireCircle = config.requireCircle || false;
//   const requireLegend = config.requireLegend;
//   const imageData = config.imageData;
//   d3.select(mainDiv).append("svg").attr("width", $(mainDiv).width()).attr("height", $(mainDiv).height()*0.9);
//   const svg = d3.select(mainDiv + " svg"),
//     margin = { top: 20, right: 20, bottom: 30, left: 50 },
//     width = svg.attr("width") - margin.left - margin.right,
//     height = svg.attr("height") - margin.top - margin.bottom;
//   const g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
//   if (requireLegend != null && requireLegend != undefined && requireLegend != false) {
//     $("#Legend_" + mainDivName).remove();
//     createmultiSeriesLineChartLegend(mainDiv, columnsInfo, colorRange);
//   }
//   const x = d3.scaleLinear().range([0, width]),
//     y = d3.scaleLinear().range([height, 0]),
//     z = d3.scaleOrdinal()
//       .range(colorRange);
//   const line = d3.line()
//     .x(function (d) {
//       return x(d[xAxis]);
//     })
//     .y(function (d) {
//       return y(d[yAxis]);
//     });
//   const columns = Object.keys(columnsInfo);
//   const groupData = columns.map(function (id) {
//     return {
//       id: id,
//       values: data.filter(function (d, i) {
//         //CBT:remove last blank or value is 0 data to show only that much of line
//         if ((d[id] != 0 && d[id] != null && d[id] != undefined) || i == 0) return d;
//       }).map(function (d, i) {
//         const tempObj = {};
//         tempObj[xAxis] = d[xAxis];
//         tempObj[yAxis] = d[id];
//         return tempObj;
//       })
//     };
//   });

//   x.domain(d3.extent(data, function (d) {
//     return d[xAxis];
//   }));
//   y.domain([
//     d3.min(groupData, function (c) {
//       return d3.min(c.values, function (d) {
//         return d[yAxis];
//       });
//     }),
//     d3.max(groupData, function (c) {
//       return d3.max(c.values, function (d) {
//         return d[yAxis];
//       });
//     })
//   ]);
//   z.domain(groupData.map(function (c) {
//     return c.id;
//   }));

//   g.append("g")
//     .attr("class", "axis axis--x")
//     .attr("transform", "translate(0," + height + ")")
//     .call(d3.axisBottom(x))
//     .append("text")
//     .attr("x", width / 2)
//     .attr("y", margin.bottom * 0.9)
//     .attr("dx", "0.32em")
//     .attr("fill", "#000")
//     .attr("font-weight", "bold")
//     .attr("text-anchor", "start")
//     .text(label.xAxis);

//   g.append("g")
//     .attr("class", "axis axis--y")
//     .call(d3.axisLeft(y))
//     .append("text")
//     .attr("transform", "rotate(-90)")
//     .attr("y", 6)
//     .attr("dy", "0.71em")
//     .attr("fill", "#000")
//     .attr("font-weight", "bold")
//     .text(label.yAxis);


//   const city = g.selectAll(".city")
//     .data(groupData)
//     .enter().append("g")
//     .attr("class", "city");

//   city.append("path")
//     .attr("class", "line")
//     .attr("d", function (d) {
//       return line(d.values);
//     })
//     .style("stroke", function (d) {
//       return z(d.id);
//     }).style("fill", "none").style("stroke-width", "3px");

//   //CBT:for wicket Circles in multiseries line chart
//   const circleRadius = 6;
//   var keys = Object.keys(columnsInfo);
//   const element = g.append("g")
//     .selectAll("g")
//     .data(data)
//     .enter().append("g")
//     .attr("transform", function (d) {
//       return "translate(" + x(d[xAxis]) + ",0)";
//     });

//   const circles = element.selectAll("circle")
//     .data(function (d) {
//       return keys.map(function (key) {
//         return { key: key, value: d[key], over: d.over };
//       });
//     })
//     .enter().append("circle")
//     .attr("cx", function (d) {
//       return 0;
//     })
//     .attr("cy", function (d) {
//       return y(d.value);
//     })
//     .attr("r", circleRadius)
//     .attr("fill", "#fff")
//     .attr("stroke", function (d) {
//       if (d.circles == undefined || d.circles.length <= 0) {
//         return "#fff";
//       } else {
//         return z(d.key);
//       }
//     })
//     .attr("data", function (d) {
//       const data = {};
//       data["over"] = d.over;
//       data["runs"] = d.value;
//       return JSON.stringify(data);
//     })
//     .attr("stroke-width", "2px")
//     .attr("fill-opacity", function (d) {
//       return 0.05;
//     })
//     .attr("stroke-opacity", function (d) {
//       return 0.05;
//     });

//   circles.on("mouseover", function () {
//     const currentEl = d3.select(this);
//     currentEl.attr("r", 7);
//     const fadeInSpeed = 120;
//     d3.select("#circletooltip_" + mainDivName)
//       .transition()
//       .duration(fadeInSpeed)
//       .style("opacity", function () {
//         return 1;
//       });
//     d3.select("#circletooltip_" + mainDivName).attr("transform", function (d) {
//       const mouseCoords = d3.mouse(this.parentNode);
//       let xCo = 0;
//       if (mouseCoords[0] + 10 >= width * 0.80) {
//         xCo = mouseCoords[0] - parseFloat(d3.selectAll("#circletooltipRect_" + mainDivName)
//           .attr("width"));
//       } else {
//         xCo = mouseCoords[0] + 10;
//       }
//       var x = xCo;
//       let yCo = 0;
//       if (mouseCoords[0] + 10 >= width * 0.80) {
//         yCo = mouseCoords[1] + 10;
//       } else {
//         yCo = mouseCoords[1];
//       }
//       var x = xCo;
//       const y = yCo;
//       return "translate(" + x + "," + y + ")";
//     });
//     //CBT:calculate tooltips text
//     const tooltipData = JSON.parse(currentEl.attr("data"));
//     const tooltipsText = "";
//     d3.selectAll("#circletooltipText_" + mainDivName).text("");
//     let yPos = 0;
//     d3.selectAll("#circletooltipText_" + mainDivName).append("tspan").attr("x", 0).attr("y", yPos * 10).attr("dy", "1.9em").text(label.xAxis + ":  " + tooltipData.over);
//     yPos = yPos + 1;
//     d3.selectAll("#circletooltipText_" + mainDivName).append("tspan").attr("x", 0).attr("y", yPos * 10).attr("dy", "1.9em").text(label.yAxis + ":  " + tooltipData.runs);
//     //CBT:calculate width of the text based on characters
//     const dims = helpers.getDimensions("circletooltipText_" + mainDivName);
//     d3.selectAll("#circletooltipText_" + mainDivName + " tspan")
//       .attr("x", dims.w + 4);

//     d3.selectAll("#circletooltipRect_" + mainDivName)
//       .attr("width", dims.w + 10)
//       .attr("height", dims.h + 20);

//   });
//   circles.on("mousemove", function () {
//     const currentEl = d3.select(this);
//     currentEl.attr("r", 7);
//     d3.selectAll("#circletooltip_" + mainDivName)
//       .attr("transform", function (d) {
//         const mouseCoords = d3.mouse(this.parentNode);
//         let xCo = 0;
//         if (mouseCoords[0] + 10 >= width * 0.80) {
//           xCo = mouseCoords[0] - parseFloat(d3.selectAll("#circletooltipRect_" + mainDivName)
//             .attr("width"));
//         } else {
//           xCo = mouseCoords[0] + 10;
//         }
//         var x = xCo;
//         let yCo = 0;
//         if (mouseCoords[0] + 10 >= width * 0.80) {
//           yCo = mouseCoords[1] + 10;
//         } else {
//           yCo = mouseCoords[1];
//         }
//         var x = xCo;
//         const y = yCo;
//         return "translate(" + x + "," + y + ")";
//       });
//   });
//   circles.on("mouseout", function () {
//     const currentEl = d3.select(this);
//     currentEl.attr("r", 6);
//     d3.select("#circletooltip_" + mainDivName)
//       .style("opacity", function () {
//         return 0;
//       })
//       .attr("transform", function (d, i) {
//         // klutzy, but it accounts for tooltip padding which could push it onscreen
//         const x = -500;
//         const y = -500;
//         return "translate(" + x + "," + y + ")";
//       });
//   });

//   const circleTooltipg = g.append("g")
//     .attr("font-family", "sans-serif")
//     .attr("font-size", 10)
//     .attr("text-anchor", "end")
//     .attr("id", "circletooltip_" + mainDivName)
//     .attr("style", "opacity:0")
//     .attr("transform", "translate(-500,-500)");

//   circleTooltipg.append("rect")
//     .attr("id", "circletooltipRect_" + mainDivName)
//     .attr("x", 0)
//     .attr("width", 120)
//     .attr("height", 80)
//     .attr("opacity", 0.71)
//     .style("fill", "#000000");

//   circleTooltipg
//     .append("text")
//     .attr("id", "circletooltipText_" + mainDivName)
//     .attr("x", 30)
//     .attr("y", 15)
//     .attr("fill", function () {
//       return "#fff";
//     })
//     .style("font-size", function (d) {
//       return 10;
//     })
//     .style("font-family", function (d) {
//       return "arial";
//     })
//     .text(function (d, i) {
//       return "";
//     });

// }

// var helpers = {
//   getDimensions: function (id) {
//     const el = document.getElementById(id);
//     let w = 0, h = 0;
//     if (el) {
//       const dimensions = el.getBBox();
//       w = dimensions.width;
//       h = dimensions.height;
//     } else {
//       console.log("error: getDimensions() " + id + " not found.");
//     }
//     return { w: w, h: h };
//   }
// };
