// Generated by CoffeeScript 1.8.0
(function() {
  (function($) {
    var coverSupported, methods;
    coverSupported = function() {
      var supported, temp;
      supported = 'backgroundSize' in document.documentElement.style;
      if (supported) {
        temp = document.createElement('div');
        temp.style.backgroundSize = 'cover';
        supported = temp.style.backgroundSize === 'cover';
      }
      return supported;
    };
    methods = {
      init: function(options) {
        options = options || {};
        return this.each(function() {
          var $back, $cback, $ccurrent, $cforward, $container, $controls, $counter, $floater, $forward, $this, counter, cover, current, data, fixed_height, fixed_width, h, height, i, images, imgs, interval, l, loop_, lowest, mobile, onSwipe, onTouchStart, origX, origY, slide_selector, slider, slideshow, slimmest, swipe_threshold, w, width;
          $this = $(this);
          cover = options.cover || false;
          mobile = options.mobile || false;
          swipe_threshold = options.swipeThreshold || 20;
          counter = options.counter || false;
          loop_ = options.loop || false;
          slideshow = options.slideshow || false;
          interval = options.interval || 4000;
          width = options.width || false;
          height = options.height || false;
          fixed_width = options.fixedWidth || false;
          fixed_height = options.fixedHeight || false;
          slide_selector = options.slideSelector || '.image';
          data = $this.data("gallery");
          images = $(slide_selector, $this);
          imgs = $(slide_selector + ' img', $this);
          l = images.length;
          current = 0;
          $container = $("<div class=\"aGALLERY-container\" style=\"overflow:hidden;\"></div>");
          $floater = $("<div style=\"position:relative;float:left;width:100%;height:100%;\"></div>");
          $controls = $("<div style=\"position:absolute;top:0;left:0;bottom:0;right:0;font-size:24px;line-height:100%;color:rgba(0,0,0,.12);\"></div>");
          $back = $("<div style=\"position:absolute;top:0;left:0;bottom:0;right:50%;display:none;cursor:w-resize;background:#F00;opacity:0;filter:alpha(opacity=0);\"></div>");
          $forward = $("<div style=\"position:absolute;top:0;left:50%;bottom:0;right:0;cursor:e-resize;background:#0F0;opacity:0;filter:alpha(opacity=0);\"></div>");
          $counter = $("<div class=\"aGALLERY-counter\" style=\"text-align:left;\">&nbsp;&nbsp;&bull;&nbsp;" + images.length + "</div>");
          $ccurrent = $("<span>" + (current + 1) + "</span>");
          $cback = $("<div style=\"display:inline;margin:0 4px 0 0;cursor:pointer;\"><</div>");
          $cforward = $("<div style=\"display:inline;margin:0 0 0 4px;cursor:pointer;\">></div>");
          if (l > 1) {
            if (!data) {
              if (cover && coverSupported()) {
                images.each(function() {
                  var $image, $img, src;
                  $image = $(this);
                  $img = $('img', $image);
                  src = $img.attr('src');
                  $image.css({
                    'background-image': 'url(' + src + ')',
                    'background-size': 'cover',
                    'background-position': 'center',
                    'width': '100%',
                    'height': '100%'
                  });
                  return $img.hide();
                });
              }
              $(".image:not(:first)", $this).hide();
              if (mobile) {
                onTouchStart = function(e) {
                  var origX, touch;
                  touch = e.originalEvent.touches[0];
                  origX = touch.pageX;
                  $this.on("touchmove", onSwipe);
                };
                onSwipe = function(e) {
                  var dx, touch, x;
                  touch = e.originalEvent.touches[0];
                  x = touch.pageX;
                  dx = origX - x;
                  if (Math.abs(dx) >= swipe_threshold) {
                    if (dx > 0) {
                      $this.aGALLERY("next");
                    } else {
                      $this.aGALLERY("prev");
                    }
                  }
                };
                origX = void 0;
                origY = void 0;
                if ("ontouchstart" in document.documentElement) {
                  $this.on("touchstart", onTouchStart);
                }
              } else {
                $back.html("back");
                $forward.html("forward");
                $controls.append($back);
                $controls.append($forward);
                $("div", $controls).bind("mouseenter", function() {
                  $(this).css("color", "rgba(124,0,0,.64)");
                }).bind("mouseleave", function() {
                  $(this).css("color", "");
                });
                $back.bind("click", function() {
                  $this.aGALLERY("prev");
                });
                $forward.bind("click", function() {
                  $this.aGALLERY("next");
                });
                $controls.bind("mouseenter", function() {
                  $(document).bind("keydown", function(e) {
                    e.preventDefault();
                    switch (e.which) {
                      case 39:
                        return $this.aGALLERY("next");
                      case 37:
                        return $this.aGALLERY("prev");
                    }
                  });
                }).bind("mouseleave", function() {
                  $(document).unbind("keydown");
                });
              }
              if (width) {
                console.log(width);
                imgs.css("width", width + "px");
              } else if (fixed_width) {
                i = l;
                slimmest = 0;
                while (i--) {
                  w = $(imgs[i]).width();
                  if (w < slimmest || slimmest === 0) {
                    slimmest = w;
                  }
                }
                imgs.css("width", slimmest + "px");
              }
              if (height) {
                console.log(width);
                imgs.css("height", height + "px");
              } else if (fixed_height) {
                i = l;
                lowest = 0;
                while (i--) {
                  h = $(imgs[i]).height();
                  if (h < lowest || lowest === 0) {
                    lowest = h;
                  }
                }
                imgs.css("height", lowest + "px");
              }
              $("img", $this).css({
                position: "relative",
                zIndex: "0"
              });
              $container.css({
                width: '100%'
              });
              $this.wrap($container).wrap($floater);
              $this.after($controls);
              if (counter) {
                $counter.prepend($ccurrent);
                $counter.prepend($cback);
                $counter.append($cforward);
                $this.after($counter);
                $cback.bind("click", function() {
                  $this.aGALLERY("prev");
                  $this.trigger("navigating");
                });
                $cforward.bind("click", function() {
                  $this.aGALLERY("next");
                  $this.trigger("navigating");
                });
              }
              if (slideshow) {
                slider = setInterval(function() {
                  $this.aGALLERY("next");
                }, interval);
              }
              $this.on("navigating", function() {
                if (slider) {
                  clearInterval(slider);
                }
                if (counter) {
                  $this.aGALLERY("updateCounter");
                }
              });
              $this.data("gallery", {
                target: $this,
                images: images,
                current: current,
                $ccurrent: $ccurrent,
                $back: $back,
                $forward: $forward,
                loop: loop_,
                slideshow: slideshow,
                counter: counter
              });
            }
          }
        });
      },
      prev: function() {
        var $this, data, l, left, loop_, slideshow;
        $this = $(this);
        data = $this.data("gallery");
        l = data.images.length;
        left = data.current;
        loop_ = data.loop;
        slideshow = data.slideshow;
        if (left > 0) {
          data.current = data.current - 1;
        } else {
          data.current = (loop_ || slideshow ? l - 1 : data.current);
        }
        data.images.hide();
        $(data.images[data.current]).show();
        $this.trigger("navigating");
        data.$forward.show();
        if (left === 1 && (!loop_ && !slideshow)) {
          data.$back.hide();
        }
      },
      next: function() {
        var $this, data, l, left, loop_, slideshow;
        $this = $(this);
        data = $this.data("gallery");
        l = data.images.length;
        left = data.images.length - data.current - 1;
        loop_ = data.loop;
        slideshow = data.slideshow;
        if (left > 0) {
          data.current = data.current + 1;
        } else {
          data.current = (loop_ || slideshow ? 0 : data.current);
        }
        data.images.hide();
        $(data.images[data.current]).show();
        $this.trigger("navigating");
        data.$back.show();
        if (left === 1 && (!loop_ && !slideshow)) {
          data.$forward.hide();
        }
      },
      updateCounter: function() {
        var $this, data;
        $this = $(this);
        data = $this.data("gallery");
        data.$ccurrent.text(data.current + 1);
      }
    };
    $.fn.aGALLERY = function(method) {
      if (methods[method]) {
        methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
      } else if (typeof method === "object" || !method) {
        methods.init.apply(this, arguments);
      } else {
        $.error("Method " + method + " doesn't exist in aGALLERY");
      }
    };
  })(jQuery);

}).call(this);
