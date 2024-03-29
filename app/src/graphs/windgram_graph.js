import _ from 'lodash';
import * as d3 from 'd3';
import {Arrow} from '../graphs/arrow';

export class WindGramGraph {

    constructor(divid) {

        this.container =  d3.select("#" + divid)
                            .append('div')
                            .attr("class", "react-root")
                            .style("position", "relative");

        this.name = divid;

    }

    background_dark(){
        this.background = "dark"
    }
    background_light(){
        this.background = "light"
    }
    numbers_show(){
        this.show_numbers = true;
    }
    numbers_hide(){
        this.show_numbers = false;
    }

    scale_normal(){
        this.num_periods = 9;
        this.arrorw_scale = 0.2;
    }
    scale_tight(){
        this.num_periods = 12;
        this.arrorw_scale = 0.15;
    }
    scale_desktop(){
        this.num_periods = 30;
        this.arrorw_scale = 0.15;
    }

    config(defaultHeight, defaultWidth, max_y){

        this.background_light()
        this.scale_normal()
        this.numbers_show()
        // this.scale_desktop()
 
        
       

        let defaultMargin = {'top': 10, 'left': 30, 'right': 10, 'bottom': 40 };

        this.max_y = max_y
        let outerWidth = defaultWidth
        let outerHeight = d3.min([defaultHeight, 380]);
        outerHeight = defaultHeight;
        this.margin =defaultMargin;
        
        this.width =  outerWidth - this.margin.left - this.margin.right;
        this.height = outerHeight - this.margin.top - this.margin.bottom;
    
        this.svgChart = this.container.append('svg:svg')
                                .attr('width', outerWidth)
                                .attr('height', outerHeight)
                                .attr('class', 'svg-block')
                                .style("z-index", 10);

        this.rect = this.svgChart.append("defs").append("clipPath")
                                .attr("id", "clip")
                                .append("rect")
                                .attr('width', outerWidth)
                                .attr("height", outerHeight);

        this.svgGroup = this.svgChart.append('g')
                            .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);


        this.canvasChart = this.container.append('canvas')
                                    .attr('width', this.width)
                                    .attr('height', this.height)
                                    .style('margin-left', this.margin.left + 'px')
                                    .style('margin-top', this.margin.top + 'px')
                                    .style("position", "absolute")
                                    .style("z-index", -1)
                                    .attr('class', 'canvas-block');

        this.timeline = this.svgGroup.append("line")
                            .attr("clip-path","url(#clip)")
                            .style("stroke-width", 2)
                            .style("stroke", "red")
                            .style("fill", "none");

        this.box = this.svgGroup.append("rect")
                            .attr("clip-path","url(#clip)")
                            .style("stroke-width", 1)
                            .style("fill", "grey")
                            .style("opacity", 0.9);
                      

        this.context = this.canvasChart.node().getContext('2d');
        this.draw_arrow = new Arrow(this.context);

        this.thresholdWind = 100
        // Init Scales
        this.x = d3.scaleTime();
        // this.y = d3.scaleLinear();
        this.y = d3.scaleLog()
        // this.y = d3.scalePow()
        // this.y.tickFormat(d3.format(",.0f"));

        // this.x = d3.scaleLinear();
        // this.y = d3.scaleLinear();
        
        // Init Axis
        this.xAxis = d3.axisBottom(this.x);
        this.xAxis.ticks(5);

        this.yAxis = d3.axisLeft(this.y);
        
        this.yAxis.tickValues([5,6,8,10,12,14,16,18,20]);
        this.yAxis.tickFormat(d3.format(",.0f"));
    
        this.transform = d3.zoomIdentity;
    
        this.x.range([0, this.width]).nice();

        this.y.range([this.height, 0]).nice();
  
        // Add Axis
        this.gxAxis = this.svgGroup.append('g')
            .attr('transform', `translate(0, ${this.height})`);
            
        this.gyAxis = this.svgGroup.append('g');
            
        // Add labels
        this.svgGroup.append('text')
            .attr('x', `-${this.height/2}`)
            .attr('dy', '-3.5em')
            .attr('transform', 'rotate(-90)')
            .text('Axis Y');

        this.svgGroup.append('text')
            .attr('x', `${this.width/2}`)
            .attr('y', `${this.height + 40}`)
            .text('');

    

        let chart = this;
        chart.zoom_function = d3.zoom()
                                .scaleExtent([1, 100])
                                .on('zoom', chart.onZoomClosure().bind(this))
                                // .call(zoom.transform, d3.zoomIdentity.translate(100, 50).scale(0.5))

        // this.canvasChart.call(chart.zoom_function);
        this.svgChart.call(chart.zoom_function);

       
        // let chart = this;
        // const zoom_function = d3.zoom().scaleExtent([0.5, 100])
        //                         .on('zoom', chart.onZoomClosure().bind(this));

        // this.canvasChart.call(zoom_function);
        // this.canvasChart.on('mousemove', this.onMouseMoveClosure());
        // this.canvasChart.on("mousedown", this.onMouseDownClosure());
        
    
    

       
    }

    create_packet(timestamp, previous_timestamp, previous_height, x){
        return { 'timestamp': timestamp,
                 'previous': previous_timestamp,
                 'pheight': previous_height,
                 'height': x[9]*3.28/1000,
                 'speed': x[6],
                 'angle': x[5]}
    }








    data(data){
        
 
        let chart = this;

        


        chart._keys = _.keys(data);
        console.log(chart._keys)

        chart.color_scale = d3.scaleSequential(d3.interpolateViridis).domain([40,0]);
        // chart.color_scale = d3.scaleSequential(d3.interpolateCool).domain([40,0]);
        // chart.color_scale = d3.scaleSequential(d3.interpolateInferno).domain([50,0]);

        var parseTime = d3.timeParse("%Y-%m-%d %H:%M:%S");

        chart.tmp = {};
        _.forEach(chart._keys, function(key){

            chart.tmp[key] = {}
            let results = [];
            let arrows = [];
            let model_data = data[key];
      
            let delta_timestamp;

            let start_time = parseTime(model_data[0]['timestamp']);
            let end_time = parseTime(model_data[model_data.length-1]['timestamp']);
            
            // console.log(key)
            // console.log(start_time, end_time);
            // console.log("------------------------------------------------------------------")
            let previous_timestamp;
            let previous_height;
            let previous_arrow_height;
            

            _.forEach(model_data, function(item, timeindex){
                
                let timestamp = parseTime(item['timestamp']);
               
                _.forEach(item['forecasts']['data'], function(row, index){

                    // console.log(row.length)
                    
                    if ( row.length > 0 ){
                    
            
                        let tmp = _.clone(chart.create_packet(timestamp, previous_timestamp, previous_height, row));
               

                        if( index === 0){
                            results.push(tmp);
                            arrows.push(tmp);
                            previous_height = tmp['height'];
                            previous_arrow_height = tmp['height'];
                        }
                        else{
                            results.push(tmp);
                        
                            if( tmp['height'] - previous_arrow_height > 0.2){
                                
                                arrows.push(tmp);
                                previous_arrow_height = tmp['height'];
                            }     
                            previous_height = tmp['height'];               
                        }

                    }   
                });  // rows

                delta_timestamp = (timestamp - previous_timestamp);

                // console.log(timestamp)
                // console.log(delta_timestamp)
                // console.log(previous_timestamp)
                previous_timestamp = timestamp;
                // console.log(previous_timestamp)
                

            }); // times
            

  
            // console.log(chart.tmp[key], results.length, delta_timestamp);
            
            // _.forEach(results, function(d, i){
            //     // d['previous'] = d['timestamp']-minutes_between
            //     if( d.previous===undefined ){
            //         console.log(d['timestamp'])
            //         console.log(d['timestamp']-delta_timestamp);
            //         // console.log(d['previous'])

            //         // d['previous'] = Date(d['timestamp']-delta_timestamp/100.0);
            //         // console.log(i, d)
            //     }
            // });

            let periods = (end_time - start_time)/delta_timestamp;
            let scale = periods/chart.num_periods;



            // console.log(_.map(results, function(d){ return d['previous'] }));
            chart.tmp[key] = {'data': _.clone(results),
                              'arrows': arrows,
                              'scale': scale,
                              'minutes_between': delta_timestamp,
                              'start_time': start_time,
                              'end_time': end_time
                            };

        }); //keys


        // Adjust the first timestamp





        // chart.tmp = {};
        // _.forEach(chart._keys, function(key){


        //     // list of timestamps
        //     // console.log(data[key])
        //     let previous = undefined;
        //     let previous_height = undefined;
        //     let minutes_between = 0;
        //     let start_time = parseTime(data[key][0]['timestamp']);
        //     let end_time = parseTime(data[key][  data[key].length-1 ]['timestamp']);
            
        //     let formatted = _.map(data[key], function(item){
                
        //         let timestamp = parseTime(item['timestamp']);
                
        //         let values = _.map( item['forecasts']['data'], function(x){
                
        //             // console.log(x)
        //             let feet = (x[9])*3.28/1000
        //             // console.log(previous_height-feet)
        //             // feet = x[9];
        //             let tmp = {'timestamp': timestamp,
        //                         'previous': previous,
        //                         'height': feet,
        //                         'angle': x[5],
        //                         'pheight': previous_height,
        //                         'speed': x[6]}
        //             previous_height = feet;

                    
        //             return tmp
        //         });

        //         // fix values[0]
               
        //         minutes_between = (timestamp-previous)

        //         previous = timestamp;

    
        //         // return values;
        //         return _.filter(values, function(d){
        //             return d['height'] < chart.max_y + 2;
        //         })
        //     });

        //     _.forEach(formatted[0], function(d){
        //         d['previous'] = d['timestamp']-minutes_between
        //     });

        //     let periods = (end_time - start_time)/minutes_between;
        //     let scale = periods/12;

        //     // console.log(formatted);
        //     var flat = [].concat.apply([], formatted);
        //     chart.tmp[key] = {'data': flat,
        //                       'scale': scale,
        //                       'minutes_between': minutes_between,
        //                       'start_time': start_time,
        //                       'end_time': end_time
        //                     };
            
        // });

    }
    
    setKey(key){
        let chart = this;
        this.key = key;
    }
    
    setThreshold(threshold){
        console.log("threshold", threshold);

        if(threshold){
            this.thresholdWind = 15;
        }
        else{
            this.thresholdWind = 100;
        }
    }
    




    onZoomClosure(){
        let chart = this;
        return function(){
            if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return;
            let tmp = { 'transform': d3.event.transform };
            chart.onZoom(tmp);
        }
    }

    // Default zoom
    onZoom(transform){
        let chart = this;
        
        let tmp = _.get(transform, 'transform');
        
        // min scale
        let k = Math.min(chart.tmp[chart.key]['scale'], tmp.k);
        k = chart.tmp[chart.key]['scale']


        let tx = Math.min(0, Math.max(tmp.x, chart.width - chart.width * k));
        let ty = Math.min(0, Math.max(tmp.y, chart.height - chart.height * k));

        // console.log(tx, tx, k)

        chart.transform = d3.zoomIdentity.translate(tx, ty).scale(k);
        chart.predraw();
        chart.draw();
    }


    getSpeedColor(speed){  
        return this.color_scale(speed);

        if(speed < 0){
            return `rgb(37,74,255)`;
        }
        else if( speed < 10){
            return `rgb(0,199,255)`;
        }
        else if( speed < 15){
            return `rgb(36,193,147)`;
        }
        else if( speed < 20){
            return `rgb(111,251,0)`;
        }
        else if( speed < 25){
            return `rgb(221,74,28)`;
        }
        else if( speed < 30){
            return `rgb(213,18,193)`;
        }
        else if( speed < 35){
            return `rgb(3,197,224)`;
        }
        return "rgb(30,35,120)";
    }

    getSimpleThresholdColor(speed){
        
        if(speed < this.thresholdWind){
            return this.color_scale(speed);
        }
        return "grey"

        if( speed < 5){
            return `rgb(37,74,255)`;
        }
        if( speed < 10){
            return `rgb(0,124,255)`;
        }
        else if( speed < 15){
            return `rgb(14,198,204)`;
        }
        else if( speed < 20){
            return `rgb(0,235,0)`;
        }
        else if( speed < 25){
            return `rgb(255,187,0)`;
        }
        else if( speed < 30){
            return `rgb(200,0,74)`;
        }
        else if( speed < 35){
            return `rgb(139,0,74)`;
        }
        return "rgb(100,0,74)";
    }


    predraw(){
        let chart = this;
        let key = chart.key;
        
        if(key){

        chart._data = chart.tmp[key]['data'];
        chart._arrows = chart.tmp[key]['arrows'];

        chart._x0_values = _.map(chart._data, 'timestamp');
        chart._y0_values = _.map(chart._data, 'height');

        chart._x0 = d3.extent(chart._x0_values);
        chart._y0 = d3.extent(chart._y0_values);

        // console.log(chart._y0)
        this.x.domain(chart._x0);
        this.y.domain([chart._y0[0]*0.97, chart.max_y]);
        
        this.scaleX = this.transform.rescaleX(this.x);
        this.scaleY = this.transform.rescaleY(this.y);
        this.scaleY = this.y;
        // this.scaleX = this.x;

        this.gxAxis.call(this.xAxis.scale(this.scaleX));
        this.gyAxis.call(this.yAxis.scale(this.scaleY))

        }

    }

    draw(){

        let chart = this;
        let key = chart.key;
        
        if(key){
        
            // Clear svg

            var today = new Date();
            // var endtoday = today+3*100*60*60
            // console.log(today)
            // console.log(endtoday);
            // console.log(chart.scaleX(endtoday));
            // console.log(chart.scaleX(today));

            this.timeline
                    .attr("x1", chart.scaleX(today))  //<<== change your code here
                    .attr("y1", 0)
                    .attr("x2", chart.scaleX(today))  //<<== and here
                    .attr("y2", chart.height )
            
      
            // this.box
            //     .attr("x", chart.scaleX(today)) 
            //     .attr("y", 0)
            //     .attr("width", 50) 
            //     .attr("height", chart.height )




            this.context.clearRect(0, 0, this.width, this.height);


            // Draw the lines
            chart.context.save();
       
            if( this.background == "dark"){
                chart._data.forEach(chart.drawPoint, this);
            }
            chart._arrows.forEach(chart.drawArrow, this);
            
       
       

            chart.context.restore();


           

        }
       

    }

    initial_scale(){
        let chart = this;
        let key = chart.key;
        
        if(key){
            // let translatex = -100

            let today = new Date();

            console.log();
            console.log(today, chart.scaleX.domain())
            console.log();

            let init_zoom = d3.zoomIdentity.translate(0, 0).scale(chart.tmp[chart.key]['scale']);
            chart.svgChart.call(chart.zoom_function.transform,  init_zoom );
        }
    }

    drawPoint(point){

        let chart = this;
        // let col = chart.getSpeedColor(point['speed']);
        let col = chart.getSimpleThresholdColor(point['speed']);

        // console.log(point['speed']);

        // var grd= chart.context.createLinearGradient(0, 0, 5, 5);
       
        // grd.addColorStop(0, "white");
        // grd.addColorStop(1,"red");

        chart.context.fillStyle = col;
        
        chart.context.beginPath();
        // chart.context.arc( chart.scaleX(point.timestamp), chart.scaleY(point.height), 5*chart.transform.k, 0, 2*Math.PI);
        // chart.context.fill();
        
        let x_extra = 0;
        let y_extra = -3;

        let x = chart.scaleX(point.timestamp);
        let width = chart.scaleX(point.timestamp) - chart.scaleX(point.previous) + x_extra;
        
        let y = chart.scaleY(point.height);
        let height = chart.scaleY(point.height)-chart.scaleY(point.pheight) + y_extra;

        chart.context.fillRect(x-width/2, y-height/2, width, height);

        chart.context.closePath();

        // chart.context.beginPath();
        // chart.line(tmp);
        // chart.context.lineWidth = line_size*chart.transform.k;
        // chart.context.strokeStyle = line_color;
        // chart.context.stroke();
        // chart.context.closePath();
     }

     drawArrow(point){


        let angle = point['angle'];
        let scale = this.arrorw_scale;
        let cx = this.scaleX(point.timestamp);
        let cy = this.scaleY(point.height);
        let col = this.getSimpleThresholdColor(point['speed']);

        if( this.background == "dark"){
            col ="grey";
        }

        this.draw_arrow.draw(cx, cy, angle, point['speed'], scale, col);

        if( this.show_numbers){
            this.context.font = "12px Arial";
            this.context.fillStyle = 'grey'
            if( this.background == "dark"){
                this.context.fillStyle = 'white'
            }
            
            this.context.fillText(Math.round(point['speed']), cx+10, cy);
        }

    }



}