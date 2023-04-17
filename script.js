let fileInput = document.getElementById('file-upload');

//Input mssv : CMU-CS 303 DIS. IS 301 D

const fileName = document.getElementById("file-name");

fileInput.addEventListener("change", function () {
    fileName.textContent = this.value.split("\\").pop();
});


const TimKiemLichThi = async () => {
    var mssv = document.getElementById('mssv').value;
    // let mssv = "CS 464 H, POS 351 F,MTH 203 DIS, CMU-ENG 230 DIS";
    let table = document.getElementById('result').getElementsByTagName('tbody')[0];
    mssv = mssv.toUpperCase();
    let mssvArray = mssv.split(" ");
    let indexMssv = 2;

    // if (mssv.length == 0) {
    //     alert("Chưa nhập mssv !");
    //     console.error("Chưa nhập mssv !");
    //     return;
    // }

    if (fileInput.files.length == 0) {
        alert("Chưa chọn file !");
        console.error("Chưa chọn file !");
        return;
    }

    await mssvArray.map(function (item) {
        let Lop = item.trim();

        readXlsxFile(fileInput.files[0]).then(function (rows) {
            // `rows` is an array of rows
            // each row being an array of cells.
            console.log(rows.length);
            // rows.map(function (row) {
            //     row.map(function (cell, indexCell) {
            //         if (String(cell).indexOf("Thời gian") > -1) {
            //             console.log(row);
            //         }
            //     });

                
            // });
            
        });
    });

    // setTimeout( () => {
    //     console.log(numberRowInsert)
    //     if (numberRowInsert > 0) {
    //         let control = document.getElementById('control');
    //         control.style.display = "block";
    //     }
    // } , 1000)
}

const Reset = () => {
    let table = document.getElementById('result').getElementsByTagName('tbody')[0];
    table.innerHTML = "";
    let control = document.getElementById('control');
    control.style.display = "none";
}

