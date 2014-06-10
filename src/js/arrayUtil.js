// 
// arrayUtil.js - datatablesでの Insert/Raise/Lower用
//  
function xsort(sqs,col,order){
    //二次元配列のソート
    //col:並べ替えの対象となる列
    //order:1=昇順、-1=降順
    sqs.sort(function(a,b){
        return((a[col]-b[col])*order);
    });
    return(sqs);
}

Array.prototype.asort = function(key) {
    this.sort(function(a, b) {
        return (a[key] > b[key]) ? 1 : -1;
    });
}

Array.prototype.arsort = function(key) {
    this.sort(function(a, b) {
        return (a[key] < b[key]) ? 1 : -1;
    });
}
