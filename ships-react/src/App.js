//import GameCanvas from './GameCanvas';
import { useState, useRef, useEffect } from 'react';
import './App.css';

function App() {

  const [drawables,setDrawables] = useState([]);
	const [keysPressed,setKeysPressed] = useState({});

	let gameCanvas = (<GameCanvas drawables={drawables} />);

	//When load complete, add playerShip
	useEffect(() => {
		setDrawables([Ship()]);

  let updater = window.setInterval(() => {
//		playerShip.direction = playerShip.direction + Math.PI/40;
//		playerShip.frontTurret.direction = playerShip.frontTurret.direction + Math.PI/40;
//console.log(keysPressed);
	},1000);


		return () => {
			window.clearInterval(updater);
		}
	}, []);
/*
	const keydown = (event) => {
		setKeysPressed((prevKeysPressed) => {
			prevKeysPressed[event.key] = true;
console.log(prevKeysPressed)
			return prevKeysPressed;
		});
	}
	const keyup = (event) => {
		setKeysPressed((prevKeysPressed) => {
			let n = { ...prevKeysPressed};
			n[event.key] = false;
			return n;
		});
	}
*/
  return (
    <div className="App" >
	  {gameCanvas}
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
    </div>
  );
}

function Turret(x, y, width, height, direction) {
	let turret = {};
//x and y are the CENTER of the circle
	turret.x = x;
	turret.y = y;
	turret.width = width;
  turret.height = height;
	turret.direction = direction;
  turret.gunwidth = width/6;
  turret.gunheight = height/2;

	turret.draw = (context) => {
		context.save();
    context.translate(turret.x, turret.y);
		context.rotate(turret.direction);
    context.beginPath();
		context.ellipse(
			0,
			0,
			turret.width/3,
			turret.height/3,
			0,
			0,
			2*Math.PI );
		context.rect(
			-turret.gunwidth/2,
			-turret.gunheight,
			turret.gunwidth,
			turret.gunheight
		);
		context.fill();
		context.restore();
  }
	return turret;
}

function Ship() {
  let ship = {};
//x and y are the CENTER of the ship
	ship.x = 100;
	ship.y = 100;
  ship.width = 10;
	ship.height = 50;
  ship.direction = 0;

//Turret placement is relative to the CENTER of the ship
  ship.frontTurret = Turret(
		0,
		-ship.height/3,
		ship.width*2,
		ship.width*2,
		0 );
  ship.rearTurret = Turret(
		0,
		ship.height/3,
		ship.width*2,
		ship.width*2,
		-Math.PI );

	ship.draw = (context) => {
		context.save();
		context.translate(ship.x, ship.y);
		context.rotate(ship.direction);
		context.beginPath();
		context.ellipse(
		  0,
			0,
			ship.width,
			ship.height,
			0,
			0,
			2*Math.PI );

		context.stroke();
		ship.frontTurret.draw(context);
		ship.rearTurret.draw(context);
		context.restore();
  }

	return ship;
}

function GameCanvas(props) {
	const { drawables } = props;
	const canvasRef = useRef(null);
	
	useEffect(() => {
			let animationFrameId;
			const canvas = canvasRef.current;
			if(canvas) {
			const context = canvas.getContext('2d');

			//Main render loop, recursively called
			const render = () => {
				if(drawables) {	
					context.clearRect(0,0,canvas.width,canvas.height);
					for(let drawable of drawables) {
						drawable.draw(context);
					}
				}
				animationFrameId = window.requestAnimationFrame(render);
			}
			render();

			// When component unmounts, cancel the animation
			return () => { window.cancelAnimationFrame(animationFrameId) }
			}
	}, [drawables]); //end useEffect


  return (<canvas ref={canvasRef} width={640} height={640} />)
}

export default App;
