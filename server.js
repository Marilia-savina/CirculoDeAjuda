const express = require ('express')
const cors = require ('cors')
const {banco} = require ('./database')

const app = express()

app.use(cors())
app.use(express.json())

let db

(async () =>{
    db = await banco()
})()


app.get('/', (req, res) => {
    res.send(`
        <body>
        <h1>Circúlo de Ajuda</h1>
        <h2>API Apoio durante enchentes</h2>
        <p>Endpoint que leva a uma rota para cadastrar abrigos: /abrigos</p>
        <p>Endpoint que leva a uma rota para registrar um pedido de ajuda: /pedidos </p>
        </body>
        `)
})


//rota de listagem de abrigos / pedidos 
// get 
app.get('/abrigos', async (req,res) =>{
    const db = await banco()
    const listagemAbrigos = await db.all(`
        SELECT * FROM abrigos 
        `)    
    res.json(listagemAbrigos)
})

app.get('/pedidos', async (req,res) =>{
    const db = await banco()
    const listaDePedidos = await db.all(`
        SELECT * FROM pedidos
        `)    
    res.json(listaDePedidos)
})


// rota para criar um abrigo / criar pedido de ajuda 
// post
app.post('/abrigos', async (req,res) =>{
const {nome, endereco, telefone, vagas_total, vagas_disponiveis, aceita_pets, latitude, longitude} = req.body
const db = await banco()
await db.run(`
    INSERT INTO abrigos(nome, endereco, telefone, vagas_total, vagas_disponiveis, aceita_pets, latitude, longitude) VALUES (?,?,?,?,?,?,?,?)`, [nome, endereco, telefone, vagas_total, vagas_disponiveis, aceita_pets, latitude, longitude])
res.send(` Abrigo ${nome} registrado!!`)

})

app.post('/pedidos', async (req,res) =>{
const {nome, qt_pessoas, localizacao, status} = req.body
const db = await banco()
await db.run(`
    INSERT INTO pedidos (nome, qt_pessoas, localizacao, status) VALUES (?,?,?, ?)`, [nome, qt_pessoas, localizacao, status])
res.send(` ${nome} seu pedido foi registrado!! `)

})


//rota de atualização 
// put
app.put ('/abrigos/:id', async (req,res) => {
    const {id} = req.params
    const {vagas_total,vagas_disponiveis} =req.body
    const db = await banco()
        await db.run(`
            UPDATE abrigos
            SET vagas_total = ?, vagas_disponiveis = ? 
            WHERE id =?`, [vagas_total,vagas_disponiveis, id])
            res.send( ` O abrigo ${id} foi atualizado com sucesso!!!` )
    
})

app.put ('/pedidos/:id', async (req,res) => {
    const {id} = req.params
    const {status} =req.body
    const db = await banco()
        await db.run(`
            UPDATE pedidos
            SET status = ?
            WHERE id =?`, [status, id])
            res.send( ` O status do pedido ${id} foi atualizado com sucesso!!!`)
    
})

//rota recomendacao de abrigo baseado em distancia e disponibilidade
app.post('/recomendacao', async (req, res) =>{
    const { latitude, longitude, pessoas} = req.body
    const abrigos = await db.all(`
        SELECT * FROM abrigos
        WHERE vagas_disponiveis >= ?`, [pessoas])

    function calcularDistancia(lat1, lon1, lat2, lon2) {
        const dx = lat1 - lat2
        const dy = lon1 -lon2
        return Math.sqrt(dx * dx + dy * dy)
    }
    const comDistancia = abrigos.map( a =>{
        const distancia = calcularDistancia(
            latitude,
            longitude,
            a.latitude,
            a.longitude
        )
        return {...a, distancia}
    })
    comDistancia.sort((a,b) => a.distancia - b.distancia)
    res.json(comDistancia[0])
})


const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`servidor rodando na porta http://localhost:${PORT}`)
})