// Generated by CoffeeScript 1.10.0
(function() {
  (function($) {
    var coverSupported, goToIndex, init, killSlideshow, methods, next, prev, updateCounter;
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
    init = function(options) {
      options = options || {};
      return this.each(function() {
        var $back, $cback, $ccurrent, $cforward, $container, $controls, $counter, $floater, $forward, $this, background_size, counter, current, data, fade, fade_duration, fixed_height, fixed_width, force, gpu, height, images, imgs, interval, l, loop_, lowest, mobile, onSwipe, onTouchStart, origX, origY, slide_selector, slider, slideshow, slimmest, swipe_threshold, width;
        $this = $(this);
        force = options.force || false;
        background_size = options.backgroundSize || false;
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
        fade = options.fade || false;
        gpu = options.gpu || false;
        fade_duration = options.fadeDuration ? (options.fadeDuration / 1000) + 's' : '.2s';
        data = $this.data("gallery");
        images = $(slide_selector, $this);
        imgs = $(slide_selector + ' img', $this);
        l = images.length;
        current = 0;
        lowest = 0;
        slimmest = 0;
        $container = $("<div class=\"aGALLERY-container\" style=\"overflow:hidden;\"></div>");
        $floater = $("<div style=\"position:relative;float:left;width:100%;height:100%;\"></div>");
        $controls = $("<div class=\"aGALLERY-controls\" style=\"position:absolute;top:0;left:0;bottom:0;right:0;font-size:24px;line-height:100%;color:rgba(0,0,0,.12);\"></div>");
        $back = $("<div style=\"position:absolute;top:0;left:0;bottom:0;right:50%;display:none;cursor:w-resize;background:#F00;opacity:0;filter:alpha(opacity=0);\"></div>");
        $forward = $("<div style=\"position:absolute;top:0;left:50%;bottom:0;right:0;display:none;cursor:e-resize;background:#0F0;opacity:0;filter:alpha(opacity=0);\"></div>");
        $counter = $("<div class=\"aGALLERY-counter\" style=\"text-align:left;\">&nbsp;&nbsp;&bull;&nbsp;" + images.length + "</div>");
        $ccurrent = $("<span>" + (current + 1) + "</span>");
        $cback = $("<div style=\"display:inline;margin:0 4px 0 0;cursor:pointer;\"><</div>");
        $cforward = $("<div style=\"display:inline;margin:0 0 0 4px;cursor:pointer;\">></div>");
        if (!force && l < 2) {
          return;
        }
        if (!data) {
          images.each(function() {
            var $image, $img, h, slide_css, src, w;
            $image = $(this);
            $img = $('img', $image);
            slide_css = {};
            if (fade) {
              if (gpu) {
                slide_css.transform = 'translateZ(0)';
              }
              slide_css.transition = 'opacity ' + fade_duration;
            }
            w = $img.attr('width');
            if (w < slimmest || slimmest === 0) {
              slimmest = w;
            }
            h = $img.attr('height');
            if (h < lowest || lowest === 0) {
              lowest = h;
            }
            if (w > 0 && h > 0) {
              $img.attr('width', '');
              $img.attr('height', '');
              if (w < slimmest || slimmest === 0) {
                slimmest = w;
              }
              slide_css['position'] = 'absolute';
            }
            if (background_size && coverSupported()) {
              src = $img.attr('src');
              slide_css['background-image'] = 'url(' + src + ')';
              slide_css['background-size'] = background_size;
              slide_css['background-position'] = 'center';
              slide_css['background-repeat'] = 'no-repeat';
              slide_css['width'] = '100%';
              slide_css['height'] = '100%';
              $img.hide();
            }
            return $image.css(slide_css);
          });
          if (width) {
            $this.css({
              'width': width + 'px'
            });
          } else if (slimmest !== 0) {
            $this.css({
              'width': slimmest + 'px'
            });
          }
          if (height) {
            $this.css({
              'height': height + 'px'
            });
          } else if (lowest !== 0) {
            $this.css({
              'height': lowest + 'px'
            });
          }
          $(slide_selector + ':not(:first)', $this).css('opacity', 0);
          $(slide_selector + ':first', $this).show();
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
            if (l > 1) {
              $forward.show();
            }
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
          $("img", $this).css({
            position: "relative",
            zIndex: "0"
          });
          $container.css({
            width: $this.width()
          });
          $this.wrap($container).wrap($floater);
          $this.after($controls);
          if (counter) {
            $counter.prepend($ccurrent);
            $counter.prepend($cback);
            $counter.append($cforward);
            $this.after($counter);
            $cback.bind('click', function() {
              $this.aGALLERY('prev');
            });
            $cforward.bind('click', function() {
              $this.aGALLERY('next');
            });
          }
          if (slideshow) {
            slider = setInterval(function() {
              $this.aGALLERY('next', false);
            }, interval);
            $this.on('navigating', function() {
              $this.aGALLERY('killSlideshow');
            });
          }
          return $this.data("gallery", {
            target: $this,
            images: images,
            current: current,
            $ccurrent: $ccurrent,
            $back: $back,
            $forward: $forward,
            loop: loop_,
            slider: slider,
            counter: counter,
            slideshow: slideshow,
            counter: counter
          });
        }
      });
    };
    killSlideshow = function() {
      var $this, data;
      $this = $(this);
      data = $this.data('gallery');
      if (data.slider) {
        clearInterval(data.slider);
      }
    };
    goToIndex = function(index, trigger) {
      var $this, data, left, loop_, right, slideshow;
      if (isNaN(index)) {
        return false;
      }
      $this = $(this);
      data = $this.data('gallery');
      loop_ = data.loop;
      slideshow = data.slideshow;
      if (index < 0 || data.images.length < index) {
        return false;
      }
      data.current = index;
      if (trigger) {
        $this.trigger('navigating', data.current);
      }
      $this.trigger('slide', data.current);
      left = data.current;
      right = data.images.length - data.current - 1;
      data.images.css('opacity', 0);
      $(data.images[index]).show().css('opacity', 1);
      if (data.counter) {
        $this.aGALLERY('updateCounter');
      }
      if (left === 0 && (!loop_ && !slideshow)) {
        data.$back.hide();
      } else {
        data.$back.show();
      }
      if (right === 0 && (!loop_ && !slideshow)) {
        data.$forward.hide();
      } else {
        data.$forward.show();
      }
    };
    prev = function(trigger) {
      var $this, data, index, l, left, loop_, slideshow;
      $this = $(this);
      trigger = typeof trigger !== 'undefined' ? trigger : true;
      data = $this.data('gallery');
      l = data.images.length;
      left = data.current;
      loop_ = data.loop;
      slideshow = data.slideshow;
      if (left > 0) {
        index = data.current - 1;
      } else {
        index = (loop_ || slideshow ? l - 1 : data.current);
      }
      $this.aGALLERY('goToIndex', index, trigger);
    };
    next = function(trigger) {
      var $this, data, index, l, left, loop_, slideshow;
      $this = $(this);
      trigger = typeof trigger !== 'undefined' ? trigger : true;
      data = $this.data('gallery');
      l = data.images.length;
      left = data.images.length - data.current - 1;
      loop_ = data.loop;
      slideshow = data.slideshow;
      if (left > 0) {
        index = data.current + 1;
      } else {
        index = (loop_ || slideshow ? 0 : data.current);
      }
      $this.aGALLERY('goToIndex', index, trigger);
    };
    updateCounter = function() {
      var $this, data;
      $this = $(this);
      data = $this.data('gallery');
      data.$ccurrent.text(data.current + 1);
    };
    methods = {
      killSlideshow: killSlideshow,
      goToIndex: goToIndex,
      prev: prev,
      next: next
    };
    $.fn.aGALLERY = function(method) {
      if (methods[method]) {
        methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
      } else if (typeof method === 'object' || !method) {
        init.apply(this, arguments);
      } else {
        $.error("Method " + method + " doesn't exist in aGALLERY");
      }
    };
  })(jQuery);

}).call(this);
