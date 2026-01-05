const konyvek = require('../models/konyvek');
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
exports.getAllKonyvek = async (req, res) => {
  try {
    const page = req.query.page
    const konyvek_all = await konyvek.getAll(page);
    res.json(konyvek_all); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Hiba történt a könyvek lekérdezésekor (SERVER ERROR)' });
  }
};

exports.getbyISBN = async (req, res) => {
  try {
    const ISBN = req.body.ISBN
    const konyv = await konyvek.getbyISBN(ISBN);
    if(!konyv){
      res.status(404).json({message : "Hiba! Nem találtunk a kérésnek megfelelő terméket!😔"})
    }
    res.json(konyv);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Hiba történt a könyvek lekérdezésekor (SERVER ERROR)' });
  }
};

exports.filter = async (req, res) => {
  try {
    const kiado = req.query.kiado
    const kategoria = req.query.kat
    const nyelv = req.query.nyelv
    const illusztrator = req.query.illusz
    const borito = req.query.borito
    const tipus = req.query.tipus
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const konyvek_filter = await konyvek.filter(kiado,kategoria,nyelv,illusztrator, borito, "Relevancia",tipus , page, limit);
    res.json(konyvek_filter); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Hiba történt a könyvek lekérdezésekor (SERVER ERROR)' });
  }
};

exports.fokereso = async (req,res) => {
  try{
    const cim = req.query.cim || ""
    const szerzo = req.query.szerzo || ""
    const page = parseInt(req.query.page) || 1;
    const konyvek_filter = await konyvek.fokereso(cim,szerzo, page);
    res.json(konyvek_filter);
  }
  catch(err)
  {
    console.error(err);
    res.status(500).json({ message: 'Hiba történt a könyvek lekérdezésekor (SERVER ERROR)' });
  }
}

exports.delete = async (req, res) =>{
  try{
      const ISBN = req.params.ISBN
      const success = await konyvek.delete(ISBN)
      if(success){
        res.status(204).json()
      }
      else{
        res.status(404).json({error: 'Nincs ilyen termék'})
     }
  }
    catch(err)
  {
    console.error(err);
    res.status(500).json({ message: 'Hiba történt a könyvek lekérdezésekor (SERVER ERROR)' });
  }
}

exports.kategoria = async (req,res) => {
  try{
    const kateg = await konyvek.kategoriak();
    res.json(kateg);
  }
  catch(err)
  {
    console.error(err);
    res.status(500).json({ message: 'Hiba történt a könyvek lekérdezésekor (SERVER ERROR)' });
  }
}

exports.kiado = async (req,res) => {
  try{
    const kateg = await konyvek.kiadok();
    res.json(kateg);
  }
  catch(err)
  {
    console.error(err);
    res.status(500).json({ message: 'Hiba történt a könyvek lekérdezésekor (SERVER ERROR)' });
  }
}
exports.nyelv = async (req,res) => {
  try{
    const kateg = await konyvek.nyelv();
    res.json(kateg);
  }
  catch(err)
  {
    console.error(err);
    res.status(500).json({ message: 'Hiba történt a könyvek lekérdezésekor (SERVER ERROR)' });
  }
}
exports.borito = async (req,res) => {
  try{
    const kateg = await konyvek.borito();
    res.json(kateg);
  }
  catch(err)
  {
    console.error(err);
    res.status(500).json({ message: 'Hiba történt a könyvek lekérdezésekor (SERVER ERROR)' });
  }
}

exports.tipus = async (req,res) => {
  try{
    const tipusok = await konyvek.tipus();
    res.json(tipusok);
  }
  catch(err)
  {
    console.error(err);
    res.status(500).json({ message: 'Hiba történt a könyvek lekérdezésekor (SERVER ERROR)' });
  }
}

exports.regisztracio = async ( req, res, next) =>{
  try{
    const {nev, email, jelszo} = req.body;
    if (!nev || !email || !jelszo) {
      return res.status(400).json({
        message: 'Minden mező kitöltése kötelező!'
      });
    }
    const hashedjelszo = await bcrypt.hash(jelszo, 10)

    await konyvek.regisztracio(
      nev,
      email,
      hashedjelszo
    )
    res.status(201).json({message: "Sikeres regisztráció! 🎉"})
  }
  catch(err){
    next(err)
  }
}

exports.bejelentkezes = async (req, res, next) =>{
  try{
    const {email, jelszo} = req.body
        if (!email || !jelszo) {
        return res.status(400).json({ error: "Minden mező kitöltése kötelező" });
        }
    const felhasznalo  = await konyvek.findByEmail(email);
    if (!felhasznalo){
      return res.status(401).json({ error: "Hibás a felhasználónév vagy jelszó" });
    }
    const talalat = await bcrypt.compare(jelszo, felhasznalo.jelszo);
        if (!talalat) {
            return res.status(401).json({ error: "Hibás a felhasználónév vagy jelszó" });
        }
      const accessToken = jwt.sign(
      { id: felhasznalo.id, nev: felhasznalo.vevo_nev, email: felhasznalo .email},
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN } 
    );        
    const refreshToken = jwt.sign(
      { id: felhasznalo.id, email: felhasznalo.email },
      process.env.REFRESH_JWT_SECRET,
      { expiresIn: process.env.REFRESH_EXPIRES_IN } 
    );
     res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000 
    });
    res.status(200).json({ message: "Sikeres bejelentkezés 🎉", accessToken})
  }
  catch(error){
    next(error)
  }
}
exports.refreshToken = (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    return res.status(401).json({ message: "Nincs refresh token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.REFRESH_JWT_SECRET);

    const newAccessToken = jwt.sign(
      {
        id: decoded.id,
        email: decoded.email
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({ accessToken: newAccessToken });

  } catch (err) {
    return res.status(403).json({ message: "Érvénytelen refresh token" });
  }
};