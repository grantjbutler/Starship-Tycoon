(function(__) {
	var Part = new Class({
		size: CGSizeMakeZero(),
		origin: CGPointMakeZero(),
		
		_image: null,
		type: "",
		price: 0,
		
		Attributes: {
			imgSrc: {
				set: function(src) {
					this._image = new Image();
					this._image.src = src;
				},
				get: function() {
					return this._image.src;
				}
			}
		},
		
		initialize: function(part) {
			this.size = part.size;
			this.imgSrc = part.image; // TODO: Change this for a properly sized image.
			this.type = part.type;
			this.price = part.cost;
		},
		
		intersects: function(part) {
			if(!typeOf(part, Part)) {
				return false;
			}
			
			var myFrame = CGRectMake(this.origin.x, this.origin.y, this.size.width, this.size.height);
			var otherFrame = CGRectMake(part.origin.x, part.origin.y, part.size.width, part.size.height);
			
			return CGRectIntersectsRect(myFrame, otherFrame);
		},
		
		render: function(ctx) {
			CGContextSaveGState(ctx);
			
			CGContextDrawImage(ctx, CGRectMake(this.origin.x * 48, this.origin.y * 48, this.size.width * 48, this.size.height * 48), this);
			
			CGContextRestoreGState(ctx);
		}
	});
	
	var Parts = {
		Weapons: [
			{
				name: "Photon Torpedoes",
				image: "img/game_weapon.png",
				cost: 300,
				size: CGSizeMake(2, 1),
				type: "weapon"
			},
			{
				name: "Lasers",
				image: "img/game_weapon1.png",
				cost: 150,
				size: CGSizeMake(2, 1),
				type: "weapon"
			}
		],
		
		Engines: [
			{
				name: "Impulse Engines",
				image: "img/game_thruster.png",
				cost: 100,
				size: CGSizeMake(2, 1),
				type: "engine"
			},
			{
				name: "Sublight Engines",
				image: "img/game_engine.png",
				cost: 225,
				size: CGSizeMake(2, 1),
				type: "engine"
			},
			{
				name: "Thrusters",
				image: "img/game_thruster2.png",
				cost: 150,
				size: CGSizeMake(2, 2),
				type: "engine"
			},
			{
				name: "Thrusters",
				image: "img/game_thruster2_alt.png",
				cost: 150,
				size: CGSizeMake(2, 2),
				type: "engine"
			}
		],
		
		Hull: [
			{
				name: "Hull",
				image: "img/game_ship_hull_33_alt.png",
				cost: 125,
				size: CGSizeMake(2, 1),
				type: "hull"
			},
			{
				name: "Hull",
				image: "img/game_ship_hull_33.png",
				cost: 125,
				size: CGSizeMake(2, 1),
				type: "hull"
			},
			{
				name: "Hull",
				image: "img/game_ship_hull_45_alt.png",
				cost: 100,
				size: CGSizeMake(1, 1),
				type: "hull"
			},
			{
				name: "Hull",
				image: "img/game_ship_hull_45.png",
				cost: 100,
				size: CGSizeMake(1, 1),
				type: "hull"
			},
			{
				name: "Hull",
				image: "img/game_ship_hull_middle.png",
				cost: 50,
				size: CGSizeMake(1, 1),
				type: "hull"
			}
		],
		
		Cockpit: [
			{
				name: "Cockpit",
				image: "img/game_cockpit3.png",
				cost: 175,
				size: CGSizeMake(3, 2),
				type: "cockpit"
			}
		]
	};
	
	var Mission = new Class({
		description: "",
		reward: 0,
		title: "",
		validation: null,
		completed: false,
		howManyPointsDoIRecieve: null,
		
		initialize: function(attributes) {
			this.description = attributes.description || "";
			this.reward = attributes.reward || 0;
			this.title = attributes.title || "";
			this.validation = attributes.validation || function() {return true;};
			this.howManyPointsDoIRecieve = attributes.points || function() {return Math.Infinity;};
		},
		
		complete: function() {
			this.completed = this.validation();
			
			if(this.completed) {
				Game.sharedGame()._score += this.howManyPointsDoIRecieve();
				Game.sharedGame()._currency += this.reward;
			}
			
			return this.completed;
		}
	});
	
	var Missions = [
		new Mission({
			title: "The Wonderbolts",
			description: "The Wonderbolts need a ship that represents\ntheir speed and nothing else. Make the ship as\nfast as you can make it.",
			reward: 15000,
			points: function() {
				var count = 0;
				
				Game.sharedGame()._parts.forEach(function(part) {
					if(part.type == "engine") {
						count++;
					}
				});
				
				return Math.pow(count, 2) * 100;
			}
		}),
		new Mission({
			title: "The Terminator",
			description: "The military needs a new ultimate fighting machine.\nBuild the most powerful ship that you can make.",
			reward: 15000,
			points: function() {
				var count = 0;
				
				Game.sharedGame()._parts.forEach(function(part) {
					if(part.type == "weapon") {
						count++;
					}
				});
				
				return Math.pow(count, 2) * 100;
			}	
		})
	];
	
	var Game = (function() {
		var __GAME = new Class({
			_parts: [],
			_tempPart: null,
			
			_currency: 10000,
			_score: 0,
			
			_currentMission: null,
			
			initialize: function() {
				
			},
			
			addPart: function(newPart) {
				var foundPart = false;
				
				for(var i = 0; i < this._parts.length; i++) {
					var part = this._parts[i];
					
					if(part.intersects(newPart)) {
						foundPart = true;
						
						break;
					}
				}
				
				if(foundPart) {
					return false;
				}
				
				this._parts.push(newPart);
				this._currency -= newPart.price;
				
				return true;
			},
			
			removePart: function(part) {
				
			},
			
			resetParts: function() {
				this._parts = [];
			}
		});
		
		__SHARED_GAME = null;
		
		__GAME.sharedGame = function() {
			if(__SHARED_GAME == null) {
				__SHARED_GAME = new __GAME();
			}
			
			return __SHARED_GAME;
		};
		
		return __GAME;
	})();
	
	var MainScreen = new Class({
		Extends: __.Engine.Screen,
		
		_startButton: null,
		_startBG: null,
		
		initialize: function() {
			this._startButton = new __.Engine.UI.Button(CGRectMake(300, 400, 200, 63));
			this._startButton.text = "Start Game";
			this._startButton.addEvent('click', function() {
				__.Engine.setScreen(new GameScreen());
			});
			
			this._startBG = new Image();
			this._startBG.src = "img/game_startpage.png";
		},
		
		render: function(delta, ctx) {
			// TODO: Replace this with image.
			var rect = CGRectMake(0, 0, ctx.canvas.width, ctx.canvas.height);
			CGContextDrawImage(ctx, rect, { _image: this._startBG });
			
			ctx.font = '45px Volter';
			var textSize = ctx.measureText('Starship Tycoon');
			var textOrigin = CGPointMake(rect.origin.x + ROUND((rect.size.width - textSize.width) / 2.0), 150);
			CGContextSetFillColor(ctx, CGColorCreateGenericRGB(0.9, 0.9, 0.9, 1.0));
			
			ctx.fillText('Starship Tycoon', textOrigin.x, textOrigin.y);
			
			this._startButton.render(ctx);
		},
		
		mouseMove: function(point) {
			this._startButton.mouseMove(point);
		},
		
		mouseDown: function(point) {
			this._startButton.mouseDown(point);
		},
		
		mouseUp: function(point) {
			this._startButton.mouseUp(point);
		}
	});
	
	var GameScreen = new Class({
		Extends: __.Engine.Screen,
		
		_menuButton: null,
		_partsButton: null,
		_missionsButton: null,
		_completeButton: null,
		
		_mousePosition: CGPointMakeZero(),
		
		_background: null,
		
		_grid: [],
		
		initialize: function() {
			this._menuButton = new __.Engine.UI.Button(CGRectMake(10, 10, 125, 35));
			this._menuButton.text = "Menu";
/*
			this._menuButton.addEventListener('clicked', function() {
				__.Engine.showOverlay(new MenuOverlay());
			});
*/
			
			this._partsButton = new __.Engine.UI.Button(CGRectMake(10, 55, 125, 35));
			this._partsButton.text = "Parts";
			this._partsButton.addEvent('click', function() {
				if(__.Engine._currentOverlay instanceof PartsOverlay) {
					__.Engine.hideOverlay();
				} else {
					Game.sharedGame()._tempPart = null;
					
					var overlay = new PartsOverlay(CGRectMake(145, 0, 655, 600));
					
					__.Engine.showOverlay(overlay);
				}
			});
			
			this._missionsButton = new __.Engine.UI.Button(CGRectMake(10, 100, 125, 35));
			this._missionsButton.text = "Missions";
			this._missionsButton.addEvent('click', function() {
				if(__.Engine._currentOverlay instanceof MissionsOverlay) {
					__.Engine.hideOverlay();
				} else {
					Game.sharedGame()._tempPart = null;
					
					var overlay = new MissionsOverlay(CGRectMake(145, 0, 655, 600));
					
					__.Engine.showOverlay(overlay);
				}
			});
			
			this._completeButton = new __.Engine.UI.Button(CGRectMake(10, 600 - 35 - 10, 125, 35));
			this._completeButton.text = "Complete";
			this._completeButton.addEvent('click', function() {
				if(Game.sharedGame()._currentMission.complete()) {
					Game.sharedGame()._currentMission = null;
					Game.sharedGame().resetParts();
				} else {
					alert("You haven't met all the requirements yet. Try again!");
				}
			});
			
			this._background = new Image();
			this._background.src = "img/game_background.png";
		},
		
		render: function(delta, ctx) {
			if(Game.sharedGame()._currentMission) {
				if(!this._missionsButton.disabled) {
					this._missionsButton.disabled = true;
				}
				
				if(this._completeButton.disabled) {
					this._completeButton.disabled = false;
				}
				
				if(this._partsButton.disabled) {
					this._partsButton.disabled = false;
				}
			} else {
				if(this._missionsButton.disabled) {
					this._missionsButton.disabled = false;
				}
				
				if(!this._completeButton.disabled) {
					this._completeButton.disabled = true;
				}
				
				if(!this._partsButton.disabled) {
					this._partsButton.disabled = true;
				}
			}
			
			CGContextDrawImage(ctx, CGRectMake(0, 0, 800, 600), { _image: this._background });
			
			CGContextSaveGState(ctx);
				
			CGContextTranslateCTM(ctx, 161, 13);
			
			Game.sharedGame()._parts.forEach(function(part) {
				part.render(ctx);
			});
			
			CGContextRestoreGState(ctx);
			
			if(Game.sharedGame()._tempPart) {
				CGContextSaveGState(ctx);
				
				CGContextTranslateCTM(ctx, 161, 13);
				
				var mouseOrigin = CGPointMakeZero();
				mouseOrigin.x = MAX(FLOOR((this._mousePosition.x - 161) / 48) * 48, 0);
				mouseOrigin.y = MAX(FLOOR((this._mousePosition.y - 13) / 48) * 48, 0);
				
				if(mouseOrigin.x + Game.sharedGame()._tempPart.size.width * 48 > 624) {
					mouseOrigin.x = 624 - Game.sharedGame()._tempPart.size.width * 48;
				}
				
				if(mouseOrigin.y + Game.sharedGame()._tempPart.size.height * 48 > 576) {
					mouseOrigin.y = 576 - Game.sharedGame()._tempPart.size.height * 48;
				}
				
				Game.sharedGame()._tempPart.origin = CGPointMake(FLOOR(mouseOrigin.x / 48), FLOOR(mouseOrigin.y / 48));
				
				CGContextSetFillColor(ctx, CGColorCreateGenericRGB(1.0, 0.5, 0.0, 0.5));
				
				for(var i = 0; i < Game.sharedGame()._parts.length; i++) {
					var part = Game.sharedGame()._parts[i];
					
					if(part.intersects(Game.sharedGame()._tempPart)) {
						CGContextSetFillColor(ctx, CGColorCreateGenericRGB(1.0, 0.0, 0.0, 0.5));
						
						break;
					}
				}
				
				CGContextFillRect(ctx, CGRectMake(mouseOrigin.x, mouseOrigin.y, Game.sharedGame()._tempPart.size.width * 48, Game.sharedGame()._tempPart.size.height * 48));
				
				CGContextRestoreGState(ctx);
				
				CGContextDrawImage(ctx, CGRectMake(this._mousePosition.x - 10, this._mousePosition.y - 24, Game.sharedGame()._tempPart.size.width * 48, Game.sharedGame()._tempPart.size.height * 48), Game.sharedGame()._tempPart);
			}
			
			CGContextSetFillColor(ctx, CGColorCreateGenericRGB(0.85, 0.85, 0.85, 1.0));
			CGContextFillRect(ctx, CGRectMake(0, 0, 145, ctx.canvas.height));
			
			this._menuButton.render(ctx);
			this._partsButton.render(ctx);
			this._missionsButton.render(ctx);
			this._completeButton.render(ctx);
			
			CGContextSetFillColor(ctx, CGColorCreateGenericRGB(0.15, 0.15, 0.15, 1.0));
			
			ctx.textBaseline = "top";
			ctx.font = '9px Volter';
			
			if(Game.sharedGame()._currentMission) {
				ctx.fillText('Current Mission:', 10, 250);
				ctx.fillText(Game.sharedGame()._currentMission.title, 10, 263);
			}
			
			ctx.fillText('Score: ' + Game.sharedGame()._score, 10, 290);
			ctx.fillText('Monies: ' + Game.sharedGame()._currency.toLocaleString(), 10, 303);
		},
		
		mouseDown: function(point) {
			this._menuButton.mouseDown(point);
			this._partsButton.mouseDown(point);
			this._missionsButton.mouseDown(point);
			this._completeButton.mouseDown(point);
		},
		
		mouseMove: function(point) {
			this._menuButton.mouseMove(point);
			this._partsButton.mouseMove(point);
			this._missionsButton.mouseMove(point);
			this._completeButton.mouseMove(point);
			
			this._mousePosition = point;
		},
		
		mouseUp: function(point) {
			this._menuButton.mouseUp(point);
			this._partsButton.mouseUp(point);
			this._missionsButton.mouseUp(point);
			this._completeButton.mouseUp(point);
			
			if(this._mousePosition.x - 161 >= 0 && this._mousePosition.y - 13 >= 0) {
				var mouseOrigin = CGPointMakeZero();
				mouseOrigin.x = MAX(FLOOR((this._mousePosition.x - 161) / 48), 0);
				mouseOrigin.y = MAX(FLOOR((this._mousePosition.y - 13) / 48), 0);
				
				if(mouseOrigin.x + Game.sharedGame()._tempPart.size.width > 13) {
					mouseOrigin.x = 13 - Game.sharedGame()._tempPart.size.width;
				}
				
				if(mouseOrigin.y + Game.sharedGame()._tempPart.size.height > 12) {
					mouseOrigin.y = 12 - Game.sharedGame()._tempPart.size.height;
				}
				
				var part = Game.sharedGame()._tempPart;
				
				part.origin = mouseOrigin;
				
				console.log(part);
				
				if(Game.sharedGame().addPart(part)) {
					Game.sharedGame()._tempPart = null;
				} else {
					Game.sharedGame()._tempPart.origin = CGPointMakeZero();
				}
			}
		},
		
		rightMouseUp: function(point) {
			// TODO: Delete a part.
		}
	});
	
	var MissionView = new Class({
		Implements: Events,
		
		_frame: CGRectMakeZero(),
		
		title: "",
		description: "",
		reward: "",
		
		_button: null,
		
		_titleMeasurements: null,
		_descriptionMeasurements: null,
		
		Attributes: {
			frame: {
				set: function(frame) {
					this._frame = frame;
					
					this._button.frame = CGRectMake(this.frame.origin.x + FLOOR((this.frame.size.width - 125) / 2.0), CGRectGetMaxY(this.frame) - 36, 125, 36);
				},
				get: function() {
					return this._frame;
				}
			}
		},
		
		initialize: function(frame) {
			this._frame = frame;
			
			var self = this;
			
			this._button = new __.Engine.UI.Button(CGRectMake(this.frame.origin.x + FLOOR((this.frame.size.width - 125) / 2.0), CGRectGetMaxY(this.frame) - 36, 125, 36));
			this._button.text = "Accept";
			this._button.addEvent('click', function() {
				self.fireEvent('acceptMission');
			});
		},
		
		render: function(ctx) {
			CGContextSaveGState(ctx);
			
			if(!this._titleMeasurements && this._button._font.loaded) {
				this._titleMeasurements = this._button._font.measureText(this.title, this._button.fontSize);
			}
			
			CGContextSetFillColor(ctx, CGColorCreateGenericRGB(1, 1, 1, 1));
			
			ctx.textBaseline = "top";
			ctx.font = '18px Volter';
			
			var yOffset = this.frame.origin.y;
			
			if(this._titleMeasurements) {
				var origin = CGPointMake(this.frame.origin.x + FLOOR((this.frame.size.width - this._titleMeasurements.width) / 2), this.frame.origin.y);
				
				ctx.fillText(this.title, origin.x, origin.y);
				
				yOffset += this._titleMeasurements.height + 10;
			}
			
			if(!this._descriptionMeasurements && this._button._font.loaded) {
				this._descriptionMeasurements = this._button._font.measureText(this.description, 9);
			}
			
			ctx.font = '9px Volter';
			
			if(this._descriptionMeasurements) {
				var lines = this.description.split('\n');
				lines.push('');
				lines.push('Reward: ' + this.reward.toLocaleString());
				
				for (var i = 0; i < lines.length; i++) {
					ctx.fillText(lines[i], this.frame.origin.x, yOffset + (i * this._descriptionMeasurements.height));
				}
				
				
			}
			
			this._button.render(ctx);
			
			CGContextRestoreGState(ctx);
		},
		
		mouseDown: function(point) {
			this._button.mouseDown(point);
		},
		
		mouseMove: function(point) {
			this._button.mouseMove(point);
		},
		
		mouseUp: function(point) {
			this._button.mouseUp(point);
		}
	});
	
	var MissionsOverlay = new Class({
		Extends: __.Engine.Overlay,
		
		_views: [],
		
		initialize: function(frame) {
			this.parent(frame);
			
			var self = this;
			
			Missions.forEach(function(mission) {
				var view = new MissionView(CGRectMake(0, 0, 250, 150));
				view.title = mission.title;
				view.description = mission.description;
				view.reward = mission.reward;
				view.addEvent('acceptMission', function() {
					Game.sharedGame()._currentMission = mission;
					__.Engine.hideOverlay();
				});
				self._views.push(view);
			});
			
			var width = 250;
			var maxWidth = width * this._views.length + (this._views.length - 1) * 10;
			
			var x = this.frame.origin.x + FLOOR((this.frame.size.width - maxWidth) / 2.0);
			
			this._views.forEach(function(view) {
				view.frame = CGRectMake(x, 25, view.frame.size.width, view.frame.size.height);
				
				x += width + 10;
			});
		},
		
		render: function(delta, ctx) {
			this.parent(delta, ctx);
			
			this._views.forEach(function(view) {
				view.render(ctx);
			});
		},
		
		mouseDown: function(point) {
			this._views.forEach(function(view) {
				view.mouseDown(point);
			});
		},
		
		mouseMove: function(point) {
			this._views.forEach(function(view) {
				view.mouseMove(point);
			});
		},
		
		mouseUp: function(point) {
			this._views.forEach(function(view) {
				view.mouseUp(point);
			});
		}
	});
	
	var PartButton = new Class({
		Extends: __.Engine.UI.Button,
		
		Attributes: {
			imgSrc: {
				set: function(src) {
					this._img = new Image();
					this._img.src = src;
				},
				
				get: function() {
					if(this._img) {
						return this._img.src;
					}
					
					return "";
				}
			},
			
			title: {
				set: function(title) {
					this._title = title;
					
					this._measureText();
				},
				
				get: function() {
					return this._title;
				}
			},
			
			price: {
				set: function(price) {
					this._price = price;
					
					this._measureText();
				},
				
				get: function() {
					return this._price;
				}
			}
		},
		
		_title: "",
		_price: "",
		_img: null,
		
		_titleMeasurements: null,
		_priceMeasurements: null,
		
		_measureText: function() {
			this.parent();
			
			if(!this._font.loaded) {
				return;
			}
			
			this._titleMeasurements = this._font.measureText(this.title, this.fontSize);
			this._priceMeasurements = this._font.measureText(this.price, this.fontSize);
		},
		
		initialize: function() {
			this.parent(CGRectMake(0, 0, 175, 175));
			
			this.fontSize = 9;
		},
		
		render: function(ctx) {
			CGContextSaveGState(ctx);
			
			var imgRect = CGRectMake(0, 0, this._img.width, this._img.height);
			imgRect.origin.x = this.frame.origin.x + ROUND((this.frame.size.width - imgRect.size.width) / 2.0);
			imgRect.origin.y = this.frame.origin.y + ROUND((this.frame.size.height - imgRect.size.height) / 2.0);
			
			CGContextDrawImage(ctx, imgRect, { _image: this._img });
			
			if(this._font && this._font.loaded) {
				CGContextSetFillColor(ctx, CGColorCreateGenericRGB(1, 1, 1, 1.0));
				
				ctx.font = this.fontSize + "px " + this.font;
				ctx.textBaseline = "top";
				
				var origin = CGPointMakeZero();
				
				if(this._price.toString().length) {
					var textSize = this._priceMeasurements;
					
					var origin = CGPointMake(CGRectGetMinX(this.frame) + ROUND((CGRectGetWidth(this.frame) - textSize.width) / 2.0), CGRectGetMaxY(this.frame) - textSize.height);
					
					ctx.fillText(this._price, origin.x, origin.y - 2);
				}
				
				if(this._title.length) {
					var textSize = this._titleMeasurements;
					
					origin = CGPointMake(CGRectGetMinX(this.frame) + ROUND((CGRectGetWidth(this.frame) - textSize.width) / 2.0), CGRectGetMaxY(this.frame) - textSize.height);
					
					if(this._priceMeasurements) {
						origin.y -= this._priceMeasurements.height + 3;
					}
					
					ctx.fillText(this._title, origin.x, origin.y - 2);
				}
			}
			
			CGContextRestoreGState(ctx);
		}
	});
	
	var PartsOverlay = new Class({
		Extends: __.Engine.Overlay,
		
		_tabs: [],
		_activeTab: "",
		_parts: [],
		
		_mousePosition: null,
		
		_setActiveTab: function(text) {
			var self = this;
			
			this._activeTab = text;
			
			this._parts = [];
			
			Parts[this._activeTab].forEach(function(part) {
				var partButton = new PartButton();
				partButton.price = part.cost;
				partButton.title = part.name;
				partButton.imgSrc = part.image;
				partButton.addEvent('click', function() {
					self._addPart(part);
				});
				self._parts.push(partButton);
			});
			
			var numPartsPerRow = FLOOR(this.frame.size.width / 175);
			var padding = FLOOR((this.frame.size.width - 175 * numPartsPerRow) / (numPartsPerRow + 1));
			
			var x = this.frame.origin.x + padding;
			var y = this.frame.origin.y + 20;
			
			this._parts.forEach(function(part) {
				part.frame.origin.x = x;
				part.frame.origin.y = y;
				x += 175 + padding;
				
				if(x - self.frame.origin.x + 175 + padding > self.frame.size.width) {
					y += 175 + 10;
					x = self.frame.origin.x + padding;
				}
			});
		},
		
		_addPart: function(part) {
			Game.sharedGame()._tempPart = new Part(part);
			
			__.Engine.hideOverlay();
			
			if('mouseMove' in __.Engine._currentScreen) {
				__.Engine._currentScreen.mouseMove(this._mousePosition);
			}
		},
		
		initialize: function(frame) {
			this.parent(frame);
			
			var self = this;
			
			for(var type in Parts) {
				var tab = new __.Engine.UI.Button();
				tab.text = type;
				tab.addEvent("click", function() {
					self._setActiveTab(this.text);
				});
				
				this._tabs.push(tab);
			}
			
			var width = 125;
			var maxWidth = width * this._tabs.length + (this._tabs.length - 1) * 10;
			
			var x = this.frame.origin.x + ROUND((this.frame.size.width - maxWidth) / 2.0);
			
			this._tabs.forEach(function(tab) {
				tab.frame = CGRectMake(x, 10, width, 36);
				
				x += width + 10;
			});
			
			this._setActiveTab(this._tabs[0].text);
		},
		
		render: function(delta, ctx) {
			this.parent(delta, ctx);
			
			this._tabs.forEach(function(button) {
				button.render(ctx);
			});
			
			this._parts.forEach(function(part) {
				part.render(ctx);
			})
		},
		
		mouseDown: function(point) {
			this._tabs.forEach(function(tab) {
				tab.mouseDown(point);
			});
			
			this._parts.forEach(function(part) {
				part.mouseDown(point);
			});
		},
		
		mouseMove: function(point) {
			this._tabs.forEach(function(tab) {
				tab.mouseMove(point);
			});
			
			this._parts.forEach(function(part) {
				part.mouseMove(point);
			});
			
			this._mousePosition = point;
		},
		
		mouseUp: function(point) {
			this._tabs.forEach(function(tab) {
				tab.mouseUp(point);
			});
			
			this._parts.forEach(function(part) {
				part.mouseUp(point);
			});
		}
	});
	
	window.addEventListener('load', function() {
		__.Engine.run(new MainScreen());	
	}, false);
})(window);