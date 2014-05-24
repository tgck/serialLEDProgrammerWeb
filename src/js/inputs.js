// 
// inputs.js
//   入力フィールドからの値取得 & 値セット関数群
// 

// 
// 画面項目値からオブジェクト化
// 
function makeSystemRecord(){
	var str = [];
	$("#list-1 input, #list-1 select").each(function(){str.push($(this).val())});
	return CmdSystemFromStr(str);
}
function makeColorRecord(){
	var str = [];
	$("#list-2 input, #list-2 select").each(function(){str.push($(this).val())});
	return CmdColorFromStr(str);
}
function makeDelayRecord(){
	var str = [];
	$("#list-3 input").each(function(){str.push($(this).val())});
	return CmdWaitFromStr(str);
}
function makeShiftRecord(){
	var str = [];
	$("#list-4 input, #list-4 select").each(function(){str.push($(this).val())});
	return CmdShiftFromStr(str);
}
function makeRainbowRecord(){
	var str = [];
	$("#list-5 input, #list-5 select").each(function(){str.push($(this).val())});
	return CmdRainbowFromStr(str);
}
function makeBarRecord(){
	var str = [];
	$("#list-6 input, #list-6 select").each(function(){str.push($(this).val())});
	return CmdBarFromStr(str);
}
function makeSeesawRecord(){
	var str = [];
	$("#list-7 input").each(function(){str.push($(this).val())});
	return CmdSeesawFromStr(str);
}
function makeLoopRecord(){
	var str = [];
	$("#list-8 input").each(function(){str.push($(this).val())});
	return CmdLoopFromStr(str);
}

//
// 画面項目への値セット
//
function restoreAll(){
	restoreSystem();
	restoreColor();  // FIXME
	restoreDelay();
	restoreShift();
	restoreRainbow();
	restoreBar(); // FIXME
	restoreSeesaw(); // FIXME
	restoreLoop();
}
function restoreSystem(){
	var src = defaults.SLEDPDefaults.system;
	var tgt = $("#list-1 input, #list-1 select");
	restore(tgt, src);
}
function restoreColor(){
	var src = defaults.SLEDPDefaults.color;
	var tgt = $("#list-2 input, #list-2 select");
	restore(tgt, src);
}
function restoreDelay(){
	var src = defaults.SLEDPDefaults.delay;
	var tgt = $("#list-3 input");
	restore(tgt, src);
}
function restoreShift(){
	var src = defaults.SLEDPDefaults.shift;
	var tgt = $("#list-4 input, #list-4 select");
	restore(tgt, src);
}
function restoreRainbow(){
	var src = defaults.SLEDPDefaults.rainbow;
	var tgt = $("#list-5 input, #list-5 select");
	restore(tgt, src);
}
function restoreBar(){
	var src = defaults.SLEDPDefaults.bar;
	var tgt = $("#list-6 input, #list-6 select");
	restore(tgt, src);
}
function restoreSeesaw(){
	var src = defaults.SLEDPDefaults.seesaw;
	var tgt = $("#list-7 input");
	restore(tgt, src);
}
function restoreLoop(){
	var src = defaults.SLEDPDefaults.loop;
	var tgt = $("#list-8 input");
	restore(tgt, src);
}
function restore(tgt, src){
	var idx = 0;
	for (var key in src) {
		tgt.eq(idx).val(src[key]); // jQuery
		idx++;
	}
}
