var g_ledplayinfo = null;
var g_timer = null;

// 
// LED演出処理の開始
// 
function led_play(){
  // 演出用のタイマーは停止
  led_timer_stop();

  var cmdArray = [];

  // テーブルからコマンドオブジェクトを生成する
  var oTable = $('#example').dataTable();
  $.each( oTable.fnGetData(), function(i, row){
    // Remarksに入っているjsonを取得
    cmdArray[i] = CmdFromJson(JSON.parse(row[10]));
  });

  // データが存在する場合のみ実施する。
  if(cmdArray.length != 0){

    // 演出情報の設定
    g_ledplayinfo = new PlayInfo(cmdArray);

    //関数led_play_timer()を1ミリ秒間隔で呼び出す
    g_timer = setInterval("led_play_timer()",1);
  }
}

// 
// LED演出処理の停止
// 
function led_stop(){
  // 演出用のタイマーは停止
  led_timer_stop();
}

// 
// タイマー内容を定義
// 
function led_play_timer(){

  // LED演出の実施
  g_ledplayinfo.play();

  // 再生終了の場合タイマーを停止する
  if(g_ledplayinfo.is_end()){
    led_timer_stop();
  }
}

// 
// LED演出用のタイマー停止
// 
function led_timer_stop(){
  if(g_timer != null){
    clearInterval(g_timer);
    g_timer = null;
  }
}
