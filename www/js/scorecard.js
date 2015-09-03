var db;
var dbCreated = false;
var IDhist = 0;
var id = getUrlVars()["ID"];
var gtoken =0;
var team1all = 0;
var team2all = 0;
var deviceIDscorecard;
var networkconnectionscore = 0;
document.addEventListener("deviceready", onDeviceReadyscore, false);
var playerhome = 0;
var playeraway = 0;
var timehome = 0;
var timeaway = 0;
var scoringname =0;
var Ref= 0;
var isadmin =0;
var clubedit = 0;
var DIVid = getUrlVars()["divID"];
function onDeviceReadyscore() {
    checkonlinescore()
    deviceIDscorecard = device.uuid;
  //  db = window.openDatabase("Neosportz_Football", "1.1", "Neosportz_Football", 200000);
  //  console.log("LOCALDB - Database ready");
   // db.transaction(gettoken, errorCBfunc, successCBfunc);

    if(networkconnectionscore !=0) {
        onclicksyncloaddata();
    }

    window.setTimeout(function(){
        db.transaction(getfliter1, errorCBfunc, successCBfunc);
    }, 1500);
}

function getfliter1(tx) {

    //  updateadmin();

    var sql = "select Ref,isadmin,Clubedit from MobileApp_LastUpdatesec";
   // alert(sql);
    tx.executeSql(sql, [], getfliter1_success);

}


function getfliter1_success(tx, results) {
    $('#busy').hide();
    var len = results.rows.length;


    if(len != 0) {
        var menu = results.rows.item(0);
        Clubedit = menu.Clubedit;
        Ref= menu.Ref;
        isadmin = menu.isadmin;
        db.transaction(getdata, errorCBfunc, successCBfunc);

    }
}

function checkonlinescore(){
    var networkState = navigator.connection.type;
    var states = {};
    states[Connection.UNKNOWN]  = '0';
    states[Connection.ETHERNET] = '2';
    states[Connection.WIFI]     = '2';
    states[Connection.CELL_2G]  = '1';
    states[Connection.CELL_3G]  = '1';
    states[Connection.CELL_4G]  = '1';
    states[Connection.NONE]     = '0';
    networkconnectionscore = states[networkState];
//alert(states[networkState]);

}








function getdata(tx) {
    var sql = "select ID,_id,DatetimeStart,HomeName,AwayName,Field,Latitude,Longitude,DivisionID ,DivisionName,HomeClubID,AwayClubID,HomeTeamID,AwayTeamID,HomeScore ,AwayScore ,UpdateDateUTC ,TournamentName,TournamentID ,DatetimeStartSeconds ,DivisionOrderID,ShowToAll,Final,halftime,fulltime,IsFinalScore from MobileApp_Results where ID = '" + id + "'";
    //alert(sql);
    tx.executeSql(sql, [], getMenu_success);
}



function getMenu_success(tx, results) {
    $('#busy').hide();
    var len = results.rows.length;
//alert(len);
    var menu = results.rows.item(0);
var Gameid =menu.ID;
        var res = (menu.DatetimeStart).split("T");
    $("#divbonus").hide();
    if(menu.IsFinalScore == 0) {


        $('#scorecard').empty().append('<Div class="mainmenuscore" >' +
        '<div class="bold size13 floatleft" align="center"  >' + menu.HomeName + '</div><div class="bold size13 floatleft" align="center"  >' + menu.AwayName + '</div>' +
        '<div class="floatleft" align="center" id="homescore"  >' + menu.HomeScore + '</div><div class="floatleft"  align="center" id="awayscore"  >' + menu.AwayScore + '</div>' +





        '<div id="divscore"  >' +
            '<Div class="row"  style="margin-left: 0px;margin-right: 0px;" >' +
            '<div class="col-xs-5 col-md-5"  ><input type="tel" id="txtHq1"  class="form-control"></div>' +
            '<div class="col-xs-2 col-md-2 paddingscore"   >Q1</div>' +
            '<div class="col-xs-5 col-md-5"   ><input type="tel" id="txtAq1"  class="form-control"></div>' +
            '</Div>' +
            '<Div class="row"  style="margin-left: 0px;margin-right: 0px;" >' +
            '<div class="col-xs-5 col-md-5"   ><input type="tel" id="txtHq2"  class="form-control"></div>' +
            '<div class="col-xs-2 col-md-2 paddingscore"   >Q2</div>' +
            '<div class="col-xs-5 col-md-5"  ><input type="tel" id="txtAq2"  class="form-control"></div>' +
            '</Div>' +
            '<Div class="row"  style="margin-left: 0px;margin-right: 0px;" >' +
            '<div class="col-xs-5 col-md-5"   ><input type="tel" id="txtHq3"  class="form-control"></div>' +
            '<div class="col-xs-2 col-md-2 paddingscore"    >Q3</div>' +
            '<div class="col-xs-5 col-md-5"   ><input type="tel" id="txtAq3"  class="form-control"></div>' +
            '</Div>' +
            '<Div class="row"  style="margin-left: 0px;margin-right: 0px;" >' +
            '<div class="col-xs-5 col-md-5"   ><input type="tel" id="txtHq4"  class="form-control"></div>' +
            '<div class="col-xs-2 col-md-2 paddingscore"    >Q4</div>' +
            '<div class="col-xs-5 col-md-5"   ><input type="tel" id="txtAq4"  class="form-control"></div>' +
            '</Div>' +
            '</div>' +

        '<div id="divhalffull" align="center"  >' +


        '<button id="btnsave" class="btn btn-warning" onclick="savegame(' + Gameid + ')" >Save</button><br>' +
        '<button id="btnapprove" class="btn btn-warning" onclick="gamestate(3,' + Gameid + ')" >Approve</button>' +
        '<button id="btnSync" class="btn btn-info" onclick="syncscore()" >Sync Data</button>' +
        '</div>' +
        '</Div>');



        db.transaction(gettoken, errorCBfunc, successCBfunc);



    }else{
        $('#scorecard').empty().append("Thanks for approving this game!");

    }

}

function syncscore(){

    onDeviceReadyscore();
}




function savegame(id){

    db.transaction(gettoken, errorCBfunc, successCBfunc);
   // alert(id);
    var hq1 = $( "#txtHq1" ).val();

    var hq2 = $( "#txtHq2" ).val();

    var hq3 = $( "#txtHq3" ).val();

    var hq4 = $( "#txtHq4" ).val();

    var aq1 = $( "#txtAq1" ).val();

    var aq2 = $( "#txtAq2" ).val();

    var aq3 = $( "#txtAq3" ).val();
    alert(aq3);
    var aq4 = $( "#txtAq4" ).val();
    alert(aq4);

    alert("gameid=" + id + "&H1st=" + hq1 + "&H2nd=" + hq2 + "&H3rd=" + hq3 + "&H4th=" + hq4 + "&A1st=" + aq1 + "&A2nd=" + aq2 + "&A3rd=" + aq3 + "&A4th=" + aq4 + "&deviceid=" + deviceIDscorecard + "&token=" + gtoken);

    var response = passscoretoserverscorecard("gameid=" + id + "&H1st = " + hq1 + "&H2nd = " + hq2 + "&H3rd = " + hq3 + "&H4th = " + hq4 + "&A1st = " + aq1 + "&A2nd = " + aq2 + "&A3rd = " + aq3 + "&A4th=" + aq4 + "&deviceid=" + deviceIDscorecard + "&token=" + gtoken)


    if(response = "{'Success' : [{'Message': 'Everything is Good'}]"){
        // alert(response);
        onclicksyncloaddata();
    }

}



function gamestate(IDD,id){


         if (IDD == 3) {

            db.transaction(function (tx) {
                tx.executeSql('Update MobileApp_Results set IsFinalScore = 1 where ID = ' + id);
                console.log("Update INTO MobileApp_Results");
            });
        }
    db.transaction(getdata, errorCBfunc, successCBfunc);


    halftimefulltimenow(id,IDD);

}



function getbonus(){
    db.transaction(gettoken, errorCBfunc, successCBfunc);
var home1 = 0;
var home2 =0;
var away1=0;
var away2 = 0;

    if ($('#homebonus1').prop('checked') == true){
        home1 = 1;
    }
    if ($('#homebonus2').prop('checked') == true){
        home2 =1;
    }
    if ($('#awaybonus1').prop('checked') == true){
        away1=1;
    }
    if ($('#awaybonus2').prop('checked') == true){
        away2=1;
    }


    var response =   passscoretoserverscorecard("gameidbonus=" + id + "&bonushome1=" + home1 + "&bonushome2=" + home2 + "&bonusaway1=" + away1 + "&bonusaway2=" + away2 + "&deviceid=" + deviceIDscorecard + "&token=" + gtoken)

   // alert(response);

    if(response = "{'Success' : [{'Message': 'Everything is Good'}]"){
      //  alert(response);
        onclicksyncloaddata();
    }



}



function getscore(team,value,name){
  checkonlinescore();
if(networkconnectionscore != 0) {

    playerhome = $('#drphometeam').val();
     playeraway = $('#drpawayteam').val();
     timehome = $('#drphometime').val();
     timeaway = $('#drpawaytime').val();
    scoringname = name;


    if (team == 0) {
        db.transaction(function (tx) {
            tx.executeSql('Update MobileApp_Results set AwayScore = AwayScore+' + value + ' where ID = ' + id);
            console.log("Update INTO MobileApp_Results");
        });
    } else if (team == 1) {
        db.transaction(function (tx) {
            tx.executeSql('Update MobileApp_Results set HomeScore = HomeScore+' + value + '  where ID = ' + id);
            console.log("Update INTO MobileApp_Results");
        });
    }

    //update score;
    db.transaction(getdata, errorCBfunc, successCBfunc);
    //update buttons

    //getting token for sync
    db.transaction(gettoken, errorCBfunc, successCBfunc);
    db.transaction(getscorefromtable, errorCBfunc, successCBfunc);
}else{

 //   alert("You don't have access to internet!");
}
}

function getscorefromtable(tx) {
    var sql = "select ID,HomeScore ,AwayScore from MobileApp_Results where ID = '" + id + "'";
    //  alert(sql);
    tx.executeSql(sql, [], getscorefromtable_success);
}

function getscorefromtable_success(tx, results) {

    $('#busy').hide();
    var len = results.rows.length;
    var menu = results.rows.item(0);
  //  alert("gameid=" + menu.ID + "&home=" + menu.HomeScore + "&away=" + menu.AwayScore + "&deviceid=" + deviceIDscorecard + "&token=" + gtoken);




 var response = passscoretoserverscorecard("gameid=" + menu.ID + "&scoringname=" + scoringname + "&homeplayer=" + playerhome + "&awayplayer=" + playeraway + "&hometime=0&awaytime=0&home=" + menu.HomeScore + "&away=" + menu.AwayScore + "&deviceid=" + deviceIDscorecard + "&token=" + gtoken)

    //alert(response);

    if(response = "{'Success' : [{'Message': 'Everything is Good'}]"){
       // alert(response);
        onclicksyncloaddata();
    }


}




function gettoken(tx) {
    var sql = "select token from MobileApp_LastUpdatesec";
    //  alert(sql);
    tx.executeSql(sql, [], gettoken_success);
}

function gettoken_success(tx, results) {
    $('#busy').hide();
    var len = results.rows.length;
    var menu = results.rows.item(0);

    gtoken = menu.token;
alert(gtoken);
}

function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}