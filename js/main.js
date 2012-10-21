(function($) {
	/* Simple JavaScript Inheritance
	 * By John Resig http://ejohn.org/
	 * MIT Licensed.
	 */
	// Inspired by base2 and Prototype
	(function(){
		var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
		// The base Class implementation (does nothing)
		this.Class = function(){};
		
		// Create a new Class that inherits from this class
		Class.extend = function(prop) {
			var _super = this.prototype;
			
			// Instantiate a base class (but only create the instance,
			// don't run the init constructor)
			initializing = true;
			var prototype = new this();
			initializing = false;
			
			// Copy the properties over onto the new prototype
			for (var name in prop) {
				// Check if we're overwriting an existing function
				prototype[name] = typeof prop[name] == "function" && 
				typeof _super[name] == "function" && fnTest.test(prop[name]) ?
				(function(name, fn){
					return function() {
					var tmp = this._super;
					
					// Add a new ._super() method that is the same method
					// but on the super-class
					this._super = _super[name];
					
					// The method only need to be bound temporarily, so we
					// remove it when we're done executing
					var ret = fn.apply(this, arguments);		
					this._super = tmp;
					
					return ret;
					};
				})(name, prop[name]) :
				prop[name];
			}
			
			// The dummy class constructor
			function Class() {
				// All construction is actually done in the init method
				if ( !initializing && this.init )
				this.init.apply(this, arguments);
			}
			
			// Populate our constructed prototype object
			Class.prototype = prototype;
			
			// Enforce the constructor to be what we expect
			Class.prototype.constructor = Class;
		
			// And make this class extendable
			Class.extend = arguments.callee;
			
			return Class;
		};
	})();
	
	$.Engine = {
		_isRunning: false,
		_startTime: $.mozAnimationStartTime || Date.now(),
		_currentScreen: null,
		
		_renderFPS: false,
		_fps: 0,
		_displayedFPS: 0,
		_lastUpdate: (new Date) * 1 - 1,
		
		canvas: null,
		ctx: null,
		
		render: function(timestamp) {
			var delta = timestamp - $.Engine._startTime;
			
			if($.Engine._currentScreen != null) {
				$.Engine._currentScreen.update(delta);
				
				CGContextSaveGState($.Engine.ctx);
				
				CGContextClearRect($.Engine.ctx, CGRectMake(0, 0, $.Engine.ctx.canvas.width, $.Engine.ctx.canvas.height));
				
				$.Engine._currentScreen.render(delta, $.Engine.ctx);
				
				CGContextRestoreGState($.Engine.ctx);
			}
			
			if($.Engine._renderFPS) {
				// RENDER FPS.
				var now = new Date;
				var thisFrameFPS = 1000 / (now - $.Engine._lastUpdate);
				$.Engine._fps += (thisFrameFPS - $.Engine._fps);// / fpsFilter;
				$.Engine._lastUpdate = now;
				
				var ctx = $.Engine.ctx;
				
				ctx.save();
				
				ctx.fillStyle = 'white';
				ctx.fillText($.Engine._displayedFPS.toFixed(1) + "fps", 10, 10);
				
				ctx.restore();
			}
			
			if($.Engine._isRunning) {
				$.Engine.requestAnimationFrame.call($, $.Engine.render);
			}
		},
		
		run: function(baseScreen) {
			if($.location != null) {
				$.Engine._renderFPS = ($.location.hash == '#debug');
			}
			
			$.Engine._isRunning = true;
			
			if(baseScreen != null) {
				$.Engine.setScreen(baseScreen);
			}
			
			$.Engine.canvas = document.getElementById('canvas');
			$.Engine.ctx = $.Engine.canvas.getContext('2d');
			$.Engine.ctx.DOMElement = $.Engine.canvas;
			
			$.addEventListener('keydown', $.Engine.keyDown, false);
			$.addEventListener('keyup', $.Engine.keyUp, false);
			
			$.Engine.canvas.addEventListener('mousedown', $.Engine.mouseDown, false);
			$.Engine.canvas.addEventListener('mousemove', $.Engine.mouseMove, false);
			$.Engine.canvas.addEventListener('mouseup', $.Engine.mouseUp, false);
			
			$.Engine.requestAnimationFrame.call($, $.Engine.render);
			
			if($.Engine._renderFPS) {
				setInterval(function() {
					$.Engine._displayedFPS = $.Engine._fps;
				}, 500);
			}
		},
		
		setScreen: function(screen) {
			$.Engine._currentScreen = screen;
		},
		
		keyDown: function(e) {
			if(e.metaKey) {
				// We don't capture keyboard shortcuts
				return;
			}
			
			if($.Engine._currentScreen == null) {
				return;
			}
		
			if('keyDown' in $.Engine._currentScreen) {
				for(var i = 0, len = e.char.length; i < len; i++) {
					$.Engine._currentScreen.keyDown(e.char.charAt(i));
				}
			}
			
			e.preventDefault();
			e.stopPropagation();
		},
		
		keyUp: function(e) {
			if(e.metaKey) {
				// We don't capture keyboard shortcuts
				return;
			}
			
			if($.Engine._currentScreen == null) {
				return;
			}
			
			if('keyUp' in $.Engine._currentScreen) {
				for(var i = 0, len = e.char.length; i < len; i++) {
					$.Engine._currentScreen.keyUp(e.char.charAt(i));
				}
				
				e.preventDefault();
				e.stopPropagation();
			}
		},
		
		mouseDown: function(e) {
			if(e.metaKey) {
				// We don't capture keyboard shortcuts
				return;
			}
			
			if($.Engine._currentScreen == null) {
				return;
			}
			
			var origin = CGPointMake(e.clientX - e.target.offsetLeft, e.clientY - e.target.offsetTop);
			
			if(e.button == 2) { // Right click
				if('rightMouseDown' in $.Engine._currentScreen) {
					$.Engine._currentScreen.rightMouseDown(origin);
					
					e.preventDefault();
					e.stopPropagation();
				}
			} else if(e.button == 0) { // Left click
				if('mouseDown' in $.Engine._currentScreen) {
					$.Engine._currentScreen.mouseDown(origin);
					
					e.preventDefault();
					e.stopPropagation();
				}
			}
		},
		
		mouseMove: function(e) {
			if(e.metaKey) {
				// We don't capture keyboard shortcuts
				return;
			}
			
			if($.Engine._currentScreen == null) {
				return;
			}
			
			var origin = CGPointMake(e.clientX - e.target.offsetLeft, e.clientY - e.target.offsetTop);
			
			if(e.button == 2) { // Right click
				if('rightMouseMove' in $.Engine._currentScreen) {
					$.Engine._currentScreen.rightMouseMove(origin);
					
					e.preventDefault();
					e.stopPropagation();
				}
			} else if(e.button == 0) { // Left click
				if('mouseMove' in $.Engine._currentScreen) {
					$.Engine._currentScreen.mouseMove(origin);
					
					e.preventDefault();
					e.stopPropagation();
				}
			}
		},
		
		mouseUp: function(e) {
			if(e.metaKey) {
				// We don't capture keyboard shortcuts
				return;
			}
			
			if($.Engine._currentScreen == null) {
				return;
			}
			
			var origin = CGPointMake(e.clientX - e.target.offsetLeft, e.clientY - e.target.offsetTop);
			
			if(e.button == 2) { // Right click
				if('rightMouseUp' in $.Engine._currentScreen) {
					$.Engine._currentScreen.rightMouseUp(origin);
					
					e.preventDefault();
					e.stopPropagation();
				}
			} else if(e.button == 0) { // Left click
				if('mouseUp' in $.Engine._currentScreen) {
					$.Engine._currentScreen.mouseUp(origin);
					
					e.preventDefault();
					e.stopPropagation();
				}
			}
		}
	};
	
	if('mozRequestAnimationFrame' in $) {
		$.Engine.requestAnimationFrame = $.mozRequestAnimationFrame;
	} else if('msRequestAnimationFrame' in $) {
		$.Engine.requestAnimationFrame = $.msRequestAnimationFrame;
	} else if('webkitRequestAnimationFrame' in $) {
		$.Engine.requestAnimationFrame = $.webkitRequestAnimationFrame;
	} else {
		$.Engine.requestAnimationFrame = $.requestAnimationFrame;
	}
	
	$.Engine.Screen = Class.extend({
		render: function(delta, ctx) {
		
		},
		
		update: function(delta) {
			
		}
	});
	
	$.Engine.Overlay = Class.extend({
		render: function(delta, ctx) {
			
		},
		
		update: function(delta) {
			
		}
	});
	
	$.Engine.Events = Class.extend({
		_events: {},
		
		addEventListener: function(event, listener) {
			if(!(event in this._events)) {
				this._events[event] = [];
			}
			
			this._events[event].push(listener);
		},
		
		removeEventListener: function(event, listener) {
			if(!(event in this._events)) {
				return;
			}
			
			var index = this._events[event].indexOf(listener);
			
			if(index != -1) {
				this._events[event].splice(index, 1);
			}
		},
		
		triggerEvent: function(event) {
			if(!(event in this._events)) {
				return;
			}
			
			var args = Array.prototype.slice.call(arguments);
			args.splice(0, 1);
			
			this._events[event].forEach(function(item) {
				item.apply(this, args);
			});
		}
	});
	
	$.Engine.UI = {};
	
	$.Engine.UI.Button = $.Engine.Events.extend({
		frame: CGRectMakeZero(),
		
		_text: "",
		_textMeasurements: { width: 0, height: 0 },
		
		_font: null,
		_fontSize: 18,
		
		highlighted: false,
		hovered: false,
		_mouseDown: false,
		
		_measureText: function() {
			if(!this._font.loaded) {
				return;
			}
			
			this._textMeasurements = this._font.measureText(this.text, this.fontSize);
		},
		
		init: function(frame) {
			this.frame = frame || CGRectMakeZero();
			
			this.font = "Volter";
			this._font.onload = function() {
				this._measureText();
			}.bind(this);
		},
		
		render: function(ctx) {
			CGContextSaveGState(ctx);
			
			// TODO: Replace this with button stylings.
			if(this.highlighted) {
				CGContextSetFillColor(ctx, CGColorCreateGenericRGB(0, 0, 1, 1.0));
			} else if(this.hovered) {
				CGContextSetFillColor(ctx, CGColorCreateGenericRGB(1, 0, 1, 1.0));
			} else {
				CGContextSetFillColor(ctx, CGColorCreateGenericRGB(1, 0, 0, 1.0));
			}
			
			CGContextFillRect(ctx, this.frame);
			
			if(this.text.length && this._font && this._font.loaded) {
				CGContextSetFillColor(ctx, CGColorCreateGenericRGB(0, 0, 0, 1.0));
				
				var textSize = this._textMeasurements;
				
				var origin = CGPointMake(CGRectGetMinX(this.frame) + ROUND((CGRectGetWidth(this.frame) - textSize.width) / 2.0), CGRectGetMinY(this.frame) + ROUND((CGRectGetHeight(this.frame) - textSize.height) / 2.0));
				
				ctx.font = this.fontSize + "px " + this.font;
				ctx.textBaseline = "top";
				ctx.fillText(this.text, origin.x, origin.y - 2);
			}
			
			CGContextRestoreGState(ctx);
		},
		
		mouseMove: function(point) {
			this.hovered = CGRectContainsPoint(this.frame, point);
			
			if(this._mouseDown) {
				this.highlighted = CGRectContainsPoint(CGRectInset(this.frame, -20, -20), point);
			}
		},
		
		mouseDown: function(point) {
			this.highlighted = CGRectContainsPoint(this.frame, point);
			this._mouseDown = true;
		},
		
		mouseUp: function(point) {
			if(this.highlighted && this._mouseDown) {
				this.triggerEvent('clicked');
			}
			
			this._mouseDown = false;
			this.highlighted = false;
		}
	});
	
	Object.defineProperty($.Engine.UI.Button.prototype, 'font', { set: function(newFont) {
		this._font = new Font();
		this._font.fontFamily = newFont;
		this._font.src = this._font.fontFamily;
	}, get: function() {
		return this._font.fontFamily
	}});
	
	Object.defineProperty($.Engine.UI.Button.prototype, 'text', { set: function(text) {
		this._text = text;
		
		this._measureText();
	}, get: function() {
		return this._text;
	}});
	
	Object.defineProperty($.Engine.UI.Button.prototype, 'fontSize', { set: function(size) {
		this._fontSize = size;
		
		this.measureText();
	}, get: function() {
		return this._fontSize;
	}});
})(window);