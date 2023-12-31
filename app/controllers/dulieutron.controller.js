var DuLieuTron = require('../models/dulieutron.model');

exports.dulieutron = function(req, res){
    if (req.session.user) {
        // Người dùng đã đăng nhập, cho phép truy cập vào đường dẫn /dulieutron
        // Thực hiện các xử lý để lấy dữ liệu và render trang /dulieutron
        res.render('index', { username: req.session.user.username });
      } else {
        // Người dùng chưa đăng nhập, chuyển hướng đến trang đăng nhập
        res.redirect('https://factory-binhdong.vercel.app/');
      }
}

exports.get_list_dulieutron = function(req, res){
   
    DuLieuTron.get_all(function(data){
        res.send({result: data})
    });

}

exports.get_total_row = function(req, res){
    DuLieuTron.get_totalRows(function(data){
        console.log(data)
        res.send({result: data})
    });
};

exports.get_page_dulieutron = function(req, res){
    DuLieuTron.getPage(req.params.page, function(respnse){
        res.send({result: respnse});
    });

}

exports.detail = function(req, res){
   
    DuLieuTron.getByID(req.params.id, function(respnse){
        res.send({result: respnse});
    });
    
}


exports.detail_ByCondition = function(req, res) {
    var conditions = {
      MachineID: req.query.machine,
      FromDate: req.query.fromDate,
      NameProduct: req.query.productName,
      ToDate: req.query.toDate
    };
    var currentPage = req.query.page || 1;
    console.log(conditions.MachineID);
    DuLieuTron.getByConditions(conditions, currentPage, function(response) {
        res.send({ result: response });
      });
  };

exports.get_total_row_ByCondition = function(req, res) {
    var conditions = {
      MachineID: req.query.machine,
      FromDate: req.query.fromDate,
      NameProduct: req.query.productName,
      ToDate: req.query.toDate
    };
    DuLieuTron.getTotalRowsByConditions(conditions, function(totalRows) {
        console.log(totalRows);
        res.send({ result: totalRows });
    });
};

exports.get_excel_ByCondition = function(req, res) {
    var conditions = {
      MachineID: req.query.machine,
      FromDate: req.query.fromDate,
      NameProduct: req.query.productName,
      ToDate: req.query.toDate
    };
    DuLieuTron.getExcelByConditions(conditions, function(error, callback) {
        if (error) {
          console.error('Lỗi khi lấy dữ liệu Excel:', error);
          res.status(500).send({ error: 'Lỗi khi lấy dữ liệu Excel' });
        } else {
          console.log(callback);
          res.send({ result: callback });
        }
      });
    };

exports.get_excelsum_ByCondition = function(req, res) {
    var conditions = {
        MachineID: req.query.machine,
        FromDate: req.query.fromDate,
        NameProduct: req.query.productName,
        ToDate: req.query.toDate
    };
    DuLieuTron.getExcelSumByConditions(conditions, function(error, callback) {
        if (error) {
            console.error('Lỗi khi lấy dữ liệu Excel:', error);
            res.status(500).send({ error: 'Lỗi khi lấy dữ liệu Excel' });
        } else {
            console.log(callback);
            res.send({ result: callback });
        }
    });
};

exports.get_total_M_CE1_ByCondition = function(req, res) {
    var conditions = {
      MachineID: req.query.machine,
      FromDate: req.query.fromDate,
      NameProduct: req.query.productName,
      ToDate: req.query.toDate
    };
    DuLieuTron.getTotal_M_CE1_ByConditions(conditions, function(totalSupplies) {
        console.log(totalSupplies);
        res.send({ result: totalSupplies });
    });
  };

  exports.get_total_M_CE2_ByCondition = function(req, res) {
    var conditions = {
      MachineID: req.query.machine,
      FromDate: req.query.fromDate,
      NameProduct: req.query.productName,
      ToDate: req.query.toDate
    };
    DuLieuTron.getTotal_M_CE2_ByConditions(conditions, function(totalSupplies) {
        console.log(totalSupplies);
        res.send({ result: totalSupplies });
    });
  };
  exports.get_total_M_CE3_ByCondition = function(req, res) {
    var conditions = {
      MachineID: req.query.machine,
      FromDate: req.query.fromDate,
      NameProduct: req.query.productName,
      ToDate: req.query.toDate
    };
    DuLieuTron.getTotal_M_CE3_ByConditions(conditions, function(totalSupplies) {
        console.log(totalSupplies);
        res.send({ result: totalSupplies });
    });
  };
  exports.get_total_PV_CE1_ByCondition = function(req, res) {
    var conditions = {
      MachineID: req.query.machine,
      FromDate: req.query.fromDate,
      NameProduct: req.query.productName,
      ToDate: req.query.toDate
    };
    DuLieuTron.getTotal_PV_CE1_ByConditions(conditions, function(totalSupplies) {
        console.log(totalSupplies);
        res.send({ result: totalSupplies });
    });
  };
  exports.get_total_PV_CE2_ByCondition = function(req, res) {
    var conditions = {
      MachineID: req.query.machine,
      FromDate: req.query.fromDate,
      NameProduct: req.query.productName,
      ToDate: req.query.toDate
    };
    DuLieuTron.getTotal_PV_CE2_ByConditions(conditions, function(totalSupplies) {
        console.log(totalSupplies);
        res.send({ result: totalSupplies });
    });
  };
  exports.get_total_PV_CE3_ByCondition = function(req, res) {
    var conditions = {
      MachineID: req.query.machine,
      FromDate: req.query.fromDate,
      NameProduct: req.query.productName,
      ToDate: req.query.toDate
    };
    DuLieuTron.getTotal_PV_CE3_ByConditions(conditions, function(totalSupplies) {
        console.log(totalSupplies);
        res.send({ result: totalSupplies });
    });
  };
  exports.get_total_M_PG_ByCondition = function(req, res) {
    var conditions = {
      MachineID: req.query.machine,
      FromDate: req.query.fromDate,
      NameProduct: req.query.productName,
      ToDate: req.query.toDate
    };
    DuLieuTron.getTotal_M_PG_ByConditions(conditions, function(totalSupplies) {
        console.log(totalSupplies);
        res.send({ result: totalSupplies });
    });
  };


  exports.get_total_supplies_ByCondition = function(req, res) {
    var conditions = {
      MachineID: req.query.machine,
      FromDate: req.query.fromDate,
      NameProduct: req.query.productName,
      ToDate: req.query.toDate
    };
    DuLieuTron.getTotalSuppliesByConditions(conditions, ["M_CE1", "M_CE2", "M_CE3", "PV_CE1", "PV_CE2", "PV_CE3", "PV_PG"], function(totalSupplies) {
        console.log(totalSupplies);
        res.send({ result: totalSupplies });
    });
  };
  
exports.add_dulieutron = function(req, res) {
    var data = req.body;
    DuLieuTron.create(data, function(response) {
        if (response) {
            res.send("OK");
        } else {
            res.send("ERROR");
        }
    });
}

exports.remove_dulieutron = function(req, res){
    var id = req.params.id;
    DuLieuTron.remove(id, function(respnse){
        res.send({result: respnse});
    })
}

exports.update_dulieutron = function(req, res){
    var data = req.body;
    DuLieuTron.update(data, function(respse){
        res.send({result: respse});
    })
}