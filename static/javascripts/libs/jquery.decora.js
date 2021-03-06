/*!
 * jQuery Decorate Text Plugin
 *
 *  - auto link
 *  - checkbox
 */

(function($) {
  var REG_CHECKBOX = /-[ ]?\[[ ]?\]|-[ ]?\[x\]/g,
      SYM_CHECKED = "-[x]",
      SYM_UNCHECKED = "-[ ]";

  $.fn.decora = function( options ){
    var defaults = {
      checkbox_callback: function(that, applyCheckStatus){}
    };

    var options = $.extend( defaults, options );

    // private method
    Function.prototype.method = function(name, func){
      this.prototype[name] = func;
      return this;
    }
    Function.method('curry', function(){
      var slice = Array.prototype.slice,
          args = slice.apply(arguments),
          that = this;
      return function(){
        return that.apply(null, args.concat(slice.apply(arguments)));
      }
    });

    function _updateCheckboxStatus(check_no, is_checked, target_text){
      var check_index = 0;
      return target_text.replace(REG_CHECKBOX,
        function(){
          var matched_check = arguments[0];
          var current_index = check_index++;
          if ( check_no == current_index){
            if (is_checked){
              return SYM_CHECKED;
            }else{
              return SYM_UNCHECKED;
            }
          }else{
            return matched_check;
          }
        });
    }

    $(this).on('click',':checkbox', function(){
      var check_no = $(this).data('no');
      var is_checked = $(this).attr("checked") ? true : false;
      var that = this;

      options.checkbox_callback(that, _updateCheckboxStatus.curry(check_no, is_checked))
    });
    return this;
  }

  // private method
  function _decorate_link_tag( text ){
    var linked_text = text.replace(/((https?|ftp)(:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+))/g,
        function(){
          var matched_link = arguments[1];
          if ( matched_link.match(/(\.jpg|\.gif|\.png|\.bmp)$/)){
            return matched_link;
          }else{
            return '<a href="' + matched_link + '" target="_blank" >' + matched_link + '</a>';
          }
        });
    return linked_text;
  }

  function _decorate_img_tag( text, default_width ){
    var img_text = text.replace(/((\S+?(\.jpg|\.gif|\.png|\.bmp))($|\s([0-9]+)|\s))/g,
        function(){
          var matched_link = arguments[2];
          var width = arguments[5] != undefined ? arguments[5] : default_width;
          if (width){
            return '<a href="' + matched_link + '" target="_blank" class="thumbnail"><img src="' + matched_link + '" style="max-width:' + width + 'px"/></a>';
          }else{
            return '<a href="' + matched_link + '" target="_blank" class="thumbnail" style="display: inline-block;"><img src="' + matched_link + '"/></a>';
          }
        });
    return img_text;
  }

  function _decorate_checkbox( text ){
    var check_index = 0;
    var check_text = text.replace(REG_CHECKBOX, function(){
      var matched_text = arguments[0];
      if ( matched_text.indexOf("x") > 0 ){
        return '<input type="checkbox" data-no="' + check_index++ + '" checked />';
      }else{
        return '<input type="checkbox" data-no="' + check_index++ + '" />';
      }
    });
    return check_text;
  }

  function _decorate_header( text ){
    var header_index = 0;
    var header_text = text.replace(/^(#+)[ ]*(.*)$/mg, function(){
      var header_num = arguments[1].length < 4 ? arguments[1].length : 4;
      var matched_text = arguments[2];
      return '<h' + header_num + '>' + _decorate_line_color(matched_text) + '</h' + header_num + '>';
    });
    return header_text;
  }

  function _decorate_line_color( text ){
    var color_text = text.replace(/^(.+)[ 　]#([a-z]+)$/mg, function(){
      var matched_text = arguments[1];
      var color_name = arguments[2];
      if (color_name == "r"){ color_name = "red"; }
      if (color_name == "g"){ color_name = "green"; }
      if (color_name == "b"){ color_name = "blue"; }
      return '<font color="' + color_name + '">' + matched_text + '</font>';
    });
    return color_text;
  }


  $.decora = {
    to_html: function(target_text){
      target_text = _decorate_link_tag( target_text );
      target_text = _decorate_img_tag( target_text );
      target_text = _decorate_checkbox( target_text );
      target_text = _decorate_header( target_text );
      target_text = _decorate_line_color( target_text );

      return target_text;
    },
    message_to_html: function(target_text){
      target_text = target_text.replace(/(^|\s+)+(SUCCESS|OK|YES)($|\s)+/, function(){ return ' <span class="label label-success">' + arguments[2] + '</span> '});
      target_text = target_text.replace(/(^|\s+)+(FAILURE|NG|NO)($|\s)+/, function(){ return ' <span class="label label-important">' + arguments[1] + '</span> '});
      target_text = target_text.replace(/[\(（](笑|爆|喜|嬉|楽|驚|泣|涙|悲|怒|厳|辛|苦|閃|汗|忙|急|輝)[\)）]/g, function(){ return '<span class="emo">' + arguments[1] + '</span>'});
 
      target_text = _decorate_link_tag( target_text );
      target_text = _decorate_img_tag( target_text, 100 );
      target_text = _decorate_line_color( target_text );

      return target_text;
    }
  };
})(jQuery);

