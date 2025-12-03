const konyvek = require('../models/konyvek');

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
    const konyvek_filter = await konyvek.filter(kiado,kategoria,nyelv,illusztrator, borito);
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




