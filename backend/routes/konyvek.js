const express = require('express');
const router = express.Router();
const konyvekcontrollers = require('../controllers/konyvekcontrollers');
const auth = require('../middleware/auth');
const requireAdmin = require('../middleware/adminOnly');


router.get('/search', konyvekcontrollers.filter);

router.get('/kategoria', konyvekcontrollers.kategoria);

router.get('/elerheto-szurok', konyvekcontrollers.DynamicFilters)


router.get('/nyelv', konyvekcontrollers.nyelv);

router.get('/borito', konyvekcontrollers.borito);

router.get('/tipus',konyvekcontrollers.tipus)

router.get('/forditok',konyvekcontrollers.fordito)

router.get('/szerzok',konyvekcontrollers.szerzok)

router.get('/illusztratorok',konyvekcontrollers.illusztratorok)

router.get('/illusztracio',konyvekcontrollers.illusztracio)

router.get('/kiadok', konyvekcontrollers.kiado);

router.get('/statusz', konyvekcontrollers.rendeles_statusza);

router.post('/ISBN',konyvekcontrollers.getbyISBN);



router.get('/profil',auth ,konyvekcontrollers.Profilleker);

router.post("/szamla", auth,konyvekcontrollers.szamlakeszites)

router.put('/modosit',auth ,konyvekcontrollers.modositas);

router.get("/rendelesek", auth, konyvekcontrollers.Rendelesek)



router.put("/raktar_modosit", konyvekcontrollers.darabszamModositas)

router.get('/', konyvekcontrollers.getAllKonyvek);

module.exports = router;