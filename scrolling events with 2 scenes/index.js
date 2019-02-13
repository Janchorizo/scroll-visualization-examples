const data = {
    data_1:[
      [0,  871, 916, 268],
      [951, 0, 602, 617],
      [810, 645, 0, 845],
      [113,   990,  940, 0]
    ],
    data_2:[
      [197,  148, 916, 868],
      [ 951, 571, 260, 671],
      [ 800, 615, 890, 805],
      [ 103,   990,  940, 607]
    ],
    data_3:[
      [119,  571, 116, 268],
      [ 191, 148, 60, 171],
      [ 10, 145, 800, 45],
      [ 103,   990, 901  , 607]
    ],
};

const annotations = [
[
  {
    "x": 1,
    "y": 507,
    "path": "M9,-20C63,21,83,-130,137,-97",
    "text": "Anotado!",
    "textOffset": [
      30,-86
    ]
  },

],
[
  {
    "x": 3,
    "y": 307,
    "path": "M-1,100C63,21,-61,-26,0,-122",
    "text": "Cuidado, son caras",
    "textOffset": [
        -178,-56
    ]
  },

],
    [
  {
    "x": 2,
    "y": 670,
    "path": "M0,143C63,21,-98,182,-148,181",
    "text": "Un puente",
    "textOffset": [
      -19,
        94
    ]
  },
  {
    "x": 3,
    "y": 797,
    "path": "M-442,-70C63,21,-186,124,-440,179",
    "text": "Precioso",
    "textOffset": [
      -347,
        60
    ]
  },
]
];

function render(){
    let svg = d3.select('#container_1 #graph')
        .append('svg')
        .attr('width', 400)
        .attr('height', 400)
		.attr("viewBox", [-200, -200, 400, 400]);
	svg
		.append("g")
		.attr('class', 'sectors');
	svg
		.append("g")
		.attr('class', 'ribbons');

    svg = d3.select('#container_2 #graph')
        .append('svg')
        .attr('width', 500)
        .attr('height', 400);
    svg.append("g")
        .attr("class", "y axis");
    svg.append("g")
        .attr("class", "x axis");
    svg.append('g')
        .attr("class", "dots");
    svg.append('g')
        .attr('class', 'annotations');

    const firstContainer = d3.select('#container_1');
    const gscroll_1 = d3.graphScroll()
        .container(firstContainer)
        .graph(firstContainer.select('#graph'))
        .sections(firstContainer.selectAll('#sections > div'))
        .on('active', function(i){
			updateChords(i);
        })

    const secondContainer = d3.select('#container_2');
    const gscroll_2 = d3.graphScroll()
        .container(secondContainer)
        .graph(secondContainer.select('#graph'))
        .sections(secondContainer.selectAll('#sections > div'))
        .on('active', function(i){
			updateScatter(i%3);
        })
}

function updateChords(i){
    const outerRadius = 180, innerRadius = outerRadius-20;

    const chord = d3.chord()
        .padAngle(0.05)
        .sortSubgroups(d3.descending);

    const arc = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius);

    const ribbon = d3.ribbon()
        .radius(innerRadius);

    const color = d3.scaleOrdinal()
        .domain(d3.range(4))
        .range(d3.schemeSet2)


    /* Actual visualization ------------*/
    const svg = d3.select('#graph svg');

    const chords = chord(data['data_'+(i+1)]);
    let group = svg.select('.sectors')
		.selectAll("g")
        .data(chords.groups);

	group.exit().remove();

	group.enter()
		.append("g")
		.append("path");

	svg.select('.sectors').selectAll('g')
		.each(function(d){
			d3.select(this).select('path')
				.attr("fill", d => color(d.index))
				.attr("stroke", d => d3.rgb(color(d.index)).darker())
				.attr("d", d=>arc(d));
		});

    group = svg.select('.ribbons')
		.attr('fill-opacity',0.67)
		.selectAll("path")
        .data(chords);

	group.exit().remove();

	group.enter()
		.append("path");

	svg.select('.ribbons').selectAll('path')
		.attr("fill", d => color(d.target.index))
		.attr("stroke", d => d3.rgb(color(d.target.index)).darker())
		.attr("d", ribbon);
}

function updateScatter(i){
    const padding = 30;
    //data['data_'+(i+1)];
    const xScale = d3.scalePoint()
        .domain(data['data_'+(i+1)])
        .range([padding, 500-padding]);
    const yScale = d3.scaleLinear()
        .domain([0, 1000])
        .range([400-padding, padding]);
    const xAxis = d3.axisBottom(xScale).tickFormat((d,i)=>['leche','cacao','avellanas','almendras'][i]);
    const yAxis = d3.axisLeft(yScale);

    const color = d3.scaleOrdinal()
        .domain(d3.range(4))
        .range(d3.schemeSet2);

    const svg = d3.select('#container_2 #graph svg');
    svg.select('.y.axis')
        .call(yAxis)
        .attr('transform', `translate(${padding}, ${0})`);   

    d3.select('.x.axis')
        .call(xAxis)
        .attr('transform', `translate(${0}, ${400-padding})`);   

    const dots = svg.select('.dots')
        .selectAll('circle')
        .data(data['data_'+(i+1)]);

    dots.exit().remove();

    dots.enter()
        .append('circle');

    svg.select('.dots').selectAll('circle')
        .transition()
        .attr('cx',(d,i)=>xScale(d))
        .attr('cy',d=>yScale(d.reduce((a,b)=>a+b)/4))
        .attr('fill',(d,i)=>color(i))
        .attr('r',5);

    const swoopy = d3.swoopyDrag()
      .x(d => xScale(xScale.domain()[d.x]))
      .y(d => yScale(d.y))
      .annotations(annotations[i])

    svg.select('.annotations').call(swoopy);
}


render()
