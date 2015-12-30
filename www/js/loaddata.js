var db;
var dbCreated = false;

var d = new Date();
//alert(d);
var day = d.getDate();
var month = d.getMonth();
var year = d.getFullYear();
var hours= d.getHours();
var stringresultID = 0;
var datenow = (day + '' + month+ '' + year);
var milliesecs = d.getTime();
var datenowsec = Math.round((milliesecs/1000));
var golbaltoken= "";
var networkconnection = "";
var deviceIDfunc;
var devicePlatformfunc;
var chkrefreshdata = 0;
var archiveyear=0;
document.addEventListener("deviceready", onDeviceReadyloaddata, false);
var tokenldata ="";
var start = 0;
var menufrommansync = 0;
// Cordova is ready
//

var appversionlocalf = '1.2.2';


function onDeviceReadyloaddata() {
    pushnotifiy();

    console.log("LOCALDB - Database ready");
    deviceIDfunc = device.uuid;
    devicePlatformfunc = device.platform;
     getnetworkdetails();


    document.addEventListener("offline", onOffline, false);
    db.transaction(getresultids, errorCBfunc, successCBfunc);



// select the right Ad Id according to platform

}
//db.transaction(getresultids, errorCBfunc, successCBfunc);

function onOffline()
{
  //  window.plugins.toast.showShortCenter('You are offline', function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)});
    $('#settingdeleteall').prop('disabled', false);
    $('#settingsync').prop('disabled', false);

}





function getnetworkdetails(){

    document.addEventListener("online", checkonline, false);
}

function checkonline(){

    var networkState = navigator.connection.type;

    var states = {};
    states[Connection.UNKNOWN]  = '0';
    states[Connection.ETHERNET] = '2';
    states[Connection.WIFI]     = '2';
    states[Connection.CELL_2G]  = '1';
    states[Connection.CELL_3G]  = '1';
    states[Connection.CELL_4G]  = '1';
    states[Connection.NONE]     = '0';

    networkconnection = states[networkState];
//alert(states[networkState]);

}

function refreshdata(){

    checkonline();

  //  $('#indexloadingdata').modal('show');
    checkdatabaseloaddata();

}





function checkdatabaseloaddata(){

    var xmlHttp = null;
    xmlHttp = new XMLHttpRequest();
    var json = "0";
    if(networkconnection!=0) {
        xmlHttp.open("GET", 'http://bball.neosportz.com/checkdatabase.aspx?deviceID=' + deviceIDfunc, false);
        xmlHttp.send();
    //     alert('http://admin.adme.kiwi/checkdatabase.aspx?deviceID=' + deviceIDfunc);
        json = xmlHttp.responseText;
    }else{

       // db.transaction(getMenusch, errorCBfunc, successCBfunc);
    }

   // alert(json);
    if(json == "0"){

        db.transaction(populateDB, errorCBfunc, successCBfunc);
    }else  if(json == "1"){
        // alert(json);
        if(document.getElementById("indexdiv")!=null) {
           // $('#indexloadingdata').modal('hide');
            window.plugins.spinnerDialog.hide();

            if (devicePlatformfunc == "Android") {
                $('#modelnewdatabase').modal('show');
            }
            else if (devicePlatformfunc == "iOS") {

                $('#modelnewdatabaseapple').modal('show');
            }
        }else{

            db.transaction(populateDB, errorCBfunc, successCBfunc);
        }

    }else{
        db.transaction(populateDB, errorCBfunc, successCBfunc);
    }
}



function loadnewtable(){
 //   $('#busy').show();
  //  blankLastUpdatesec();
  //  pushnotifiy();

    db.transaction(populateDB, errorCBfunc, successCBfunc);
}

function populateDB(tx){
    // $('#busy').show();
    var sql = "select Count(Datesecs) as Count,syncwifi,Datesecs from MobileApp_LastUpdatesec";
   // alert(sql);
    tx.executeSql(sql, [], populateDB1,errorCreatetable);

}

function errorCreatetable(err) {

    createtables();

}

function createtables(){
    $.when(db.transaction(createDB, errorCBfunc, successCBfunc)).done(function() {

        db.transaction(populateDB, errorCBfunc, successCBfunc);
    });



}

function populateDB1(tx,results) {
    checkonline();
    var row = results.rows.item(0);
 //   alert(row);
 //   alert(row.Count);
    if(row.Count ==0){


            //$('#indexloadingdata').modal('show');


        $.when(blankLastUpdatesec()).done(function() {
          // $.when( pushnotifiy()).done(function() {
               // db.transaction(populateDB, errorCBfunc, successCBfunc);
               db.transaction(gettokenregion, errorCBfunc, successCBfunc);
            start =1;
         //   });
        });

    }else{
        start=0;

        var sql = "select Datesecs,datemenus,token,Region from MobileApp_LastUpdatesec";

        if((row.syncwifi ==1 && networkconnection==2) || ((row.syncwifi ==0 &&  networkconnection!=0))){

             tx.executeSql(sql, [], getchecksync,errorCBfunc);
        }else{
            window.plugins.spinnerDialog.hide();
            db.transaction(getMenusch, errorCBfunc, successCBfunc);
        }
    }
}

function getresultids(tx) {
    sql = "select ID from MobileApp_Results";
    tx.executeSql(sql, [], getresultids_success);
}

function getresultids_success(tx, results) {

    var len = results.rows.length;
    stringresultID =0;
    for (var i=0; i<len; i++) {
        var menu = results.rows.item(i);
        stringresultID = stringresultID + menu.ID + ",";
    }
}


function passdatatoserver(){

    var deviceid = "dsdsadsadasd";
    var http = new XMLHttpRequest();
    var url = "http://bball.neosportz.com/loaddatafromapp.aspx";
    var params = "?token=" + golbaltoken + "&deviceid=" + deviceid;
    http.open("POST", url + params, true);

    http.onreadystatechange = function() {//Call a function when the state changes.
        if(http.readyState == 4 && http.status == 200) {
        }
    }
    http.send();

}

function getchecksync(tx, results) {

        var row = results.rows.item(0);

        var datemenus= row.datemenus;

        var datenowsecsync = row.Datesecs;

        var region = row.Region;
        var datenow = new Date();
        var timenow = datenow.getTime();
        var yearnow = datenow.getFullYear()

        var dif = (timenow/1000)-(datenowsecsync);

        if (document.getElementById("newsmain") != null) {
            dif = 100000000;
        }

        if (dif >= "600") {


                  //  $('#indexloadingdata').modal('show');

            window.plugins.spinnerDialog.show(null, null, true);

            var xmlHttp = null;
            xmlHttp = new XMLHttpRequest();
            xmlHttp.open("GET", 'http://bball.neosportz.com/mobiledata.aspx?deviceID=' + deviceIDfunc + '&token=' + row.token + '&sec=' + datenowsecsync + '&resultids=' + stringresultID + '&start=0&region=' + region + '&year=' + yearnow, false);
           alert('http://bball.neosportz.com/mobiledata.aspx?deviceID=' + deviceIDfunc + '&token=' + row.token + '&sec=' + datenowsecsync + '&resultids=' + stringresultID + '&start=0&region=' + region + '&year=' + yearnow);
            xmlHttp.send();

            var json = xmlHttp.responseText;

            if (json == "{'Error' : [{'Message': 'Something went wrong'}]") {

                errorclosemodel();
            } else {

            var obj = JSON.parse(json);



            syncmaintables(obj,yearnow);
            }
        }else{


            db.transaction(getMenusch, errorCBfunc, successCBfunc);

        }

}

function errorclosemodel(){
   // $('#mainfore').removeClass('mainforeground2');
   // $('#mainfore').addClass('mainforeground');
  // $('#indexloadingdata').modal('hide');
    window.plugins.spinnerDialog.hide();
    if (document.getElementById("indexdiv") != null) {
        showdivindex();
    }
    window.plugins.toast.showLongBottom('Something went wrong! Please sync data again \n If problem persists contact helpdesk@neocom.co.nz', function (a) {console.log('toast success: ' + a)}, function (b) {alert('toast error: ' + b)});
    db.transaction(getoneoff, errorCBfunc, successCBfunc);
    db.transaction(getMenusch, errorCBfunc, successCBfunc);
    randomfunctions();
}

function closemodel(){
   // alert("close");

   // $('#indexloadingdata').modal('hide');
    window.plugins.spinnerDialog.hide();


   // window.plugins.toast.showLongBottom('Your App is Updated!', function (a) {console.log('toast success: ' + a)}, function (b) {alert('toast error: ' + b)});
    db.transaction(getsyncdateload, errorCBfunc, successCBfunc);




}


function getsyncdateload(tx) {
    var sql = "select Datesecs, syncwifi,Region from MobileApp_LastUpdatesec";
    //  alert(sql);
    tx.executeSql(sql, [], getsyncdateload_success2);
}

function getsyncdateload_success2(tx, results) {


    var len = results.rows.length;

    var menu = results.rows.item(0);
    //   alert(menu.Datesecs);
    var dateme = new Date((menu.Datesecs)*1000);
    var wifi = menu.syncwifi;

    var month = new Array();
    month[0] = "Jan";
    month[1] = "Feb";
    month[2] = "Mar";
    month[3] = "Apr";
    month[4] = "May";
    month[5] = "Jun";
    month[6] = "Jul";
    month[7] = "Aug";
    month[8] = "Sep";
    month[9] = "Oct";
    month[10] = "Nov";
    month[11] = "Dec";


   // alert("lastsyncdate");

    $('#lastsyncdate').empty();
    if(dateme.getFullYear() != 1970) {
        $('#lastsyncdate').append("<strong>Last sync time</strong> <br>" + dateme.getDate() + " " + month[dateme.getMonth()] + " " + dateme.getFullYear() + " " + (dateme.getHours()) + ":" + ("0" + dateme.getMinutes()).slice(-2) + ":" + ("0" + dateme.getSeconds()).slice(-2))
    }




    if (menufrommansync == 0) {

        db.transaction(getMenusch, errorCBfunc, successCBfunc);
    }else{
        if (document.getElementById("scorecard") != null) {

        }
        else if (document.getElementById("addnewfeed") != null)
        {


        }
        else
        {
            location.reload(true);
        }





    }


    randomfunctions();
}






function closemodelarchive(){

    $('#indexloadingdata').modal('hide');

    window.plugins.toast.showLongBottom('Your App is Updated!', function (a) {console.log('toast success: ' + a)}, function (b) {alert('toast error: ' + b)});


  //  randomfunctions();
    loadarchiveyear();
}

function closemodelRegion(){
  //  $('#mainfore').removeClass('mainforeground2');
 //   $('#mainfore').addClass('mainforeground');
    //$('#indexloadingdata').modal('hide');
    window.plugins.spinnerDialog.hide();
  //  window.plugins.toast.showLongBottom('Your App is Updated!', function (a) {console.log('toast success: ' + a)}, function (b) {alert('toast error: ' + b)});
    showregion();

}
function reloadindividual(){


    window.plugins.spinnerDialog.hide();
    if (document.getElementById("divschedules") != null) {
        $('#loadinggears').hide();
        db.transaction(getdatasch, errorCBfunc, successCBfunc)
    }

    if (document.getElementById("newsmain") != null) {
        $.mobile.loading().hide();
        db.transaction(getfirstnew, errorCBfunc, successCBfunc);
    }

}



function randomfunctions(){

//alert("randomfunctions");
    if (document.getElementById("divschedules") != null) {

        db.transaction(getflitersch, errorCBfunc, successCBfunc);

    }
    if (document.getElementById("divresults") != null) {
        db.transaction(getfliterresult, errorCBfunc, successCBfunc);
    }


    if(document.getElementById("divscoringreqadmin") != null){

        onDeviceReadyscoringadmin();
    }



}


function countProperties(obj) {

    var prop;
    var prop2;
    var propCount = 0;

    $.each(obj.App_Results, function (idx, obj) {
        propCount++;
    });


    $.each(obj.clubs, function (idx, obj) {
        propCount++;
    });

    $.each(obj.App_Schedule, function (idx, obj) {
        propCount++;
    });


    $.each(obj.clubsimages, function (idx, obj) {
        propCount++;
    });

    $.each(obj.vwApp_Teams, function (idx, obj) {
        propCount++;
    });

    $.each(obj.vwApp_News_v_2, function (idx, obj) {
        propCount++;
    });

    $.each(obj.App_Players, function (idx, obj) {
        propCount++;
    });

    $.each(obj.App_Players_Images, function (idx, obj) {
        propCount++;
    });

    $.each(obj.ScoringTable, function (idx, obj) {
        propCount++;
    });

    db.transaction(function (tx) {
        propCount++;
    });

    $.each(obj.Standings, function (idx, obj) {
        propCount++;
    });

    $.each(obj.sponsorsclub, function (idx, obj) {
        propCount++;
    });

    $.each(obj.sportsDataContext, function (idx, obj) {
        propCount++;
    });

    $.each(obj.scoringbreakdown, function (idx, obj) {
        propCount++;
    });

    $.each(obj.Isadmin, function (idx, obj) {
        propCount++;
    });
    return propCount;
}


function onclickloadregion(){
    window.plugins.spinnerDialog.hide();
        $('#basicModalregions2').modal('show');

    //db.transaction(onclickloadregiondata, errorCBfunc, successCBfunc)
}



function chooseregionloaddata(ID){

   // $('#indexloadingdata').modal('show')
    window.plugins.spinnerDialog.show(null, null, true);




    db.transaction(function(tx) {
        tx.executeSql('Update MobileApp_LastUpdatesec set Datesecs = ' + 0 + ',  Region = "' + ID + '"');
        console.log("Update MobileApp_LastUpdatesec");
    });



    refreshdata();

}

function onclicksyncloaddata(){
    closemenu();

    window.setTimeout(function(){


        //$('#indexloadingdata').modal('show');
        window.plugins.spinnerDialog.show(null, null, true);
        db.transaction(onclicksyncloaddata2, errorCBfunc, successCBfunc);
    }, 1000);
}

function onclicksyncloaddata2(tx){
    checkonline();
    var sql = "select Datesecs,datemenus,syncwifi,token,isadmin,Region from MobileApp_LastUpdatesec";

    tx.executeSql(sql, [], onclickresync,errorCBfunc);

}



function onclickresync(tx, results) {
    menufrommansync =1;
    var row = results.rows.item(0);
   // alert(row.syncwifi + " " + networkconnection);
    if((row.syncwifi ==1 && networkconnection==2) || ((row.syncwifi ==0 &&  networkconnection!=0))) {
      //  $('#indexloadingdata').modal('show');
       // alert("here1")
        var datemenus = row.datemenus;
        var datenowsecsync = row.Datesecs;
        var region = row.Region;
        var datenow = new Date();
        var timenow = datenow.getTime();
       // var yearnow = currentTime.getFullYear()
        var yearnow = datenow.getFullYear()
        var dif = timenow - (datenowsecsync);

        //   window.plugins.toast.showLongBottom('Please Wait While Data is Downloaded', function (a) {console.log('toast success: ' + a) }, function (b) { alert('toast error: ' + b)});
        var xmlHttp = null;
        xmlHttp = new XMLHttpRequest();

       xmlHttp.open("GET", 'http://bball.neosportz.com/mobiledata.aspx?deviceID=' + deviceIDfunc + '&token=' + row.token + '&sec=' + datenowsecsync + '&resultids=' + stringresultID + '&start=0&region=' + region + '&year=' + yearnow, false);
     //   alert('http://bball.neosportz.com/mobiledata.aspx?deviceID=' + deviceIDfunc + '&token=' + row.token + '&sec=' + datenowsecsync + '&resultids=' + stringresultID + '&start=0&region=' + region + '&year=' + yearnow);

        xmlHttp.send();

        var json = xmlHttp.responseText;

        if (json == "{'Error' : [{'Message': 'Something went wrong'}]") {

            errorclosemodel();
        } else {
            var obj = JSON.parse(json);
            syncmaintables(obj,yearnow);
        }

    }else{
        window.plugins.toast.showShortCenter('Sorry couldnt update Server No Internet', function (a) {console.log('toast success: ' + a)}, function (b) {alert('toast error: ' + b)});
        window.plugins.spinnerDialog.hide();
    }
}



function loadarchiveyeardata(ID){
    archiveyear =ID;
    db.transaction(loadarchiveyeardata2, errorCBfunc, successCBfunc);
}

function loadarchiveyeardata2(tx){
    checkonline();
    var sql = "select Datesecs,datemenus,syncwifi,token,isadmin,Region from MobileApp_LastUpdatesec";
    tx.executeSql(sql, [], loadarchiveyeardata2_sync,errorCBfunc);

}



function loadarchiveyeardata2_sync(tx, results) {

    var row = results.rows.item(0);

    if((row.syncwifi ==1 && networkconnection==2) || ((row.syncwifi ==0 &&  networkconnection!=0))) {
        $('#indexloadingdata').modal('show');

        var datemenus = row.datemenus;
        var datenowsecsync = row.Datesecs;
        var region = row.Region;
        var datenow = new Date();
        var timenow = datenow.getTime();
        var yearnow = archiveyear;
        var dif = timenow - (datenowsecsync);

        //   window.plugins.toast.showLongBottom('Please Wait While Data is Downloaded', function (a) {console.log('toast success: ' + a) }, function (b) { alert('toast error: ' + b)});
        var xmlHttp = null;
        xmlHttp = new XMLHttpRequest();

        xmlHttp.open("GET", 'http://bball.neosportz.com/mobiledata.aspx?deviceID=' + deviceIDfunc + '&token=' + row.token + '&sec=' + datenowsecsync + '&resultids=' + stringresultID + '&start=0&region=' + region + '&year=' + yearnow, false);


        xmlHttp.send();

        var json = xmlHttp.responseText;

        if (json == "{'Error' : [{'Message': 'Something went wrong'}]") {

            errorclosemodel();
        } else {
            var obj = JSON.parse(json);
            $.when(syncmaintables(obj,yearnow)).done(function () {

            });
        }

    }else{

        window.plugins.toast.showShortCenter('Sorry couldnt update Server No Internet', function (a) {console.log('toast success: ' + a)}, function (b) {alert('toast error: ' + b)});

    }
}




function successHandler (result) {
 //   alert('result = ' + result);
}

function errorHandler (error) {
 //   alert('error = ' + error);
}

function tokenHandler (result) {
    var xmlHttptt = null;
    xmlHttptt = new XMLHttpRequest();

   // alert('tokenB: '+ result);
    //$('#busy').show();
    var strur = 'http://bball.neosportz.com/registerdevice.aspx?deviceID=' + deviceIDfunc + '&devicemodel=' + devicemodelfunc + '&deviceCordova=' + deviceCordovafunc + '&devicePlatform=' + devicePlatformfunc + '&databasever=0&appver=' + appversionlocalf + '&deviceVersion=' + deviceVersionfunc + '&regid=' + result;
  //  navigator.notification.alert(strur);
    xmlHttptt.open("GET",strur ,false);
    xmlHttptt.send();
   // $('#busy').hide();
    // Your iOS push server needs to know the token before it can push to this device
    // here is where you might want to send it the token for later use.
}


function pushnotifiy() {
    pushNotification = window.plugins.pushNotification;


    if ( device.platform == 'android' || device.platform == 'Android' || device.platform == "amazon-fireos" ){
        pushNotification.register(
            successHandler,
            errorHandler,
            {
                "senderID":"555878037927",
                "ecb":"onNotification"
            });
    } else if ( device.platform == 'blackberry10'){
        pushNotification.register(
            successHandler,
            errorHandler,
            {
                invokeTargetId : "replace_with_invoke_target_id",
                appId: "replace_with_app_id",
                ppgUrl:"replace_with_ppg_url", //remove for BES pushes
                ecb: "pushNotificationHandler",
                simChangeCallback: replace_with_simChange_callback,
                pushTransportReadyCallback: replace_with_pushTransportReady_callback,
                launchApplicationOnPush: true
            });
    } else {
        pushNotification.register(
        tokenHandler,
        errorHandler,
        {
            "badge":"true",
            "sound":"true",
            "alert":"true",
            "ecb":"onNotificationAPN"
        });
}
}

function updatedatapush(ID,mess){
    //alert(ID);
if(start ==0) {
    if (ID == 'New News Feed') {
        onclicksyncloaddata();
        window.plugins.toast.showLongBottom(ID + '\n' + mess, function (a) {
            console.log('toast success: ' + a)
        }, function (b) {
            alert('toast error: ' + b)
        });
    } else if (ID == 'Game Cancellation') {
        onclicksyncloaddata();
        window.plugins.toast.showLongBottom(ID + '\n' + mess, function (a) {
            console.log('toast success: ' + a)
        }, function (b) {
            alert('toast error: ' + b)
        });

    } else if (ID == 'Half Time Score') {
        onclicksyncloaddata();
        window.plugins.toast.showLongBottom(ID + '\n' + mess, function (a) {
            console.log('toast success: ' + a)
        }, function (b) {
            alert('toast error: ' + b)
        });

    } else if (ID == 'Full Time Score') {
        onclicksyncloaddata();
        window.plugins.toast.showLongBottom(ID + '\n' + mess, function (a) {
            console.log('toast success: ' + a)
        }, function (b) {
            alert('toast error: ' + b)
        });

    } else {
        onclicksyncloaddata();
        window.plugins.toast.showLongBottom('New News Feed ' + '\n' + ID + '\n' + mess, function (a) {
            console.log('toast success: ' + a)
        }, function (b) {
            alert('toast error: ' + b)
        });

    }
}
}


function updatedatapushappclosed(ID,mess){
    //alert(ID);

    if(ID == 'New News Feed'){
        onclicksyncloaddata();

        if (document.getElementById("indexdiv") != null) {
            weblink('../www/pages/news.html');
        }else{
            weblink('../pages/news.html');
        }

    }else if(ID == 'Game Cancellation'){
        onclicksyncloaddata();



    }else if(ID == 'Half Time Score'){
        onclicksyncloaddata();



    }else if(ID == 'Full Time Score'){

        onclicksyncloaddata();



    }else{
       onclicksyncloaddata();
        if (document.getElementById("indexdiv") != null) {
            weblink('../www/pages/news.html');
        }else{
            weblink('../pages/news.html');
        }

    }

}

function onNotification(e) {
 //   $("#app-status-ul").append('<li>EVENT -> RECEIVED:' + e.event + '</li>');
    var xmlHttpt = null;
    xmlHttpt = new XMLHttpRequest();
 //  alert(e.event);
    switch( e.event )
    {
        case 'registered':
            if ( e.regid.length > 0 )
            {
              //  $("#app-status-ul").append('<li>REGISTERED -> REGID:' + e.regid + "</li>");
                // Your GCM push server needs to know the regID before it can push to this device
                // here is where you might want to send it the regID for later use.
               // alert("regID = " + e.regid);
              //  $('#busy').show();
                             var strur = 'http://bball.neosportz.com/registerdevice.aspx?deviceID=' + deviceIDfunc + '&devicemodel=' + devicemodelfunc + '&deviceCordova=' + deviceCordovafunc + '&devicePlatform=' + devicePlatformfunc + '&databasever=0&deviceVersion=' + deviceVersionfunc + '&appver=' + appversionlocalf + '&regid=' + e.regid;
                xmlHttpt.open("GET",strur ,false);
                 // alert(strur);
                xmlHttpt.send();
                //   $('#busy').hide();
             //   alert(json);
            }
            break;

        case 'message':
            // if this flag is set, this notification happened while we were in the foreground.
            // you might want to play a sound to get the user's attention, throw up a dialog, etc.



            if ( e.foreground )
            {
                updatedatapush(e.payload.title, e.payload.message);




             //   $("#app-status-ul").append('<li>--INLINE NOTIFICATION--' + '</li>');

                // on Android soundname is outside the payload.
                // On Amazon FireOS all custom attributes are contained within payload
                var soundfile = e.soundname || e.payload.sound;
                // if the notification contains a soundname, play it.
                var my_media = new Media("/android_asset/www/"+ soundfile);
                my_media.play();
            }
            else
            {
            // otherwise we were launched because the user touched a notification in the notification tray.
                if ( e.coldstart )
                {
                    updatedatapushappclosed(e.payload.title, e.payload.message);
             //  $("#app-status-ul").append('<li>--COLDSTART NOTIFICATION--' + '</li>');
                }
                else
                {

                    updatedatapushappclosed(e.payload.title, e.payload.message);
              //      $("#app-status-ul").append('<li>--BACKGROUND NOTIFICATION--' + '</li>');
                }
            }




            //    $("#app-status-ul").append('<li>MESSAGE -> MSG: ' + e.payload.message + '</li>');
            //Only works for GCM
            //    $("#app-status-ul").append('<li>MESSAGE -> MSGCNT: ' + e.payload.msgcnt + '</li>');
            //Only works on Amazon Fire OS
            //  $status.append('<li>MESSAGE -> TIME: ' + e.payload.timeStamp + '</li>');
            break;

        case 'error':
          //  $("#app-status-ul").append('<li>ERROR -> MSG:' + e.msg + '</li>');
            break;

        default:
         //   $("#app-status-ul").append('<li>EVENT -> Unknown, an event was received and we do not know what it is</li>');
            break;
    }
}

function onNotificationAPN(e) {

    if (e.alert) {
       // $("#app-status-ul").append('<li>push-notification: ' + e.alert + '</li>');
// showing an alert also requires the org.apache.cordova.dialogs plugin
      // navigator.notification.alert(e.alert);
        onclicksyncloaddata();

    }
    if (e.sound) {
// playing a sound also requires the org.apache.cordova.media plugin
        var snd = new Media(e.sound);
       snd.play();
    }
    if (e.badge) {
        pushNotification.setApplicationIconBadgeNumber(successHandler, e.badge);
    }
}




function hidedivindex(){

  //  $('#mainbackground').hide();
}
function showdivindex(){

   // $('#mainbackground').show();
}



