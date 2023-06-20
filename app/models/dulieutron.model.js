const db = require('../common/connect');
const ExcelJS = require('exceljs');
const XLSX = require("xlsx");

const { getStorage, ref, uploadBytes, getDownloadURL } = require("@firebase/storage");
const { deleteObject } = require("@firebase/storage");
const { initializeApp } = require("firebase/app");

const firebaseConfig = {
  apiKey: "AIzaSyA2Se4PVHdlDiXu-2OfYFRRzRFGn5YX4eY",
  authDomain: "factorybd-3d9c9.firebaseapp.com",
  projectId: "factorybd-3d9c9",
  storageBucket: "factorybd-3d9c9.appspot.com",
  messagingSenderId: "557990948165",
  appId: "1:557990948165:web:66a05809379a5b9b7a222c",
  measurementId: "G-YH81F206PZ"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);


const DuLieuTron = function(dulieutron){
    this.DuLieuTronID = dulieutron.DuLieuTronID;
    this.Time = dulieutron.Time;
    this.Date = dulieutron.Date;
    this.MachineID = dulieutron.MachineID;
    this.NameProduct = dulieutron.NameProduct;
    this.STTM = dulieutron.STTM;
    this.M_CE1 = dulieutron.M_CE1;
    this.PV_CE1 = dulieutron.PV_CE1;
    this.M_CE2 = dulieutron.M_CE2;
    this.PV_CE2 = dulieutron.PV_CE2;
    this.M_CE3 = dulieutron.M_CE3;
    this.PV_CE3 = dulieutron.PV_CE3;
    this.PV_PG = dulieutron.PV_PG;
    this.DateCreate = dulieutron.DateCreate;

}


DuLieuTron.get_all = function(result){
  db.query("SELECT *FROM dulieutronbd", function(err, dulieutron){

      if(err){
          result(err);
          return;
      }
      else {
          result(dulieutron);
      }
      
  });
  
}

DuLieuTron.get_totalRows = function(result) {
    // Truy vấn để lấy tổng số dòng dữ liệu
    db.query("SELECT COUNT(*) AS totalRows FROM dulieutronbd", function(err, countResult) {
        if (err) {
            result(err);
            return;
        }

        var totalRows = countResult[0].totalRows;

        // Trả về tổng số dòng dữ liệu
        result(totalRows);
    });
};

DuLieuTron.getTotalRowsByConditions = function(conditions, result) {
    var query = "SELECT COUNT(*) AS totalRows FROM dulieutronbd";
    var params = [];
    var values = [];
  
    for (var key in conditions) {
      if (key === "MachineID" || key === "NameProduct") {
        if (conditions[key]) {
          params.push(key + " = ?");
          values.push(conditions[key]);
        }
      } else if (key === "FromDate" || key === "ToDate") {
        if (conditions[key]) {
          params.push("Date " + (key === "FromDate" ? ">=" : "<=") + " ?");
          values.push(conditions[key]);
        }
      }
    }
  
    // Loại bỏ dấu ngoặc kép từ các giá trị trong mảng values
    for (var i = 0; i < values.length; i++) {
      if (typeof values[i] === 'string') {
        values[i] = values[i].replace(/"/g, '');
      }
    }
  
    if (params.length > 0) {
      query += " WHERE " + params.join(" AND ");
    }
  
    
  
    db.query(query, values, function(err, countResult) {
      if (err) {
        result(0);
      }
  
      var totalRows = countResult[0].totalRows;
      console.log(totalRows);
      result(totalRows);
    });
  };
  

DuLieuTron.getPage = function(page, result){

    
    const limit = 50;
    const offset = (page - 1) * limit;

    const query = `SELECT * FROM dulieutronbd ORDER BY Date DESC LIMIT ${limit} OFFSET ${offset}`;

    //console.log(page);
    db.query(query, (err, dulieutron) => {
        if(err){
            result(null);
        }
    
        else {
            result(dulieutron);
        }
        // Calculate total number of pages
        
      });
}

DuLieuTron.getByID = function(id, result){

    db.query("SELECT *FROM dulieutronbd WHERE MachineID = ?", id, function(err, dulieutron){

        if(err){
            result(null);
        }
        else {
            result(dulieutron);
        }
    });
}

DuLieuTron.getByConditions = function(conditions, page, result) {

    var perPage = 50;
    var offset = (page - 1) * perPage;
    
    var query = "SELECT * FROM dulieutronbd";
    var params = [];
    var values = [];
    
    for (var key in conditions) {
        if (key === "MachineID" || key === "NameProduct") {
          if (conditions[key]) {
            params.push(key + " = ?");
            values.push(conditions[key]);
          }
        } else if (key === "FromDate" || key === "ToDate") {
          if (conditions[key]) {
            params.push("Date " + (key === "FromDate" ? ">=" : "<=") + " ?");
            values.push(conditions[key]);
          }
        }
      }
  
    // Loại bỏ dấu ngoặc kép từ các giá trị trong mảng values
    for (var i = 0; i < values.length; i++) {
        if (typeof values[i] === 'string') {
          values[i] = values[i].replace(/"/g, '');
        }
      }
    if (params.length > 0) {
        query += " WHERE " + params.join(" AND ");
    }  
    //query += params.join(" AND ");

    query += " ORDER BY Date DESC";

    query += " LIMIT ? OFFSET ?";

    values.push(perPage);
    values.push(offset);

    console.log(values);
    console.log(query);
    db.query(query, values, function(err, dulieutron) {
      if (err) {
        result(null);
      } else {
        result(dulieutron);
      }
    });
  };



  DuLieuTron.getExcelByConditions = function(conditions, callback) {
    var query = "SELECT * FROM dulieutronbd";
    var params = [];
    var values = [];
  
    for (var key in conditions) {
      if (key === "MachineID" || key === "NameProduct") {
        if (conditions[key]) {
          params.push(key + " = ?");
          values.push(conditions[key]);
        }
      } else if (key === "FromDate" || key === "ToDate") {
        if (conditions[key]) {
          params.push("Date " + (key === "FromDate" ? ">=" : "<=") + " ?");
          values.push(conditions[key]);
        }
      }
    }
  
    if (params.length > 0) {
      query += " WHERE " + params.join(" AND ");
    }
  
    query += " ORDER BY Date DESC";
  
    db.query(query, values, async function(err, dulieutron) {
      if (err) {
        //callback(err);
      } else {
        try{
            // Đọc file Excel sẵn có từ Firebase Storage
            const storageRef = ref(storage, 'dulieutron/dulieutronchitiet.xlsx');
            const fileSnapshot = await getDownloadURL(storageRef);
            const response = await fetch(fileSnapshot);
            const fileBuffer = await response.arrayBuffer();

            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.load(fileBuffer);

            const worksheet = workbook.getWorksheet('Sheet 1');

            // Xoá dữ liệu từ hàng 7 trở đi
            const startRowDel = 7;
            const endRowDel = worksheet.rowCount;

            for (let rowNumberdel = startRowDel; rowNumberdel <= endRowDel; rowNumberdel++) {
              const row = worksheet.getRow(rowNumberdel);
              row.eachCell({ includeEmpty: true }, (cell) => {
                const cellAddress = cell.address;
                  const cellValue = cell.value;
                  worksheet.getCell(cellAddress).value = cellValue;
                cell.value = null; // Xoá giá trị của từng ô
                
              });
            }

            const updatedWorkbookBufferDel = await workbook.xlsx.writeBuffer();
            await uploadBytes(storageRef, updatedWorkbookBufferDel);
            //console.log(worksheet.rowCount);


            // Thêm dữ liệu từ dulieutron bắt đầu từ hàng 7
            const startRow = 7;
            const startColumn = 2; // Cột B

            dulieutron.forEach((item, index) => {
              // Loại bỏ cột cuối trong dulieutron
              const rowData = [...Object.values(item).slice(0, -1)];
              const rowNumber = startRow + index;
              
              //console.log(rowNumber);

              // Thêm giá trị STT (Số thứ tự) vào cột A
              const sttCellAddress = 'A' + rowNumber;
              worksheet.getCell(sttCellAddress).value = index + 1;

              worksheet.getCell(sttCellAddress).alignment = {
                vertical: 'middle', // Căn giữa theo chiều dọc
                horizontal: 'center' // Căn giữa theo chiều ngang
              };
              rowData.forEach((cellValue, cellIndex) => {
                const columnNumber = startColumn + cellIndex;
                const columnLetter = getExcelColumnLetter(columnNumber);
                const cellAddress = columnLetter + rowNumber;

                if (columnNumber === startColumn + rowData.length - 1) {
                  const cell = worksheet.getCell(cellAddress);
                  cell.value = parseFloat(cellValue); // Định dạng cột cuối là số thập phân
                  cell.numFmt = '#,##0.00'; // Định dạng số thập phân
                } else if (columnNumber === startColumn + 1) {
                  // Định dạng cột C là giờ (hh:mm:ss)
                  const cell = worksheet.getCell(cellAddress);
                  const time = new Date(item.Time); // Chuyển đổi chuỗi thành đối tượng Date
                  const formattedTime = time.toLocaleTimeString('en-US', { hour12: false }); // Lấy giờ, phút, giây từ đối tượng Date và định dạng hh:mm:ss
                  cell.value = formattedTime;
                  cell.numFmt = 'hh:mm:ss';
                } else {
                  worksheet.getCell(cellAddress).value = cellValue;
                }

              });
            });

            // Tính tổng và thêm hàng cho các cột H, I, J, K, L, M, N
            const columnsToSum = ['H', 'I', 'J', 'K', 'L', 'M', 'N'];
            columnsToSum.forEach((columnLetter) => {
              const column = worksheet.getColumn(columnLetter);
              let total = 0;

              column.eachCell({ includeEmpty: true }, (cell, rowNumber) => {
                if (rowNumber >= startRow) {
                  const cellValue = cell.value || 0;
                  total += cellValue;
                }
              });

              const totalRowNumberSum = startRow + dulieutron.length;
              const totalCellAddressSum = columnLetter + totalRowNumberSum;
              const totalCellSum = worksheet.getCell(totalCellAddressSum);
              totalCellSum.value = total;


              totalCellSum.numFmt = '#,##0'; // Định dạng số hàng nghìn
            });

            // Cập nhật giá trị "Từ ngày" và "Đến ngày" trong dòng 4
            const dataCell = worksheet.getCell('A4');
            if (!conditions.FromDate || !conditions.ToDate) {
              // Lấy ngày lâu nhất trong dulieutron
              const oldestDate = dulieutron[dulieutron.length - 1].Date;
              const fromDate = new Date(oldestDate);
              
              // Lấy ngày gần nhất trong dulieutron
              const newestDate = dulieutron[0].Date;
              const toDate = new Date(newestDate);
              
              const fromDateString = formatDate(fromDate);
              const toDateString = formatDate(toDate);
              
              const combinedValue = 'Từ ngày: ' + fromDateString + ' - đến ngày: ' + toDateString;
            
              dataCell.value = combinedValue;
            } else {
              const fromDate = new Date(conditions.FromDate);
              const toDate = new Date(conditions.ToDate);
            
              if (fromDate instanceof Date && !isNaN(fromDate) && toDate instanceof Date && !isNaN(toDate)) {
                const fromDateString = formatDate(fromDate);
                const toDateString = formatDate(toDate);
                
                const combinedValue = 'Từ ngày: ' + fromDateString + ' - đến ngày: ' + toDateString;
            
                dataCell.value = combinedValue;
              }
            }
            
            // Định dạng ô hàng 4 theo yêu cầu của bạn
            dataCell.alignment = {
              vertical: 'middle',
              horizontal: 'left'
            };
            dataCell.font = {
              bold: false,
              italic: true
            };

            // Cập nhật giá trị "Máy" và "Tên hàng" trong dòng 5
            const dataCellRow5 = worksheet.getCell('A5');
            const machineID = conditions.MachineID || '';
            const nameProduct = conditions.NameProduct || '';

            // Kiểm tra và gán giá trị "Tất cả" nếu MachineID và NameProduct là rỗng
            const machineIDText = machineID !== '' ? machineID : 'Tất cả';
            const nameProductText = nameProduct !== '' ? nameProduct : 'Tất cả';

            const combinedValueRow5 = 'Máy: ' + machineIDText + '   -   Tên hàng: ' + nameProductText;

            dataCellRow5.value = combinedValueRow5;

            // Định dạng ô hàng 5 theo yêu cầu của bạn
            dataCellRow5.alignment = {
              vertical: 'middle',
              horizontal: 'left'
            };
            dataCellRow5.font = {
              bold: false,
              italic: true
            };
          // Lưu file Excel cập nhật vào Firebase Storage
            const updatedWorkbookBuffer = await workbook.xlsx.writeBuffer();
            const uploadTask = uploadBytes(storageRef, updatedWorkbookBuffer);

        uploadTask
          .then(() => {
            console.log('File Excel đã được tải lên Firebase Storage.');
            // Trả về đường dẫn tải xuống file Excel
            getDownloadURL(storageRef)
              .then((downloadURL) => {
                console.log(downloadURL);
                
                callback(null, downloadURL);

              })
              .catch((error) => {
                console.error('Lỗi khi lấy đường dẫn tải xuống file Excel:', error);
                  //callback(error);
              });
          })
          .catch((error) => {
            console.error('Lỗi khi tải file Excel lên Firebase Storage:', error);
            //callback(error);
          });
        }
        catch (error) {
          console.error('Lỗi khi thực hiện tác vụ đọc, cập nhật file Excel:', error);
          //callback(error);
        }

      }
    });
  };
  function formatDate(date) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${day}/${month}/${year}`;
  }
  // Hàm chuyển đổi số cột sang chữ cái tương ứng (A, B, C, ...)
function getExcelColumnLetter(columnIndex) {
  const columnNumber = columnIndex - 1;
  const columnLetter = String.fromCharCode(65 + columnNumber);
  return columnLetter;
}


DuLieuTron.getExcelSumByConditions = function(conditions, callback) {
  var query = "SELECT * FROM dulieutronbd";
  var params = [];
  var values = [];

  for (var key in conditions) {
    if (key === "MachineID" || key === "NameProduct") {
      if (conditions[key]) {
        params.push(key + " = ?");
        values.push(conditions[key]);
      }
    } else if (key === "FromDate" || key === "ToDate") {
      if (conditions[key]) {
        params.push("Date " + (key === "FromDate" ? ">=" : "<=") + " ?");
        values.push(conditions[key]);
      }
    }
  }

  if (params.length > 0) {
    query += " WHERE " + params.join(" AND ");
  }

  query += " ORDER BY Date DESC";

  db.query(query, values, async function(err, dulieutron) {
    if (err) {
      //callback(err);
    } else {
      try{
          // Đọc file Excel sẵn có từ Firebase Storage
          const storageRef = ref(storage, 'BaoCao/baocaotongvattu.xlsx');
          const fileSnapshot = await getDownloadURL(storageRef);
          const response = await fetch(fileSnapshot);
          const fileBuffer = await response.arrayBuffer();

          const workbook = new ExcelJS.Workbook();
          await workbook.xlsx.load(fileBuffer);

          const worksheet = workbook.getWorksheet('Sheet 1');

          // Xoá dữ liệu từ cột C đến F, bắt đầu từ hàng 7
          const startRowDel = 7;
          const endRowDel = worksheet.rowCount;
          const startColumnDel = 3; // Cột C
          const endColumnDel = 6; // Cột F

          for (let rowNumberdel = startRowDel; rowNumberdel <= endRowDel; rowNumberdel++) {
            for (let columnNumberDel = startColumnDel; columnNumberDel <= endColumnDel; columnNumberDel++) {
              const cell = worksheet.getCell(rowNumberdel, columnNumberDel);
              cell.value = null; // Xoá giá trị của từng ô
            }
          }
          const updatedWorkbookBufferDel = await workbook.xlsx.writeBuffer();
          await uploadBytes(storageRef, updatedWorkbookBufferDel);

          // Tính tổng các giá trị từ cột PV_CE1 của dulieutron
          const sumPV_CE1 = dulieutron.reduce((total, row) => total + (row.PV_CE1 || 0), 0);
          console.log(sumPV_CE1);
          // Cập nhật giá trị tổng vào ô C7
          const sumCell_PV_CE1 = worksheet.getCell('C7');
          sumCell_PV_CE1.value = sumPV_CE1;
          // Định dạng ô C7 thành số hàng nghìn
          sumCell_PV_CE1.numFmt = '#,##0';

          // Tính tổng các giá trị từ cột PV_CE2 của dulieutron
          const sumPV_CE2 = dulieutron.reduce((total, row) => total + (row.PV_CE2 || 0), 0);
          console.log(sumPV_CE2);
          // Cập nhật giá trị tổng vào ô C8
          const sumCell_PV_CE2 = worksheet.getCell('C8');
          sumCell_PV_CE2.value = sumPV_CE2;
          // Định dạng ô C7 thành số hàng nghìn
          sumCell_PV_CE2.numFmt = '#,##0';

          // Tính tổng các giá trị từ cột PV_CE3 của dulieutron
          const sumPV_CE3 = dulieutron.reduce((total, row) => total + (row.PV_CE3 || 0), 0);
          console.log(sumPV_CE3);
          // Cập nhật giá trị tổng vào ô C9
          const sumCell_PV_CE3 = worksheet.getCell('C9');
          sumCell_PV_CE3.value = sumPV_CE3;
          // Định dạng ô C7 thành số hàng nghìn
          sumCell_PV_CE3.numFmt = '#,##0';

          // Tính tổng các giá trị từ cột PV_PG của dulieutron
          const sumPV_PG = dulieutron.reduce((total, row) => total + (row.PV_PG || 0), 0);
          console.log(sumPV_PG);
          // Cập nhật giá trị tổng vào ô C9
          const sumCell_PV_PG = worksheet.getCell('C10');
          sumCell_PV_PG.value = sumPV_PG;
          // Định dạng ô C7 thành số hàng nghìn
          sumCell_PV_PG.numFmt = '#,##0';

          //cột D
          // Tính tổng các giá trị từ cột PV_CE1 của dulieutron
          const sumM_CE1 = dulieutron.reduce((total, row) => total + (row.M_CE1 || 0), 0);
          console.log(sumM_CE1);
          // Cập nhật giá trị tổng vào ô C7
          const sumCell_M_CE1 = worksheet.getCell('D7');
          sumCell_M_CE1.value = sumM_CE1;
          // Định dạng ô C7 thành số hàng nghìn
          sumCell_M_CE1.numFmt = '#,##0';

          // Tính tổng các giá trị từ cột PV_CE2 của dulieutron
          const sumM_CE2 = dulieutron.reduce((total, row) => total + (row.M_CE2 || 0), 0);
          console.log(sumM_CE2);
          // Cập nhật giá trị tổng vào ô C8
          const sumCell_M_CE2 = worksheet.getCell('D8');
          sumCell_M_CE2.value = sumM_CE2;
          // Định dạng ô C7 thành số hàng nghìn
          sumCell_M_CE2.numFmt = '#,##0';

          // Tính tổng các giá trị từ cột PV_CE3 của dulieutron
          const sumM_CE3 = dulieutron.reduce((total, row) => total + (row.M_CE3 || 0), 0);
          console.log(sumM_CE3);
          // Cập nhật giá trị tổng vào ô C9
          const sumCell_M_CE3 = worksheet.getCell('D9');
          sumCell_M_CE3.value = sumM_CE3;
          // Định dạng ô C7 thành số hàng nghìn
          sumCell_M_CE3.numFmt = '#,##0';

          // Tính tổng các giá trị từ cột PV_CE3 của dulieutron
          const sumM_PG = dulieutron.reduce((total, row) => total + (row.PV_PG || 0), 0);
          console.log(sumM_PG);
          // Cập nhật giá trị tổng vào ô C9
          const sumCell_M_PG = worksheet.getCell('D10');
          sumCell_M_PG.value = sumM_PG;
          // Định dạng ô C7 thành số hàng nghìn
          sumCell_M_PG.numFmt = '#,##0';

          // Sai số Kg
          // Tính sai số CE1
          const errorValue_CE1 = sumPV_CE1 - sumM_CE1; 
          //Cập nhật giá trị vào ô E7
          const errorCell_CE1 = worksheet.getCell('E7');
          errorCell_CE1.value = errorValue_CE1;
          // Định dạng ô E7 thành số hàng nghìn
          errorCell_CE1.numFmt = '#,##0';

          // Tính sai số CE2
          const errorValue_CE2 = sumPV_CE2 - sumM_CE2; 
          //Cập nhật giá trị vào ô E7
          const errorCell_CE2 = worksheet.getCell('E8');
          errorCell_CE2.value = errorValue_CE2;
          // Định dạng ô E7 thành số hàng nghìn
          errorCell_CE2.numFmt = '#,##0';

          // Tính sai số CE3
          const errorValue_CE3 = sumPV_CE3 - sumM_CE3; 
          //Cập nhật giá trị vào ô E7
          const errorCell_CE3 = worksheet.getCell('E9');
          errorCell_CE3.value = errorValue_CE3;
          // Định dạng ô E7 thành số hàng nghìn
          errorCell_CE3.numFmt = '#,##0';

          // Tính sai số PG
          const errorValue_PG = sumPV_PG - sumPV_PG; 
          //Cập nhật giá trị vào ô E7
          const errorCell_PG = worksheet.getCell('E10');
          errorCell_PG.value = errorValue_PG;
          // Định dạng ô E7 thành số hàng nghìn
          errorCell_PG.numFmt = '#,##0';

          // Kiểm tra nếu sumM_CE1 và errorValue_CE1 đều bằng 0
          if (sumM_CE1 === 0 && errorValue_CE1 === 0) {
            // Gán giá trị phần trăm sai số là 0
            const roundedPercentageError_CE1 = 0;
            
            // Cập nhật giá trị phần trăm sai số vào ô F
            const errorCell_percent_CE1 = worksheet.getCell('F' + 7);
            errorCell_percent_CE1.value = roundedPercentageError_CE1;
            
            
          } else {
            // Nếu sumM_CE1 và errorValue_CE1 không bằng 0, tiếp tục tính toán phần trăm sai số như trước đó
            const percentageError_CE1 = (errorValue_CE1 / sumM_CE1) * 100;
            const roundedPercentageError_CE1 = Math.round(percentageError_CE1 * 100) / 100;
            
            // Cập nhật giá trị phần trăm sai số vào ô F
            const errorCell_percent_CE1 = worksheet.getCell('F' + 7);
            errorCell_percent_CE1.value = roundedPercentageError_CE1;
            errorCell_percent_CE1.numFmt = '0.00';
            
          }
          
          
          // Kiểm tra nếu sumM_CE1 và errorValue_CE1 đều bằng 0
          if (sumM_CE2 === 0 && errorValue_CE2 === 0) {
            // Gán giá trị phần trăm sai số là 0
            const roundedPercentageError_CE2 = 0;
            
            // Cập nhật giá trị phần trăm sai số vào ô F
            const errorCell_percent_CE2 = worksheet.getCell('F' + 8);
            errorCell_percent_CE2.value = roundedPercentageError_CE2;
            
            
          } else {
            // Nếu sumM_CE1 và errorValue_CE1 không bằng 0, tiếp tục tính toán phần trăm sai số như trước đó
            const percentageError_CE2 = (errorValue_CE2 / sumM_CE2) * 100;
            const roundedPercentageError_CE2 = Math.round(percentageError_CE2 * 100) / 100;
            
            // Cập nhật giá trị phần trăm sai số vào ô F
            const errorCell_percent_CE2 = worksheet.getCell('F' + 8);
            errorCell_percent_CE2.value = roundedPercentageError_CE2;
            errorCell_percent_CE2.numFmt = '0.00';
            
          }

          // Kiểm tra nếu sumM_CE1 và errorValue_CE1 đều bằng 0
          if (sumM_CE3 === 0 && errorValue_CE3 === 0) {
            // Gán giá trị phần trăm sai số là 0
            const roundedPercentageError_CE3 = 0;
            
            // Cập nhật giá trị phần trăm sai số vào ô F
            const errorCell_percent_CE3 = worksheet.getCell('F' + 9);
            errorCell_percent_CE3.value = roundedPercentageError_CE3;
            
            
          } else {
            // Nếu sumM_CE1 và errorValue_CE1 không bằng 0, tiếp tục tính toán phần trăm sai số như trước đó
            const percentageError_CE3 = (errorValue_CE3 / sumM_CE3) * 100;
            const roundedPercentageError_CE3 = Math.round(percentageError_CE3 * 100) / 100;
            
            // Cập nhật giá trị phần trăm sai số vào ô F
            const errorCell_percent_CE3 = worksheet.getCell('F' + 9);
            errorCell_percent_CE3.value = roundedPercentageError_CE3;
            errorCell_percent_CE3.numFmt = '0.00';
            
          }
          // Percent CE1
          // Cập nhật giá trị phần trăm sai số vào cột F
          const roundedPercentageError_PG = 0;
          const errorCell_percent_PG = worksheet.getCell('F10');
          errorCell_percent_PG.value = roundedPercentageError_PG;


          // Cập nhật giá trị "Từ ngày" và "Đến ngày" trong dòng 4
          const dataCell = worksheet.getCell('A4');
          if (!conditions.FromDate || !conditions.ToDate) {
            // Lấy ngày lâu nhất trong dulieutron
            const oldestDate = dulieutron[dulieutron.length - 1].Date;
            const fromDate = new Date(oldestDate);
            
            // Lấy ngày gần nhất trong dulieutron
            const newestDate = dulieutron[0].Date;
            const toDate = new Date(newestDate);
            
            const fromDateString = formatDate(fromDate);
            const toDateString = formatDate(toDate);
            
            const combinedValue = 'Từ ngày: ' + fromDateString + ' - đến ngày: ' + toDateString;
          
            dataCell.value = combinedValue;
          } else {
            const fromDate = new Date(conditions.FromDate);
            const toDate = new Date(conditions.ToDate);
          
            if (fromDate instanceof Date && !isNaN(fromDate) && toDate instanceof Date && !isNaN(toDate)) {
              const fromDateString = formatDate(fromDate);
              const toDateString = formatDate(toDate);
              
              const combinedValue = 'Từ ngày: ' + fromDateString + ' - đến ngày: ' + toDateString;
          
              dataCell.value = combinedValue;
            }
          }
          
          // Định dạng ô hàng 4 theo yêu cầu của bạn
          dataCell.alignment = {
            vertical: 'middle',
            horizontal: 'left'
          };
          dataCell.font = {
            bold: false,
            italic: true
          };

          // Cập nhật giá trị "Máy" và "Tên hàng" trong dòng 5
          const dataCellRow5 = worksheet.getCell('A5');
          const machineID = conditions.MachineID || '';
          const nameProduct = conditions.NameProduct || '';

          // Kiểm tra và gán giá trị "Tất cả" nếu MachineID và NameProduct là rỗng
          const machineIDText = machineID !== '' ? machineID : 'Tất cả';
          const nameProductText = nameProduct !== '' ? nameProduct : 'Tất cả';

          const combinedValueRow5 = 'Máy: ' + machineIDText + '   -   Tên hàng: ' + nameProductText;

          dataCellRow5.value = combinedValueRow5;

          // Định dạng ô hàng 5 theo yêu cầu của bạn
          dataCellRow5.alignment = {
            vertical: 'middle',
            horizontal: 'left'
          };
          dataCellRow5.font = {
            bold: false,
            italic: true
          };
        // Lưu file Excel cập nhật vào Firebase Storage
          const updatedWorkbookBuffer = await workbook.xlsx.writeBuffer();
          const uploadTask = uploadBytes(storageRef, updatedWorkbookBuffer);

      uploadTask
        .then(() => {
          console.log('File Excel đã được tải lên Firebase Storage.');
          // Trả về đường dẫn tải xuống file Excel
          getDownloadURL(storageRef)
            .then((downloadURL) => {
              console.log(downloadURL);
              
              callback(null, downloadURL);

            })
            .catch((error) => {
              console.error('Lỗi khi lấy đường dẫn tải xuống file Excel:', error);
                callback(error);
            });
        })
        .catch((error) => {
          console.error('Lỗi khi tải file Excel lên Firebase Storage:', error);
          callback(error);
        });
      }
      catch (error) {
        console.error('Lỗi khi thực hiện tác vụ đọc, cập nhật file Excel:', error);
        callback(error);
      }

    }
  });
};


DuLieuTron.create = function(data, result){
    data.DateCreate = new Date();
    db.query("INSERT INTO dulieutronbd SET ?", data, function(err, dulieutron){
        if(err){
            result(null);
        }
        else {
            result({DuLieuTronID: dulieutron.insertId, ...data});
        }
    });
}

DuLieuTron.remove = function(id, result){
    db.query("DELETE FROM dulieutronbd WHERE DuLieuTronID = ?", id, function(err, dulieutron){
        if(err){
            result(null);
        }
        else {
            result("Đã xoá DLT có ID: " + id);
        }
    });
}

DuLieuTron.update = function(b, result){
    db.query("UPDATE dulieutronbd SET DuLieuTronID = ?, Time = ?, Date = ?, MachineID = ?, NameProduct = ?, STTM = ?, M_CE1 = ?, PV_CE1 = ?, M_CE2 = ?, PV_CE2, M_CE3 = ?, PV_CE3, PV_PG = ? WHERE id = ?", 
    [b.DuLieuTronID, b.Time, b.Date, b.MachineID, b.NameProduct, b.STTM, b.M_CE1, b.PV_CE1, b.M_CE2, b.PV_CE2, b.M_CE3, b.PV_CE3. b.PV_PG], function(err, dulieutron){
        if(err){
            result(null);
        }
        else {
            result(b);
        }
    });
}
module.exports = DuLieuTron;