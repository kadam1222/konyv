const { body } = require("express-validator");

exports.loginValidator = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Érvénytelen email formátum."),

  body("jelszo")
    .notEmpty()
    .withMessage("A jelszó megadása kötelező.")
];