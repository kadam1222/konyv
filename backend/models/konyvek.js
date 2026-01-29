const db = require('../config/db');


class Konyvek {
  static async getAll(page) {
    try {
      const limit = 10;
      const offset = (page-1) * limit
      const [rows] = await db.query(`SELECT * FROM osszes_konyv ORDER BY RAND() limit ${limit} offset ?`, [offset]);
      return rows;
    } catch (err) {
      throw err;
    }
  }

  static async getbyISBN(ISBN) {
    try {
      const [rows] = await db.query('SELECT * FROM osszes_konyv where ISBN LIKE ?', [ISBN]);
      return rows[0];
    } catch (err) {
      throw err;
    }
  }


  static async rendezes(relevancia){
    let rendezes = "";

    try{
      if (relevancia == "Kiadás éve (növekvő)"){
        rendezes = "order by kiadas_eve ASC"
      }
      if (relevancia == "Kiadás éve (csökkenő)"){
        rendezes = "order by kiadas_eve DESC"
      }
      if (relevancia == "Ár (növekvő)"){
        rendezes = "order by ar ASC"
      }
      if (relevancia == "Ár (csökennő)"){
        rendezes = "order by ar DESC"
      }

      return rendezes
    }
    catch(error){
      console.error(error)
      throw error;
    }
  }
  static async filter(kiado,kat,nyelv,illusztrator,borito, relevanciabe, tipus , page=1, limit=10, cim="", szerzo="") {
      try{
        const offset = (page - 1) * limit;
        const feltetelek_sql = []
        const feltetelek_parameter = []
        if (kiado) {
          feltetelek_sql.push("kiado_nev LIKE ?");
          feltetelek_parameter.push(`%${kiado}%`);
        }

        if (kat) {
          feltetelek_sql.push("kat_nev = ?");
          feltetelek_parameter.push(kat);
        }

        if (nyelv) {
          feltetelek_sql.push("nyelv_nev LIKE ?");
          feltetelek_parameter.push(`%${nyelv}%`);
        }

        if (illusztrator) {
          feltetelek_sql.push("illusztratorok LIKE ?");
          feltetelek_parameter.push(`%${illusztrator}%`);
        }

        if (borito) {
          feltetelek_sql.push("borito_tipus = ?");
          feltetelek_parameter.push(borito);
        }

        if (tipus) {
          feltetelek_sql.push("tipus_nev = ?");
          feltetelek_parameter.push(tipus);
        }
        if (cim || szerzo) {
      const q = cim || szerzo; 
      feltetelek_sql.push("(cim LIKE ? OR szerzok LIKE ?)");
      feltetelek_parameter.push(`%${q}%`, `%${q}%`);
    }

        
        const sikeres = feltetelek_sql.length ? "WHERE " + feltetelek_sql.join(" AND ") : ""
        let rendezes = "";
        if(relevanciabe != "Relevancia"){
          rendezes = await this.rendezes(relevanciabe);
        }
        
        const [rows] = await db.query(`SELECT * FROM osszes_konyv ${sikeres} ${rendezes} LIMIT ? OFFSET ?`, [...feltetelek_parameter, limit, offset]);
        return rows
       
      }
      catch (err) {
        console.error(err)
        throw err; 
      }
    }

    static async delete(ISBN) {
    try{
      await db.query('DELETE FROM kapcsolo_fordito WHERE ISBN = ?', [ISBN]);
      await db.query('DELETE FROM kapcsolo_illusztrator WHERE ISBN = ?', [ISBN]);
      await db.query('DELETE FROM kapcsolo_szerzo WHERE ISBN = ?', [ISBN]);
      const [result] = await db.query('DELETE FROM termek WHERE ISBN = ?', [ISBN]);

    return result.affectedRows > 0;
    }
    catch(error){
        console.error(error)
        throw error;
    }

    
  }

  static async kategoriak(){
    try{
      const [rows] = await db.query('SELECT * FROM kategoria');
      return rows;
    }
    catch(error){
        console.error(error)
        throw error;
    }
  }

  static async kiadok(){
    try{
      const [rows] = await db.query('SELECT * FROM kiado');
      return rows;
    }
    catch(error){
        console.error(error)
        throw error;
    }
  }

  static async nyelv(){
    try{
      const [rows] = await db.query('SELECT * FROM nyelv');
      return rows;
    }
    catch(error){
        console.error(error)
        throw error;
    }
  }
 static async borito(){
    try{
      const [rows] = await db.query('SELECT * FROM borito');
      return rows;
    }
    catch(error){
        console.error(error)
        throw error;
    }
  }
  static async szerzok(){
    try{
      const [rows] = await db.query('SELECT * FROM szerző');
      return rows;
    }
    catch(error){
        console.error(error)
        throw error;
    }
  }
  static async forditok(){
    try{
      const [rows] = await db.query('SELECT * FROM fordito');
      return rows;
    }
    catch(error){
        console.error(error)
        throw error;
    }
  }
  static async illusztratorok(){
    try{
      const [rows] = await db.query('SELECT * FROM illusztrator');
      return rows;
    }
    catch(error){
        console.error(error)
        throw error;
    }
  }
  static async illusztracio(){
    try{
      const [rows] = await db.query('SELECT * FROM illusztracio');
      return rows;
    }
    catch(error){
        console.error(error)
        throw error;
    }
  }
  static async tipus(){
    try{
      const [rows] = await db.query('SELECT * FROM tipus');
      return rows;
    }
    catch(error){
        console.error(error)
        throw error;
    }
  }
   static async rendeles_statusza(){
    try{
      const [rows] = await db.query('SELECT * FROM rendeles_statusz');
      return rows;
    }
    catch(error){
        console.error(error)
        throw error;
    }
  }

  static async regisztracio (nev, email, jelszo){
    try {
      await db.query('INSERT INTO vevo(vevo_nev , email, jelszo) VALUES (?, ?, ?)', [nev,email,jelszo])
    } 
    catch (error) {
      console.error(error)
      throw error
    }
  }
   static async profilleker (email){
    try{
        const [rows] = await db.query("SELECT id,vevo_nev,lakcim,email,adoszam, jogosultsag FROM vevo WHERE email = ?", [email])
        return rows[0]
    }
    catch(err){
        throw err
    }
  }
  static async findByEmail(email) {
  try {
    const [rows] = await db.query(
      "SELECT id,vevo_nev, email, jelszo, jogosultsag FROM vevo WHERE email = ?",
      [email]
    );
    return rows[0];
  } catch (err) {
    throw err;
  }

  
}

static async szamlakeszites(email, fizetesi_mod, szallitas_mod, vegosszeg) {
  try {
    const [vevoRows] = await db.query(
      "SELECT id FROM vevo WHERE email = ?",
      [email]
    );

    if (vevoRows.length === 0) {
      throw new Error("Vevő nem található");
    }

    const vevo_id = vevoRows[0].id;

    const [result] = await db.query(
      `
      INSERT INTO szamla (
        fizetesi_mod,
        szallitas_id,
        fizetesi_hatarido,
        vevo_id,
        vegosszeg,
        szamlaszam
      )
      SELECT
        ?,           
        ?,         
        CURDATE() + INTERVAL 7 DAY,
        ?, 
        ?,      
        CONCAT(
          YEAR(CURDATE()), '/',
          ?, '/',
          (
            SELECT COUNT(*) + 1
            FROM szamla
            WHERE vevo_id = ?
              AND YEAR(szamla_kelte) = YEAR(CURDATE())
          )
        )
      `,
      [fizetesi_mod, szallitas_mod, vevo_id,vegosszeg, vevo_id, vevo_id]
    );

    return {
      szamla_id: result.insertId
    };

  } catch (err) {
    console.error(err);
    throw err;
  }
}
static async modositas (email, nev, regiemail){
    try {

      const [result] = await db.query('UPDATE vevo set email = ?, vevo_nev=? where email= ?', [email,nev,regiemail])
      return result.affectedRows > 0;
    } 
    catch (error) {
      console.error(error)
      throw error
    }
  }

  static async rendelesek(email) {
    try {
      const [rows] = await db.query(`SELECT * FROM rendelesek where email = ?`, [email]);
      return rows;
    } catch (err) {
      throw err;
    }
  }

  static async osszesRendeles(page=1, limit=10,){
    try{
      const offset = (page - 1) * limit;
      const [rows] = await db.query(`
    SELECT * FROM rendelesek ORDER BY szamla_kelte DESC LIMIT ? OFFSET ?`, [limit, offset])
      return rows
    }
    catch(err){
      throw err
    }
  }
  static async rendeles_statusza_modositas(r_statusz, szamlaszam){
    try{
      const [rows] = await db.query('UPDATE szamla SET r_statusz = ? WHERE szamlaszam= ?', [r_statusz, szamlaszam])
      return rows.affectedRows > 0
    }
    catch(err){
      throw err
    }
  }

  static async darabszam_modositas(darab, ISBN){
    try{
      const [rows] = await db.query(`UPDATE termek SET raktar = raktar - ? WHERE ISBN = ? AND raktar >= ? `,[darab,ISBN, darab])
       if (rows.affectedRows === 0) {
        throw new Error("Nincs elég készlet: " + ISBN);
      }
    }
    catch(err){
      throw err
    }
  }
static async rendelesSnapshotFeltoltese(szamla_id, termekek) {
  try {
    for (const item of termekek) {
      const [rows] = await db.query(
        "SELECT cim, ar FROM termek WHERE ISBN = ?",
        [item.ISBN]
      );
      const { cim, ar } = rows[0];

      await db.query(
        `INSERT INTO rendeles_leadasa_termek
         (szamla_id, ISBN, cim, egysegar, darab)
         VALUES (?, ?, ?, ?, ?)`,
        [szamla_id, item.ISBN, cim, ar, item.darab]
      );
    }
  } catch (err) {
    console.error("Snapshot mentési hiba:", err);
    throw err;
  }
}
static async vegosszegSzamitas(termekek, szallitas_mod) {
  let osszeg = 0;

  for (const item of termekek) {
    const [rows] = await db.query(
      "SELECT ar FROM termek WHERE ISBN = ?",
      [item.ISBN]
    );

    if (rows.length === 0) {
      throw new Error("Termék nem található: " + item.ISBN);
    }

    osszeg += rows[0].ar * item.darab;
  }

  if (Number(szallitas_mod) === 1) {
    osszeg += 500;
  }

  return osszeg;
}


  static async osszesUser(page=1, limit=10,){
    try{
      const offset = (page - 1) * limit;
      const [rows] = await db.query(`select * from vevo limit ? offset ?`, [limit, offset])
      return rows
    }
    catch(err){
      throw err
    }
  }

  static async deleteUser(email) {
    try{
      
      const [result] = await db.query(`UPDATE vevo
       SET vevo_nev = 'TÖRÖLT',
           lakcim = 'TÖRÖLT',
           adoszam = 'TÖRÖLT',
           jelszo = 'TÖRÖLT',
           jogosultsag = 0
       WHERE email = ?`,
      [email]);

    return result.affectedRows > 0;

    }
    catch(error){
        console.error(error)
        throw error;
    }
  }

  static async Updatejogosultsag(email,jogosultsag) {
    try{
      
      const [result] = await db.query(`UPDATE vevo
       SET jogosultsag = ?
       WHERE email = ?`,
      [jogosultsag,email]);

    return result.affectedRows > 0;
    
    }
    catch(error){
        console.error(error)
        throw error;
    }
  }

  static async osszesKonyv(page=1, limit=10,){
    try{
      const offset = (page - 1) * limit;
      const [rows] = await db.query(`SELECT * FROM osszes_konyv limit ? offset ?`, [limit, offset])
      return rows
    }
    catch(err){
      throw err
    }
  }

  static async updatekonyv(adatok, REGIISBN) {
 
    try {
    const mezok = [];
    const ertekek = [];

    for (const [kulcs, ertek] of Object.entries(adatok)) {
      if (ertek !== undefined) {
        mezok.push(`${kulcs} = ?`);
        ertekek.push(ertek);
      }
    }

    if (mezok.length === 0) {
      return false; 
    }

    ertekek.push(REGIISBN);

    const [result] = await db.query(
      `UPDATE termek SET ${mezok.join(', ')} WHERE ISBN = ?`,
      ertekek
    );

    return result.affectedRows > 0;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

static async updateSzerzok(ISBN, szerzoIds) {
  try {

    await db.query("DELETE FROM kapcsolo_szerzo WHERE ISBN = ?", [ISBN]);


    if (szerzoIds && szerzoIds.length > 0) {
     
      const values = szerzoIds.map(id => [ISBN, id]);
      

      await db.query(
        "INSERT INTO kapcsolo_szerzo (ISBN, szerzo_id) VALUES ?",
        [values] 
      );
    }

    return true;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

static async updateIllusztratorok(ISBN, illusztrator_ids) {
  try {
    
    await db.query("DELETE FROM kapcsolo_illusztrator WHERE ISBN = ?", [ISBN]);


    if (illusztrator_ids && illusztrator_ids.length > 0) {
      const values = illusztrator_ids.map(id => [ISBN, id]);
      await db.query(
        "INSERT INTO kapcsolo_illusztrator (ISBN, illusztrator_id) VALUES ?",
        [values]
      );
    }

    return true;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

static async updateForditok(ISBN, fordito_id) {
  try {
    
    await db.query("DELETE FROM kapcsolo_fordito WHERE ISBN = ?", [ISBN]);


    if (fordito_id && fordito_id.length > 0) {
      const values = fordito_id.map(id => [ISBN, id]);
      await db.query(
        "INSERT INTO kapcsolo_fordito (ISBN, fordito_id) VALUES ?",
        [values]
      );
    }

    return true;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

static async insertAdat(adatok ){
  try{
   const segedTablak = {
      borito: ['borito', 'borito_nev'],
      kiado: ['kiado', 'kiado_nev'],
      illusztracio: ['illusztracio', 'illusztracio'],
      nyelv: ['nyelv', 'nyelv_nev'],
      illusztrator: ['illusztrator', 'illusztrator'],
      fordito: ['fordito', 'fordito_nev'],
      szerzo: ['szerző', 'szerzo_nev']
    };

    for (const [kulcs, [tabla, oszlop]] of Object.entries(segedTablak)) {
      if (adatok[kulcs]) {
        await db.query(
          `INSERT INTO ${tabla} (${oszlop}) VALUES (?)`, 
          [adatok[kulcs]]
        );
      }
    }

    if (adatok.kat_nev) {
      const katMezok = ['kat_nev'];
      const katErtekek = [adatok.kat_nev];
      
      if (adatok.katazon) {
        katMezok.push('katazon');
        katErtekek.push(adatok.katazon);
      }

      const placeholders = katMezok.map(() => '?').join(',');
      await db.query(
        `INSERT INTO kategoria (${katMezok.join(',')}) VALUES (${placeholders})`,
        katErtekek
      );
    }

    if (adatok.termekek) {
      const t = { ...adatok.termekek };
      if (t.ISBN) t.ISBN = String(t.ISBN).replace(/-/g, '');
      
      const mezok = Object.keys(t);
      const ertekek = Object.values(t);
      const placeholders = mezok.map(() => '?').join(',');

      await db.query(`INSERT INTO termek (${mezok.join(',')}) VALUES (${placeholders})`, ertekek);

      // --- ITT HÍVJUK MEG A KAPCSOLÓTÁBLÁKAT ---
      const ujISBN = t.ISBN;

      // Szerzők (adatok.szerzoIds egy tömb kell legyen a JSON-ben, pl: [1, 5, 8])
      if (adatok.szerzoIds) {
        await this.updateSzerzok(ujISBN, adatok.szerzoIds);
      }

      if (adatok.fordito_ids) { 
        await this.updateForditok(ujISBN, adatok.fordito_ids);
      }

      if (adatok.illusztrator_ids) {
        await this.updateIllusztratorok(ujISBN, adatok.illusztrator_ids);
      }
    }

    return true
  }
  catch (err) {
    console.error(err);
    throw err;
  }
}
}

module.exports = Konyvek;