document.addEventListener("deviceready", onDeviceReadymainmenu, false);
var schstring = "";
var resultsstring = "";
var standstring = "";

function onDeviceReadymainmenu() {
    deviceIDfunc = device.uuid;


    db.transaction(getMenusch, errorCBfunc, successCBfunc);


}

function getMenusch(tx) {


    var sql = "select Distinct DivisionName,DivisionID,_id from MobileApp_Schedule_Menu where Hide = 0 Group by DivisionName,DivisionID  order by DivisionOrderID";
    //  alert(sql);

    tx.executeSql(sql, [], getMenusch_success);
}


function getMenusch_success(tx, results) {

    var len = results.rows.length;
    // alert(len);
    for (var i=0; i<len; i++) {
        var menu = results.rows.item(i);
        schstring += '<li><a href="#" onclick="redirectschedules2(' + menu._id + ')">'+ menu.DivisionName + '</a></li>';


    }
   // alert(schstring);

    db.transaction(getMenuresult, errorCBfunc, successCBfunc);
}



function getMenuresult(tx) {
    var sql = "select Distinct DivisionName,DivisionID,_id from MobileApp_Results_Menu  where Hide = 0  Group by DivisionName,DivisionID  order by DivisionOrderID";
    // var sql = "select Distinct DivisionName,DivisionID from MobileApp_Schedule_Menu Group by DivisionName,DivisionID  order by DivisionOrderID";


    // alert(sql);
    tx.executeSql(sql, [], getMenuresult_success);
}


function getMenuresult_success(tx, results) {
    $('#busy').hide();
    var len = results.rows.length;
    //  alert(len);
    for (var i=0; i<len; i++) {
        var menu = results.rows.item(i);

        resultsstring+='<li><a href="#" onclick="redirectresults(' + menu._id + ')">'+ menu.DivisionName + '</a></li>';


    }

    db.transaction(getMenustandings, errorCBfunc, successCBfunc);
}


function getMenustandings(tx) {
    var sql = "select _id, TournamentName,UpdateDateUTC ,OrderID from MobileApp_Results_Table_Menu  where Hide = 0 order by OrderID,TournamentName";
    //alert(sql);
    tx.executeSql(sql, [], getMenustandings_success);
}


function getMenustandings_success(tx, results) {
    $('#busy').hide();
    var len = results.rows.length;
    // alert(len);
    for (var i=0; i<len; i++) {
        var menu = results.rows.item(i);

        standstring +='<li><a href="#" onclick="redirectstandings(' + menu._id + ')">'+ menu.TournamentName + '</a></li>';

    }





        $('#menu').show();
        $("#schedulemenudiv").append(schstring);
        $("#resultmenudiv").append(resultsstring);
        $("#standingsmenudiv").append(standstring);
        $('nav#menu').mmenu();




}


function redirectstandings(ID){

    if(document.getElementById("indexdiv")==null) {

        window.location = "../pages/standings.html?id=" + ID;
    }else{

        window.location = "pages/standings.html?id=" + ID;
    }

}

function redirectresults(ID){
    if(document.getElementById("indexdiv")==null) {
        window.location = "../pages/results.html?id=" + ID;
    }else{

        window.location = "pages/results.html?id=" + ID;
    }
}

function redirectschedules2(ID){
    if(document.getElementById("indexdiv")==null) {
    window.location = "../pages/schedules.html?id=" + ID;
    }else{

        window.location = "pages/schedules.html?id=" + ID;
    }
}
