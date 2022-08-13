//import GameCanvas from './GameCanvas';
import { useState, useRef, useEffect } from 'react';
import './App.css';

const P = Math.PI/180;

function App() {

  const [drawables,setDrawables] = useState([]);
	const [keysPressed,setKeysPressed] = useState({});

	let gameCanvas = (<GameCanvas drawables={drawables} />);

	//When load complete, add playerShip
	useEffect(() => {
		let playerShip = Ship();
		setDrawables([playerShip]);

  let updater = window.setInterval(() => {
//		playerShip.direction = playerShip.direction + Math.PI/40;
//		playerShip.frontTurret.direction = playerShip.frontTurret.direction + Math.PI/40;
//console.log(keysPressed);
//playerShip.move();


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

function Shot(x, y, direction, speed) {
	let shot = {};
	shot.x = x;
	shot.y = y;
	shot.direction = direction;
	shot.speed = speed;
	shot.width = 3;
	shot.height = 3;

	shot.move = () => {

	}
	shot.draw = (context) => {
		context.save();
    context.translate(shot.x, shot.y);
    context.rotate(shot.direction);
    context.beginPath();
		context.ellipse(
			0,
			0,
			shot.width,
			shot.height,
			0,
			Math.PI/2,
			-Math.PI/2);
		context.lineTo(-10,0);
		context.fill();
		context.restore();
	}
}

function Turret(x, y, width, height, direction) {
	let turret = {};
//x and y are the CENTER of the circle
	turret.x = x;
	turret.y = y;
	turret.width = width;
  turret.height = height;
	turret.direction = direction;
  turret.gunwidth = width/2;
  turret.gunheight = height/6;

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
			turret.gunwidth,
			turret.gunheight/2,
			-turret.gunwidth,
			-turret.gunheight
		);

		context.fill();
		context.restore();
  }

	turret.fire = () => {
		// Round should be fired at end of muzzle
		let shot = Shot(turret.x + turret.width,
			turret.y,
			turret.direction,
//TODO speed?
			50);
		return shot;
	}

	return turret;
}

function Ship() {
  let ship = {};
//x and y are the CENTER of the ship
	ship.x = 100;
	ship.y = 100;
  ship.width = 50;
	ship.height = 10;
  ship.direction = 0;
	ship.speed = 10;

//Turret placement is relative to the CENTER of the ship
  ship.frontTurret = Turret(
		ship.width/3,
		0,
		ship.height*2,
		ship.height*2,
		0 );
  ship.rearTurret = Turret(
		-ship.width/3,
		0,
		ship.height*2,
		ship.height*2,
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
//TODO Using this to indicate front
		context.lineTo(0,0);

		context.stroke();
		ship.frontTurret.draw(context);
		ship.rearTurret.draw(context);
		context.restore();
  }

	//Updates position based on speed and direction
	ship.move = () => {
		ship.x = ship.x + ship.speed * Math.cos(ship.direction * P);
		ship.y = ship.y + ship.speed * Math.sin(ship.direction * P);
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
