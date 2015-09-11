document.addEventListener("deviceready", onDeviceReadyscoringadmin, false);
var deviceIDscoreadmin = 0;
var networkconscoreadmin= "";
var scoretokenadmin= "";


function onDeviceReadyscoringadmin() {
    deviceIDscoreadmin = device.uuid;

    onOfflinescoreadmin();
    db.transaction(gettokenscoreadmin, errorCBfunc, successCBfunc);
    db.transaction(getadmindata, errorCBfunc, successCBfunc);

}


function onOfflinescoreadmin(){

    var networkState = navigator.connection.type;

    var states = {};
    states[Connection.UNKNOWN]  = '0';
    states[Connection.ETHERNET] = '2';
    states[Connection.WIFI]     = '2';
    states[Connection.CELL_2G]  = '1';
    states[Connection.CELL_3G]  = '1';
    states[Connection.CELL_4G]  = '1';
    states[Connection.NONE]     = '0';

    networkconscoreadmin = states[networkState];
//alert(states[networkState]);

}

function gettokenscoreadmin(tx) {
    var sql = "select token from MobileApp_LastUpdatesec";
    //  alert(sql);
    tx.executeSql(sql, [], gettokenscoreadmin_success);
}

function gettokenscoreadmin_success(tx, results) {
    $('#busy').hide();
    var len = results.rows.length;
    var menu = results.rows.item(0);

    scoretokenadmin = menu.token;

}
function getadmindata(tx) {
    var sql = "select ms.ID,ms.name as Pname,mc.name as Cname from MobileApp_Scoringapplied as ms inner join MobileApp_clubs as mc on ms.ClubID = mc.ID where ms.approved = 0";
      alert(sql);
    tx.executeSql(sql, [], getadmindata_success);
}

function getadmindata_success(tx, results) {

    var len = results.rows.length;
alert(len);

    for (var i=0; i<len; i++) {
        var menu = results.rows.item(i);
        $("#divscoringreq").empty();
        $("#divscoringreq").append("<div class='row'>" +
            "<div class='col-xs-4 col-md-4'>" + menu.Pname +

            "</div>" +
            "<div class='col-xs-4 col-md-4'>" + menu.Cname +

            "</div>" +
            "<div class='col-xs-4 col-md-4'><button class='btn btn-success'>Approve</button>" +


            "</div>" +
            "</div>");




    }

}

