//
// ColorPicker関連
//

// TODO : SVの変換を入れる(コマンドとUIのSVレンジがアンマッチ)

var cp = $("#colorpicker");

// UI上の値をColor/Barペインに反映する
function fillPaneValWithUIVal(){	
	$(".cp_linked_h").val( $(".colorpicker_hsb_h input").val() );
	$(".cp_linked_s").val( $(".colorpicker_hsb_s input").val() );
	$(".cp_linked_b").val( $(".colorpicker_hsb_b input").val() );
}

// Color/Barペイン上の値をUIに反映する
function fillUIValWithPaneVal(){
	$(".colorpicker_hsb_h input").val( $(".cp_linked_h").val() );
	$(".colorpicker_hsb_s input").val( $(".cp_linked_s").val() );
	$(".colorpicker_hsb_b input").val( $(".cp_linked_b").val() );
}

// 非表示
function hideColorPicker(){
	$("#colorpicker").css('display', 'none');
}
// 表示
function showColorPicker(){
	$("#colorpicker").css('display', 'block');
}

// GUI初期化(イベント割当)
//   タブにイベントを割当
function bindColorPickerEvents(){
	
	$("#tab1").bind('click', function(){ hideColorPicker(); });
	$("#tab3").bind('click', function(){ hideColorPicker(); });
	$("#tab4").bind('click', function(){ hideColorPicker(); });
	$("#tab5").bind('click', function(){ hideColorPicker(); });
	$("#tab7").bind('click', function(){ hideColorPicker(); });

	// Color ペインクリックイベント
	$("#tab2").bind('click', function(){
		// disconnect bar pane's elems from ColorPicker
		$("#bar_input0").removeClass("cp_linked_h");
		$("#bar_input1").removeClass("cp_linked_s");
		$("#bar_input2").removeClass("cp_linked_b");
		
		// connect color pane's elems to ColorPicker
		$("#col_input0").addClass("cp_linked_h");
		$("#col_input1").addClass("cp_linked_s");
		$("#col_input2").addClass("cp_linked_b");
		
		fillUIValWithPaneVal();
		showColorPicker();
	});
	
	// Bar ペインクリックイベント
	$("#tab6").bind('click', function(){
		// disconnect color pane's elems from ColorPicker
		$("#col_input0").removeClass("cp_linked_h");
		$("#col_input1").removeClass("cp_linked_s");
		$("#col_input2").removeClass("cp_linked_b");
		
		// connect bar pane's elems to ColorPicker
		$("#bar_input0").addClass("cp_linked_h");
		$("#bar_input1").addClass("cp_linked_s");
		$("#bar_input2").addClass("cp_linked_b");
		
		fillUIValWithPaneVal();
		showColorPicker();
	});

	
	// Color/Barペイン上のinputの変更をColorPickerUI上のInputに反映する
	//   ColorPickerと接続しているinputは同時には一方のペイン上にのみ存在する前提を活用し、
	//   onChangeイベントをColor/Bar双方のペインに常時設定しておくこと(により実装をシンプルに保つ)
	$("#col_input0, #bar_input0").bind('change', function(){
		$(".colorpicker_hsb_h input").val($(".cp_linked_h").val());
	});
	$("#col_input1, #bar_input1").bind('change', function(){
		$(".colorpicker_hsb_s input").val($(".cp_linked_s").val());
	});
	$("#col_input2, #bar_input2").bind('change', function(){
		$(".colorpicker_hsb_b input").val($(".cp_linked_b").val());
	});
	// --- colorpicker end
}

// UI初期化
function initColorPicker(){
	$("#colorpicker").ColorPicker({
		flat: true,
		onChange: function() { 
			fillPaneValWithUIVal();
			return false;
		}
	});
	
	bindColorPickerEvents();	
}


