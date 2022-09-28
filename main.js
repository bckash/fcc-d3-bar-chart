
const chartWidth = 1200;
const chartHeight = 500;
const chartPadding = 50;

const toolTip = d3
    .select("#title")
    .append("div")
    .attr("id", "tooltip")
    .style("display", "none");

document.addEventListener("DOMContentLoaded", () => {
    const req = new XMLHttpRequest()
    req.open("GET", "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json", true)
    req.send()
    req.onload = () => {

        const json = JSON.parse(req.responseText)
        let parseTime = d3.timeParse("%Y-%m-%d")
        
        const dataset = json.data

        // data for defining axis

        let dataDateFirst = parseTime(json.data[0][0]);
        let dataDateLast = parseTime(json.data[json.data.length-1][0])
        let dataValFirst = json.data[0][1]
        let dataValLast = json.data[json.data.length-1][1]
           
        // X

        const xScale = d3
            .scaleTime()
            .domain([dataDateFirst, dataDateLast])
            .range([chartPadding, chartWidth-chartPadding])
        
        const xAxis = d3.axisBottom(xScale)

        // Y

        const yScale = d3
            .scaleLinear()
            .domain([0, dataValLast])
            .range([chartHeight-chartPadding, chartPadding])

        const yAxis = d3.axisLeft(yScale)

        // SVG

        const svg = d3
            .select("#title")
            .append("svg")
            .attr("width", chartWidth)
            .attr("height", chartHeight)
        
        svg.append("g")
            .attr("transform", "translate(0,"+ (chartHeight - chartPadding) +")")
            .attr("id","x-axis")
            .call(xAxis)

        svg.append("g")
            .attr("transform", "translate("+chartPadding+",0)")
            .attr("id","y-axis")
            .call(yAxis)
        
        svg.selectAll("rect")
            .data(dataset)
            .enter()
            .append("rect")
            .attr("class", "bar")                    
            .attr("data-date", d => d[0])
            .attr("data-gdp", d => d[1])                   
            .attr("x", d => xScale(parseTime(d[0])))
            .attr("y", d => yScale(d[1]))
            .attr("width", 4)
            .attr("height", d => chartHeight - chartPadding - yScale(d[1]))         
            .on("mouseover", () => {
                toolTip
                    .style("display", "inline")
            })
            .on("mousemove", (ev,d) => {
                console.log(ev, d)
                toolTip
                    .html(`
                        <span class="gdp-label">GDP:</span>
                        <span    id="gdp-value">${d[1]}</span>
                        <span class="gdp-label">Date:</span>
                        <span    id="gdp-date">${d[0]}</span>
                        `)
                    .attr("data-date", d[0])
                    .style("right", window.innerWidth - ev.pageX + "px")
                    .style("top", ev.pageY + "px")
            })

            .on("mouseleave", () => {
                toolTip
                    .style("display", "none")
            })
                    
    }
})
             