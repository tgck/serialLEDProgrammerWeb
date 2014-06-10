function initDataTable() {

	var table = $('#example').dataTable({
		"bPaginate": true,
		"bLengthChange": false,
		"bFilter": false,
		"bSort": false,
		"bInfo": false,
		"bAutoWidth": false,
		"scrollY": false, // false: スクロールを許可しない
		"scrollCollapse": false, // false: レコード長に応じてtableの高さを可変
		"paging": false,
		"jQueryUI": true
	});

	$('#example tbody').on( 'click', 'tr', function () {
		if ( $(this).hasClass('selected') ) {
			$(this).removeClass('selected');
		} else {
			table.$('tr.selected').removeClass('selected');
			$(this).addClass('selected');
//			alert($(this).index());
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
		
		if(obj.length != 0){
			if(json_text != null){
				// テーブルからコマンドオブジェクトを生成する
				var oTable = $('#example').dataTable();
				// クリア
				oTable.fnClearTable(false);
				// テーブル追加
				oTable.fnAddData(obj, true);
			}
		}
	}
}

