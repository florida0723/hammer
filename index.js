
var reqAnimationFrame = (function () {
  // https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestAnimationFrame
  return window[Hammer.prefixed(window, 'requestAnimationFrame')] || function (callback) {
      window.setTimeout(callback, 1000 / 60);
  };
})();

(function(){
  var defaults = {
    'translate': {    // 定义 2D 转换。
		'x': 0,
		'y': 0
	},
	'scale': 1,    // 定义 2D 缩放转换。
	'angle': 0,    // 定义 2D 旋转，在参数 中规定角度。deg
    'ticking': false
  }
  
  function touch(id, options){
    
    options = options || {};
	  
    this.el = document.querySelector(id);
    
    this.opts = Hammer.extend(defaults, options);
	
	this.old = Hammer.extend({}, this.opts);	// 缓存原始数据
	
    this.init();
  }
  
  touch.prototype.init = function(){
    var _this = this;
    
    var handler = new Hammer(this.el);
    handler.get('pinch').set({ enable: true });
    handler.get('rotate').set({ enable: true });
    
    this.elementUpdate();
    
	handler.on("panstart panmove", function(ev){
		console.log(_this.opts.translate);
      _this.opts.translate.x += parseInt(ev.deltaX);
      _this.opts.translate.y += parseInt(ev.deltaY);
      
      _this.opts.translate = {
        x: parseInt(_this.old.translate.x + ev.deltaX),
        y: parseInt(_this.old.translate.y + ev.deltaY)
      };
      _this.elementUpdate();
    });
    
	this.initAngle = 0;
    handler.on("rotatestart rotatemove", function(ev){
	  if(ev.type == 'rotatestart') {
        _this.initAngle = _this.opts.angle || 0;
      }
      _this.opts.angle = _this.initAngle + parseFloat(ev.rotation);
      _this.elementUpdate();
	});
    
	this.initScale = 1;
	handler.on("pinchstart pinchmove", function(ev){
	  if(ev.type == 'pinchstart') {
        _thisinitScale = _this.opts.scale || 1;
      }

      _this.opts.scale = _this.initScale * parseFloat(ev.scale);

      _this.elementUpdate();
	});
	
	handler.on("hammer.input", function(ev) {
      if(ev.isFinal) {
        _this.old.translate.x = _this.opts.translate.x;
        _this.old.translate.y = _this.opts.translate.y;
        
        _this.updateElementTransform();
      }
    });  
  };
  
  touch.prototype.elementUpdate = function(){
    var _this = this;
    if(!this.opts.ticking) {
      reqAnimationFrame(_this.updateElementTransform.bind(this));
      this.opts.ticking = true;
    }
  };
  
  touch.prototype.updateElementTransform = function(){
    var _this = this;
	
    var value = [
      'translate(' + this.opts.translate.x + 'px, ' + this.opts.translate.y + 'px)',
      'scale(' + this.opts.scale + ', ' + this.opts.scale + ')',
      'rotate('+ this.opts.angle + 'deg)'
    ];

    value = value.join(" ");
    
    _this.el.textContent = value;
    _this.el.style.webkitTransform = value;
    _this.el.style.mozTransform = value;
    _this.el.style.transform = value;
    
    _this.opts.ticking = false;
  };
  
  window['touch'] = touch;
})()