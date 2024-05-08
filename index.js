const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json';

fetch(url)
  .then(response => response.json())
  .then(data => {
    // Parse dates outside the mapping function
    data.forEach(d => {
      d.year = new Date(d.Year.toString());
      d.time = new Date(`1970-01-01T00:${d.Time}`);
      d.doping = d.Doping !== '' ? d.Doping : 'No doping';
    });

    const margin = { top: 20, right: 20, bottom: 50, left: 70 };
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = d3.select('#plot')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const xScale = d3.scaleTime()
      .domain(d3.extent(data, d => d.year))
      .range([0, width]);

    const yScale = d3.scaleLinear() // Change to linear scale
      .domain(d3.extent(data, d => d.time))
      .range([0, height]);

    const xAxis = d3.axisBottom(xScale).ticks(10).tickFormat(d3.timeFormat('%Y'));
    const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat('%M:%S'));

    svg.append('g')
      .attr('id', 'x-axis')
      .attr('transform', `translate(0, ${height})`)
      .call(xAxis);

    svg.append('g')
      .attr('id', 'y-axis')
      .call(yAxis);

    svg.selectAll('.dot')
      .data(data)
      .enter().append('circle')
      .attr('class', d => 'dot' + (d.doping !== 'No doping' ? ' doping' : ''))
      .attr('cx', d => xScale(d.year))
      .attr('cy', d => yScale(d.time)) // Use yScale for the y-coordinate
      .attr('r', 7)
      .attr('data-xvalue', d => d.year)
      .attr('data-yvalue', d => d.time)
      .style('fill', d => (d.doping !== 'No doping' ? 'red' : 'green')) // Dynamically assign dot colors
      .on('mouseover', function (event, d) {
        const tooltip = d3.select('#tooltip');
        tooltip.html(
          `Name: ${d.Name}<br>
          Year: ${d.Year}<br>
          Time: ${d3.timeFormat('%M:%S')(d.time)}<br>
          Doping: ${d.doping}`
        );
        tooltip.style('visibility', 'visible')
          .style('left', Math.min(event.pageX, width - tooltip.node().offsetWidth) + 'px')
          .style('top', (event.pageY - 30) + 'px')
          .attr('data-year', d.year);
      })
      .on('mouseout', function () {
        const tooltip = d3.select('#tooltip');
        tooltip.style('visibility', 'hidden');
      });

    // Dynamically create legend
    const legend = d3.select('#legend');
    legend.selectAll('.legend')
      .data(['No Doping Allegation', 'Doping Allegation'])
      .enter().append('div')
      .text(d => d)
      .attr('class', 'legend')
      .style('color', (d, i) => (i === 0 ? 'green' : 'red')); // Dynamically assign legend colors
  });
