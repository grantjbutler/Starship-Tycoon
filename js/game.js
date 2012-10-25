(function(__) {
	var Part = new Class({
		size: CGSizeMakeZero(),
		origin: CGPointMakeZero(),
		
		_image: null,
		
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
				size: CGSizeMake(2, 1)
			},
			{
				name: "Lasers",
				image: "img/game_weapon1.png",
				cost: 150,
				size: CGSizeMake(2, 1)
			}
		],
		
		Engines: [
			{
				name: "Impulse Engines",
				image: "img/game_thruster.png",
				cost: 100,
				size: CGSizeMake(2, 1)
			},
			{
				name: "Sublight Engines",
				image: "img/game_engine.png",
				cost: 225,
				size: CGSizeMake(2, 1)
			},
			{
				name: "Thrusters",
				image: "img/game_thruster2.png",
				cost: 150,
				size: CGSizeMake(2, 2)
			}
		],
	}
	
	var Game = (function() {
		var __GAME = new Class({
			_parts: [],
			_tempPart: null,
			_currency: 1000,
			
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
			
			this._background = new Image();
			this._background.src = "img/game_background.png";
		},
		
		render: function(delta, ctx) {
			CGContextDrawImage(ctx, CGRectMake(0, 0, 800, 600), { _image: this._background });
			
			CGContextSaveGState(ctx);
				
			CGContextTranslateCTM(ctx, 161, 13);
			
			console.log(Game.sharedGame()._parts);
			
			Game.sharedGame()._parts.forEach(function(part) {
				console.log(part);
				
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
		},
		
		mouseDown: function(point) {
			this._menuButton.mouseDown(point);
			this._partsButton.mouseDown(point);
			this._missionsButton.mouseDown(point);
		},
		
		mouseMove: function(point) {
			this._menuButton.mouseMove(point);
			this._partsButton.mouseMove(point);
			this._missionsButton.mouseMove(point);
			
			this._mousePosition = point;
		},
		
		mouseUp: function(point) {
			this._menuButton.mouseUp(point);
			this._partsButton.mouseUp(point);
			this._missionsButton.mouseUp(point);
			
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
			this.parent(CGRectMake(0, 0, 125, 175));
			
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
			
			var numPartsPerRow = FLOOR(this.frame.size.width / 250);
			var padding = FLOOR((this.frame.size.width - 250 * numPartsPerRow) / (numPartsPerRow + 1));
			
			var x = this.frame.origin.x + padding;
			var y = this.frame.origin.y + 10;
			
			this._parts.forEach(function(part) {
				part.frame.origin.x = x;
				part.frame.origin.y = y;
				x += 125 + padding;
				
				if(x - self.frame.origin.x > self.frame.size.width) {
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