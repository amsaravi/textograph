function autoBox() {

    $("#chart").appendChild(this);
    const {
        x,
        y,
        width,
        height
    } = this.getBBox();
    //document.body.removeChild(this);
    return [x, y, width, height];
}
mydata = ({
    id: 'id_1',
    name: 'ali',
    children: [{
        id: 'id_2',
        name: 'ahmad',
        children: [{
            id: 'id_3',
            name: 'salam',
            children: {}
        }, {
            id: 'id_4',
            name: 'salam',
            children: {}
        }, ]
    }, {
        id: 'id_5',
        name: 'mahmood',
        children: [{
            id: 'id_6',
            name: 'salam',
            children: {}
        }, {
            id: 'id_7',
            name: 'salam',
            children: {}
        }, ]
    }, {
        id: 'id_8',
        name: 'hoda',
        children: [{
            id: 'id_9',
            name: 'salam',
            children: {}
        }, {
            id: 'id_10',
            name: 'goodbye',
            children: {}
        }, ]
    }, ]
})

var data = d3.hierarchy(mydata)
var radius = 150
var width = (data.height * radius)

window.curr_selection

var tree = d3.tree()
    .size([2 * Math.PI, radius])
    .separation((a, b) => (a.parent == b.parent ? 1 : 2) / a.depth)

function chart(data, width) {


    d3.select('#chart').select("svg").remove();
    var svg = d3.select('#chart').append("svg");
    const gNode = svg.append("g")
        .attr("cursor", "pointer")
        .attr("pointer-events", "all");

    data.descendants().forEach((d, i) => {
        d.id = i;
        d._children = d.children;
        // if (d.depth && d.data.data.name.length !== 7) d.children = null;
    });

    function chart_update(root) {
        const nodes = root.descendants().reverse();
        const links = root.links();
        tree(data);
        const node = gNode.selectAll("g")
            .data(nodes,
                d =>
                d.id);
        const nodeEnter = node.enter()
            .append("g")
            .attr("fill", "none")
            .attr("stroke", "#555")
            .attr("stroke-opacity", 0.4)
            .attr("stroke-width", 1.5)
            .selectAll("path")
            .data(data.links())
            .join("path")
            .attr("d", d3.linkRadial()
                .angle(d => d.x)
                .radius(d => d.y));

        nodeEnter.append("g")
            .selectAll("circle")
            .data(data.descendants())
            .join("circle")
            .attr("transform", d => `
            rotate(${d.x * 180 / Math.PI - 90})
            translate(${d.y},0)
        `)
            .attr("fill", d => d.children ? "#555" : "#999")
            .attr("r", 3.5)
            .on("click", d => {
                d.children = d.children ? null : d._children;
                chart_update(d);
            });;

        nodeEnter.append("g")
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
            .attr("stroke-linejoin", "round")
            .attr("stroke-width", 3)
            .selectAll("text")
            .data(data.descendants())
            .join("text")
            .attr("transform", d => `
            rotate(${d.x * 180 / Math.PI - 90}) 
            translate(${d.y},0) 
            rotate(${d.x >= Math.PI ? 180 : 0})
        `)
            .attr("dy", "0.31em")
            .attr("x", d => d.x < Math.PI === !d.children ? 6 : -6)
            .attr("text-anchor", d => d.x < Math.PI === !d.children ? "start" : "end")
            .text(d =>
                d.data.data.name)
            .clone(true).lower()
            .attr("stroke", "white");

        nodeEnter.selectAll("text").on("click", function(d) {
                if (window.curr_selection != undefined) {
                    window.curr_selection.attr('class', 'black_text')
                }
                txt = d3.select(this)
                txt.attr('class', "red_text")
                the_id = d.data.data.id
                test = `#${the_id}`
                window.curr_selection = txt
                console.log("hello " + d.data.data.name);
            })
            // .onclick("click();");
            // d3.select("body").style("background-color", "black");
        nodeExit = node.exit().remove();
        _width2 = width * 2 + 90
        _width1 = (width + 40)
        const viewbox = `-${_width1} -${_width1} ${_width2} ${_width2}`
        svg.attr("viewBox", viewbox)
    }
    chart_update(data)


}
// chart(data);
curr_selection = $('#id_1')