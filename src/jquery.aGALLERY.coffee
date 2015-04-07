(($) ->

  coverSupported = ->
    supported = 'backgroundSize' of document.documentElement.style
    if supported
      temp = document.createElement 'div'
      temp.style.backgroundSize = 'cover'
      supported = temp.style.backgroundSize == 'cover'
    return supported

  methods =
    init: (options) ->
      options = options or {}
      @each ->
        $this = $(this)
        force = options.force or false
        background_size = options.backgroundSize or false
        mobile = options.mobile or false
        swipe_threshold = options.swipeThreshold or 20
        counter = options.counter or false
        loop_ = options.loop or false
        slideshow = options.slideshow or false
        interval = options.interval or 4000
        width = options.width or false
        height = options.height or false
        fixed_width = options.fixedWidth or false
        fixed_height = options.fixedHeight or false
        slide_selector = options.slideSelector or '.image'
        data = $this.data("gallery")
        images = $(slide_selector, $this)
        imgs = $(slide_selector+' img', $this)
        l = images.length
        current = 0
        
        # $container = $('<div style="position:relative;overflow:hidden;"></div>'),
        # $floater = $('<div style="position:relative;float:left;width:100%;"></div>'),
        $container = $("<div class=\"aGALLERY-container\" style=\"overflow:hidden;\"></div>")
        $floater = $("<div style=\"position:relative;float:left;width:100%;height:100%;\"></div>")
        $controls = $("<div style=\"position:absolute;top:0;left:0;bottom:0;right:0;font-size:24px;line-height:100%;color:rgba(0,0,0,.12);\"></div>")
        $back = $("<div style=\"position:absolute;top:0;left:0;bottom:0;right:50%;display:none;cursor:w-resize;background:#F00;opacity:0;filter:alpha(opacity=0);\"></div>")
        $forward = $("<div style=\"position:absolute;top:0;left:50%;bottom:0;right:display:none;0;cursor:e-resize;background:#0F0;opacity:0;filter:alpha(opacity=0);\"></div>")
        $counter = $("<div class=\"aGALLERY-counter\" style=\"text-align:left;\">&nbsp;&nbsp;&bull;&nbsp;" + images.length + "</div>")
        $ccurrent = $("<span>" + (current + 1) + "</span>")
        $cback = $("<div style=\"display:inline;margin:0 4px 0 0;cursor:pointer;\"><</div>")
        $cforward = $("<div style=\"display:inline;margin:0 0 0 4px;cursor:pointer;\">></div>")
        
        if not force and l > 1 then return false
        # if not already initialised
        unless data
          if background_size && coverSupported()
            images.each ->
              $image = $(this)
              $img = $('img',$image)
              src = $img.attr('src')
              $image.css
                'background-image': 'url('+src+')'
                'background-size': background_size
                'background-position': 'center'
                'background-repeat': 'no-repeat'
                'width': '100%'
                'height': '100%'
              $img.hide()

          $(".image:not(:first)", $this).hide()
          if mobile
            onTouchStart = (e) ->
              touch = e.originalEvent.touches[0]
              origX = touch.pageX
              $this.on "touchmove", onSwipe
              return
            onSwipe = (e) ->
              touch = e.originalEvent.touches[0]
              x = touch.pageX
              dx = origX - x
              if Math.abs(dx) >= swipe_threshold
                if dx > 0
                  $this.aGALLERY "next"
                else
                  $this.aGALLERY "prev"
              return
            origX = undefined
            origY = undefined
            $this.on "touchstart", onTouchStart if "ontouchstart" of document.documentElement
          else
            $back.html "back"
            $forward.html "forward"
            $controls.append $back
            $controls.append $forward
            if l > 1 then $forward.show()
            $("div", $controls).bind("mouseenter", ->
              $(this).css "color", "rgba(124,0,0,.64)"
              return
            ).bind "mouseleave", ->
              $(this).css "color", ""
              return

            $back.bind "click", ->
              $this.aGALLERY "prev"
              return

            $forward.bind "click", ->
              $this.aGALLERY "next"
              return

            $controls.bind("mouseenter", ->
              $(document).bind "keydown", (e) ->
                e.preventDefault()
                switch e.which
                  when 39
                    $this.aGALLERY "next"
                  when 37
                    $this.aGALLERY "prev"

              return
            ).bind "mouseleave", ->
              $(document).unbind "keydown"
              return

          if width
            console.log width
            imgs.css "width", width + "px"
          else if fixed_width
            i = l
            slimmest = 0
            while i--
              w = $(imgs[i]).width()
              slimmest = w  if w < slimmest or slimmest is 0
            imgs.css "width", slimmest + "px"
          if height
            console.log width
            imgs.css "height", height + "px"
          else if fixed_height
            i = l
            lowest = 0
            while i--
              h = $(imgs[i]).height()
              lowest = h  if h < lowest or lowest is 0
            imgs.css "height", lowest + "px"
          $("img", $this).css
            position: "relative"
            zIndex: "0"

          $container.css
            width: $this.width()
          $this.wrap($container).wrap $floater
          $this.after $controls
          if counter
            $counter.prepend $ccurrent
            $counter.prepend $cback
            $counter.append $cforward
            $this.after $counter
            $cback.bind 'click', ->
              $this.aGALLERY 'prev'
              return

            $cforward.bind 'click', ->
              $this.aGALLERY 'next'
              return

          if slideshow
            slider = setInterval(->
              $this.aGALLERY 'next'
              return
            , interval)
          $this.on 'navigating', ->
            clearInterval slider  if slider
            $this.aGALLERY 'updateCounter'  if counter
            return
          
          # set data
          $this.data "gallery",
            target: $this
            images: images
            current: current
            $ccurrent: $ccurrent
            $back: $back
            $forward: $forward
            loop: loop_
            slideshow: slideshow
            counter: counter

        return

    goToIndex: (index)->
      if isNaN(index) then return false
      $this = $(this)
      data = $this.data('gallery')
      loop_ = data.loop
      slideshow = data.slideshow
      if index < 0 or data.images.length < index then return false
      data.current = index
      $this.trigger 'navigating', data.current
      left = data.current
      right = data.images.length - data.current - 1
      data.images.hide()
      $(data.images[index]).show()
      if left is 0 and (not loop_ and not slideshow) then data.$back.hide() else data.$back.show()
      if right is 0 and (not loop_ and not slideshow) then data.$forward.hide() else data.$forward.show()
      return

    prev: ->
      $this = $(this)
      data = $this.data('gallery')
      l = data.images.length
      left = data.current
      loop_ = data.loop
      slideshow = data.slideshow
      if left > 0
        index = data.current - 1
      else
        index = (if (loop_ or slideshow) then l - 1 else data.current)
      $this.aGALLERY 'goToIndex', index
      return

    next: ->
      $this = $(this)
      data = $this.data('gallery')
      l = data.images.length
      left = data.images.length - data.current - 1
      loop_ = data.loop
      slideshow = data.slideshow
      if left > 0
        index = data.current + 1
      else
        index = (if (loop_ or slideshow) then 0 else data.current)
      $this.aGALLERY 'goToIndex', index
      return

    updateCounter: ->
      $this = $(this)
      data = $this.data('gallery')
      data.$ccurrent.text data.current + 1
      return

  $.fn.aGALLERY = (method) ->
    # method logic
    if methods[method]
      methods[method].apply this, Array::slice.call(arguments, 1)
    else if typeof method is 'object' or not method
      methods.init.apply this, arguments
    else
      $.error "Method " + method + " doesn't exist in aGALLERY"
    return

  return
) jQuery
