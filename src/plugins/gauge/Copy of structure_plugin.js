﻿

$.includeScripts([
  'plugins/gauge/lib/tween-min.js',
  'plugins/gauge/lib/steelseries-min.js'
], templateEngine.pluginLoaded );

VisuDesign_Custom.prototype.addCreator("gauge", {
    create: function( element, path, flavour, type ) {
        var $e = $(element);
        // create the main structure
        var ret_val = basicdesign.createDefaultWidget( 'gauge', $e, path, flavour, type, this.update, function( src, transform, mode, variant ) {
          return [ true, variant ];
        });     
        var id = "gauge_" + path;

        // and fill in widget specific data
        ret_val.data( {
           'type' : $e.attr('type'),
           'titleString' : $e.attr('titleString') || '',
           'unitString'  : $e.attr('unitString') || '',
           'minValue'    : $e.attr('minValue') || 0, 
           'maxValue'    : $e.attr('maxValue') || 100,
           'lcdVisible'  : $e.attr('lcdVisible') || false,
           'trendVisible': $e.attr('trendVisible') || false,
           radial        : undefined,
           linear        : undefined,
           'size'        : $e.attr('size') || '150',
           'threshold'   : $e.attr('threshold'),
           'lcdDecimals' : $e.attr('lcdDecimals') || 0,
           'background'  : $e.attr('background') || 'DARK_GRAY',
           'framedesign' : $e.attr('framedesign') || 'STEEL',
           'width'       : $e.attr('width') || 320,
           'height'      : $e.attr('height') || 140
        });
        var data = ret_val.data();
        var titleString = data.titleString;
        var type = data.type;
        var size = data.size;
        var unitString = data.unitString;
        var minValue = data.minValue;
        var maxValue = data.maxValue;
        var threshold = data.threshold;
        var background = data.background;
        var framedesign = data.framedesign;
        var width = data.width;
        var height = data.height;
        if (data.lcdVisible == 'false') var lcdVisible = false;
        else if (data.lcdVisible == 'true') var lcdVisible = true;
        if (data.trendVisible == 'false') var trendVisible = false;
        if (data.trendVisible == 'true') var trendVisible = true;
        // create the actor 
        var $actor = $('div class="actor"></div><canvas id=' + id + '></canvas>');
        ret_val.append( $actor ); 
        basicdesign.defaultUpdate(undefined, undefined, ret_val, true);

        templateEngine.bindActionForLoadingFinished(function() {
            if (type == 'Radial') { 
                var radial = new steelseries[type](id, {
                     titleString : [titleString],
                      unitString : [unitString],
                            size : [size],
                      lcdVisible : lcdVisible,
                     lcdDecimals : data.lcdDecimals, 
                    trendVisible : trendVisible
                });
                radial.setFrameDesign(steelseries.FrameDesign[framedesign]);
                radial.setBackgroundColor(steelseries.BackgroundColor[background]);
                radial.setForegroundType(steelseries.ForegroundType.TYPE1);
                radial.setPointerColor(steelseries.ColorDef.RED);
                radial.setPointerType(steelseries.PointerType.TYPE1);
                radial.setMinValue(minValue);
                radial.setMaxValue(maxValue);
                radial.setThreshold(threshold);
                   //radial.setValueAnimated(1000);
            } else if(type == 'WindDirection'){
                var radial = new steelseries[type](id, {
                     titleString : [titleString],
                      unitString : [unitString],
                            size : [size],
                    //lcdVisible : [lcdVisible]
                });
                radial.setFrameDesign(steelseries.FrameDesign[framedesign]);
                radial.setBackgroundColor(steelseries.BackgroundColor[background]);
                radial.setForegroundType(steelseries.ForegroundType.TYPE1);
                radial.setPointerColor(steelseries.ColorDef.RED);
                radial.setPointerTypeAverage(steelseries.PointerType.TYPE1);
                //radial.setValueAnimatedLatest(80);
                //radial.setValueAnimatedAverage(90);
            }
      else if (type == 'Linear'){
      var linear = new steelseries[type](id, {
      titleString : [titleString],
      size : [size],
      unitString : [unitString],
      background : background,
      framedesign : framedesign,
      width : width,
      height : height
      });
      linear.setFrameDesign(steelseries.FrameDesign[framedesign]),
      linear.setBackgroundColor(steelseries.BackgroundColor[background]);
              //  linear.setValueColor(steelseries.ValueColor.STANDARD);
                linear.setLcdColor(steelseries.LcdColor.STANDARD);
                linear.setLedColor(steelseries.LedColor.RED_LED);
        linear.setMinValue(minValue);
                linear.setMaxValue(maxValue);
        linear.setThreshold(threshold);
      }
            ret_val.data( 'radial', radial );
            ret_val.data( 'linear', linear );
        });
        return ret_val;
    },
    update: function(e,d) {
        var element = $(this);
        var value = basicdesign.defaultUpdate( e, d, element, true );
        var variant = element.data( 'address' )[ e.type ][2];
        switch( variant ){
        case 'average':
            if( element.data('radial') && element.data('radial').setValueAnimatedAverage )
                element.data('radial').setValueAnimatedAverage( value );
        if( element.data('linear') && element.data('linear').setValueAnimatedAverage )
                element.data('linear').setValueAnimatedAverage( value );
            break;
        case 'trend':
           if( element.data('radial') && element.data('radial').setTrend ){
                if ( value > 0) element.data('radial').setTrend(steelseries.TrendState.UP);
                else if (value < 0) element.data('radial').setTrend(steelseries.TrendState.DOWN);
                else element.data('radial').setTrend(steelseries.TrendState.STEADY);
            }
        break;
        default:
            if( element.data('radial') && element.data('radial').setValueAnimatedLatest )
               element.data('radial').setValueAnimatedLatest( value );
            if( element.data('radial') && element.data('radial').setValueAnimated )
               element.data('radial').setValueAnimated( value );
         
         if( element.data('linear') && element.data('linear').setValueAnimatedLatest )
               element.data('linear').setValueAnimatedLatest( value );
            if( element.data('linear') && element.data('linear').setValueAnimated )
               element.data('linear').setValueAnimated( value );
        }
    }
});
