// HSV-RGB変換
// http://msdn.microsoft.com/ja-jp/library/jj203843(v=vs.85).aspx 参考
function hsv2rgb(h, s, v) {
    // Set up rgb values to work with 
    var r;
    var g;
    var b;

    // Sat and value are expressed as 0 - 100%
    // convert them to 0 to 1 for calculations  
    s /= 100;
    v /= 100;

    if (s == 0) {
        v = Math.round(v * 255); // Convert to 0 to 255 and return 
        return [v, v, v]; //  Grayscale, just send back value
    }

    h %= 360;
    h /= 60;   // Divide by 60 to get 6 sectors (0 to 5)

    var i = Math.floor(h);  // Round down to nearest integer
    var f = h - i;
    var p = v * (1 - s);
    var q = v * (1 - s * f);
    var t = v * (1 - s * (1 - f));

    // Each sector gets a different mix
    switch (i) {
        case 0:
            r = v;
            g = t;
            b = p;
            break;
        case 1:
            r = q;
            g = v;
            b = p;
            break;
        case 2:
            r = p;
            g = v;
            b = t;
            break;
        case 3:
            r = p;
            g = q;
            b = v;
            break;
        case 4:
            r = t;
            g = p;
            b = v;
            break;
        default:
            r = v;
            g = p;
            b = q;
            break;
    }
    //  Convert all decimial values back to 0 - 255
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function color_hsv(pos, br) {

  var r, g, b;
  br = br * 3;
  if(pos < 85) {
      r = Math.round((255 - pos * 3)*br/255);
      g = Math.round((pos * 3)*br/255);
      b = 0;
  } else if(pos < 170) {
      pos -= 85;
      r = 0;
      g = Math.round((255 - pos * 3)*br/255);
      b = Math.round((pos * 3)*br/255);
  } else {
      pos -= 170;
      r = Math.round((pos * 3)*br/255);
      g = 0;
      b = Math.round((255 - pos * 3)*br/255);
  }
  

  return [r, g, b];
}


function Sleep(ms) {
    var d1 = new Date().getTime();
    var d2 = new Date().getTime();
    while( d2 < (d1 + ms) ) {
        d2 = new Date().getTime();
    }
    return;
}

String.prototype.replaceAll = function (org, dest){  
  return this.split(org).join(dest);  
}

function NumberToHexString(val){
  return "0x" + ('0' + val.toString(16)).slice(-2);
}
