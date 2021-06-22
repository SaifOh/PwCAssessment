function complaint() {
    var context = $("#context").val()
    var subject = $("#subject").val()
    var email = $("#email").val()
    var type = document.getElementById("rad1").checked;
    var cookie = document.cookie.split("; ").find(row => row.startsWith("Access-Token=")).replace("Access-Token=", "");
    //console.log(cookie);
    var uid = document.cookie.split("; "[1]).find(row => row.startsWith("userID=")).split('=')[1].replace(";", "");
    //console.log(uid);
    var datas = { context: context, email: email, ctype: type, token: cookie, type: "new", uid: uid }
    //console.log(datas);
    $.ajax({
        type: "POST",
        url: `${BASE_URL}:${PORT}/api/complaints`,
        data: JSON.stringify(datas),
        contentType: "application/json; charset=utf-8",
        error: function (er) {
            console.log("error sending complaint");
            console.error(er);
        },
        success: function (res) {
            //console.log(res);
            //window.location.href = "http://localhost:8080/index";
            $("#success").removeAttr("hidden");
        }
    });
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
                    $("#admin").removeAttr("hidden");
                    $("#ucomp").removeAttr("hidden");
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