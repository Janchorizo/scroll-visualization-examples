const data = {
    data_1:[
      [1975,  5871, 8916, 2868],
      [ 1951, 1048, 2060, 617],
      [ 8010, 1645, 8090, 8045],
      [ 1013,   990,  940, 6907]
    ],
    data_2:[
      [1975,  1048, 916, 868],
      [ 1951, 5871, 2060, 671],
      [ 8010, 1615, 890, 8045],
      [ 1013,   990,  940, 6907]
    ],
    data_3:[
      [1195,  5871, 1186, 2868],
      [ 191, 1048, 60, 171],
      [ 10, 1645, 800, 45],
      [ 103,   990, 901  , 6907]
    ],
};


function render(){
    const svg = d3.select('#graph')
        .append('svg')
        .attr('width', 400)
        .attr('height', 400)
		.attr("viewBox", [-200, -200, 400, 400])
	svg
		.append("g")
		.attr('class', 'sectors');
	svg
		.append("g")
		.attr('class', 'ribbons');

    const gscroll = d3.graphScroll()
        .container(d3.select('#container'))
        .graph(d3.select('#graph'))
        .sections(d3.selectAll('#sections > div'))
        .on('active', function(i){
			updateChords(i);
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

render()
