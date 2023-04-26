const socket = io('http://localhost:3000');

let fileInput = document.getElementById('file-upload');
//Input mssv : 26211234181
const fileName = document.getElementById("file-name");

fileInput.addEventListener("change", function () {
    fileName.textContent = this.value.split("\\").pop();
});

const data = {
    title: 'Thông báo lịch thi',
    content: 'Thời gian: 7h30 - 9h30\nNgày thi: 21/04/2021\nPhòng thi: 101\nCơ sở thi: 1',
    time: '4/21/2021 11:15:00'
};

socket.on('connection', () => {
    console.log('Connected');
});


socket.on('new-notification', (data) => {
    const { title, content, time } = data;

    // Hiển thị thông báo sử dụng Notification API
    Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
            new Notification(title, { body: content });
        }
    });
});

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

function NotificationMe(thoigian, ngay, phong, coso) {
    let title = "Thông báo lịch thi";

    let newThoiGian = "00:00:00";
    let day = ngay.split("/")[0];
    let month = ngay.split("/")[1];
    let year = ngay.split("/")[2];
    let thoigianThi = new Date(month + "/" + day + "/" + year + " " + newThoiGian);
    console.log(thoigianThi);
    // console.log(date);

    let options = {
        title: title,
        body: "Thời gian: " + thoigian + "\nNgày thi: " + ngay + "\nPhòng thi: " + phong + "\nCơ sở thi: " + coso,
        time: thoigianThi
        // icon: "https://cdn4.iconfinder.com/data/icons/flat-brand-logo-2/512/medium-512.png",
        // image: "https://cdn4.iconfinder.com/data/icons/flat-brand-logo-2/512/medium-512.png",
        // timestamp: Math.floor(date)
    };

    if ('serviceWorker' in navigator) {
        let title = options.title;
        let content = options.body;
        let time = options.time;

        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('Service Worker registered');

                if (!("Notification" in window)) {
                    alert("This browser does not support desktop notification");
                } else if (Notification.permission === "granted") {
                    console.log("Đã thông báo");

                    // navigator.serviceWorker.ready.then(function (registration) {
                    registration.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey: urlBase64ToUint8Array('BLl_utTXOFdsD7sXCuVv9GMEozNxPoPPpNZpTW64m9E47pRAhmbtLv4Lv6JB9FSQQ2vbAVvf4Dc8Rls4GWyPp3E')
                    }).then(function (subscription) {
                        console.log(JSON.stringify({ subscription }));
                        fetch('http://192.168.1.2:3000/api/subscribe', {
                            method: 'POST',
                            body: JSON.stringify({ subscription }),
                            headers: { 'Content-Type': 'application/json' }
                        });
                    });

                    fetch('http://192.168.1.2:3000/api/send-notification', {
                        method: 'POST',
                        body: JSON.stringify({ title, content, time }),
                        headers: { 'Content-Type': 'application/json' }
                    }).then(res => {
                        console.log(res);
                    })
                    .catch(err => {
                        console.log(err);
                    });

                } else if (Notification.permission !== "denied") {
                    Notification.requestPermission(function (permission) {
                        if (permission === "granted") {
                            console.log("Đã thông báo");
                            registration.pushManager.subscribe({
                                userVisibleOnly: true,
                                applicationServerKey: 'BLl_utTXOFdsD7sXCuVv9GMEozNxPoPPpNZpTW64m9E47pRAhmbtLv4Lv6JB9FSQQ2vbAVvf4Dc8Rls4GWyPp3E'
                            }).then(function (subscription) {
                                console.log(subscription);
                                fetch('http://192.168.1.2:3000/api/subscribe', {
                                    method: 'POST',
                                    body: JSON.stringify({ subscription }),
                                    headers: { 'Content-Type': 'application/json' }
                                });
                            });

                        }
                    });

                    fetch('http://192.168.1.2:3000/api/send-notification', {
                        method: 'POST',
                        body: JSON.stringify({ title, content, time }),
                        headers: { 'Content-Type': 'application/json' }
                    }).then(res => {
                        console.log(res);
                    })
                    .catch(err => {
                        console.log(err);
                    });
                }
            })
            .catch(error => {
                console.error('Service Worker registration failed:', error);
            });
    }

}

function insertToResult(thoigian, ngay, phong, coso) {
    let MainDiv = document.createElement("div");
    MainDiv.className = "card";
    let content = document.createElement("p");
    let btn = document.createElement("button");
    btn.className = "btn btn-notifications";
    btn.innerHTML = "Thông báo cho tôi";
    btn.addEventListener("click", function () {
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

    readXlsxFile(fileInput.files[0], {sheet: 'TONGHOP'}).then(function (rows) {
        // `rows` is an array of rows
        // each row being an array of cells.
        let indexOfMssv = 2;

        console.log("row", rows.length);
        rows.map(function (row) {
            row.map(function (cell, indexCell) {
                if (String(cell).indexOf("Thời gian") > -1) {
                    current_head = row;
                }
                if (String(cell).trim() == "MSV" && indexOfMssv == 2) {
                    console.log("indexCell", indexCell);
                    indexOfMssv = indexCell;
                }
            });

            if (row[indexOfMssv] == mssv) {
                // result.innerHTML = current_head.join(" ").trim();
                let resultStr = current_head.join(" ").trim();
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
    }, 1000);

}

const Reset = () => {
    let result = document.getElementById('result');
    result.innerHTML = "";
}

