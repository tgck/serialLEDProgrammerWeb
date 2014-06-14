function initDataTable() {
	
	var table = $('#example').dataTable({
		"order" : [[0, "asc"]],
		"columns" : [
			{"name":"hidden-index", "sortable" : false },
			{"name":"Name", "sortable" : false },
			{"name":"C1", "sortable" : false },
			{"name":"C2", "sortable" : false },
			{"name":"C3", "sortable" : false },
			{"name":"C4", "sortable" : false },
			{"name":"D1", "sortable" : false },
			{"name":"D2", "sortable" : false },
			{"name":"D3", "sortable" : false },
			{"name":"D4", "sortable" : false },
			{"name":"Remarks", "sortable" : false }
		],
		"bPaginate": true,
		"bLengthChange": false,
		"bFilter": false,
		"bInfo": false,
		"bAutoWidth": false,
		"scrollY": 200, // false: スクロールを許可しない
		"scrollCollapse": false, // false: レコード長に応じてtableの高さを可変
		"paging": false
	});
	
	$('#example tbody').on( 'click', 'tr', function () {
		if ( $(this).hasClass('selected') ) {
			$(this).removeClass('selected');
		} else {
			table.$('tr.selected').removeClass('selected');
			$(this).addClass('selected');
		}
	});
	// 前回データのロード
	loadDataTable("def_data");
	// データ操作は以下を参照
	// http://datatables.net/examples/api/
}

// 
// 現在のデータテーブルを指定された名前でローカルストレージにjson形式で保存する。
// 
function saveDataTable(keyName) {
	// localStorageが利用できる場合のみ保存する。
	if (window.localStorage) {
		// テーブルからコマンドオブジェクトを生成する
		var oTable = $('#example').dataTable();
		var x = oTable.fnGetData();
		var json_text = JSON.stringify(x);
		localStorage.setItem(keyName, json_text);
	}
}

// 
// 指定された名前のローカルストレージからデータを読み出してデータテーブルに格納
// 
function loadDataTable(keyName) {
	// localStorageが利用できる場合のみロードする。
	if (window.localStorage) {
		
		var json_text = localStorage.getItem(keyName);
		// json -> オブジェクト化
		var obj = JSON.parse(json_text);

		if( obj != null && obj.length > 0){
//		if(json_text != null && json_text.length > 0){
			// テーブルからコマンドオブジェクトを生成する
			var oTable = $('#example').dataTable();
			// クリア
			oTable.fnClearTable(false);
			// テーブル追加
			oTable.fnAddData(obj, true);
		}
	}
}

