(function(__) {
	__.Engine = {
		_isRunning: false,
		_startTime: __.mozAnimationStartTime || Date.now(),
		_currentScreen: null,
		_currentOverlay: null,
		
		_renderFPS: false,
		_fps: 0,
		_displayedFPS: 0,
		_lastUpdate: (new Date) * 1 - 1,
		
		canvas: null,
		ctx: null,
		
		render: function(timestamp) {
			var delta = timestamp - __.Engine._startTime;
			
			if(__.Engine._currentScreen != null) {
				__.Engine._currentScreen.update(delta);
				
				CGContextSaveGState(__.Engine.ctx);
				
				CGContextClearRect(__.Engine.ctx, CGRectMake(0, 0, __.Engine.ctx.canvas.width, __.Engine.ctx.canvas.height));
				
				__.Engine._currentScreen.render(delta, __.Engine.ctx);
				
				CGContextRestoreGState(__.Engine.ctx);
			}
			
			if(__.Engine._currentOverlay != null) {
				__.Engine._currentOverlay.update(delta);
				
				CGContextSaveGState(__.Engine.ctx);
				
				__.Engine._currentOverlay.render(delta, __.Engine.ctx);
				
				CGContextRestoreGState(__.Engine.ctx);
			}
			
			if(__.Engine._renderFPS) {
				// RENDER FPS.
				var now = new Date;
				var thisFrameFPS = 1000 / (now - __.Engine._lastUpdate);
				__.Engine._fps += (thisFrameFPS - __.Engine._fps);// / fpsFilter;
				__.Engine._lastUpdate = now;
				
				var ctx = __.Engine.ctx;
				
				CGContextSaveGState(ctx);
				
				ctx.fillStyle = 'white';
				ctx.textBaseline = "top";
				ctx.fillText(__.Engine._displayedFPS.toFixed(1) + "fps", 10, 5);
				
				CGContextRestoreGState(ctx);
			}
			
			if(__.Engine._isRunning) {
				__.Engine.requestAnimationFrame.call(__, __.Engine.render);
			}
		},
		
		run: function(baseScreen) {
			if(__.location != null) {
				__.Engine._renderFPS = (__.location.hash == '#debug');
			}
			
			__.Engine._isRunning = true;
			
			if(baseScreen != null) {
				__.Engine.setScreen(baseScreen);
			}
			
			__.Engine.canvas = document.getElementById('canvas');
			__.Engine.ctx = __.Engine.canvas.getContext('2d');
			__.Engine.ctx.DOMElement = __.Engine.canvas;
			
			__.addEventListener('keydown', __.Engine.keyDown, false);
			__.addEventListener('keyup', __.Engine.keyUp, false);
			
			__.Engine.canvas.addEventListener('mousedown', __.Engine.mouseDown, false);
			__.Engine.canvas.addEventListener('mousemove', __.Engine.mouseMove, false);
			__.Engine.canvas.addEventListener('mouseup', __.Engine.mouseUp, false);
			
			__.Engine.requestAnimationFrame.call(__, __.Engine.render);
			
			if(__.Engine._renderFPS) {
				setInterval(function() {
					__.Engine._displayedFPS = __.Engine._fps;
				}, 500);
			}
		},
		
		setScreen: function(screen) {
			__.Engine._currentScreen = screen;
		},
		
		showOverlay: function(overlay) {
			__.Engine._currentOverlay = overlay;
		},
		
		hideOverlay: function() {
			__.Engine._currentOverlay = null;
		},
		
		keyDown: function(e) {
			if(e.metaKey) {
				// We don't capture keyboard shortcuts
				return;
			}
			
			if(__.Engine._currentScreen == null) {
				return;
			}
			
			var firstResponder = __.Engine._currentOverlay || __.Engine._currentScreen;
		
			if('keyDown' in firstResponder) {
				for(var i = 0, len = e.char.length; i < len; i++) {
					firstResponder.keyDown(e.char.charAt(i));
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
			
			if(__.Engine._currentScreen == null) {
				return;
			}
			
			var firstResponder = __.Engine._currentOverlay || __.Engine._currentScreen;
			
			if('keyUp' in firstResponder) {
				for(var i = 0, len = e.char.length; i < len; i++) {
					firstResponder.keyUp(e.char.charAt(i));
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
			
			if(__.Engine._currentScreen == null) {
				return;
			}
			
			var origin = CGPointMake(e.clientX - e.target.offsetLeft, e.clientY - e.target.offsetTop);
			
			var firstResponder = __.Engine._currentScreen;
			
			if(__.Engine._currentOverlay && CGRectContainsPoint(__.Engine._currentOverlay.frame, origin)) {
				firstResponder = __.Engine._currentOverlay;
			}
			
			if(e.button == 2) { // Right click
				if('rightMouseDown' in firstResponder) {
					firstResponder.rightMouseDown(origin);
					
					e.preventDefault();
					e.stopPropagation();
				}
			} else if(e.button == 0) { // Left click
				if('mouseDown' in firstResponder) {
					firstResponder.mouseDown(origin);
					
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
			
			if(__.Engine._currentScreen == null) {
				return;
			}
			
			var origin = CGPointMake(e.clientX - e.target.offsetLeft, e.clientY - e.target.offsetTop);
			
			var firstResponder = __.Engine._currentScreen;
			
			if(__.Engine._currentOverlay && CGRectContainsPoint(__.Engine._currentOverlay.frame, origin)) {
				firstResponder = __.Engine._currentOverlay;
			}
			
			if(e.button == 2) { // Right click
				if('rightMouseMove' in firstResponder) {
					firstResponder.rightMouseMove(origin);
					
					e.preventDefault();
					e.stopPropagation();
				}
			} else if(e.button == 0) { // Left click
				if('mouseMove' in firstResponder) {
					firstResponder.mouseMove(origin);
					
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
			
			if(__.Engine._currentScreen == null) {
				return;
			}
			
			var origin = CGPointMake(e.clientX - e.target.offsetLeft, e.clientY - e.target.offsetTop);
			
			var firstResponder = __.Engine._currentScreen;
			
			if(__.Engine._currentOverlay && CGRectContainsPoint(__.Engine._currentOverlay.frame, origin)) {
				firstResponder = __.Engine._currentOverlay;
			}
						
			if(e.button == 2) { // Right click
				if('rightMouseUp' in firstResponder) {
					firstResponder.rightMouseUp(origin);
					
					e.preventDefault();
					e.stopPropagation();
				}
			} else if(e.button == 0) { // Left click
				if('mouseUp' in firstResponder) {
					firstResponder.mouseUp(origin);
					
					e.preventDefault();
					e.stopPropagation();
				}
			}
		}
	};
	
	if('mozRequestAnimationFrame' in __) {
		__.Engine.requestAnimationFrame = __.mozRequestAnimationFrame;
	} else if('msRequestAnimationFrame' in __) {
		__.Engine.requestAnimationFrame = __.msRequestAnimationFrame;
	} else if('webkitRequestAnimationFrame' in __) {
		__.Engine.requestAnimationFrame = __.webkitRequestAnimationFrame;
	} else {
		__.Engine.requestAnimationFrame = __.requestAnimationFrame;
	}
	
	__.Engine.Screen = new Class({
		render: function(delta, ctx) {
		
		},
		
		update: function(delta) {
			
		}
	});
	
	__.Engine.Overlay = new Class({
		frame: CGRectMakeZero(),
		
		initialize: function(frame) {
			this.frame = frame || CGRectMakeZero();
		},
		
		render: function(delta, ctx) {
			if(CGRectIsEmpty(this.frame)) {
				return;
			}
			
			CGContextSaveGState(ctx);
			
			CGContextSetFillColor(ctx, CGColorCreateGenericRGB(0.0, 0.0, 0.0, 0.5));
			CGContextFillRect(ctx, this.frame);
			
			CGContextRestoreGState(ctx);
		},
		
		update: function(delta) {
			
		}
	});
	
	__.Engine.UI = {};
	
	__.Engine.UI.Button = new Class({
		Implements: [Events],
		
		frame: CGRectMakeZero(),
		
		_text: "",
		_textMeasurements: { width: 0, height: 0 },
		
		_font: null,
		_fontSize: 18,
		
		highlighted: false,
		hovered: false,
		disabled: false,
		_mouseDown: false,
		
		_buttonBG: null,
		_buttonBGSelected: null,
		
		Attributes: {
			font: {
				set: function(newFont) {
					this._font = new Font();
					this._font.fontFamily = newFont;
					this._font.src = this._font.fontFamily;
					this._font.onload = (function() {
						this._measureText();
					}.bind(this));
				},
				get: function() {
					return this._font.fontFamily;
				}
			},
			
			text: {
				set: function(text) {
					this._text = text;
					
					this._measureText();
				},
				
				get: function() {
					return this._text;
				}
			},
			
			fontSize: {
				set: function(size) {
					this._fontSize = size;
					
					this._measureText();
				},
				
				get: function() {
					return this._fontSize;
				}
			}
		},
		
		_measureText: function() {
			if(!this._font.loaded) {
				return;
			}
			
			this._textMeasurements = this._font.measureText(this.text, this.fontSize);
		},
		
		initialize: function(frame) {
			this.frame = frame || CGRectMakeZero();
			
			this.font = "Volter";
			
			this._buttonBG = new Image();
			this._buttonBG.src = "img/game_button.png";
			
			this._buttonBGSelected = new Image();
			this._buttonBGSelected.src = "img/game_button_pressed.png";
		},
		
		render: function(ctx) {
			CGContextSaveGState(ctx);
			
			// TODO: Replace this with button stylings.
			var img = this._buttonBG;
			
			if(this.highlighted) {
				img = this._buttonBGSelected;
			}
			
			if(this.disabled) {
				CGContextSetAlpha(ctx, 0.5);
			}
			
			ctx.drawImage(img, 0, 0, 12, img.height, this.frame.origin.x, this.frame.origin.y, 12, this.frame.size.height);
			ctx.drawImage(img, img.width - 12, 0, 12, img.height, this.frame.origin.x + this.frame.size.width - 12, this.frame.origin.y, 12, this.frame.size.height);
			CGContextDrawTiledImage(ctx, CGRectMake(13, 0, 1, img.height), CGRectInset(this.frame, 12, 0), img);
			
			if(this.text.length && this._font && this._font.loaded) {
				CGContextSetFillColor(ctx, CGColorCreateGenericRGB(1, 1, 1, 1.0));
				
				var textSize = this._textMeasurements;
				
				var origin = CGPointMake(CGRectGetMinX(this.frame) + ROUND((CGRectGetWidth(this.frame) - textSize.width) / 2.0), CGRectGetMinY(this.frame) + ROUND((CGRectGetHeight(this.frame) - textSize.height) / 2.0));
				
				ctx.font = this.fontSize + "px " + this.font;
				ctx.textBaseline = "top";
				ctx.fillText(this.text, origin.x, origin.y - 2);
			}
			
			CGContextRestoreGState(ctx);
		},
		
		mouseMove: function(point) {
			if(this.disabled) {
				return;
			}
			
			this.hovered = CGRectContainsPoint(this.frame, point);
			
			if(this._mouseDown) {
				this.highlighted = CGRectContainsPoint(CGRectInset(this.frame, -20, -20), point);
			}
		},
		
		mouseDown: function(point) {
			if(this.disabled) {
				return;
			}
			
			this.highlighted = CGRectContainsPoint(this.frame, point);
			this._mouseDown = true;
		},
		
		mouseUp: function(point) {
			if(this.disabled) {
				return;
			}
			
			if(this.highlighted && this._mouseDown) {
				this.fireEvent('click');
			}
			
			this._mouseDown = false;
			this.highlighted = false;
		}
	});
})(window);