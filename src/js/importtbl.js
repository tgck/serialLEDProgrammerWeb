// 
// importtbl.js
//   テーブルインポートの生成
// 

// 
// テーブルインポート処理
// 
function import_tbl(){

	var txt = document.getElementById('importtext').value;
		
	var pos_st = txt.search('led_play_list');
	
	// 見つかった場合
	if(pos_st != -1){
	  var pos_ed = txt.indexOf( ';', pos_st );
	  
	  var subtxt = txt.substring( pos_st, pos_ed );
	  
		// 数値を取得し配列数値変換
		var val = [];
		var pos_index = 0;
		while(true)
		{
			pos_index = subtxt.indexOf('0x', pos_index);

			if(pos_index > 0){
				val.push(parseInt(subtxt.substr(pos_index, 4), 16));
				pos_index += 5;
			}else{
			  break;
			}
		}

		var cmds = [];
		// 8の倍数であれば処理する。
		if(val.length % 8 == 0)
		{
			var buff = new ArrayBuffer(8);
			var data = new Uint8Array(buff);
			for(var j = 0 ; j < val.length ; j+=8){
				for(var i = 0 ; i < 8 ; i++){
				  data[i] = val[j + i];
				}

				var tmp = CmdFromArray8(buff);
				
				if(tmp != null){
					cmds.push(tmp);
				}
			}
		}

		// クリア
		$('#example').dataTable().fnClearTable(false);

		// コマンドが一つでも存在すればテーブルを変更する。
		var t = $('#example').DataTable();

		for(var i = 0 ; i < cmds.length ; i++){
			var values = get_cmd_values(cmds[i]);
			values.unshift(i * 10);
			var node = t.row.add( values ).draw().node(); // 表示して選択
		}
		
		// LEDの長さを更新するための処理
		for(var i = 0 ; i < cmds.length ; i++){
			if(cmds[i].name == "system"){
				ledsToUse = cmds[i].length;
				$("#sys_input0").val(ledsToUse)
				updateViewLeds();
				updateSimLeds();
				break;
			}
		}
		
		// ダイアログを閉じる
		$( "#dialog" ).dialog( "close" );
	}

}

// 
// コマンドの取得
// 
function get_cmd_values(cmd) {

	// レコード挿入
	var buffer = cmd.get_command();
	var uint8s = new Uint8Array(buffer);

	// Gridに表示するデータの追加
	var values = [];
	values[0] = cmd.get_funcname();
	values[1] = NumberToHexString(uint8s[0]);
	values[2] = NumberToHexString(uint8s[1]);
	values[3] = NumberToHexString(uint8s[2]);
	values[4] = NumberToHexString(uint8s[3]);
	values[5] = NumberToHexString(uint8s[4]);
	values[6] = NumberToHexString(uint8s[5]);
	values[7] = NumberToHexString(uint8s[6]);
	values[8] = NumberToHexString(uint8s[7]);
	values[9]= JSON.stringify(cmd);

	return values;
}

