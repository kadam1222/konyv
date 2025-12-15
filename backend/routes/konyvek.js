const express = require('express');
const router = express.Router();
const konyvekcontrollers = require('../controllers/konyvekcontrollers');



router.get('/search', konyvekcontrollers.filter);
router.get('/fokereso', konyvekcontrollers.fokereso);
router.get('/kategoria', konyvekcontrollers.kategoria);
router.get('/nyelv', konyvekcontrollers.nyelv);
router.get('/borito', konyvekcontrollers.borito);
router.get('/kiadok', konyvekcontrollers.kiado);
router.post('/ISBN',konyvekcontrollers.getbyISBN);
router.delete('/:ISBN', konyvekcontrollers.delete);
router.get('/', konyvekcontrollers.getAllKonyvek);
module.exports = router;