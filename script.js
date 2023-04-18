let fileInput = document.getElementById('file-upload');
//Input mssv : 26211234181
const fileName = document.getElementById("file-name");

fileInput.addEventListener("change", function () {
    fileName.textContent = this.value.split("\\").pop();
});


const TimKiemLichThi = async () => {
    var mssv = document.getElementById('mssv').value;
    // let mssv = "26211234181";
    let result = document.getElementById('result');
    result.innerHTML = "Đang tìm kiếm...";
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
                result.innerHTML = current_head.join(" ").trim();
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

