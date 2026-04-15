const sqlite3 = require('sqlite3').verbose()
const {open} = require ('sqlite')


const banco = async () => {
    const db = await open({
        filename: './database.db',
        driver: sqlite3.Database
    })

    await db.exec(`
        CREATE TABLE IF NOT EXISTS abrigos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT,
        endereco TEXT,
        telefone TExT,
        vagas_total INTEGER,
        vagas_disponiveis INTEGER,
        aceita_pets TEXT
        )
    `)

     await db.exec(`
       CREATE TABLE IF NOT EXISTS pedidos (
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       nome TEXT,
       qt_pessoas INTEGER,
       localizacao TEXT,
       status TEXT
       )         
    `)
return db
}
module.exports = {banco}