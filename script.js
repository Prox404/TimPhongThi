let fileInput = document.getElementById('file-upload');
//Input mssv : 26211234181
const fileName = document.getElementById("file-name");

fileInput.addEventListener("change", function () {
    fileName.textContent = this.value.split("\\").pop();
});



function NotificationMe(thoigian, ngay, phong, coso){
    let title = "Thông báo lịch thi";
    let newThoiGian = String(thoigian).replace("h",":");
    let date = new Date('4/18/2023 11:15:00');
    console.log(date);

    let options = {
        body: "Thời gian: " + thoigian + "\nNgày thi: " + ngay + "\nPhòng thi: " + phong + "\nCơ sở thi: " + coso,
        // icon: "https://cdn4.iconfinder.com/data/icons/flat-brand-logo-2/512/medium-512.png",
        // image: "https://cdn4.iconfinder.com/data/icons/flat-brand-logo-2/512/medium-512.png",
        timestamp: Math.floor(date)
    };
    if (!("Notification" in window)) {
        alert("This browser does not support desktop notification");
    } else if (Notification.permission === "granted") {
        let notification = new Notification(title, options);
         
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission(function (permission) {
            if (permission === "granted") {
                let notification = new Notification(title, options);

            }
        });
    }

}

function insertToResult(thoigian, ngay, phong, coso){
    let MainDiv = document.createElement("div");
    MainDiv.className = "card";
    let content = document.createElement("p");
    let btn = document.createElement("button");
    btn.className = "btn btn-notifications";
    btn.innerHTML = "Thông báo cho tôi";
    btn.addEventListener("click", function(){
        NotificationMe(thoigian, ngay, phong, coso);
    });
    content.innerHTML = "Thời gian: " + thoigian + "<br>Ngày thi: " + ngay + "<br>Phòng thi: " + phong + "<br>Cơ sở thi: " + coso;
    MainDiv.appendChild(content);
    content.appendChild(btn);
    document.getElementById("result").appendChild(MainDiv);
}
 
const TimKiemLichThi = async () => {
    // var mssv = document.getElementById('mssv').value;
    let mssv = "26211234181";
    let result = document.getElementById('result');
    mssv = mssv.toUpperCase();
    let mssvString = mssv.trim();
    
    if (mssv.length == 0) {
        alert("Chưa nhập mssv !");
        console.error("Chưa nhập mssv !");
        return;
    }
    
    if (fileInput.files.length == 0) {
        alert("Chưa chọn file !");
        console.error("Chưa chọn file !");
        return;
    }
    
    result.innerHTML = "Đang tìm kiếm...";

    let current_head = [];
    readXlsxFile(fileInput.files[0]).then(function (rows) {
        // `rows` is an array of rows
        // each row being an array of cells.
        let indexOfMssv = 2;

        rows.map(function (row) {
            row.map(function (cell, indexCell) {
                if (String(cell).indexOf("Thời gian") > -1) {
                    current_head = row;
                }
                if (cell == "MSV" && indexOfMssv == 2) {
                    console.log("indexCell", indexCell);
                    indexOfMssv = indexCell;
                }
            });

            if (row[indexOfMssv] == mssv) {
                // result.innerHTML = current_head.join(" ").trim();
                let resultStr =  current_head.join(" ").trim();
                console.log(resultStr);
                const timeRegex = /Thời gian:\s*([\d]{2}[h:][\d]{2})/i;
                const dateRegex = /([\d]{2}\/[\d]{2}\/[\d]{4})/;
                const roomRegex = /Phòng:\s*([\dA-Z]+)/i;
                const arr = resultStr.split("-");

                const timeMatch = timeRegex.exec(resultStr);
                const dateMatch = dateRegex.exec(resultStr);
                const roomMatch = roomRegex.exec(resultStr);
                const campusMatch = arr[2];

                let time = timeMatch[1];
                let date = dateMatch[1];
                let room = roomMatch[1];
                let campus = campusMatch.trim();

                console.log(time); 
                console.log(date); 
                console.log(room);
                if (String(campus).indexOf("Phòng") > -1) {
                    const addressPattern = /cơ sở:\s+(.+)\s+Lần thi/i;
                    const addressMatch = addressPattern.exec(resultStr);
                    const address = addressMatch[1];
                    campus = address;
                } 
                console.log(campus); 
                result.innerHTML = "";
                insertToResult(time, date, room, campus);
                return;
            }
        });

    });

    setTimeout(function () {
        if (result.innerHTML.length == 0) {
            result.innerHTML = "Không tìm thấy lịch thi của sinh viên " + mssvString;
        }
    },1000);

}

const Reset = () => {
    let result = document.getElementById('result');
    result.innerHTML = "";
}

