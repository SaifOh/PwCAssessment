function complaint(){
    var context = $("#context").val()
    var subject = $("#subject").val()
    var email = $("#email").val()
    var type = document.getElementById("rad1").checked;
    var cookie = document.cookie.split("; ").find(row => row.startsWith("Access-Token=")).replace("Access-Token=","");
    console.log(cookie);
    var uid = document.cookie.split("; "[1]).find(row => row.startsWith("userID=")).split('=')[1].replace(";","");
    console.log(uid);
    var datas = {context: context, email: email, ctype: type, token: cookie, type: "new", uid: uid}
    console.log(datas);
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
            console.log("Complaint submitted."+res);
            window.location.href = "http://localhost:8080/index";
            $("#success").removeAttr("hidden");
        }
    });
}

function getInfo(){

}