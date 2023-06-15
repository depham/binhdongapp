const db = require('../common/connect');
const exceljs = require('exceljs');
const XLSX = require("xlsx");
const fs = require('fs');

//const tempFolderPath = './temp';
//const storageFolderPath = './storage';

// Tạo thư mục temp
//if (!fs.existsSync(tempFolderPath)) {
//  fs.mkdirSync(tempFolderPath);
//  console.log('Thư mục temp đã được tạo.');
//}

// Tạo thư mục storage
//if (!fs.existsSync(storageFolderPath)) {
//  fs.mkdirSync(storageFolderPath);
//  console.log('Thư mục storage đã được tạo.');
//}

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
    //this.DateCreate = dulieutron.DateCreate;

}


DuLieuTron.get_all = function(page, result){
    var perPage = 50;
    var offset = (page - 1) * perPage;

    db.query("SELECT * FROM dulieutronbd ORDER BY Date DESC LIMIT ? OFFSET ?", [perPage, offset], function(err, dulieutron){
        if(err){
            result(err);
            return;
        } else {
            result(dulieutron);
        }
    });
};

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
        result(err);
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

  if (params.length > 0) {
    query += " WHERE " + params.join(" AND ");
  }

  query += " ORDER BY Date DESC LIMIT ? OFFSET ?";

  values.push(perPage);
  values.push(offset);

  console.log(values);
  console.log(query);

  db.query(query, values, function(err, dulieutron) {
    if (err) {
      console.error(err);
      result(null);
      return;
    }

    try {
      var jsonResult = JSON.stringify(dulieutron);
      result(jsonResult);
    } catch (error) {
      console.error(error);
      result(null);
    }
  });
};


DuLieuTron.getExcelByConditions = function(conditions, result) {
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
  
    db.query(query, values, function(err, dulieutron) {
      if (err) {
        result(err);
      } else {
        
        
        // Tạo file Excel
        //const workbook = XLSX.utils.book_new();
        //const sheetData = XLSX.utils.json_to_sheet(dulieutron);
        //XLSX.utils.book_append_sheet(workbook, sheetData, "Sheet 1"); // Thay "Sheet 1" bằng tên sheet của bạn

        // Tạo tệp tin Excel tạm thời
        //const tempFilePath = "./temp/excel_temp.xlsx"; // Đường dẫn tới tệp tin Excel tạm thời
        //XLSX.writeFile(workbook, tempFilePath);

        // Di chuyển tệp tin Excel tạm thời vào thư mục lưu trữ trên server
        //const storagePath = "./storage/excel_file.xlsx"; // Đường dẫn tới thư mục lưu trữ tệp tin Excel
        //fs.rename(tempFilePath, storagePath, (error) => {
          //if (error) {
            //console.error("Lỗi khi di chuyển tệp tin:", error);
            //return res.status(500).json({ success: false, message: "Có lỗi xảy ra khi di chuyển tệp tin Excel." });
          //}

      // Trả về đường dẫn của tệp tin Excel đã tạo
      //console.log(storagePath);
        //result(dulieutron);

        //});
        result(dulieutron);
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