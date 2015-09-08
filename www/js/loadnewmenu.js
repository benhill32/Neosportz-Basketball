document.addEventListener("deviceready", onDeviceReadymainindex, false);

function onDeviceReadymainindex() {
    deviceIDfunc = device.uuid;


    db.transaction(getMenusch, errorCBfunc, successCBfunc);


}

function getMenusch(tx) {


    var sql = "select Distinct DivisionName,DivisionID,_id from MobileApp_Schedule_Menu where Hide = 0 Group by DivisionName,DivisionID  order by DivisionOrderID";
    //  alert(sql);

    tx.executeSql(sql, [], getMenusch_success);
}


function getMenusch_success(tx, results) {
    $('#busy').hide();
    var len = results.rows.length;
    // alert(len);
    for (var i=0; i<len; i++) {
        var menu = results.rows.item(i);
        $('#schedulemenudiv').append('<li><a href="#" onclick="redirectschedules2(' + menu._id + ')">'+ menu.DivisionName + '</a></li>');
    }
}