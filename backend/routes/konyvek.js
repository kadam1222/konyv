const express = require('express');
const router = express.Router();
const konyvekcontrollers = require('../controllers/konyvekcontrollers');
const auth = require('../middleware/auth');
const requireAdmin = require('../middleware/adminOnly')

router.get('/search', konyvekcontrollers.filter);
router.get('/kategoria', konyvekcontrollers.kategoria);
router.get('/nyelv', konyvekcontrollers.nyelv);
router.get('/borito', konyvekcontrollers.borito);
router.get('/tipus',konyvekcontrollers.tipus)
router.get('/kiadok', konyvekcontrollers.kiado);
router.get('/statusz', konyvekcontrollers.rendeles_statusza);
router.post('/ISBN',konyvekcontrollers.getbyISBN);
router.delete('/:ISBN', konyvekcontrollers.delete);
router.get('/profil',auth ,konyvekcontrollers.Profilleker);
router.post("/szamla", auth,konyvekcontrollers.szamlakeszites)
router.put('/modosit',auth ,konyvekcontrollers.modositas);
router.get("/rendelesek", auth, konyvekcontrollers.Rendelesek)
router.get("/adminmodosit",auth,requireAdmin, konyvekcontrollers.OsszesRendeles)
router.put("/rendeles_statusz_modositas",auth,requireAdmin,konyvekcontrollers.rendeles_statusza_modositasa)
router.get('/', konyvekcontrollers.getAllKonyvek);
module.exports = router;