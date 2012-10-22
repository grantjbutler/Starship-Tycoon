(function($) {
	
	var Game = (function() {
		var __GAME = Class.extend({
			init: function() {
				
			}
		});
		
		__SHARED_GAME = null;
		
		__GAME.sharedGame = function() {
			if(__SHARED_GAME == null) {
				__SHARED_GAME = new __GAME();
			}
		};
		
		return __GAME;
	})();
	
	var MainScreen = $.Engine.Screen.extend({
		_startButton: null,
		
		init: function() {
			this._startButton = new $.Engine.UI.Button(CGRectMake(300, 350, 200, 63));
			this._startButton.text = "Start Game";
			this._startButton.addEventListener('clicked', function() {
				$.Engine.setScreen(new GameScreen());
			});
		},
		
		render: function(delta, ctx) {
			// TODO: Replace this with image.
			var rect = CGRectMake(0, 0, ctx.canvas.width, ctx.canvas.height);
			CGContextSetFillColor(ctx, CGColorCreateGenericRGB(0, 1, 0, 1.0));
			CGContextFillRect(ctx, rect);
			
			ctx.font = '45px Volter';
			var textSize = ctx.measureText('Starship Tycoon');
			var textOrigin = CGPointMake(rect.origin.x + ROUND((rect.size.width - textSize.width) / 2.0), 60);
			CGContextSetFillColor(ctx, CGColorCreateGenericRGB(0, 0, 1, 1.0));
			
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
	
	var GameScreen = $.Engine.Screen.extend({
		_menuButton: null,
		_partsButton: null,
		_missionsButton: null,
		
		_background: null,
		
		_grid: [],
		
		init: function() {
			this._menuButton = new $.Engine.UI.Button(CGRectMake(10, 10, 125, 35));
			this._menuButton.text = "Menu";
			
			this._partsButton = new $.Engine.UI.Button(CGRectMake(10, 55, 125, 35));
			this._partsButton.text = "Parts";
			
			this._missionsButton = new $.Engine.UI.Button(CGRectMake(10, 100, 125, 35));
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
	
	window.addEventListener('load', function() {
		$.Engine.run(new MainScreen());	
	}, false);
})(window);