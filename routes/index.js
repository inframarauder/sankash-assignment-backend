const router = require("express").Router();
const UserController = require("../controllers/UserController");
const DashboardController = require("../controllers/DashboardController");
const AuthMiddleware = require("../middlewares/AuthMiddleware");
//@route  POST /users/singup
router.post("/users/signup", UserController.signup);

//@route  POST /users/login
router.post("/users/login", UserController.login);

//@route  POST /users/refresh_token
router.post("/users/refresh_token", UserController.generateRefreshToken);

//@route  DELETE /users/logout
router.delete("/users/logout", UserController.logout);

//@route GET /dashboard
router.get(
  "/dashboard",
  AuthMiddleware.checkAuth,
  DashboardController.getDashboard
);

module.exports = router;
