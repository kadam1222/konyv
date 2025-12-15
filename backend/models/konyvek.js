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

  static async fokereso(cim,szerzo, page){
    try{
      const limit = 10;
      const offset = (page-1) * limit
      const feltetelek_sql = []
      const feltetelek_parameter = []
      if(cim){
          feltetelek_sql.push("cim LIKE ?")
          feltetelek_parameter.push(`%${cim}%`)
      }
      if(szerzo){
          feltetelek_sql.push("szerzok LIKE ?")
          feltetelek_parameter.push(`%${szerzo}%`)
      }
      const sikeres = feltetelek_sql.length ? "WHERE " + feltetelek_sql.join(" OR ") : ""
      const params = [...feltetelek_parameter];
      const [rows] = await db.query(`SELECT * FROM osszes_konyv ${sikeres} limit ${limit} offset ${offset}`, params);
      return rows
    }
    catch(error){
        console.error(error)
        throw error;
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
  static async filter(kiado,kat,nyelv,illusztrator,borito, relevanciabe) {
      try{
        const feltetelek_sql = []
        const feltetelek_parameter = []
        if(kiado){
          feltetelek_sql.push("kiado_nev LIKE ?")
          feltetelek_parameter.push(`%${kiado}%`)
        }
        if(kat){
          feltetelek_sql.push("kat_nev LIKE ?")
          feltetelek_parameter.push(`%${kat}%`)
        }
        if(nyelv){
          feltetelek_sql.push("nyelv_nev LIKE ?")
          feltetelek_parameter.push(`%${nyelv}%`)
        }
        if(illusztrator){
          feltetelek_sql.push("illusztratorok LIKE ?")
          feltetelek_parameter.push(`%${illusztrator}%`)
        }
        if(borito){
          feltetelek_sql.push("borito_tipus LIKE ?")
          feltetelek_parameter.push(`%${borito}%`)
        }
        
        const sikeres = feltetelek_sql.length ? "WHERE " + feltetelek_sql.join(" AND ") : ""

        if(relevanciabe != "Relevancia"){
          const rendezes = await this.rendezes(relevanciabe);
          const [rows] = await db.query(`SELECT * FROM osszes_konyv ${sikeres} ${rendezes}`, feltetelek_parameter,);
          return rows
        }
        
        const [rows] = await db.query(`SELECT * FROM osszes_konyv ${sikeres} ORDER BY RAND()`, feltetelek_parameter);
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

 

  
}

module.exports = Konyvek;
