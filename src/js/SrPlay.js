////////////////////////////////////////////////////////////////////////////////
// 再生情報
////////////////////////////////////////////////////////////////////////////////
function PlayInfo(cmd)
{
  // 全体
  this.index = 0;
  this.cmd = cmd;
  this.led = [];
  this.ctrl = 0x00;

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
    
    // 再生処理を実施したコントロールコードを保持（変化検出用）
    this.ctrl = Cmd.ctrl;
    
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
CmdWait.prototype.play = function(playinfo)
{
  // 初回判定
  if(playinfo.ctrl != this.ctrl)
  {
    // Webは遅いので待ち時間を1/10とする
    playinfo.wait = this.wait/10;
  }

  if(playinfo.wait <= 0){
    playinfo.index++;
  }else{
    playinfo.wait--;
  }
}

////////////////////////////////////////////////////////////////////////////////
// Shiftコマンドの再生
////////////////////////////////////////////////////////////////////////////////
CmdShift.prototype.play = function(playinfo)
{
  // 初回判定
  if(playinfo.ctrl != this.ctrl)
  {
    playinfo.shift_count = this.count;
    playinfo.shift_wait = 0;
  }

  // Wait数
  if(playinfo.shift_wait <= 0){
    // Webは遅いので待ち時間を1/10とする
    playinfo.shift_wait = this.wait/10;
    
    var rgb = 'rgb(0, 0, 0)';

    // 順方向
    if(this.dir)
    {
      // ローテートの処理
      if(this.mode){
        rgb = playinfo.led[0].getAttribute("fill");
      }

      // 左シフト
      for(var j = 0, len = playinfo.ledlen - 2 ; j <= len ; j++){
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
  // 初回判定
  if(playinfo.ctrl != this.ctrl)
  {
    playinfo.rainbow_loop = this.loop;
    playinfo.rainbow_wait = 0;
  }

  // Wait数
  if(playinfo.rainbow_wait <= 0){
    // Webは遅いので待ち時間を1/10とする
    playinfo.rainbow_wait = this.wait/10;

    var j = this.loop - playinfo.rainbow_loop;

    // 虹色設定
    var work;
    var br = add_bright_offset(this.bright);
    for(var i = 0, len = playinfo.ledlen ; i < len ; i++){
      if(this.mode)
      {
        work = Math.round((((i << 8) / playinfo.ledlen) + j)) & 0xFF;
      }
      else
      {
        work = (i + j) & 0xFF;
      }
      
      var rgb = color_hsv(work, br);
      var mycolor = "rgb(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ")";

      playinfo.led[i].setAttribute("fill", mycolor);
    }

    playinfo.rainbow_loop--;
    
    // 再生の終了判定
    if(playinfo.rainbow_loop <= 0){
      playinfo.index++;
    }
  }
  else
  {
    playinfo.rainbow_wait--;
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

    var rgb = hsv2rgb(this.h, this.s * 100 / 255, add_bright_offset(this.v) * 100 / 255);
    playinfo.bar_rgb = "rgb(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ")";
    playinfo.bar_status = 5;

  }else if(playinfo.bar_status == 5){

    playinfo.led[playinfo.bar_start].setAttribute("fill", playinfo.bar_rgb);
    playinfo.bar_start += playinfo.bar_step;

//    console.log("start = " + playinfo.bar_start );
    
    if(this.shiftwait){
      // Webは遅いので待ち時間を1/10とする
      playinfo.bar_wait = this.shiftwait/10;
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
          // Webは遅いので待ち時間を1/10とする
          // playinfo.bar_wait = this.showwait * 10;
          playinfo.bar_wait = this.showwait;
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
      // Webは遅いので待ち時間を1/10とする
      playinfo.bar_wait = this.shiftwait/10;
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
          // Webは遅いので待ち時間を1/10とする
          // playinfo.bar_wait = this.showwait * 10;
          playinfo.bar_wait = this.showwait;
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
    var br = add_bright_offset(this.bright);
    var brDec = br / playinfo.ledlen;
    for(var i = 0, len = playinfo.ledlen ; i < len ; i++)
    {
      playinfo.seesaw_br[i] = Math.round(br - (brDec * i));
      playinfo.seesaw_pos[i] = i;
    }
  }

  // Wait数
  if(playinfo.seesaw_wait <= 0){
    // Webは遅いので待ち時間を1/10とする
    playinfo.seesaw_wait = this.wait / 10;

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
  var rgb = hsv2rgb(this.h, this.s * 100 / 255, add_bright_offset(this.v) * 100 / 255);
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

////////////////////////////////////////////////////////////////////////////////
// 再生用の明るさオフセット加算処理
// 明るさが低いと画面では見えない。
////////////////////////////////////////////////////////////////////////////////
function add_bright_offset(val){
  var ret = val + 128;
  if(ret > 255){
    ret = 255;
  }
  return ret;
}

