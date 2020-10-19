const express = require("express")
const server = express()

// configurar o servidor para apresentar os arquivos estáticos
server.use(express.static('public'))

// habilitar o corpo do formulário
server.use(express.urlencoded({extended: true}))

// conectar ao DATABASE
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: 5247,
    host: 'localhost',
    port: 5432,
    database: 'doe'
})

// configurando a template engine
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express: server,
    noCache: true
})


// lista de doadores


//configurar a apresentação na pg
server.get("/", function(req, res){
    db.query("SELECT * FROM donors", function(result){
        //if(err) return res.send("erro db")

        const donors = result.rows
        return res.render("index.html", {donors})
    })
    
})

server.post("/", function(req, res){
    // pegar dados do formulário
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if(name == "" || email == "" || blood ==""){
        return res.send("Todos os campos são obrigatórios")
    }

// coloca valores dentro do banco de dados
    const query = `INSERT INTO donors ("name", "email", "blood")
                    VALUES ($1, $2, $3)`
    const values = [name, email, blood]
    db.query(query, values, function(err){
        // fluxo de erro
        if(err) return res.send('Configure o banco de dados')
        // fluxo ideal
        return res.redirect("/")
    })

   
})


// configurando o servidor
server.listen(3000, function(){
    console.log("iniciei o servidor")
})


