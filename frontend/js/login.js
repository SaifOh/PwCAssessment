

function login(){
    var username = $("#username").val()
    var password = $("#password").val()
    var datas = {username: username, password: CryptoJS.MD5(password).toString(), type:"login"};
    document.cookie = "Access-Token=null";
    $.ajax({
        type: "POST",
        url: `${BASE_URL}:${PORT}/api/users`,
        data: JSON.stringify(datas),
        contentType: "application/json; charset=utf-8",
        error: function (er) {
            console.log("error logging in");
            console.error(er);
        },
        success: function (res) {
            console.log("Logged in.");
            let date = new Date(Date.now()+1000*36000);
            let token = res.token;
            let uid = res.userId;
            document.cookie = "Access-Token= "+token+"; expires ="+date.toUTCString()+';path=/';
            document.cookie = "userID="+uid;
            $("#loggedin").removeAttr("hidden");
            window.location.href = "http://localhost:8080/index";
        }
    });


}