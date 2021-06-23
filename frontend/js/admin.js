
$("#ucomp").click(function(){
    var cookie = document.cookie.split("; ").find(row => row.startsWith("Access-Token=")).replace("Access-Token=", "");
    var uid = document.cookie.split("; "[1]).find(row => row.startsWith("userID=")).split('=')[1].replace(";", "");

    $.redirect("/ucomplaints",{token: cookie, uid: uid}, "GET");
})
$("#admin").click(function(){
    var cookie = document.cookie.split("; ").find(row => row.startsWith("Access-Token=")).replace("Access-Token=", "");
    var uid = document.cookie.split("; "[1]).find(row => row.startsWith("userID=")).split('=')[1].replace(";", "");

    $.redirect("/admin",{token: cookie, uid: uid}, "GET");
})


function getComplaints() {
    var uid = document.cookie.split("; "[1]).find(row => row.startsWith("userID=")).split('=')[1].replace(";", "");
    var cookie = document.cookie.split("; ").find(row => row.startsWith("Access-Token=")).replace("Access-Token=", "");
    console.log(uid);
    var datas = { uid: uid, token: cookie }
    $.ajax({
        type: "GET",
        url: `${BASE_URL}:${PORT}/api/complaints/`,
        data: datas,
        contentType: "application/json; charset=utf-8",
        error: function (er) {
            console.log("error getting complaints");
            console.error(er);
        },
        success: function (res) {
            //console.log(res);
            if (res != "") {//if correct response

                if ($("#dataTable tbody").length == 0) {
                    $("#dataTable").append("<tbody></tbody>");
                }
                $('#dataTable').bootstrapTable({
                    data: res,
                    search: true,
                    detailView: true,
                    detailFormatter: detailFormatter,
                    pagination: true,
                });
                

                //add code to change inner html of complaints.html to show them in a table.
            }
            else {//if error msg
                //show failed message
            }

        }
    });
}
function getUsers() {
    var uid = document.cookie.split("; "[1]).find(row => row.startsWith("userID=")).split('=')[1].replace(";", "");
    var cookie = document.cookie.split("; ").find(row => row.startsWith("Access-Token=")).replace("Access-Token=", "");

    var datas = { uid: uid, token: cookie }
    //console.log(datas);
    $.ajax({
        type: "GET",
        url: `${BASE_URL}:${PORT}/api/users`,
        data: datas,
        contentType: "application/json; charset=utf-8",
        error: function (er) {
            console.log("error getting users");
            console.error(er);
        },
        success: function (res) {
            //console.log(res);
            if (res != "") {//if correct response

                if ($("#dataTable2 tbody").length == 0) {
                    $("#dataTable2").append("<tbody></tbody>");
                }
                $('#dataTable2').bootstrapTable({
                    data: res,
                    search: true,
                    pagination: true,
                });
                

                //add code to change inner html of complaints.html to show them in a table.
            }
            else {//if error msg
                //show failed message
            }

        }
    });
}
function detailFormatter(index, row, res) {
    var html = [];
    //console.log(res);
    $.each(row, function (key, value) {
      html.push('<p><b>' + key + ':</b> ' + value + '</p>')
    })
    return html.join('')
}
function updateLevel(level, uuid){
    var cookie = document.cookie.split("; ").find(row => row.startsWith("Access-Token=")).replace("Access-Token=", "");
    var uid = document.cookie.split("; "[1]).find(row => row.startsWith("userID=")).split('=')[1].replace(";", "");
    var datas = { token: cookie, type: level, uid: uid, uuid: uuid}
    $.ajax({
        type: "PUT",
        url: `${BASE_URL}:${PORT}/api/users`,
        data: JSON.stringify(datas),
        contentType: "application/json; charset=utf-8",
        error: function (er) {
            console.log("error updating user");
            console.error(er);
        },
        success: function (res) {
          //  console.log(res);
            if (res.message == "updated user") {
                $("#success").removeAttr("hidden");
                setTimeout(() => {
                    $.redirect("/admin",{token: cookie, uid: uid}, "GET");
                }, 5000)
            }
            else{
                $("#failed").removeAttr('hidden');
            }
            //window.location.href = "http://localhost:8080/admin";

        }
    });
}
function updateComplaint(status, cid) {

    var cookie = document.cookie.split("; ").find(row => row.startsWith("Access-Token=")).replace("Access-Token=", "");
    //console.log(cookie);
    var uid = document.cookie.split("; "[1]).find(row => row.startsWith("userID=")).split('=')[1].replace(";", "");
    //console.log(uid);
    var datas = { cid: cid, token: cookie, type: "modify", uid: uid, status: status }
    //console.log(datas);
    $.ajax({
        type: "PUT",
        url: `${BASE_URL}:${PORT}/api/complaints`,
        data: JSON.stringify(datas),
        contentType: "application/json; charset=utf-8",
        error: function (er) {
            console.log("error updating complaint");
            console.error(er);
        },
        success: function (res) {
          //  console.log(res);
            if (res == "updated") {
                $("#success").removeAttr("hidden");
                setTimeout(() => {
                    $.redirect("/ucomplaints",{token: cookie, uid: uid}, "GET");
                }, 5000)
            }
            //window.location.href = "http://localhost:8080/admin";

        }
    });
}
//function to get a specific complaint 
function getComplaint(cid) {
    var uid = document.cookie.split("; "[1]).find(row => row.startsWith("userID=")).split('=')[1].replace(";", "");
    
    var cookie = document.cookie.split("; ").find(row => row.startsWith("Access-Token=")).replace("Access-Token=", "");
    var datas = { uid: uid, token: cookie }
    $.ajax({
        type: "GET",
        url: `${BASE_URL}:${PORT}/api/complaints/${cid}`,
        data: datas,
        contentType: "application/json; charset=utf-8",
        error: function (er) {
            console.log("error getting complaints");
            console.error(er);
        },
        
        success: function (res) {
            //console.log(res);
            if (res != "") {//if correct response
                    return res;
                //add code to change inner html of complaints.html to show them in a table.
            }
            else {
                return json("could not find complaint");
            }

        }
    });
}
function LinkFormatter(value, row, index) {
     return "<a href='complaints/"+value+"'>" + value + "</a>";
}


function setStatus(value, row, index) {
    //console.log(row)
    //<input type="button" class="btn btn-primary btn-block" onclick="updateComplaint(\"Resolved\","+row.cid+")'" value="Mark as resolved">
    if (row.status == "Open")
        return "<a class=\"btn btn-success\" href='javascript:updateComplaint(\"Resolved\"," + row.cid + ")'>Mark as Resolved</a><br><a class=\"btn btn-danger\" href='javascript:updateComplaint(\"Dismissed\"," + row.cid + ")'>Dismiss</a>";
    else
        if (row.status == "Resolved")
            return "<a class=\"btn btn-primary\" href='javascript:updateComplaint(\"Open\"," + row.cid + ")'>Mark as Open</a><br><a class=\"btn btn-danger\" href='javascript:updateComplaint(\"Dismissed\"," + row.cid + ")'>Dismiss</a>";
        else
            return "<a class=\"btn btn-success\" href='javascript:updateComplaint(\"Resolved\"," + row.cid + ")'>Mark as Resolved</a><br><a class=\"btn btn-primary\" href='javascript:updateComplaint(\"Open\"," + row.cid + ")'>Mark as Open</a>";
}


function setLevel(value, row, index) {
    //console.log(row)
    //<input type="button" class="btn btn-primary btn-block" onclick="updateComplaint(\"Resolved\","+row.cid+")'" value="Mark as resolved">
    if (row.type == "1")
        return "<a class=\"btn btn-danger\" href='javascript:updateLevel(0," + row.uid + ")'>Demote</a>";
    if (row.type == "0")
        return "<a class=\"btn btn-success\" href='javascript:updateLevel(1," + row.uid + ")'>Promote</a>";

}


function getInfo() {
    if (document.cookie.split("; ").find(row => row.startsWith("Access-Token="))) {
        var cookie = document.cookie.split("; ").find(row => row.startsWith("Access-Token=")).replace("Access-Token=", "");
        var uid = document.cookie.split("; "[1]).find(row => row.startsWith("userID=")).split('=')[1].replace(";", "");

        var datas = { uid: uid, token: cookie };
        //console.log(datas);
        $.ajax({
            type: "GET",
            url: `${BASE_URL}:${PORT}/api/users/${uid}`,
            data: datas,
            contentType: "application/json; charset=utf-8",
            error: function (er) {
                console.log("error getting info");
                console.error(er);
            },
            success: function (res) {
                //console.log(res);
                if (res.length>0) {
                    var uname = document.getElementById("userboi");
                    uname.innerHTML = "Hello, " + res[0].username;
                    if(res[0].type == 1)
                    {
                        $("#admin").removeAttr("hidden");
                        $("#ucomp").removeAttr("hidden");
                    }
                    
                }
                else {
                    var uname = document.getElementById("userboi");
                    uname.innerHTML = "Please Login";
                    window.location.href = "/login";
                }

            }
        });
    }
    else{
        window.location.href = "/login";
    }
}

function logout(){
    document.cookie = "Access-Token=null";
    document.cookie = "userID=null"
    window.location.href = "/login"
}