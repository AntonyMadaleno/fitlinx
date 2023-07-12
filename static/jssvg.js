class Svg {

	constructor(elm) {
		this.screen = document.querySelector(elm);
		this.w = this.screen.clientWidth;
		this.h = this.screen.clientHeight - 75;
		this.circles = new Array();
		this.lines = new Array();
		this.labels = new Array();
		this.center_x = this.w/2;
		this.center_y = this.h/2;
	}

	createCircle(fill, stroke, radius, x, y) {
	//permet de créer un cercle
		let circle = document.createElement('circle');
		circle.setAttribute("fill", fill);
		circle.setAttribute("stroke", stroke);
		circle.setAttribute("stroke-width", 1);
		circle.setAttribute("r", radius);
		circle.setAttribute("cx", this.center_x + x);
		circle.setAttribute("cy", this.center_y + y);

		this.screen.appendChild(circle);
		this.circles.push(circle);
		return circle;
	}

	createLine(stroke, x1, y1, x2, y2) {
	//permet de créer une ligne
		let line = document.createElement('line');
		line.setAttribute("stroke", stroke);
		line.setAttribute("stroke-width", 1);
		line.setAttribute("x1", this.center_x + x1);
		line.setAttribute("y1", this.center_y +  y1);
		line.setAttribute("x2", this.center_x + x2);
		line.setAttribute("y2", this.center_y + y2);

		this.screen.appendChild(line);
		this.lines.push(line);
		return line;
	}

	createLabel(fill, x, y, str) {
	//permet de créer une ligne
		let l = document.createElement('text');
		l.innerHTML = str;
		l.setAttribute("fill", fill);
		l.setAttribute("x", this.center_x + x);
		l.setAttribute("y", this.center_y + y);

		this.screen.appendChild(l);
		this.labels.push(l);
		return l;
	}

	createCurve(stroke, arr, p) {

		if(arr.length == 8) {
		// on execute que s'il y'a 4 point de contrôle

			let rx;
			let ry;

			let sx;
			let sy;

			//on récupère la position de chaque point de contrôle (a est le depart, d l'arriver)
			let ax = arr[0]; let ay = arr[1];
			let bx = arr[2]; let by = arr[3];
			let cx = arr[4]; let cy = arr[5];
			let dx = arr[6]; let dy = arr[7];

			for (let t = 0; t < p; t++) {//on trace la courbe

				rx = ax*(1-(t/p))**3 + bx*3*(t/p)*(1-(t/p))**2 + cx*3*((t/p)**2)*(1-(t/p)) + dx*(t/p)**3;
				ry = ay*(1-(t/p))**3 + by*3*(t/p)*(1-(t/p))**2 + cy*3*((t/p)**2)*(1-(t/p)) + dy*(t/p)**3;

				let u = (t+1)/p;

				sx = ax*(1-u)**3 + bx*3*u*(1-u)**2 + cx*3*(u**2)*(1-u) + dx*u**3;
				sy = ay*(1-u)**3 + by*3*u*(1-u)**2 + cy*3*(u**2)*(1-u) + dy*u**3;

				this.createLine(stroke, rx, ry, sx, sy);
			}

			this.createLine("#666", ax, ay, bx, by);
			this.createLine("#666", cx, cy, dx, dy);

		}

	}

	update() {this.screen.innerHTML += "";}
	empty() {this.screen.innerHTML = "";}

}

