
var reqAnimationFrame = (function () {
  // https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestAnimationFrame
  return window[Hammer.prefixed(window, 'requestAnimationFrame')] || function (callback) {
      window.setTimeout(callback, 1000 / 60);
  };
})();

(function(){
  var defaults = {
    'transform': {
      'translate': {    // 定义 2D 转换。
        'x': 0,
        'y': 0
      },
      'scale': {    // 定义 2D 缩放转换。
        'x': 1,
        'y': 1
      },
      'angle': 0    // 定义 2D 旋转，在参数中规定角度。deg
    },
    ticking: false
  }
  
  function touch(id, options){
    
    this.options = options || {};
    
    this.opts = Hammer.extend(defaults, this.options, true);
    
    this.x = this.opts.transform.translate.x;
    this.y = this.opts.transform.translate.y;
    
    this.el = document.querySelector(id);
    
    this.init();
    
    this.elementUpdate();
  }
  
  touch.prototype.init = function(){
    var _this = this;
    
    var mc = new Hammer(this.el);
    mc.get('pinch').set({ enable: true });
    mc.get('rotate').set({ enable: true });
    
    mc.on("panstart panmove", function(ev){
      _this.el.className = '';
      _this.opts.transform.translate.x += parseInt(ev.deltaX);
      _this.opts.transform.translate.y += parseInt(ev.deltaY);
      
      _this.opts.transform.translate = {
        x: _this.x + ev.deltaX,
        y: _this.y + ev.deltaY
      };
      _this.elementUpdate();
    });
    
    //mc.on("rotatestart rotatemove", onRotate);
    //mc.on("pinchstart pinchmove", onPinch);
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
    console.log(_this);
    var value = [
      'translate(' + this.opts.transform.translate.x + 'px, ' + this.opts.transform.translate.y + 'px)',
      'scale(' + this.opts.transform.scale.x + ', ' + this.opts.transform.scale.y + ')',
      'rotate('+ this.opts.transform.angle + 'deg)'
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