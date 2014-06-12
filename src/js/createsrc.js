// 
// createsrc.js
//   ソースコードの生成
// 

// 
// コードの生成処理（ひな形の取得）
// 
function create_src(){
	// コード表示領域のリセット
	$("#preWrapper").empty().html("<pre class='brush: js; toolbar: false'></pre>");
	// $("#preWrapper").html("<pre class='brush: cpp; toolbar: false'></pre>");
	
	// ひな形の読出し（非同期）
	var objXML;
	reqXML = new XMLHttpRequest();
	reqXML.onreadystatechange = create_src_view;
	reqXML.open( "GET", "https://dl.dropboxusercontent.com/u/71549646/external/SrSrcBase.c", false );
	reqXML.send( null );
}

// 
// コードの生成処理（コードの表示）
// 
function create_src_view()
{
	if (reqXML.readyState == 4 && reqXML.status == 200)
	{
		// キーワードの置換
		var src = reqXML.responseText;
		src = src.replace("[key_cmd_list]", create_insert_table());

		$("#code pre").text(src);
		SyntaxHighlighter.highlight();
	}
}

// 
// ベースのソースに挿入するテーブル生成
// 
function create_insert_table(){
  var cmdArray = [];

  //////////////////////////////////////////////////////////////////////////////
  // コマンドの生成
  //////////////////////////////////////////////////////////////////////////////
  // 開始
  cmdArray.push(new CmdScript(1));

  // テーブルからコマンドオブジェクトを生成する
  var oTable = $('#example').dataTable();
  $.each( oTable.fnGetData(), function(i, row){
    // Remarksに入っているjsonを取得
    cmdArray.push(CmdFromJson(JSON.parse(row[10])));
  });

  // 終了
  cmdArray.push(new CmdScript(0));

  var key_cmd_list = '';

  //////////////////////////////////////////////////////////////////////////////
  // テーブルの生成
  //////////////////////////////////////////////////////////////////////////////
  for(var i = 0 ; i < cmdArray.length ; i++)
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
    var buff = cmdArray[i].get_command();
    var uint8s = new Uint8Array(buff);
    key_cmd_list += "0x" + ('0' + uint8s[0].toString(16)).slice(-2);
    for(var j = 1 ; j < 8 ; j++)
    {
      key_cmd_list += ", 0x" + ('0' + uint8s[j].toString(16)).slice(-2);
    }
    key_cmd_list += " }, /* " + JSON.stringify(cmdArray[i]) + " */\r\n";
  }
  
  return key_cmd_list;
}
