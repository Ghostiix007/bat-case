const express = require("express");
const router = express.Router();
const { adminLogin, getUsers, updateUserBalance, updateCasePrice, addDropToCase, removeDropFromCase, createSkin } = require("../controllers/adminController.js");

const authMiddleware = require("../middleware/authMiddleware.js");
const adminMiddleware = require("../middleware/adminMiddleware.js");

router.post("/login", adminLogin);

router.get("/users", authMiddleware, adminMiddleware, getUsers);
router.patch("/users/:id", authMiddleware, adminMiddleware, updateUserBalance);
router.patch("/cases/:id", authMiddleware, adminMiddleware, updateCasePrice);
router.post("/cases/:id/drops", authMiddleware, adminMiddleware, addDropToCase);
router.delete("/cases/:id/drops", authMiddleware, adminMiddleware, removeDropFromCase);
router.post("/skins", authMiddleware, adminMiddleware, createSkin);

module.exports = router;

