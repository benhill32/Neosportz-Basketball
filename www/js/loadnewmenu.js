document.addEventListener("deviceready", onDeviceReadymainmenu, false);
var schstring = "";
var resultsstring = "";
var standstring = "";
var Clubstring = "";
var IDhistall = 0;
var IDconall =0;
var styleall= "";
var favidall= 0;
function onDeviceReadymainmenu() {
    deviceIDfunc = device.uuid;


    db.transaction(getMenusch, errorCBfunc, successCBfunc);


}

function closemenu(){

    $("#menu").hide();
}


function getMenusch(tx) {


    var sql = "select Distinct DivisionName,DivisionID,_id from MobileApp_Schedule_Menu where Hide = 0 Group by DivisionName,DivisionID  order by DivisionOrderID";
    // alert(sql);

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

    var sql = "select ID,_id ,name,UpdateDateUTC ,Base64,replace(History, '###$$###', '<br>') as History,replace(Contacts, '###$$###', '<br>') as Contacts,UpdateSecondsUTC,Color,Fav from MobileApp_clubs order by name";
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

        if(menu.Fav == 1){
            styleall = "<span class='glyphicon glyphicon-ok' aria-hidden='true'></span>";
            favidall = menu.ID;
        }else{
            styleall = "";

        }

        Clubstring+='<li id="clubmenu' + menu.ID + '"><a href="#">'+ imgg + "  " + menu.name + '  ' + styleall + '</a>' +
            '<ul>' +
            '<li data-toggle="modal" data-target="#basicModalclubhistory"><a href="#"  onclick="loadhistoryall(' + menu.ID + ')">Club History</a></li>' +
            '<li data-toggle="modal" data-target="#basicModalclubContact"><a href="#"   onclick="loadcontactsall(' + menu.ID + ')">Club Contacts</a></li>' +
            '<li><a href="#" onclick="updatefollowall(' + menu.ID + ')">Set as Favourite</a></li>' +
            '</ul>' +
            '</li>';



    }


    if(document.getElementById("indexdiv")!=null) {

        //$("#menu").show();
    }




    $("#menu").show();


    $("#schedulemenudiv").empty();
    $("#resultmenudiv").empty();
    $("#standingsmenudiv").empty();
    $("#clubsmenudiv").empty();

    $("#schedulemenudiv").append(schstring);
    $("#resultmenudiv").append(resultsstring);
    $("#standingsmenudiv").append(standstring);
    $("#clubsmenudiv").append(Clubstring);
    $(function() {
        $('nav#menu').mmenu().stop();
    });

    alert("create menu");
}


function updatefollowall(ID){


        clearcurrentfavteam(ID)

        db.transaction(function(tx) {
            tx.executeSql('Update MobileApp_LastUpdatesec set hasclub = 0');
            console.log("Update MobileApp_LastUpdatesec");
        });


        addfavteam(ID);

        clearotherfavteam(ID)

        addfavclub();


    window.setTimeout(function(){
        window.location.reload();
    }, 1500);







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



function loadhistoryall(ID){
    IDhistall = ID;
    //$('body').css('position','fixed');
    //  db = window.openDatabase("Neosportz_Football", "1.1", "Neosportz_Football", 200000);
    db.transaction(loadhistoryall_next, errorCBfunc, successCBfunc);

}

function loadhistoryall_next(tx) {

    var sql = "select replace(History, '###$$###', '<br>') as History,name from MobileApp_clubs where ID=" + IDhistall;
    //  alert(sql);
    tx.executeSql(sql, [], loadhistoryall_next_success);
}

function loadhistoryall_next_success(tx, results) {
    $('#busy').hide();
    var len = results.rows.length;

    var menu = results.rows.item(0);
    $('#clubhistorydiv').empty();
    if(document.getElementById("indexdiv")==null) {
        $('#clubhistorydiv').append('<img src="../img/info.png" height="20"> Club History : ' + menu.name + '');
    }else{

        $('#clubhistorydiv').append('<img src="img/info.png" height="20"> Club History : ' + menu.name + '');
    }
    $('#modelhistoryall').empty();
    $('#modelhistoryall').append( '<div>1</div>');
    $('#modelhistoryall').empty();
    $('#modelhistoryall').append( '<div>' + menu.History + '</div>');
}

function loadcontactsall(ID){
    IDconall = ID;

    db.transaction(loadcontactsall_next, errorCBfunc, successCBfunc);

}

function loadcontactsall_next(tx) {

    var sql = "select replace(Contacts, '###$$###', '<br>') as Contacts,name from MobileApp_clubs where ID=" + IDconall;
    //  alert(sql);
    tx.executeSql(sql, [], loadcontactsall_next_success);
}

function loadcontactsall_next_success(tx, results) {
    $('#busy').hide();
    var len = results.rows.length;
//alert(len);

    var menu = results.rows.item(0);

    $('#clubcontactdiv').empty();
    if(document.getElementById("indexdiv")==null) {
        $('#clubcontactdiv').append('<img src="../img/info.png" height="20"> Club Contact :  ' + menu.name);
    }else{
        $('#clubcontactdiv').append('<img src="img/info.png" height="20"> Club Contact :  ' + menu.name);
    }

    $('#modelcontactall').empty();
    $('#modelcontactall').append( '<div>' + menu.Contacts + '</div>');

}