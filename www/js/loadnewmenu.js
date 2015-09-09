document.addEventListener("deviceready", onDeviceReadymainmenu, false);
var schstring = "";
var resultsstring = "";
var standstring = "";
var Clubstring = "";
function onDeviceReadymainmenu() {
    deviceIDfunc = device.uuid;


    db.transaction(getMenusch, errorCBfunc, successCBfunc);


}

function closemenu(){

    $("#menu").hide();
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



    db.transaction(getdataclubs, errorCBfunc, successCBfunc);




}


function getdataclubs(tx) {

    var sql = "select ID,_id ,name,UpdateDateUTC ,Base64,replace(History, '###$$###', '<br>') as History,replace(Contacts, '###$$###', '<br>') as Contacts,UpdateSecondsUTC,Color from MobileApp_clubs order by name";
    //alert(sql);
    tx.executeSql(sql, [], getdataclubs_success);
}

function getdataclubs_success(tx, results) {
    $('#busy').hide();
    var len = results.rows.length;
//alert(len);
    for (var i=0; i<len; i++) {
        var menu = results.rows.item(i);
        var imgg = "";
        if(menu.Base64 != "null"){
            imgg = '<img src="data:image/png;base64,' + menu.Base64 + '"  align="left" height="40">';
        }


        Clubstring+='<li><a href="#">'+ imgg + menu.name + '</a></li>';


      // $('#mainmenu').append('<Div class="mainmenuresult" align="left"  >' +
      //      '<div class="bold size13" style="padding-bottom:7px;"   >' + imgg + menu.name  +
      //      '<img src="../img/info.png" height="25" align="right" data-toggle="modal" data-target="#basicModalContact" onclick="loadcontacts(' + menu.ID + ')">' +
       //     '<img src="../img/team.png" onclick="redirectplayer(' + menu.ID + ')"    align="right" height="25">' +
      //      '</div>' +
       //     '<div class="size11" data-toggle="modal" data-target="#basicModalclub" onclick="loadhistory(' + menu.ID + ')">' + menu.History.substring(0,200) + '....<span' +
       //     'data-toggle="modal" class="size11 blue" data-target="#basicModalclub" onclick="loadhistory(' + menu.ID + ')"  >Read More</span></div>' +
       //     '</Div>');
    }


    if(document.getElementById("indexdiv")!=null) {

        //$("#menu").show();
    }

    $("#menu").show();

    $("#schedulemenudiv").append(schstring);
    $("#resultmenudiv").append(resultsstring);
    $("#standingsmenudiv").append(standstring);
    $("#clubsmenudiv").append(Clubstring);
    $(function() {
        $('nav#menu').mmenu();
    });


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
