

function register(){
    var username = $("#username").val()
    var password = $("#password").val()
    var email = $("#email").val();
    var special = $("#special").val();

    var datas = {username: $("#username").val(), password: CryptoJS.MD5(password).toString(), type:"register", email: email, special: special};
    //console.log(JSON.stringify(datas));
    $.ajax({
        type: "POST",
        dataType:"json",
        url: `${BASE_URL}:${PORT}/api/users`,
        data: JSON.stringify(datas),
        contentType: "application/json; charset=utf-8",
        error: function (er) {
            console.log("error adding user to database ");
            console.error(er)
            $("#failure").removeAttr("hidden")
        },
        success: function (res) {
            //console.log(res.message);
            if(res.message == "User already exists.")
            {
                $("#failure").removeAttr("hidden")
                $("#success").attr("hidden");
            }
            else if(res.message == "Successfully Registered."){
                $("#success").removeAttr("hidden");
                $("#failure").attr("hidden");
            }
            else{
                console.log("Error maybe? "+res.message);
            }
        }
    });

}