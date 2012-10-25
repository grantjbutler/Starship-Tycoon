(function(__) {
	var Parts = {
		Weapons: [
			{
				name: "Photon Torpedoes",
				image: "img/game_weapon.png",
				cost: 300
			}
		],
		
		Engines: [
			{
				name: "Impulse Engines",
				image: "img/game_thruster.png",
				cost: 100
			},
			{
				name: "Sublight Engines",
				image: "img/game_engine.png",
				cost: 225
			}
		],
	}
	
	var Game = (function() {
		var __GAME = new Class({
			initialize: function() {
				
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
		},
		
		mouseUp: function(point) {
			this._menuButton.mouseUp(point);
			this._partsButton.mouseUp(point);
			this._missionsButton.mouseUp(point);
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
			this.parent(CGRectMake(0, 0, 125, 250));
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
				
				if(this._title.length) {
					
				}
				
				if(this._price.length) {
					var textSize = this._priceMeasurements;
					
					var origin = CGPointMake(CGRectGetMinX(this.frame) + ROUND((CGRectGetWidth(this.frame) - textSize.width) / 2.0), CGRectGetMinY(this.frame) + ROUND((CGRectGetHeight(this.frame) - textSize.height) / 2.0));
					
					ctx.fillText(this.text, origin.x, origin.y - 2);
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
		
		_setActiveTab: function(text) {
			var self = this;
			
			this._activeTab = text;
			
			this._parts = [];
			
			Parts[this._activeTab].forEach(function(part) {
				var partButton = new PartButton();
				partButton.price = part.cost;
				partButton.title = part.name;
				partButton.imgSrc = part.image;
				self._parts.push(partButton);
			});
			
			var numPartsPerRow = FLOOR(this.frame.size.width / 250);
			var padding = FLOOR((this.frame.size.width - 250 * numPartsPerRow) / (numPartsPerRow + 1));
			
			var x = this.frame.origin.x + padding;
			
			this._parts.forEach(function(part) {
				part.frame.origin.x = x;
				x += 250 + padding;
			});
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