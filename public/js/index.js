getEmpresasCadastradas()

function getNomeEmpresas() { 
    
    let nomeEmpresa = []
    $.get("http://localhost:5000/show", (data, status) => {
        data.map((item) => {
            nomeEmpresa.push(item.nome)
        })
    })   
    console.log(nomeEmpresa)

    return nomeEmpresa

}

function autoCompleta() {
    const nomeEmpresas = getNomeEmpresas()

    $("#empresa").autocomplete({
        source: nomeEmpresas
    })
}

function getToDadosEmpresa(nomeEmpresa) {
    $.get(`http://localhost:5000/empresa/${nomeEmpresa}`, (data, status) => {
        let result = data.filter((empresa => {
            return empresa.nome === nomeEmpresa
        })) 
        
        
        criaPaginaPrint(result)
    })
}

function  criaPaginaPrint(result) {
    const empresa = result[0]
    
    /*Objeto window*/
    let newWin = window.open('','', 'heigth=700,width=700')

    let templatePagPrintToDadosHTML = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>

        <style>
        @import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');

        * {
            font-family: 'Roboto', sans-serif;
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        section {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;  
            padding: 20px;
        }
        
        section .container {
            position: relative;
            width: 400px;
            height: 550px;
            background: #ffffff;
            border: 1px solid black;
        }
        
        section .container .contBx {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
        
        section .container .contBx .destinatario, section .container .contBx .remetente {
            position: relative;
            width: 100%;
            height: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            padding: 30px;
        }
        
        section .container .contBx h2 {
            font-size: 18px;
            font-weight: 600;
            text-transform: uppercase;
            text-align: start;
            width: 100%;
            margin-bottom: 10px;
        }
        
        section .container .contBx ul li {
            list-style: none;
            width: 100%;
            margin-bottom: 5px;
            text-align: left;
        }
        </style>
    </head>
    <body>
        <section>
            <div class="container">
                <div class="contBx">
                    <div class="destinatario">
                        <h2>destinatario</h2>
                        <ul>
                            <li>${empresa.nome}</li>
                            <li>${empresa.telefone}</li>
                            <li>${empresa.endereco.rua}</li>
                            <li>${empresa.endereco.numero}</li>
                            <li>${empresa.endereco.bairro}</li>
                            <li>${empresa.endereco.cidade}</li>
                            <li>${empresa.endereco.uf}</li> 
                            <li>${empresa.endereco.cep}</li> 
                        </ul>
                    </div>

                    <div class="remetente">
                        <h2>remetente</h2>
                        <ul>
                            <li>VT Paraná Supermercado</li>
                            <li>(67) 3247-7700</li>
                            <li>Av. José Ferreira da Costa</li>
                            <li>847</li>
                            <li>Centro</li>
                            <li>Costa Rica</li>
                            <li>MS</li>
                            <li>79550-000</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    </body>
    </html>`

    newWin.document.write(templatePagPrintToDadosHTML)
    newWin.document.close()
    newWin.print()
}

// modal 

var btAbrirModal = $("#abrirModal");
var modal = $("#modal");
var modalClose = $("#modal .modal-close");
var modalBackground = $("#modal .modal-bg");

btAbrirModal.click(function () {
    modal.fadeIn(500);
});

modalClose.click(function () {
    modal.fadeOut(500);
});

modalBackground.click(function () {
    modal.fadeOut(500);
})

function getEmpresasCadastradas() {  
    $.get("http://localhost:5000/show", (data, status) => {
        data.map((item) => {
            $("#tabelaEmpresa").append(`<tr>
                <td id="nomeEmpresa">${item.nome}</td>
                <td>${item.telefone}</td>
            </tr>`)
        })
        
    })   

}
$(document).ready( function () {
    $("#tabelaEmpresa").on('click',"td", function(e) {
        const valorSelectTd = ($(this).closest('tr').find('td').first().text().trim())

        getToDadosEmpresa(valorSelectTd)
        modal.fadeOut(500);
    })
})
const ufname = []
function getSelectUf(event) {

    $.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados', (data, status) => {
        
        for(const uf of data){
            ufname.push({
                id: uf.id,
                name: uf.sigla
            })
            $("#uf").append(`<option value=${uf.sigla}>${uf.sigla}</option>`)
        }

        abilitaCampo()
        
    })
}

const cityNome = []

function getSelectCity(idUf) {
    $.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${idUf}/municipios`, (estados, status) => {
        for(const estado of estados) {
            cityNome.push({
                id: estado.id,
                nome: estado.nome
            })
            $("#cidade").append(`<option value="${estado.nome}">${estado.nome}</option>`)
        }
    })
}

function abilitaCampo() {
    if ($('[name=uf]').val() === $('select option[value=""]').val()) {
        document.querySelector('#cidade').disabled = true
    } else {
        document.querySelector('#cidade').disabled = false
        getSelectCity($('[name=uf]').val())
    }
}

getSelectUf()

$('[name=uf]').on('change', abilitaCampo)