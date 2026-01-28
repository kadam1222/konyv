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
    SELECT *
    FROM rendelesek
    ORDER BY szamla_kelte DESC
    LIMIT ? OFFSET ?
      `, [limit, offset])
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


}

module.exports = Konyvek;