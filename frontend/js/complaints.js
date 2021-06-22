function getComplaints() {
    var uid = document.cookie.split("; "[1]).find(row => row.startsWith("userID=")).split('=')[1].replace(";", "");
    var cookie = document.cookie.split("; ").find(row => row.startsWith("Access-Token=")).replace("Access-Token=", "");

    var datas = { uid: uid, token: cookie }
    $.ajax({
        type: "GET",
        url: `${BASE_URL}:${PORT}/api/complaints/${uid}`,
        data: datas,
        contentType: "application/json; charset=utf-8",
        error: function (er) {
            console.log("error getting complaints");
            console.error(er);
        },
        success: function (res) {
            console.log(res);
            if (res != "") {//if correct response
                if ($("#table tbody").length == 0) {
                    $("#table").append("<tbody></tbody>");
                }
                $(".no-records-found").remove();
                res.forEach(element => {
                    $("#table tbody").append("<tr>" + "<td>" + element.cid + "<td>" + element.type + "<td>" + element.status + "<td>" + element.context);
                })
                //add code to change inner html of complaints.html to show them in a table.
            }
            else {//if error msg
                //show failed message
            }

        }
    });
}

function getComplaint(cid) {
    var uid = document.cookie.split("; "[1]).find(row => row.startsWith("userID=")).split('=')[1].replace(";", "");
    $.ajax({
        type: "GET",
        url: `${BASE_URL}:${PORT}/api/complaint/${cid}`,
        data: JSON.stringify(datas),
        contentType: "application/json; charset=utf-8",
        error: function (er) {
            console.log("error getting complaints");
            console.error(er);
        },
        success: function (res) {
            console.log(res);
            if (res != "") {//if correct response
                if ($("#table tbody").length == 0) {
                    $("#table").append("<tbody></tbody>");
                }
                $(".no-records-found").remove();
                res.forEach(element => {
                    $("#table tbody").append("<tr>" + "<td>" + element.cid + "<td>" + element.type + "<td>" + element.status + "<td>" + element.context);
                })
            }
            else {//if error msg
                //show failed message
            }

        }
    });
}