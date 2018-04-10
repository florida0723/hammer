
var reqAnimationFrame = (function () {
  // https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestAnimationFrame
  return window[Hammer.prefixed(window, 'requestAnimationFrame')] || function (callback) {
      window.setTimeout(callback, 1000 / 60);
  };
})();

(function(){
  var defaults = {
    'translateX': 0,
    'translateY': 0,
	'scale': 1,    // 定义 2D 缩放转换。
	'angle': 0,    // 定义 2D 旋转，在参数 中规定角度。deg
    'ticking': false
  }

  function touch(id, options){

    options = options || {};

    this.el = document.querySelector(id);

    this.opts = Hammer.extend({}, Hammer.extend(defaults, options));

	this.old = Hammer.extend({}, this.opts, true);	// 缓存原始数据

    this.init();

    return this;
  }

  touch.prototype.init = function(){
    var _this = this;

    var handler = new Hammer(this.el);
    handler.get('pinch').set({ enable: true });
    handler.get('rotate').set({ enable: true });

    this.elementUpdate();

	handler.on("panstart panmove", function(ev){
      _this.opts.translateX = parseInt(_this.old.translateX + ev.deltaX);
      _this.opts.translateY = parseInt(_this.old.translateY + ev.deltaY);

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
        _this.initScale = _this.opts.scale || 1;
      }
      _this.opts.scale = _this.initScale * parseFloat(ev.scale);
      _this.elementUpdate();
	});

	handler.on("hammer.input", function(ev) {
      if(ev.isFinal) {
        _this.old.translateX = _this.opts.translateX;
        _this.old.translateY = _this.opts.translateY;
        _this.old.scale = _this.opts.scale;
        _this.old.angle = _this.opts.angle;

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
      'translate(' + this.opts.translateX + 'px, ' + this.opts.translateY + 'px)',
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
