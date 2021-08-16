function is_odd(x) {
	return !(x % 2);
}

function random(min, max) {
	return Math.round(min - 0.5 + Math.random() * (max - min + 1));
}

class chess{
	field = [];
	figures = []
	move_color = "white";
	move_order_enabled = true;

	constructor(id, size, sq){
		this.dpi = window.devicePixelRatio || 1;
		this.size = size;
		this.container = document.getElementById(id);
		this.canvas = this.append_tag("canvas", "canvas");
		this.sq = sq;
		this.image = document.getElementById('image');
		this.width = this.sq*size[0];
		this.height = this.sq*size[1];
		this.canvas.width = this.width;
		this.canvas.height = this.height;
		this.ctx = this.get_context(this.canvas);

		this.create_figure("pawn", 0, function(fig, to, game, is_moving = false, field = false){
			if (!field)
				field = game.field;

			let toF = field[to[0]][to[1]],
				fromF = field[fig.x][fig.y],
				toReturn = null;

			if (!toF.figure){
				if (fig.color == "black"){
					toReturn = (to[0] == fig.x && to[1] == fig.y+1);
					if (fig.y == 1 && to[1] == 3 && to[0] == fig.x)
						toReturn = true;
					if (to[1] == game.size[1]-1 && is_moving)
						fig.proto = game.figures["queen"];
				}else{
					toReturn = (to[0] == fig.x && to[1] == fig.y-1);
					if (fig.y == 6 && to[1] == 4 && to[0] == fig.x)
						toReturn = true;
					if (to[1] == 0 && is_moving)
						fig.proto = game.figures["queen"];
				}

			}else{
				if (fig.color == "black"){
					toReturn = ((to[0] == fig.x+1 || to[0] == fig.x-1) && to[1] == fig.y+1);
					if (to[1] == game.size[1]-1 && is_moving)
						fig.proto = game.figures["queen"];
				}else{
					toReturn = ((to[0] == fig.x+1 || to[0] == fig.x-1) && to[1] == fig.y-1);
					if (to[1] == 0 && is_moving)
						fig.proto = game.figures["queen"];
				}
			}

			return toReturn;
		});
			
		this.create_figure("queen", 1, function(fig, to, game, is_moving = false, field = false){
			let toReturn = false;
			if (!field)
				field = game.field;

			if ((Math.abs(fig.x-to[0]) == Math.abs(fig.y-to[1]))){
				toReturn = true;

				for (let i = 1; i<Math.abs(fig.x-to[0]); i++){
					let l = i, l2 = i;

					if (fig.x-to[0]>0)
						l *= -1;
					if (fig.y-to[1]>0)
						l2 *= -1;

					if (field[fig.x + l] && field[fig.x + l][fig.y + l2] && field[fig.x + l][fig.y + l2].figure){
						toReturn = false;
					}
				}
			}

			if (fig.x == to[0]){
				toReturn = true;

				for (let i = 1; i < Math.abs(fig.y - to[1]); i++){
					if (fig.y - to[1] < 0){

						if (field[fig.x][fig.y + i].figure)
							toReturn = false;
					}else{
						if (field[fig.x][fig.y - i].figure)
							toReturn = false;
					}
				}
			}else if (fig.y == to[1]){
				toReturn = true;

				for (let i = 1; i < Math.abs(fig.x - to[0]); i++){
					if (fig.x - to[0] < 0){
						if (field[fig.x + i][fig.y].figure)
							toReturn = false;
					}else{
						if (field[fig.x - i][fig.y].figure)
							toReturn = false;
					}
				}
			}

			return toReturn;
		});

		this.create_figure("king", 2, function(fig, to, game, is_moving = false, field = false){
			let toReturn = false;

			for (let i = -1; i<2; i++){
				for (let l = -1; l<2; l++){
					if (to[0] == i+fig.x && to[1] == l+fig.y)
						toReturn = true;
				}
			}

			return toReturn;
		});

		this.create_figure("el", 3, function(fig, to, game, is_moving = false, field = false){
			let toReturn = false;

			if (!field)
				field = game.field;

			if ((Math.abs(fig.x-to[0]) == Math.abs(fig.y-to[1]))){
				toReturn = true;

				for (let i = 1; i<Math.abs(fig.x-to[0]); i++){
					let l = i, l2 = i;

					if (fig.x-to[0]>0)
						l *= -1;
					if (fig.y-to[1]>0)
						l2 *= -1;

					if (field[fig.x + l] && field[fig.x + l][fig.y + l2] && field[fig.x + l][fig.y + l2].figure){
						toReturn = false;
					}
				}
			}

			return toReturn;
		});

		this.create_figure("rook", 4, function(fig, to, game, is_moving = false, field = false){
			if (!field)
				field = game.field;

			let toF = field[to[0]][to[1]],
				fromF = field[fig.x][fig.y],
				toReturn = false;

			if (fig.x == to[0]){
				toReturn = true;

				for (let i = 1; i < Math.abs(fig.y - to[1]); i++){
					if (fig.y - to[1] < 0){

						if (field[fig.x][fig.y + i].figure)
							toReturn = false;
					}else{
						if (field[fig.x][fig.y - i].figure)
							toReturn = false;
					}
				}
			}else if (fig.y == to[1]){
				toReturn = true;

				for (let i = 1; i < Math.abs(fig.x - to[0]); i++){
					if (fig.x - to[0] < 0){
						if (field[fig.x + i][fig.y].figure)
							toReturn = false;
					}else{
						if (field[fig.x - i][fig.y].figure)
							toReturn = false;
					}
				}
			}

			return toReturn;
		});

		this.create_figure("horse", 5, function(fig, to, game, is_moving = false, field = false){
			if (!field)
				field = game.field;

			let toF = field[to[0]][to[1]],
				fromF = field[fig.x][fig.y],
				toReturn = (
					(to[0] == fig.x+1 && to[1] == fig.y+2) ||
					(to[0] == fig.x-1 && to[1] == fig.y+2) ||
					(to[0] == fig.x+1 && to[1] == fig.y-2) ||
					(to[0] == fig.x-1 && to[1] == fig.y-2) ||

					(to[0] == fig.x+2 && to[1] == fig.y+1) ||
					(to[0] == fig.x-2 && to[1] == fig.y+1) ||
					(to[0] == fig.x+2 && to[1] == fig.y-1) ||
					(to[0] == fig.x-2 && to[1] == fig.y-1)
				);

			return toReturn;
		});

		this.create_figure("sip", 6, function(fig, to, game, is_moving = false, field = false){
			if (!field)
				field = game.field;

			let toReturn = false;

			for (let i = -2; i<3; i++){
				for (let l = -2; l<3; l++){
					if (to[0] == i+fig.x && to[1] == l+fig.y)
						toReturn = true;
				}
			}

			return toReturn;
		});

		this.init_field();
	}

	get_context($canvas){
		var dpr = this.dpi;
		var rect = $canvas.getBoundingClientRect();
		
		$canvas.width = rect.width * dpr;
		$canvas.height = rect.height * dpr;
		$canvas.style.width = rect.width + "px";
		$canvas.style.height = rect.height + "px";

		var ctx = $canvas.getContext('2d');
		ctx.imageSmoothingEnabled = false;
		ctx.scale(dpr, dpr);

		return ctx;
	}

	append_tag(tag, id, classL){
		var elem = document.createElement(tag);

		if (id)
			elem.id = id;
		if (classL)
			elem.classList = classL;

		this.container.appendChild(elem);

		return elem;
	}

	draw_image(sprite, pos, size){
		this.ctx.drawImage(this.image, sprite[0], sprite[1], sprite[2], sprite[3], pos[0], pos[1], size[0], size[1]);
	} 

	draw_figure(x, y){
		let size = [32, 32];

		if (this.field[x][y].figure){
			if (this.field[x][y].figure.color == "white"){
				this.draw_image([this.field[x][y].figure.proto.sprite*size[0] + 32, 0, size[0], size[1]], [x*this.sq, y*this.sq], [this.sq, this.sq]);
			}else{
				this.draw_image([this.field[x][y].figure.proto.sprite*size[0] + 32, size[1], size[0], size[1]], [x*this.sq, y*this.sq], [this.sq, this.sq]);
			}
		}
	}

	create_figure(name, sprite, check_function){
		this.figures[name] = {
			name:name,
			sprite:sprite,
			check_function:check_function
		};
	}

	summon_figure(name, pos, color="white", to_draw = false){
		this.field[pos[0]][pos[1]].figure = {
			x:pos[0],
			y:pos[1],
			color:color,
			proto:this.figures[name],
		};

		if (to_draw)
			this.draw_field();
	}

	set_color(color = "white"){
		this.move_color = color;
		document.body.style.background = "rgb(220, 220, 220)";
		if (color == "black")
			document.body.style.background = "rgb(75, 75, 75)";
	}

	get_field(x, y, prop = ""){
		if (this.field[x] && this.field[x][y]){
			if (prop)
				return this.field[x][y][prop];
			return this.field[x][y];
		}

		return false;
	}

	move(from, to){
		let toF = this.field[to[0]][to[1]],
			fromF = this.field[from[0]][from[1]];

		let figure = fromF.figure;

		if (toF && fromF && figure && (figure.color == this.move_color || !this.move_order_enabled)){
			if (
				!(from[0] == to[0] && from[1] == to[1]) &&
				figure.proto.check_function(figure, to, this, true) &&
				(!toF.figure || toF.figure.color != figure.color)
			){
				if (this.field[to[0]][to[1]].figure && this.field[to[0]][to[1]].figure.proto.name == "king"){
					this.init_field();
					this.set_color("white");
				}else{
					if (!(this.field[to[0]][to[1]].figure && this.field[to[0]][to[1]].figure.proto.name == "sip")){
						this.field[from[0]][from[1]].figure.x = to[0];
						this.field[from[0]][from[1]].figure.y = to[1];
						this.field[to[0]][to[1]].figure = this.field[from[0]][from[1]].figure;
						this.field[from[0]][from[1]].figure = null;
						this.draw_field();
					}else{
						this.field[from[0]][from[1]].figure = null;
					}

					if (this.move_color == "white")
						this.set_color("black");
					else
						this.set_color("white");
				}
			}
		}
	}

	draw_field(){
		for (let x = 0; x<this.size[0]; x++){
			for (let y = 0; y<this.size[1]; y++){
				let fig = this.field[x][y].figure;

				if (this.field[x][y].color == "white")
					this.draw_image([0, 0, 32, 32], [x*this.sq, y*this.sq], [this.sq, this.sq]);
				else
					this.draw_image([0, 32, 32, 32], [x*this.sq, y*this.sq], [this.sq, this.sq]);

				if (fig){
					try{
						this.draw_figure(x, y);
					}catch{

					}
				}

				if (this.tap){
					this.ctx.fillStyle = "rgba(255, 255, 255, .4)";

					if (
						this.field[this.tap.x][this.tap.y].figure &&
						!(fig && fig.color == this.field[this.tap.x][this.tap.y].figure.color) &&
						this.field[this.tap.x][this.tap.y].figure.proto.check_function(this.field[this.tap.x][this.tap.y].figure, [x, y], this)
					){
						if (this.field[this.tap.x][this.tap.y].figure.proto.name == "sip")
							this.ctx.fillStyle = "rgba(255, 0, 0, .1)";

						if (fig){
							if (fig.proto.name != "sip")
								this.ctx.fillStyle = "rgba(255, 100, 100, .4)";
							else
								this.ctx.fillStyle = "rgba(0, 255, 255, .4)";
						}

						this.ctx.fillRect(x*this.sq + this.sq/4, y*this.sq + this.sq/4, this.sq/2, this.sq/2);
					}
				}
			}
		}
	}

	init_field(){
		for (let x = 0; x<this.size[0]; x++){
			this.field[x] = [];

			for (let y = 0; y<this.size[1]; y++){
				this.field[x][y] = [];
				this.field[x][y].figure = null;
				this.field[x][y].color = "white";

				if (is_odd(x)){
					if (is_odd(y))
						this.field[x][y].color = "black";
				}else{
					this.field[x][y].color = "black";

					if (is_odd(y))
						this.field[x][y].color = "white";
				}
			}
		}

		// *
		// INIT
		// *

		for (var i = 0; i < this.size[0]; i++) 
			this.summon_figure("pawn", [i, 1], "black");

		for (var i = 0; i < this.size[0]; i++) 
			this.summon_figure("pawn", [i, 6], "white");

		this.summon_figure("queen", [3, 0], "black");
		this.summon_figure("queen", [3, 7], "white");

		this.summon_figure("king", [4, 0], "black");
		this.summon_figure("king", [4, 7], "white");

		this.summon_figure("el", [2, 0], "black");
		this.summon_figure("el", [2, 7], "white");
		this.summon_figure("el", [5, 0], "black");
		this.summon_figure("el", [5, 7], "white");

		this.summon_figure("rook", [0, 0], "black");
		this.summon_figure("rook", [0, 7], "white");
		this.summon_figure("rook", [7, 0], "black");
		this.summon_figure("rook", [7, 7], "white");

		this.summon_figure("horse", [1, 0], "black");
		this.summon_figure("horse", [1, 7], "white");
		this.summon_figure("horse", [6, 0], "black");
		this.summon_figure("horse", [6, 7], "white");

		this.draw_field();
	}

	mouse_down(e){
		var x = Math.floor(e.layerX/this.sq),
			y = Math.floor(e.layerY/this.sq);

		if (this.tap){
			if (
				this.field[this.tap.x] &&
				this.field[this.tap.x][this.tap.y] &&
				this.field[this.tap.x][this.tap.y].figure &&
				this.field[x] &&
				this.field[x][y]
			){
				this.move([this.tap.x, this.tap.y], [x, y]);
			}	

			this.tap = null;
		}else{
			if (
				this.field[x] &&
				this.field[x][y] &&
				this.field[x][y].figure &&
				(this.field[x][y].figure.color == this.move_color || !this.move_order_enabled)
			){
				this.tap = {
					x:x,
					y:y
				};
			}
		}

		this.draw_field();
	}

	play_audio(dir, vol = 1){
		let aud = new Audio(dir);
		aud.volume = vol;
		aud.play();

		return aud;
	}
}

var game = new chess("container", [8, 8], 48);

game.canvas.addEventListener("mousedown", function(e){
	game.mouse_down(e);
});

document.body.addEventListener("keydown", function(e){
	if (e.key == "s" && e.ctrlKey){
		game.summon_figure("sip", [4, 7], "white", true);
		game.play_audio("sounds/lol.wav");
		game.play_audio("sounds/bg.mp3", .3);
	}
});
