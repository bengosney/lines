import React, { Component } from 'react';
import './App.css';
import OpenSimplexNoise from 'open-simplex-noise';


class App extends Component {
    constructor(props) {
	super(props);

	this.state = {
	    pixelSize: 8,
	    height: 500,
	    width: 150,
	    openSimplex: new OpenSimplexNoise(Date.now()),
	    phase: 0
	};
	
	this.drawing = false;
	this.ctx = null;


	this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
	this.startts = this.getTS();
    }

    
    componentDidMount() {
	const canvas = this.refs.canvas;
	this.ctx = canvas.getContext("2d");

	
	this.rAF = requestAnimationFrame(() => this.updateAnimationState());
	this.updateWindowDimensions();
	window.addEventListener('resize', this.updateWindowDimensions);
    }
    
    updateWindowDimensions() {
	const { innerWidth, innerHeight } = window;
	
	this.setState({ width: innerWidth, height: innerHeight });
    }
    
    componentWillUnmount() {
	cancelAnimationFrame(this.rAF);
	window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateAnimationState() {
	this.ts = this.getTS();
	this.clearFrame();

	const count = 1;
	
	for (let i = 0 ; i < count ; i++) { 
	    this.drawCircle(i, count);
	}
	
	this.nextFrame();
    }

    nextFrame() {
	this.rAF = requestAnimationFrame(() => this.updateAnimationState());
    }

    clearFrame() {
	const { width, height } = this.state;
	const { ctx } = this;

	ctx.fillStyle = "#000000";
	ctx.fillRect(0, 0, width, height);
    }

    random(min, max) {
	return Math.floor(Math.random()*(max-min+1)+min);
    }

    randomXY(min, max, x, y) {
	const { openSimplex } = this.state;
	const random = openSimplex.noise2D(x, y);

	return Math.floor(random*(max-min+1)+min);
    }

    getTS() {
	const date = new Date();
	
	return date.getTime();
    }

    convertRange( value, r1, r2 ) { 
	return ( value - r1[ 0 ] ) * ( r2[ 1 ] - r2[ 0 ] ) / ( r1[ 1 ] - r1[ 0 ] ) + r2[ 0 ];
    }
    
    drawCircle(n, count) {
	const { ctx } = this;
	const { width, height, phase } = this.state;
	const TWO_PI = Math.PI * 2;
	const maxR = Math.min(width, height) / 3;
	const minR = maxR / 1.1;
	const m = maxR * 1.1;
	const step = 0.001;

	const { openSimplex } = this.state;
	//const random = openSimplex.noise2D(x, y);
	
	ctx.beginPath();
	const colour = 255 - (Math.floor(255 / count) * n);
	ctx.strokeStyle = `rgb(${colour}, ${colour}, ${colour})`;

	const scaled = [0, 10];
	
	for (let a = 0 ; a <= TWO_PI; a += step) {
	    const noiseX = this.convertRange(Math.cos(a + phase), [-1, 1], scaled);
	    const noiseY = this.convertRange(Math.sin(a + phase), [-1, 1], scaled);
	    
	    const r = this.randomXY(minR, maxR, noiseX, noiseY);
	    
	    const x = r * Math.sin(a) + m;
	    const y = r * Math.cos(a) + m;	   
	    
	    ctx.lineTo(x, y);
	}

	ctx.closePath();
	ctx.stroke();

	this.setState({ phase: phase + 0.01 });
    }
    
    render() {
	const { width, height, openSimplex } = this.state;

        return (
	    <div>
              <div>
		<canvas ref="canvas" width={ width } height={ height } onClick={ () => this.setState({ openSimplex: new OpenSimplexNoise(Date.now()) }) } />
              </div>
            </div>
	);	
    }
}

export default App;
