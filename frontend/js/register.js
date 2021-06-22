

function register() {
    var username = $("#username").val()
    var password = $("#password").val()
    var email = $("#email").val();
    var special = $("#special").val();
   // let regex = /^(?=[a-zA-Z0-9._]{5,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    if (ValidateUsername(username) && ValidateEmail(email) && ValidatePassword()) {
        var datas = { username: username, password: CryptoJS.MD5(password).toString(), type: "register", email: email, special: special };
        //console.log(JSON.stringify(datas));
        $.ajax({
            type: "POST",
            dataType: "json",
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
                if (res.message == "User already exists.") {
                    $("#failure").removeAttr("hidden")
                    $("#success").attr("hidden");
                }
                else if (res.message == "Successfully Registered.") {
                    $("#success").removeAttr("hidden");
                    $("#failure").attr("hidden");
                }
                else {
                    $("#failure").removeAttr("hidden");
                    console.log("Error maybe? " + res.message);
                }
            }
        });
    }
    else {
        alert('Check your input');
    }


}

function ValidateUsername(user) {
    if (/^(?=[a-zA-Z0-9._]{5,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/.test(user)) {
        return (true)
    }
    return (false)
}
function ValidateEmail(mail) {
    if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(mail)) {
        return (true)
    }
    return (false)
}

function ValidatePassword(password) {
    if (/^[A-Za-z]\w{7,14}$/.test(password)) {
        return (true)
    }
    return (false)
}