(function($) {
	var MainScreen = $.Engine.Screen.extend({
		_startButton: null,
		
		init: function() {
			this._startButton = new $.Engine.UI.Button(CGRectMake(300, 350, 200, 75));
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
		
		init: function() {
			this._menuButton = new $.Engine.UI.Button(CGRectMake(10, 10, 105, 24));
			this._menuButton.text = "Menu";
			
			this._partsButton = new $.Engine.UI.Button(CGRectMake(10, 44, 105, 24));
			this._partsButton.text = "Parts";
			
			this._missionsButton = new $.Engine.UI.Button(CGRectMake(10, 78, 105, 24));
			this._missionsButton.text = "Missions";
		},
		
		render: function(delta, ctx) {
			CGContextSetFillColor(ctx, CGColorCreateGenericRGB(0.1, 0.1, 0.1, 1.0));
			CGContextFillRect(ctx, CGRectMake(0, 0, 125, ctx.canvas.height));
			
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
	
	$.Engine.run(new MainScreen());
})(window);