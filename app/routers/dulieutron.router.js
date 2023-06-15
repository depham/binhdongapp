
module.exports = function(router){
    
    var dulieutronController = require('../controllers/dulieutron.controller');
    var middleware = require('../middleware');

    router.get("/dulieutron", middleware.checkAuthentication, dulieutronController.dulieutron);

    router.get("/dulieutron/list", middleware.checkAuthentication, dulieutronController.get_list_dulieutron);

    router.get("/dulieutron/totalrow", middleware.checkAuthentication, dulieutronController.get_total_row);

    router.get("/dulieutron/totalrowbycondition", middleware.checkAuthentication, dulieutronController.get_total_row_ByCondition);

    router.get("/dulieutron/page/:page", middleware.checkAuthentication, dulieutronController.get_page_dulieutron);

    router.get("/dulieutron/detail/:id", middleware.checkAuthentication, dulieutronController.detail);

    router.get("/dulieutron/detailbycondition/", middleware.checkAuthentication, dulieutronController.detail_ByCondition);

    router.post("/dulieutron/add", dulieutronController.add_dulieutron);

    //router.delete("/dulieutron/delete/:id", middleware.checkAuthentication, dulieutronController.remove_dulieutron);

    router.put("/dulieutron/update", middleware.checkAuthentication, dulieutronController.update_dulieutron);

    router.get("/dulieutron/exportexcel", middleware.checkAuthentication, dulieutronController.get_excel_ByCondition);
}
