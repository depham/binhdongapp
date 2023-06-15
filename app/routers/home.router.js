module.exports = function(router){
    
    var homeController = require('../controllers/home.controller');
    
    router.get("/", homeController.home);

    router.get("/about", homeController.about);

    router.get("/show", homeController.show);

    router.post("/login", homeController.login);
    
}
