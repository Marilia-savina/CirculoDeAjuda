const sqlite3 = require('sqlite3').verbose()
const { open } = require('sqlite')


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
        telefone TEXT,
        vagas_total INTEGER,
        vagas_disponiveis INTEGER,
        aceita_pets TEXT,
        latitude REAL,
        longitude REAL
        )
    `)
    console.log('tabela abrigo criada com sucesso!!!!')

    await db.exec(`
       CREATE TABLE IF NOT EXISTS pedidos (
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       nome TEXT,
       qt_pessoas INTEGER,
       localizacao TEXT,
       status TEXT DEFAULT 'EM ANALISE'
       )         
    `)
    console.log('tabela pedidos criada com sucesso!!!')


    // dados para visualização

    const primeirosDados = await db.get(`SELECT COUNT (*) AS Total FROM abrigos`)
    if (primeirosDados.Total === 0) {
        await db.exec(`
            INSERT INTO abrigos (nome, endereco, telefone, vagas_total, vagas_disponiveis, aceita_pets, latitude, longitude)
            VALUES
            (' EEFM monte belo', 'rua 7 de setembro', '21 934265743', '35', '14', 'sim', '43.455', '54.987'),
            ('quadra juventus sport','bom jardim,26','22 946734189','90','43','sim','21.343','13.432')
            `)
    } else {
        console.log(` banco pronto com ${primeirosDados.Total} os primeiros dados`)
    }

    return db
}
module.exports = { banco }