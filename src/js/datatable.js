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
	
	// データ操作は以下を参照
	// http://datatables.net/examples/api/
}
