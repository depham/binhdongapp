
module.exports = function(router){
    
    var dulieutronController = require('../controllers/dulieutron.controller');
    var middleware = require('../middleware');

    router.get("/dulieutron", middleware.checkAuthentication, dulieutronController.dulieutron);

    router.get("/dulieutron/list", dulieutronController.get_list_dulieutron);

    router.get("/dulieutron/totalrow", dulieutronController.get_total_row);

    router.get("/dulieutron/totalrowbycondition", dulieutronController.get_total_row_ByCondition);

    router.get("/dulieutron/page/:page", dulieutronController.get_page_dulieutron);

    router.get("/dulieutron/detail/:id", dulieutronController.detail);

    router.get("/dulieutron/detailbycondition/", dulieutronController.detail_ByCondition);

    router.post("/dulieutron/add", dulieutronController.add_dulieutron);

    //router.delete("/dulieutron/delete/:id", middleware.checkAuthentication, dulieutronController.remove_dulieutron);

    router.put("/dulieutron/update", dulieutronController.update_dulieutron);

    router.get("/dulieutron/exportexcel", dulieutronController.get_excel_ByCondition);

}
