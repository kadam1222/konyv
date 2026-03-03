const express = require('express');
const router = express.Router();
const konyvekcontrollers = require('../controllers/konyvekcontrollers');
const auth = require('../middleware/auth');
const requireAdmin = require('../middleware/adminOnly');

router.get("/adminmodosit",auth,requireAdmin, konyvekcontrollers.OsszesRendeles)

router.get("/adminuser",auth,requireAdmin, konyvekcontrollers.OsszesUser)

router.put("/konyvmodositas",auth,requireAdmin,konyvekcontrollers.UpdateKonyv)

router.post("/adatHozzaad", auth, requireAdmin, konyvekcontrollers.insertAdat)

router.put("/adminuserdelete",auth,requireAdmin, konyvekcontrollers.deleteUser)

router.put("/updatejogosultsag",auth,requireAdmin, konyvekcontrollers.UpdateJogosultsag)

router.get("/adminosszeskonyv",auth,requireAdmin, konyvekcontrollers.OsszesKonyv)

router.put("/rendeles_statusz_modositas",auth,requireAdmin,konyvekcontrollers.rendeles_statusza_modositasa)

router.delete('/konyvtorol',auth,requireAdmin, konyvekcontrollers.delete);

router.get('/searchRendelesek',auth,requireAdmin, konyvekcontrollers.osszesRendelesSearch)

router.delete('/deleteAdat', auth, requireAdmin, konyvekcontrollers.deleteAdat)

module.exports = router;