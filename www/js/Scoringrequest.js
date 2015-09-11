
document.addEventListener("deviceready", onDeviceReadyscoring, false);
var deviceIDscore = 0;




function onDeviceReadyscoring() {
    deviceIDscore = device.uuid;

    $("#lblappid").val(deviceIDscore)
    db.transaction(getdatascore, errorCBfunc, successCBfunc);
}

function getdatascore(tx) {

    var sql = "select ID ,name,Fav from MobileApp_clubs order by name";
    //alert(sql);
    tx.executeSql(sql, [], getdatascore_success);
}

function getdatascore_success(tx, results) {
    $('#busy').hide();
    var len = results.rows.length;
//alert(len);
    var option = '';
    for (var i = 0; i < len; i++) {
        var menu = results.rows.item(i);
        option += '<option value="' + menu.ID + '">' + menu.name + '</option>';

    }

    $('#idclub').append(option);
}
