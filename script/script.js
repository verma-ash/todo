// code for showing dates on pages

// var baseUrl='http://localhost:62238/api/'




// on start of application
$(document).ready(() => {
    {

        var ajaxurl = baseUrl + 'sp_get_all_tasks?uid=1'
        fnOnSuccess = function (result) {
            allTaskData = result;
            fnhandlebars("message3-template", "idpage4TaskInfo", result);
        }

        fnOnError = function (error) {
            console.log(error);
        }
        fnAjaxRequest(ajaxurl, 'GET', {}, {}, fnOnSuccess, fnOnError);
    }

    {
        var ajaxurl = baseUrl + 'sp_get_pending_tasks?uid=1'
        fnOnSuccess = function (result) {
            fnhandlebars("message1-template", "idtaskInfo1", result);
            fnhandlebars("message2-template", "idtaskInfo2", result);
        }

        fnOnError = function (error) {
            console.log(error);
        }
        fnAjaxRequest(ajaxurl, 'GET', {}, {}, fnOnSuccess, fnOnError);
    }

})










//url 
var baseUrl = 'http://192.168.2.116/Ashish_ToDo/api/'









//variables
var selDiv = "";
var attachments = [];

// contains all table data
var allTaskData;

// tacking system date
var sysDate = moment().format("YYYY-MM-DD");
var nextSysDate = moment().add('days', 1).format("YYYY-MM-DD");

var selectedDate;

var boing1;
var boing2;
var boing3;














//eventlistener

// code for display attachment file in div
document.addEventListener("DOMContentLoaded", init, false);














//function

window.onload = function () {
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];;
    var date = new Date();

    document.getElementById('idMonthYear').innerHTML = months[date.getMonth()] + ' ' + date.getFullYear();
};
$('#idTodayDate').append(moment().format("dddd Do"));
$('#idTomorrow').append(moment().add('days', 1).format("dddd Do"));
$('.timeNote').append(moment().format("h:mm a"));


function init() {
    document.querySelector('#idTapToAdd').addEventListener('change', handleFileSelect, false);
    selDiv = document.querySelector("#idDisplayFile");
}


function handleFileSelect(e) {

    if (!e.target.files || !window.FileReader) return;

    var files = e.target.files;
    var filesArr = Array.prototype.slice.call(files);
    filesArr.forEach(function (f, i) {
        var f = files[i];
        if (!f.type.match("image.*")) {
            return;
        }

        var reader = new FileReader();
        var fileLink = "http://192.168.2.116/hosted/imgs/";
        reader.onload = function (e) {
            fileLink += f.name;
            var html = "<img src=\"" + fileLink + "\">";
            selDiv.innerHTML += html;
            attachments.push(fileLink);
        }
        reader.readAsDataURL(f);
    });

}

// show function
function show(shown, hidden) {
    $(shown).removeClass("hide");
    $(hidden).addClass("hide");
    return false;
}

// code for clear page3 i.e. new task input
function ClearFields() {
    document.getElementById("idTaskNametxt").value = "";
    document.getElementById("idTaskNotetxt").value = "";
    document.getElementById("idSelect").value = "";
    document.getElementById("idDate").value = "";
}

// code for clear attachment
function ClearAttach() {
    selDiv = document.querySelector("#idDisplayFile");
    selDiv.innerHTML = "";
}

// api function 
var fnAjaxRequest = function (ajaxURL, ajaxReqMethod, ajaxReqHeader, ajaxReqData, onSucess, onError) {
    $.ajax({
        crossDomain: true,
        method: ajaxReqMethod,
        headers: ajaxReqHeader,
        url: ajaxURL,
        data: ajaxReqData,
        success: onSucess,
        error: onError,
        timeout: 120000, // sets timeout to 2 minute
        //contentType: 'application/json' || 'application/x-www-form-urlencoded; charset=UTF-8'
    });
};

// handlebar function
function fnhandlebars(template, target, data) {
    var template = $('#' + template).html();
    var templateScript = Handlebars.compile(template);
    var html = templateScript(data);
    $("#" + target).html(html);
}

// to show tasks from calaneder
function chechtrigger() {
    selectedDate = document.querySelector('#idCal').value;
    // selectedDate=$('#idCal').value;
    // console.log(selectedDate);

    $("#idAllDisplay").html("");
    $("#idAllDisplay").append(selectedDate);

    var count = null;
    for (var i in allTaskData) {
        if (selectedDate == allTaskData[i].dateOfTask.substring(0, 10)) {
            // fnhandlebars("message4-template", "idAllDisplay", allTaskData[i]);  
            count = allTaskData[i].tid;
            // console.log(selectedDate);
            var template = $('#message4-template').html();
            var templateScript = Handlebars.compile(template);
            var html = templateScript(allTaskData[i]);
            $("#idAllDisplay").append(html);
        }

    }
    if (count == null) {
        $("#idAllDisplay").html("No task for this date!!!");

    }
}

















// on clicks

// create task function
$(".createTask").on("click", function () {
    var taskName = $("#idTaskNametxt").val();
    var taskNote = $("#idTaskNotetxt").val();
    var priority = $("#idSelect").val();
    var date = $("#idDate").val();

    if (taskName == "" || taskNote == "" || priority == "" || date == "") {
        alert("Fill all fields !!")
    }
    else {
        var data1 = {
            in_title: taskName,
            in_note: taskNote,
            priority: priority,
            in_dateOfTask: date,
            img_url: attachments.join(),
            in_uid: 1
        };
        console.log(data1);
        var ajaxurl = baseUrl + 'sp_submit_task'
        // console.log(data);
        fnOnSuccess = function (result) {
            console.log(result);
        }

        fnOnError = function (error) {
            console.log(error);
        }
        fnAjaxRequest(ajaxurl, 'POST', '', data1, fnOnSuccess, fnOnError);
        ClearFields();
        ClearAttach();
        document.location.reload(true);
        show('#page4', '#page3');

    }

})

// click to change status to done
// $("#idClickToDone").on("click", function () {
$('body').off('click', '#idClickToDone').on('click', '#idClickToDone', function () {
    var title = $('#titleDivShow').html().trim();
    var note = $('#noteDivShow').html().trim();
    var date = $('#dateOfTaskDivShow').html().trim();
    console.log(title);
    // console.log(title,note,date);
    var data2 = {
        in_title: title,
        in_note: note,
        in_dateOfTask: date,
    };

    console.log(data2);
    var ajaxurl = baseUrl + 'sp_set_status'
    fnOnSuccess = function (result) {
        console.log(result);
    }

    fnOnError = function (error) {
        console.log(error);
    }
    fnAjaxRequest(ajaxurl, 'POST', '', data2, fnOnSuccess, fnOnError);

    document.location.reload(true);
})



// code for page1 down arrows
$("#idArrowDown1").click(function () {
    document.getElementById('idtaskInfo1').classList.toggle("show");
});

$("#idArrowDown2").click(function () {
    document.getElementById('idtaskInfo2').classList.toggle("show");
});


// show page4 and hide page2
$("#idPage2to4").click(function () {

    show('#page4', '#page2');
});


//show page3 and hide page2
$("#idPage2to3").click(function () {

    show('#page3', '#page2');
});

//close page5
$("#idOfClose").on("click", function () {
    show('#page1', '#page5');

});

//refresh application
$("#idSlack").on("click", function () {
    document.location.reload(true);
});


$('body').off('click', '.taskInDetail1').on('click', '.taskInDetail1', function (event) {
    boing1 = event.target.dataset.tid;
    // console.log(boing1);
    for (var i in allTaskData) {
        if (boing1 == allTaskData[i].tid) {
            if (allTaskData[i].img_url != null) {
                allTaskData[i].img_url = allTaskData[i].img_url.split(',');
            }
            fnhandlebars("detail-template", "idShowDataInDetail", allTaskData[i]);
        }
    }
    show('#page5', '#page1');
})


$('body').off('click', '.taskInDetail2').on('click', '.taskInDetail2', function (event) {
    boing2 = event.target.dataset.tid;
    // console.log(boing2);
    for (var i in allTaskData) {
        if (boing2 == allTaskData[i].tid) {
            if (allTaskData[i].img_url != null) {
                allTaskData[i].img_url = allTaskData[i].img_url.split(',');
            }
            fnhandlebars("detail-template", "idShowDataInDetail", allTaskData[i]);
        }
    }
    show('#page5', '#page4');
})


$('body').off('click', '.taskInDetail3').on('click', '.taskInDetail3', function (event) {
    boing3 = event.target.dataset.tid;
    // console.log(boing2);
    for (var i in allTaskData) {
        if (boing3 == allTaskData[i].tid) {
            if (allTaskData[i].img_url != null) {
                allTaskData[i].img_url = allTaskData[i].img_url.split(',');
            }
            fnhandlebars("detail-template", "idShowDataInDetail", allTaskData[i]);
        }
    }
    show('#page5', '#page1');
})



















//helpers

// helper to check today date
Handlebars.registerHelper("checktoday", function (property, option) {

    if (property.substring(0, 10) == sysDate) {
        return option.fn(this);
    } else {
        return option.inverse(this);
    }

});


//helper to check next date
Handlebars.registerHelper("checkDateNext", function (property, option) {

    if (property.substring(0, 10) == nextSysDate) {
        return option.fn(this);
    } else {
        return option.inverse(this);
    }

});


Handlebars.registerHelper("checkStatus", function (property, option) {

    if (property == 'pending') {
        return option.fn(this);
    } else {
        return option.inverse(this);
    }

});


Handlebars.registerHelper("changeFormat", function (property) {

    return property.substring(0, 10);

});
