class LineChart
{

	constructor(dataset, frame, w, h, AxisColor, bgColor, XLabel, YLabel, Title) //contructeur
	{
		let f = document.querySelector(frame);
		f.style.width = w;
		f.style.height = h;
		f.style.padding = "5px";

		this.renderer = new Svg(frame);
		this.data = dataset;

		this.max = undefined;
		this.min = undefined;
		this.len = undefined;

		this.yaxis_height = 0;
		
		for (let c = 0; c < this.data.length; c++)
		{
			if(this.max == undefined || this.max < Math.max(...this.data[c].slice(2)))
				this.max = Math.max(...this.data[c].slice(2));

			if(this.min == undefined || this.min > Math.min(...this.data[c].slice(2)))
				this.min = Math.min(...this.data[c].slice(2));

			if(this.len == undefined || this.sx < this.len)
				this.len = this.data[c].length - 2;
				
		}

		this.sx = Math.floor( (this.renderer.w - 30) / this.len);
		this.sy = Math.abs((this.renderer.h)/(this.max - this.min)) -30/(this.max-this.min);

		for (let y = 0; y < 11; y++)
		{
			let R = this.max - this.min;

			let v = -(this.min + R*y/10 - this.min)*this.sy + (this.renderer.h/2);

			this.renderer.createLine(
				AxisColor, 
				-this.renderer.w/2+27, 
				v, 
				-this.renderer.w/2+33, 
				v
			);
		}

		for (let x = 0; x < 31; x++)
		{

			let v = -this.renderer.w/2 + (x*this.len/30)*this.sx + 30;

			this.renderer.createLine(
				AxisColor, 
				v, 
				this.min * this.sy + (this.renderer.h/2) + 3, 
				v, 
				this.min * this.sy + (this.renderer.h/2) - 3 
			);
		}

		this.renderer.screen.style.backgroundColor = bgColor;
		this.renderer.createLine(AxisColor, -this.renderer.w/2 + 30, this.renderer.h/2 - 0, -this.renderer.w/2 + 30, -this.renderer.h/2 + 30); //YAXIS
		this.renderer.createLine(
			AxisColor,
			-(this.renderer.w/2) + 30,
			this.min*this.sy +(this.renderer.h/2), 
			(this.renderer.w/2) - 30,
			this.min*this.sy +(this.renderer.h/2)
		); //XAXIS

		this.renderer.createLabel(AxisColor, this.renderer.w/2 - 30 -(XLabel.length)*10, this.min*this.sy +this.renderer.h/2 + 20, XLabel);
		this.renderer.createLabel(AxisColor, -this.renderer.w/2 + 5, -this.renderer.h/2 + 20, YLabel);

		this.renderer.createLabel(AxisColor, -Title.length*5, this.renderer.h/2 + 50, Title);
	}

	getData() //getteur
	{
		return this.data;
	}

	addData(dataset) //accesseur
	{
		this.data.push(dataset);
	}

	draw()
	{ //on dessine le graph

		for (let c = 0; c < this.data.length; c++)
		{

			for(let i=2; i < this.data[c].length-1; i++)
			{
				if(this.data[c][0] != "none")
				{
					this.renderer.createCircle(this.data[c][0], this.data[c][0], 1, 
						-this.renderer.w/2 + (i-2)*this.sx + 30, 
						-(this.data[c][i] - this.min)*this.sy + (this.renderer.h/2)
					);
				}

				this.renderer.createLine(
					this.data[c][1],
					(i-2)*this.sx -(this.renderer.w/2) + 30,
					-(this.data[c][i] - this.min)*this.sy +(this.renderer.h/2), 
					(i-1)*this.sx -(this.renderer.w/2) + 30,
					-(this.data[c][i+1] - this.min)*this.sy +(this.renderer.h/2)
				);
			}

		}

		this.renderer.update();
	}

}