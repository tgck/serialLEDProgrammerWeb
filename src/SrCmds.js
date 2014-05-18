////////////////////////////////////////////////////////////////////////////////
// システムコマンド
////////////////////////////////////////////////////////////////////////////////
function CmdSystem(ws2812, length, wait)
{
  this.name = "system";
  this.ctrl = 0x90;
  this.ledtype = ws2812;
  this.length = length;
  this.wait = wait;
  return this;
}

// Jsonからオブジェクトの生成
function CmdSystemFromJson(obj)
{
  if(obj.name == "system")
  {
    return new CmdSystem(obj.ws2812, obj.length, obj.wait);
  }
  else
  {
    return null;
  }
}

// 文字配列からオブジェクトの生成
function CmdSystemFromStr(obj)
{
  // 数値変換
  var val = [];
  for(var i = 0 ; i < obj.length ; i++){
    val.push(parseInt(obj[i], 10));
  }

  return new CmdSystem(val[0], val[1], val[2]);
}


// 名称の取得
CmdSystem.prototype.get_funcname = function()
{
  return this.name;
}

// コマンドの取得
CmdSystem.prototype.get_command = function()
{
  // 8 バイトのバッファを作成
  var buffer = new ArrayBuffer(8);

  // uint8のアクセス
  var uint8s = new Uint8Array(buffer);
  uint8s[0] = this.ctrl;
  uint8s[1] = this.ledtype;

  // uint16のアクセス
  var uint16s = new Uint16Array(buffer);
  uint16s[2] = this.length;
  uint16s[3] = this.wait;

  return buffer;
}

////////////////////////////////////////////////////////////////////////////////
// Waitコマンド
////////////////////////////////////////////////////////////////////////////////
function CmdWait(wait)
{
  this.name = "wait";
  this.ctrl = 0x91;
  this.wait = wait;
  return this;
}

// Jsonからオブジェクトの生成
function CmdWaitFromJson(obj)
{
  if(obj.name == "wait")
  {
    return new CmdWait(obj.wait);
  }
  else
  {
    return null;
  }
}

// 文字配列からオブジェクトの生成
function CmdWaitFromStr(obj)
{
  // 数値変換
  var val = [];
  for(var i = 0 ; i < obj.length ; i++){
    val.push(parseInt(obj[i], 10));
  }

  return new CmdWait(val[0]);
}

// 名称の取得
CmdWait.prototype.get_funcname = function()
{
  return this.name;
}

// コマンドの取得
CmdWait.prototype.get_command = function()
{
  // 8 バイトのバッファを作成
  var buffer = new ArrayBuffer(8);

  // uint8のアクセス
  var uint8s = new Uint8Array(buffer);
  uint8s[0] = this.ctrl;

  // uint32のアクセス
  var uint32s = new Uint32Array(buffer);
  uint32s[1] = this.wait;

  return buffer;
}

////////////////////////////////////////////////////////////////////////////////
// Shiftコマンド
////////////////////////////////////////////////////////////////////////////////
function CmdShift(dir, mode, count, wait)
{
  this.name = "shift";
  this.ctrl = 0x92;
  this.dir = dir;
  this.mode = mode;
  this.count = count;
  this.wait = wait;
  return this;
}

// Jsonからオブジェクトの生成
function CmdShiftFromJson(obj)
{
  if(obj.name == "shift")
  {
    return new CmdShift(obj.dir, obj.mode, obj.count, obj.wait);
  }
  else
  {
    return null;
  }
}

// 文字配列からオブジェクトの生成
function CmdShiftFromStr(obj)
{
  // 数値変換
  var val = [];
  for(var i = 0 ; i < obj.length ; i++){
    val.push(parseInt(obj[i], 10));
  }

  return new CmdShift(val[0], val[1], val[2], val[3]);
}

// 名称の取得
CmdShift.prototype.get_funcname = function()
{
  return this.name;
}

// コマンドの取得
CmdShift.prototype.get_command = function()
{
  // 8 バイトのバッファを作成
  var buffer = new ArrayBuffer(8);

  // uint8のアクセス
  var uint8s = new Uint8Array(buffer);
  uint8s[0] = this.ctrl;
  uint8s[1] = this.dir;
  uint8s[2] = this.mode;

  // uint16のアクセス
  var uint16s = new Uint16Array(buffer);
  uint16s[2] = this.count;
  uint16s[3] = this.wait;

  return buffer;
}

////////////////////////////////////////////////////////////////////////////////
// Loopコマンド
////////////////////////////////////////////////////////////////////////////////
function CmdLoop(count)
{
  this.name = "loop";
  this.ctrl = 0x93;
  this.count = count;
  return this;
}

// Jsonからオブジェクトの生成
function CmdLoopFromJson(obj)
{
  if(obj.name == "loop")
  {
    return new CmdLoop(obj.count);
  }
  else
  {
    return null;
  }
}

// 文字配列からオブジェクトの生成
function CmdLoopFromStr(obj)
{
  // 数値変換
  var val = [];
  for(var i = 0 ; i < obj.length ; i++){
    val.push(parseInt(obj[i], 10));
  }

  return new CmdLoop(val[0]);
}

// 名称の取得
CmdLoop.prototype.get_funcname = function()
{
  return this.name;
}

// コマンドの取得
CmdLoop.prototype.get_command = function()
{
  // 8 バイトのバッファを作成
  var buffer = new ArrayBuffer(8);

  // uint8のアクセス
  var uint8s = new Uint8Array(buffer);
  uint8s[0] = this.ctrl;

  // uint32のアクセス
  var uint32s = new Uint32Array(buffer);
  uint32s[1] = this.count;

  return buffer;
}


////////////////////////////////////////////////////////////////////////////////
// Scriptコマンド
////////////////////////////////////////////////////////////////////////////////
function CmdScript(mode)
{
  this.name = "script";
  this.ctrl = 0x94;
  this.mode = mode;
  return this;
}

// Jsonからオブジェクトの生成
function CmdScriptFromJson(obj)
{
  if(obj.name == "script")
  {
    return new CmdScript(obj.mode);
  }
  else
  {
    return null;
  }
}

// 文字配列からオブジェクトの生成
function CmdScriptFromStr(obj)
{
  // 数値変換
  var val = [];
  for(var i = 0 ; i < obj.length ; i++){
    val.push(parseInt(obj[i], 10));
  }

  return new CmdScript(val[0]);
}

// 名称の取得
CmdScript.prototype.get_funcname = function()
{
  return this.name;
}

// コマンドの取得
CmdScript.prototype.get_command = function()
{
  // 8 バイトのバッファを作成
  var buffer = new ArrayBuffer(8);

  // uint8のアクセス
  var uint8s = new Uint8Array(buffer);
  uint8s[0] = this.ctrl;
  uint8s[1] = this.mode;

  return buffer;
}

////////////////////////////////////////////////////////////////////////////////
// Rainbowコマンド
////////////////////////////////////////////////////////////////////////////////
function CmdRainbow(bright, mode, wait, loop)
{
  this.name = "rainbow";
  this.ctrl = 0x95;
  this.bright = bright;
  this.mode = mode;
  this.wait = wait;
  this.loop = loop;
  return this;
}

// Jsonからオブジェクトの生成
function CmdRainbowFromJson(obj)
{
  if(obj.name == "rainbow")
  {
    return new CmdRainbow(obj.bright, obj.mode, obj.wait, obj.loop);
  }
  else
  {
    return null;
  }
}

// 文字配列からオブジェクトの生成
function CmdRainbowFromStr(obj)
{
  // 数値変換
  var val = [];
  for(var i = 0 ; i < obj.length ; i++){
    val.push(parseInt(obj[i], 10));
  }

  return new CmdRainbow(val[0], val[1], val[2], val[3]);
}

// 名称の取得
CmdRainbow.prototype.get_funcname = function()
{
  return this.name;
}

// コマンドの取得
CmdRainbow.prototype.get_command = function()
{
  // 8 バイトのバッファを作成
  var buffer = new ArrayBuffer(8);

  // uint8のアクセス
  var uint8s = new Uint8Array(buffer);
  uint8s[0] = this.ctrl;
  uint8s[1] = this.bright;
  uint8s[2] = this.mode;
  uint8s[3] = this.wait;

  // uint32のアクセス
  var uint32s = new Uint32Array(buffer);
  uint32s[1] = this.loop;

  return buffer;
}

////////////////////////////////////////////////////////////////////////////////
// Barコマンド
////////////////////////////////////////////////////////////////////////////////
function CmdBar(h, s, v, flag, shiftwait, showwait, loop)
{
  this.name = "bar";
  this.ctrl = 0x96;
  this.h = h;
  this.s = s;
  this.v = v;
  this.flag = flag;
  this.shiftwait = shiftwait;
  this.showwait = showwait;
  this.loop = loop;
  return this;
}

// Jsonからオブジェクトの生成
function CmdBarFromJson(obj)
{
  if(obj.name == "bar")
  {
    return new CmdBar(obj.h, obj.s, obj.v, obj.flag, obj.shiftwait, obj.showwait, obj.loop);
  }
  else
  {
    return null;
  }
}

// 文字配列からオブジェクトの生成
function CmdBarFromStr(obj)
{
  // 数値変換
  var val = [];
  for(var i = 0 ; i < obj.length ; i++){
    val.push(parseInt(obj[i], 10));
  }

  return new CmdBar(val[0], val[1], val[2], val[3], val[4], val[5], val[6]);
}

// 名称の取得
CmdBar.prototype.get_funcname = function()
{
  return this.name;
}

// コマンドの取得
CmdBar.prototype.get_command = function()
{
  // 8 バイトのバッファを作成
  var buffer = new ArrayBuffer(8);

  // uint8のアクセス
  var uint8s = new Uint8Array(buffer);
  uint8s[0] = this.ctrl;

  var rgb = hsv2rgb(this.h, this.s * 100 / 255, this.v * 100 / 255);
  uint8s[1] = rgb[0];
  uint8s[2] = rgb[1];
  uint8s[3] = rgb[2];
  uint8s[4] = this.flag;
  uint8s[5] = this.shiftwait;
  uint8s[6] = this.showwait;
  uint8s[7] = this.loop;

  return buffer;
}

////////////////////////////////////////////////////////////////////////////////
// Seesawコマンド
////////////////////////////////////////////////////////////////////////////////
function CmdSeesaw(bright, loop, wait, rgbflag)
{
  this.name = "seesaw";
  this.ctrl = 0x97;
  this.bright = bright;
  this.loop = loop;
  this.wait = wait;
  this.rgbflag = rgbflag;
  return this;
}

// Jsonからオブジェクトの生成
function CmdSeesawFromJson(obj)
{
  if(obj.name == "seesaw")
  {
    return new CmdSeesaw(obj.bright, obj.loop, obj.wait, obj.rgbflag);
  }
  else
  {
    return null;
  }
}

// 文字配列からオブジェクトの生成
function CmdSeesawFromStr(obj)
{
  // 数値変換
  var val = [];
  for(var i = 0 ; i < obj.length ; i++){
    val.push(parseInt(obj[i], 10));
  }

  return new CmdSeesaw(val[0], val[1], val[2], val[3]);
}

// 名称の取得
CmdSeesaw.prototype.get_funcname = function()
{
  return this.name;
}

// コマンドの取得
CmdSeesaw.prototype.get_command = function()
{
  // 8 バイトのバッファを作成
  var buffer = new ArrayBuffer(8);

  // uint8のアクセス
  var uint8s = new Uint8Array(buffer);
  uint8s[0] = this.ctrl;
  uint8s[1] = this.bright;
  uint8s[2] = this.loop;
  uint8s[3] = this.wait;

  // uint32のアクセス
  var uint32s = new Uint32Array(buffer);
  uint32s[1] = this.rgbflag;

  return buffer;
}

////////////////////////////////////////////////////////////////////////////////
// Colorコマンド
////////////////////////////////////////////////////////////////////////////////
function CmdColor(h, s, v, target, tr, off)
{
  this.name = "color";
  this.ctrl = 0x80;
  this.tr = tr;
  this.off = off;
  this.h = h;
  this.s = s;
  this.v = v;
  this.target = target;

  return this;
}

// Jsonからオブジェクトの生成
function CmdColorFromJson(obj)
{
  if(obj.name == "color")
  {
    return new CmdColor(obj.h, obj.s, obj.v, obj.target, obj.tr, obj.off);
  }
  else
  {
    return null;
  }
}

// 文字配列からオブジェクトの生成
function CmdColorFromStr(obj)
{
  // 数値変換
  var val = [];
  for(var i = 0 ; i < obj.length ; i++){
    val.push(parseInt(obj[i], 10));
  }

  return new CmdColor(val[0], val[1], val[2], val[3], val[4], val[5]);
}

// 名称の取得
CmdColor.prototype.get_funcname = function()
{
  return this.name;
}

// コマンドの取得
CmdColor.prototype.get_command = function()
{
  // 8 バイトのバッファを作成
  var buffer = new ArrayBuffer(8);

  // uint8のアクセス
  var uint8s = new Uint8Array(buffer);
  uint8s[0] = this.ctrl;
  uint8s[0] |= (this.tr > 0) ? 0x00 : 0x08;
  uint8s[0] |= (this.off > 0) ? 0x04 : 0x00;
  
  var rgb = hsv2rgb(this.h, this.s * 100 / 255, this.v * 100 / 255);
  uint8s[1] = rgb[0];
  uint8s[2] = rgb[1];
  uint8s[3] = rgb[2];

  // uint32のアクセス
  var uint32s = new Uint32Array(buffer);
  uint32s[1] = this.target;

  return buffer;
}
