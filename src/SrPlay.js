////////////////////////////////////////////////////////////////////////////////
// 再生情報
////////////////////////////////////////////////////////////////////////////////
function PlayInfo(cmd)
{
  // 全体
  this.index = 0;
  this.cmd = cmd;
  this.led = [];

  // System
  this.ledlen = 0;
  this.syswait = 0;
  this.syswait_count = 0;

  // Wait
  this.wait = 0;

  // Shift
  this.shift_count = 0;
  this.shift_wait = 0;

  // Loop
  this.loop_count = 0;

  // Rainbow
  this.rainbow_loop = 0;
  this.rainbow_wait = 0;

  // Bar
  this.bar_loop = 0;
  this.bar_status = 0;
  this.bar_wait = 0;
  this.bar_start = 0;
  this.bar_end = 0;
  this.bar_step = 0;
  this.bar_rgb = 'rgb(0,0,0)';

  // Seesaw
  this.seesaw_loop = 0;
  this.seesaw_wait = 0;
  this.seesaw_br = [];
  this.seesaw_pos = [];
  this.seesaw_dir = 1;

  // LEDのオブジェクト参照
  for(var i = 0 ; i < 32 ; i++)
  {
    var led = document.getElementById("LED"+(i+1));
    this.led.push(led);
  }

  return this;
}

// コマンドの取得
PlayInfo.prototype.play = function()
{
  if(this.syswait_count == 0)
  {
    var pos = this.index;
    var Cmd = this.cmd[pos];
    Cmd.play(this);
    
    // 次コマンドに遷移する場合は、時間を調整する
    if(pos != this.index){
      this.syswait_count = this.syswait;
    }
  }
  else
  {
    this.syswait_count--;
  }
}

// 再生終了ほ判定
PlayInfo.prototype.is_end = function()
{
  if(this.cmd.length <= this.index)
  {
    return true;
  }
  else
  {
    return false;
  }
}

// ソースコード生成
PlayInfo.prototype.playsrc = function()
{
  var key_cmd_list = '';

  for(var i = 0 ; i < this.cmd.length ; i++)
  {
    ////////////////////////////////////////////////////////////////////////////
    // jsonでコマンドの概要文字
    ////////////////////////////////////////////////////////////////////////////
    //var cmd_json = JSON.stringify(this.cmd[i]);
    //key_cmd_list += "  // " + cmd_json + "\r\n";

    ////////////////////////////////////////////////////////////////////////////
    // バイト列
    ////////////////////////////////////////////////////////////////////////////
    key_cmd_list += "  { ";
    var buff = this.cmd[i].get_command();
    var uint8s = new Uint8Array(buff);
    key_cmd_list += "0x" + ('0' + uint8s[0].toString(16)).slice(-2);
    for(var j = 1 ; j < 8 ; j++)
    {
      key_cmd_list += ", 0x" + ('0' + uint8s[j].toString(16)).slice(-2);
    }
    key_cmd_list += " }, /* " + JSON.stringify(this.cmd[i]) + " */\r\n";
  }
  
  return key_cmd_list;
}
 
////////////////////////////////////////////////////////////////////////////////
// システムコマンドの再生
////////////////////////////////////////////////////////////////////////////////
CmdSystem.prototype.play = function(playinfo)
{
  playinfo.ledlen = this.length;
  playinfo.syswait = this.wait;
  playinfo.index++;
}

////////////////////////////////////////////////////////////////////////////////
// Waitコマンドの再生
////////////////////////////////////////////////////////////////////////////////
CmdColor.prototype.play = function(playinfo)
{
  if(playinfo.wait == 0)
  {
    playinfo.wait = this.wait;
  }
  else
  {
    playinfo.wait--;
    if(playinfo.wait <= 0){
      playinfo.index++;
    }
  }
}

////////////////////////////////////////////////////////////////////////////////
// Shiftコマンドの再生
////////////////////////////////////////////////////////////////////////////////
CmdShift.prototype.play = function(playinfo)
{
  // シフト回数
  if(playinfo.shift_count == 0 && playinfo.shift_wait == 0){
    playinfo.shift_count = this.count;
  }

  // Wait数
  if(playinfo.shift_wait <= 0){
    playinfo.shift_wait = this.wait;
    
    var rgb = 'rgb(0, 0, 0)';

    // 順方向
    if(this.dir)
    {
      // ローテートの処理
      if(this.mode){
        rgb = playinfo.led[0].getAttribute("fill");
      }

      // 左シフト
      for(var j = 0 ; j <= playinfo.ledlen - 2 ; j++){
        var mycolor = playinfo.led[j + 1].getAttribute("fill");
        playinfo.led[j].setAttribute("fill", mycolor);
      }

      // コピー済みのデータを設定
      playinfo.led[playinfo.ledlen - 1].setAttribute("fill", rgb);
    }
    else
    {
      // ローテートの処理
      if(this.mode){
        rgb = playinfo.led[playinfo.ledlen - 1].getAttribute("fill");
      }
      
      // 右シフト
      for(var j = playinfo.ledlen - 1 ; j >= 1 ; j--){
        var mycolor = playinfo.led[j - 1].getAttribute("fill");
        playinfo.led[j].setAttribute("fill", mycolor);
      }

      // コピー済みのデータを設定
      playinfo.led[0].setAttribute("fill", rgb);
    }
    playinfo.shift_count--;
  }
  else
  {
    playinfo.shift_wait--;
    
    // 再生の終了判定
    if(playinfo.shift_wait <= 0 && playinfo.shift_count <= 0){
      playinfo.index++;
    }
  }
}

////////////////////////////////////////////////////////////////////////////////
// Loopコマンドの再生
////////////////////////////////////////////////////////////////////////////////
CmdLoop.prototype.play = function(playinfo)
{
  // Loop
  if(playinfo.loop_count == 0)
  {
    playinfo.loop_count = this.count;
  }
  else
  {
    playinfo.loop_count--;
    if(playinfo.loop_count <= 0){
      playinfo.index++;
    }else{
      playinfo.index=0;
    }
  }
}

////////////////////////////////////////////////////////////////////////////////
// Scriptコマンドの再生
////////////////////////////////////////////////////////////////////////////////
CmdScript.prototype.play = function(playinfo)
{
  // 処理なし
  playinfo.index++;
}

////////////////////////////////////////////////////////////////////////////////
// Rainbowコマンドの再生
////////////////////////////////////////////////////////////////////////////////
CmdRainbow.prototype.play = function(playinfo)
{
  // シフト回数
  if(playinfo.rainbow_loop == 0 && playinfo.rainbow_wait == 0){
    playinfo.rainbow_loop = this.loop;
  }

  // Wait数
  if(playinfo.rainbow_wait <= 0){
    playinfo.rainbow_wait = this.wait;

    var j = this.loop - playinfo.rainbow_loop;

    // 虹色設定
    var work;
    for(var i = 0 ; i < playinfo.ledlen ; i++){
      if(this.mode)
      {
        work = Math.round(((i * 256 / playinfo.ledlen) + j)) & 0xFF;
      }
      else
      {
        work = (i + j) & 0xFF;
      }
      
      
      var rgb = color_hsv(work, this.bright);
      var mycolor = "rgb(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ")";

      playinfo.led[i].setAttribute("fill", mycolor);
    }
    
    playinfo.rainbow_loop--;
  }
  else
  {
    playinfo.rainbow_wait--;
    
    // 再生の終了判定
    if(playinfo.rainbow_wait <= 0 && playinfo.rainbow_loop <= 0){
      playinfo.index++;
    }
  }
}

////////////////////////////////////////////////////////////////////////////////
// Barコマンドの再生
////////////////////////////////////////////////////////////////////////////////
CmdBar.prototype.play = function(playinfo)
{
  // ループ回数
  if(playinfo.bar_loop == 0 && playinfo.bar_wait == 0){
    playinfo.bar_loop = this.loop;
  }

  if(playinfo.bar_status == 0){
    if(this.flag & 0x01){
      playinfo.bar_start = playinfo.ledlen - 1;
      playinfo.bar_end = -1;
      playinfo.bar_step = -1;
    }else{
      playinfo.bar_start = 0;
      playinfo.bar_end = playinfo.ledlen;
      playinfo.bar_step = 1;
    }

    var rgb = hsv2rgb(this.h, this.s * 100 / 255, this.v * 100 / 255);
    playinfo.bar_rgb = "rgb(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ")";
    playinfo.bar_status = 5;

  }else if(playinfo.bar_status == 5){

    playinfo.led[playinfo.bar_start].setAttribute("fill", playinfo.bar_rgb);
    playinfo.bar_start += playinfo.bar_step;

//    console.log("start = " + playinfo.bar_start );
    
    if(this.shiftwait){
      playinfo.bar_wait = this.shiftwait;
    }else{
      playinfo.bar_wait = 1;
    }

    playinfo.bar_status = 1;

  // Wait処理
  }else if(playinfo.bar_status == 1){
    playinfo.bar_wait--;
    if(playinfo.bar_wait <= 0){
    
      if(playinfo.bar_start == playinfo.bar_end){
        if(this.showwait){
          playinfo.bar_wait = this.showwait * 10;
        }else{
          playinfo.bar_wait = 1;
        }
        playinfo.bar_status = 2;

//        console.log("status = " + playinfo.bar_status );
      }else{
        playinfo.bar_status = 5;
      }
    }
  }else if(playinfo.bar_status == 2){
    playinfo.bar_wait--;
    if(playinfo.bar_wait <= 0){
      if(this.flag & 0x01){
        playinfo.bar_start = playinfo.ledlen - 1;
        playinfo.bar_end = -1;
        playinfo.bar_step = -1;
      }else{
        playinfo.bar_start = 0;
        playinfo.bar_end = playinfo.ledlen;
        playinfo.bar_step = 1;
      }
      playinfo.bar_rgb = 'rgb(0, 0, 0)';
      playinfo.bar_status = 6;
    }
  }else if(playinfo.bar_status == 6){

    playinfo.led[playinfo.bar_start].setAttribute("fill", playinfo.bar_rgb);
    playinfo.bar_start += playinfo.bar_step;

    if(this.shiftwait){
      playinfo.bar_wait = this.shiftwait;
    }else{
      playinfo.bar_wait = 1;
    }

    playinfo.bar_status = 3;

  // Wait処理
  }else if(playinfo.bar_status == 3){
    playinfo.bar_wait--;
    if(playinfo.bar_wait <= 0){
    
      if(playinfo.bar_start == playinfo.bar_end){
        if(this.showwait){
          playinfo.bar_wait = this.showwait * 10;
        }else{
          playinfo.bar_wait = 1;
        }
        playinfo.bar_status = 4;
      }else{
        playinfo.bar_status = 6;
      }
    }
  }else if(playinfo.bar_status == 4){
    playinfo.bar_wait--;
    if(playinfo.bar_wait <= 0){
      playinfo.bar_status = 0;
      playinfo.bar_loop--;
      
      if(playinfo.bar_loop <= 0){
        playinfo.index++;
      }
    }
  }

//    console.log("status = " + playinfo.bar_status );

}

////////////////////////////////////////////////////////////////////////////////
// Seesawコマンドの再生
////////////////////////////////////////////////////////////////////////////////
CmdSeesaw.prototype.play = function(playinfo)
{
  // ループ回数
  if(playinfo.seesaw_loop == 0 && playinfo.seesaw_wait == 0){
    playinfo.seesaw_loop = this.loop * ((playinfo.ledlen * 2) - 1) + 1;

    // 明るさ減衰量
    var brDec = this.bright / playinfo.ledlen;
    for(var i = 0 ; i < playinfo.ledlen ; i++)
    {
      playinfo.seesaw_br[i] = Math.round(this.bright - (brDec * i));
      playinfo.seesaw_pos[i] = i;
    }
  }

  // Wait数
  if(playinfo.seesaw_wait <= 0){
    playinfo.seesaw_wait = this.wait;

    // データ転送
    for(var i = playinfo.ledlen - 1 ; i >= 0 ; i--)
    {
      var r = 0, g = 0, b = 0;
      
      if(this.rgbflag & 0x01){
        r = playinfo.seesaw_br[i];
      }
      if(this.rgbflag & 0x02){
        g = playinfo.seesaw_br[i];
      }
      if(this.rgbflag & 0x04){
        b = playinfo.seesaw_br[i];
      }

      var pos = playinfo.seesaw_pos[i];
      var mycolor = "rgb(" + r + "," + g + "," + b + ")";
      playinfo.led[pos].setAttribute("fill", mycolor);
    }
    
    // 位置を変更する。
    for(var i = playinfo.ledlen - 1 ; i >= 1; i--)
    {
      playinfo.seesaw_pos[i] = playinfo.seesaw_pos[i - 1];
    }

    // 次位置の計算
    var workpos = playinfo.seesaw_pos[0];
    workpos += playinfo.seesaw_dir;

    if(workpos <= 0){
      playinfo.seesaw_pos[0] = 0;
      playinfo.seesaw_dir = 1;
    }else if(workpos >= playinfo.ledlen){
      playinfo.seesaw_pos[0] = playinfo.ledlen - 1;
      playinfo.seesaw_dir = -1;
    }else{
      playinfo.seesaw_pos[0] = workpos;
    }
    
    playinfo.seesaw_loop--;
  }
  else
  {
    playinfo.seesaw_wait--;
    
    // 再生の終了判定
    if(playinfo.seesaw_wait <= 0 && playinfo.seesaw_loop <= 0){
      playinfo.index++;
    }
  }
}

////////////////////////////////////////////////////////////////////////////////
// Colorコマンドの再生
////////////////////////////////////////////////////////////////////////////////
CmdColor.prototype.play = function(playinfo)
{
  var flag = this.target;
  var rgb = hsv2rgb(this.h, this.s * 100 / 255, this.v * 100 / 255);
  var mycolor = "rgb(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ")";

  for(var i = 0 ; i < 32 ; i++)
  {
    var poly = playinfo.led[i];

    if(poly)
    {
      if(flag & 0x01)
      {
        poly.setAttribute("fill", mycolor);
      }
      else
      {
        if(this.off)
        {
          poly.setAttribute("fill", "rgb(0,0,0)");
        }
      }
    }

    // 次フラグへ
    flag >>= 1;
  }

  playinfo.index++;
}
