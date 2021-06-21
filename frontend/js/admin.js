
function getComplaints() {
    var uid = document.cookie.split("; "[1]).find(row => row.startsWith("userID=")).split('=')[1].replace(";", "");
    var cookie = document.cookie.split("; ").find(row => row.startsWith("Access-Token=")).replace("Access-Token=", "");

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
            console.log(res);
            if (res != "") {//if correct response

                if ($("#dataTable tbody").length == 0) {
                    $("#dataTable").append("<tbody></tbody>");
                }
                 $('#dataTable').bootstrapTable({
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
