const bodyParser =require('body-parser')
const express = require('express')

// const cons = require('consolidate')

const app = express()

// configurando o mongoDB
const MongoClient = require('mongodb').MongoClient
const uri = "mongodb://localhost:27017"

app.use(express.static('public'))

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())



MongoClient.connect(uri, (err, client) =>{
    if(err) return console.log(err)
    const db = client.db('appEndereco') // seleconando o Banco de dados
    const emp = db.collection('empresas')

    app.get('/', (req,res) => {
        res.sendFile(__dirname+'/index.html')
    })

    app.get('/show', (req, res) => {
    
        var teste = []
        emp.find().toArray((err, result) => {
            if (err) throw err
            result.forEach((data) => {
                teste.push(data.nome)
            })
            res.json(teste)
        })
    })


    app.get('/empresa/:nome', (req,res) => {
        emp.find({'nome': `${req.params.nome}`}).toArray((err,result) => {
            if (err) throw err
            res.json(result) 
        })
    })

    app.post('/', (req, res) => {
        const novaEmpresa = {
            nome: req.body.empresa,
            telefone: req.body.telefone,
            endereco: {
                rua: req.body.endereco,
                numero: req.body.numeroEmp,
                bairro: req.body.bairro,
                cidade: req.body.cidade,
                UF: req.body.uf,
                cep: req.body.cep
            }
        }
        emp.insert(novaEmpresa)
        res.redirect('/')
    })

    app.listen(5000, () => console.log('Servidor rodando'))
})

