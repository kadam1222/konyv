const konyvek = require('../models/konyvek');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Konyvek = require('../models/konyvek');
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
    const cim = req.query.cim || "";
    const szerzo = req.query.szerzo || "";
    const limit = 10;
    const konyvek_filter = await konyvek.filter(kiado,kategoria,nyelv,illusztrator, borito, "Relevancia",tipus , page, limit, cim, szerzo);
    res.json(konyvek_filter); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Hiba történt a könyvek lekérdezésekor (SERVER ERROR)' });
  }
};



exports.delete = async (req, res) =>{
  try{
      const { ISBN } = req.body
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
exports.fordito = async (req,res) => {
  try{
    const fordito = await konyvek.forditok();
    res.json(fordito);
  }
  catch(err)
  {
    console.error(err);
    res.status(500).json({ message: 'Hiba történt a könyvek lekérdezésekor (SERVER ERROR)' });
  }
}
exports.szerzok = async (req,res) => {
  try{
    const szerzo = await konyvek.szerzok();
    res.json(szerzo);
  }
  catch(err)
  {
    console.error(err);
    res.status(500).json({ message: 'Hiba történt a könyvek lekérdezésekor (SERVER ERROR)' });
  }
}
exports.illusztratorok = async (req,res) => {
  try{
    const illusz = await konyvek.illusztratorok();
    res.json(illusz);
  }
  catch(err)
  {
    console.error(err);
    res.status(500).json({ message: 'Hiba történt a könyvek lekérdezésekor (SERVER ERROR)' });
  }
}
exports.illusztracio = async (req,res) => {
  try{
    const illusztracio = await konyvek.illusztracio();
    res.json(illusztracio);
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
exports.rendeles_statusza = async (req,res) => {
  try{
    const statuszok = await konyvek.rendeles_statusza();
    res.json(statuszok);
  }
  catch(err){
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
      { id: Number(felhasznalo.id), nev: felhasznalo.vevo_nev, email: felhasznalo .email, jogosultsag: Number(felhasznalo.jogosultsag)},
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
exports.refreshToken = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    return res.status(401).json({ message: "Nincs refresh token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.REFRESH_JWT_SECRET);
    const felhasznalo = await Konyvek.findByEmail(decoded.email)
    const newAccessToken = jwt.sign(
      {
        id: Number(felhasznalo.id),
        nev: felhasznalo.vevo_nev,
        email: felhasznalo.email,
        jogosultsag: Number(felhasznalo.jogosultsag),
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({ accessToken: newAccessToken });

  } catch (err) {
    return res.status(403).json({ message: "Érvénytelen refresh token" });
  }
};
exports.logout = (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: "Lax",
    secure: process.env.NODE_ENV === "production"
  });

  res.json({ message: "Sikeres kijelentkezés" });
};


exports.Profilleker = async (req, res) => {
  try {
    const { email } = req.user;
    const felhasznalo = await konyvek.profilleker(email);

    if (!felhasznalo) {
      return res.status(404).json({ message: "Felhasználó nem található" });
    }

    res.json(felhasznalo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Hiba történt a profil lekérdezésekor (SERVER ERROR)' });
  }
};

exports.szamlakeszites = async (req, res) => {
  try {
    const { email } = req.user; 
    const { fizetesi_mod, szallitas_mod, termekek, lakcim, teljesites_kelte } = req.body; 

    if (!fizetesi_mod || !szallitas_mod || !termekek || termekek.length === 0 || !lakcim) {
      return res.status(400).json({
        message: "Hiányzó fizetési mód, szállítási mód vagy termékek"
      });
    }
    const vegosszeg = await Konyvek.vegosszegSzamitas(termekek, szallitas_mod)
    for (const item of termekek) {
      await Konyvek.darabszam_modositas(item.darab, item.ISBN);
    }
    const { szamla_id } = await Konyvek.szamlakeszites(email, fizetesi_mod, szallitas_mod, vegosszeg, lakcim, teljesites_kelte); 
    await Konyvek.rendelesSnapshotFeltoltese(szamla_id, termekek);

    res.status(201).json({
      message: "Számla sikeresen létrehozva",
      szamla_id: szamla_id,
      vegosszeg
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Számla létrehozása sikertelen"
    });
  }
};

exports.modositas = async (req,res) =>{
    try{
      const { email } = req.user;   
      const { valtoztatemail } = req.body; 
      const { felhasznalonev } = req.body;
      const result = await Konyvek.modositas(valtoztatemail, felhasznalonev, email);  
      
      if(result){
        res.json({message: `Profil frissítve.`})
      }
    }
    catch (err) {
      console.error(err);
      res.status(500).json({
      message: "Módosítás sikertelen"
    });
    }
};

exports.Rendelesek = async (req, res) => {
  try {
    const { email } = req.user; 
    const konyvek_all = await konyvek.rendelesek(email);
    res.json(konyvek_all); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Hiba történt a könyvek lekérdezésekor (SERVER ERROR)' });
  }
};
exports.OsszesRendeles = async (req, res) =>{
  try{
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const rendelesek_all = await Konyvek.osszesRendeles(page, limit)
    res.json(rendelesek_all)
  }
  catch(err){
    res.status(500).json({message : 'Hiba történt az összes rendelés lekérdezése során'})
  }
}
exports.rendeles_statusza_modositasa = async (req, res) =>{
  try{
    const {r_statusz} = req.body
    const {szamlaszam, teljesites_kelte }= req.body
    const result = await Konyvek.rendeles_statusza_modositas(r_statusz, teljesites_kelte ,szamlaszam)
    if (result) res.json({message: "Rendelés státusza sikeresen megváltoztatva"})
  }
  catch(err){
    res.status(500).json({message : 'Hiba történt a rendelés státuszának módosítása közben'})
  }
}


exports.darabszamModositas = async (req, res) =>{
  try{
    const {ISBN} = req.body
    const {raktar} = req.body
    const result = await Konyvek.darabszam_modositas(raktar, ISBN)
    console.log("küldött raktar:", raktar, typeof raktar);
    if (result) res.json({message: "Raktár frissítve"})
  }
  catch(err){
    res.status(500).json({message:"Server error"})
  }
}

exports.OsszesUser = async (req, res) =>{
  try{
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const rendelesek_all = await Konyvek.osszesUser(page, limit)
    res.json(rendelesek_all)
  }
  catch(err){
    res.status(500).json({message : 'Hiba történt az összes rendelés lekérdezése során'})
  }
}

exports.deleteUser = async (req, res) =>{
  try{
      const { email } = req.body
      if (!email) {
      return res.status(400).json({ error: "Email hiányzik" });
      }

      const success = await konyvek.deleteUser(email)

      if(success){
        res.status(204).json()
      }
      else{
        res.status(404).json({error: 'Nincs ilyen user'})
     }
  }
    catch(err)
  {
    console.error(err);
    res.status(500).json({ message: 'Hiba történt a felhasználó törlésekor (SERVER ERROR)' });
  }
}


exports.UpdateJogosultsag = async (req, res) =>{
  try{
      const { email } = req.body
      const { jogosultsag } = req.body
      if (!email) {
      return res.status(400).json({ error: "Email hiányzik" });
      }

      if (!jogosultsag) {
      return res.status(400).json({ error: "Jogosultság hiányzik" });
      }

      const success = await konyvek.Updatejogosultsag(email, jogosultsag)
      
      if(success){
        res.status(204).json()
      }
      else{
        res.status(404).json({error: 'Nincs ilyen user'})
     }
  }
    catch(err)
  {
    console.error(err);
    res.status(500).json({ message: 'Hiba történt a felhasználó törlésekor (SERVER ERROR)' });
  }
}

exports.OsszesKonyv = async (req, res) =>{
  try{
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const rendelesek_all = await Konyvek.osszesKonyv(page, limit)
    res.json(rendelesek_all)
  }
  catch(err){
    res.status(500).json({message : 'Hiba történt az összes rendelés lekérdezése során'})
  }
}

exports.UpdateKonyv = async (req, res) => {
  try {
    const { REGIISBN, szerzo_ids, illusztrator_ids, fordito_ids, ...adatok } = req.body;

    const normalize = (val) => Array.isArray(val) ? val : (val ? [val] : []);

    await konyvek.updatekonyv(adatok, REGIISBN);

    const aktualisISBN = adatok.ISBN || REGIISBN;

    await Promise.all([
      konyvek.updateSzerzok(aktualisISBN, normalize(szerzo_ids)),
      konyvek.updateIllusztratorok(aktualisISBN, normalize(illusztrator_ids)),
      konyvek.updateForditok(aktualisISBN, normalize(fordito_ids))
    ]);

    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Szerver hiba a módosítás során" });
  }
};


exports.insertAdat = async (req,res) =>{
  try{
    const {...adatok} = req.body;
    await konyvek.insertAdat(adatok)
    res.status(204).json()

  }catch (err) {
    console.error(err);
    res.status(500).json({ message: "Szerver hiba az INSERT során" });
  }
}

exports.deleteAdat = async (req,res) =>{
  try{
    const {...adatok} = req.body;
    await konyvek.deleteAdat(adatok)
    res.status(204).json()

  }catch (err) {
    console.error(err);
    res.status(500).json({ message: "Szerver hiba a DELETE során" });
  }
}

exports.osszesRendelesSearch = async (req,res) =>{
  try{
    const page = parseInt(req.query.page) || 1;
    const email = req.query.email || "";
    const szamlaszam = req.query.szamlaszam || ""
    const limit =  parseInt(req.query.limit) ||10;
    const result = await Konyvek.osszesRendelesSearchbar(page,limit,email,szamlaszam)
    res.json(result)
  }
  catch(err){
    console.error(err)
    res.status(500).json({message: "Szerver hiba!"})
  }
}

