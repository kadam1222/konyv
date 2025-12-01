const db = require('../config/db');


class Konyvek {
  static async getAll() {
    try {
      const [rows] = await db.query('SELECT * FROM osszes_konyv');
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

  static async fokereso(cim,szerzo){
    try{
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
      const [rows] = await db.query(`SELECT * FROM osszes_konyv ${sikeres}`, feltetelek_parameter);
      return rows
    }
    catch(error){
        console.error(error)
        throw error;
    }
  }

  static async rendezes(ar_nov,ar_csok,kiadas_no,kiadas_csok){
    const feltetelek_sql = []
    
    try{
      if (ar_nov){
        feltetelek_sql
      }
      if (ar_csok){
        
      }
      if (kiadas_no){
        
      }
      if (kiadas_csok){
        
      }

    }
    catch(error){
      console.error(error)
      throw error;
    }
  }
  static async filter(kiado,kat,nyelv,illusztrator) {
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
  
        const sikeres = feltetelek_sql.length ? "WHERE " + feltetelek_sql.join(" AND ") : ""
        const [rows] = await db.query(`SELECT * FROM osszes_konyv ${sikeres}`, feltetelek_parameter);
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
