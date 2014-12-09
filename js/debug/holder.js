;(function($){
  var canvas = $('<canvas></canvas>')[0],
      context = canvas.getContext('2d'),
      imgs = $('img[data-holder]');

  for (var i = 0, len = imgs.length; i < len; i++) {
  	var text = $(imgs[i]).data('holder'),
  		textWidth = context.measureText(text).width,
  		width = text.split('x')[0],
  		height = text.split('x')[1],
  		textX = (width-textWidth) / 2,
  		textY = height / 2;

	canvas.width = +width;
	canvas.height = +height;

	context.fillStyle = '#eee';
	context.fillRect(0,0,width,height);

	context.fillStyle = '#000';
	context.fillText(text, textX, textY);

	$(imgs[i]).attr('src', canvas.toDataURL());  
	$(imgs[i]).attr('alt', text);  
  }    
})(Zepto);