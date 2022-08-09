const url = "https://api-account-current.herokuapp.com";
const token = sessionStorage.token;
const user = JSON.parse(sessionStorage.user);
const tokenAccount = sessionStorage.tokenAccount;
const account = JSON.parse(sessionStorage.account);
const saldo = document.querySelector(".saldo");
const atmBox = document.querySelector(".atm-box");
const log = document.querySelector(".log");


function renderInfoUser(){
    document.querySelector(".name").innerText = `${user.name} ${user.last_name}`;
    document.querySelector(".cpf").innerText = `CPF: ${user.cpf}`;
    document.querySelector(".conta").innerText = `Conta: ${account.account}`;
}

function sair(){
    sessionStorage.token = "";
    sessionStorage.user = "";
    sessionStorage.tokenAccount = "";
    sessionStorage.account = "";
    window.location.href="/index.html"
}

function voltar(){
    sessionStorage.tokenAccount = "";
    sessionStorage.account = "";
    if( user.role === "manager"){
        window.location.href="/views/pagGerente.html";
    }else {
        window.location.href="/views/pagUser.html";
    }
}

function deposito(){
    atmBox.innerHTML = `
    <div class="deposito">
        <div class="title-deposito-area">
            <h2 class="title-deposito">Depósito</h2>
        </div>
        <form class="form-transfer" action="">
            <input type="text" placeholder="R$">
            <button class="btn-depositar" type="button" onclick="depositar(this)">Enviar</button>
        </form>
    </div>
    <p class="resposta"></p>
    ` 
}

function saque(){
    atmBox.innerHTML = `
    <div class="deposito">
        <div class="title-deposito-area">
            <h2 class="title-deposito">Saque</h2>
        </div>
        <form class="form-transfer" action="">
            <input type="text" placeholder="R$">
            <button class="btn-depositar" type="button" onclick="sacar(this)">Enviar</button>
        </form>
    </div>
    <p class="resposta"></p>
    `
}

function transferencia(){
    atmBox.innerHTML = `
    <div class="deposito">
        <div class="title-deposito-area">
            <h2 class="title-deposito">Transferência</h2>
        </div>
        <div class="form-transfer">
            <form class="form" action="">       
                <input type="text" placeholder="R$">
                <input type="text" placeholder="CONTA">         
            </form>
            <button class="btn-depositar" type="button" onclick="transferir(this)">Enviar</button>
        </div>
    </div>
    <p class="resposta"></p>
    `
}

function trocaUsuario() {
    window.location.href="/views/login.html";
}

function depositar(elemento){
    const balance = elemento.parentElement.children[0]
    if(balance.value){
        createOperation({ balance: parseFloat(balance.value), status: 0 })
        balance.value = "";
    }else{
        erro("Preencha o campo");
    }   
}

function sacar(elemento){
    const balance = elemento.parentElement.children[0]
    if(balance.value){
        createOperation({ balance: parseFloat(balance.value), status: 1 })
        balance.value = "";
    }else{
        erro("Preencha o campo");
    }   
}

function transferir(elemento) {
    const balance = elemento.parentElement.children[0].children[0]
    const transferAccount = elemento.parentElement.children[0].children[1]
 
    if(balance.value && transferAccount){
        createTransfer({ balance: parseFloat(balance.value), transfer_account: transferAccount.value})
        balance.value = "";
        transferAccount.value = "";
    }else{
        erro("Preencha o campo");
    } 
}

function solicitaGerente(){
    const fetchConfig = {
        method: "POST",
        headers: {
            "Content-Type":"application/json",
            "token": tokenAccount
        }
    }

    fetch(url+"/visits", fetchConfig).then(response => {
        const status = response.status;
        response.json().then(resposta => {
            if(status == 201){
                atmBox.innerHTML = `<img class="img-box" src="/assets/images/Image.png" alt="imagem">`
                atualizarsaldo()
                extrato()
            }
        }).catch(err => console.log(err))
    }).catch(err => console.log(err))
    }

function erro(erro){
    const resposta = document.querySelector(".resposta");
    resposta.innerText = erro
}

function createOperation(dados){
    const fetchConfig = {
        method: "POST",
        body: JSON.stringify({ operation: dados }),
        headers: {
            "Content-Type":"application/json",
            "token": tokenAccount
        }
    }

    fetch(url+"/operations", fetchConfig).then(response => {
        const status = response.status;
        response.json().then(resposta => {
            if(status == 201){
                atmBox.innerHTML = `<img class="img-box" src="/assets/images/Image.png" alt="imagem">`
                atualizarsaldo()
                extrato()
            }else {
                errorsOperations(resposta);
            }
        }).catch(err => console.log(err))
    }).catch(err => console.log(err))
}

function createTransfer(dados){
    const fetchConfig = {
        method: "POST",
        body: JSON.stringify({ transfer: dados }),
        headers: {
            "Content-Type":"application/json",
            "token": tokenAccount
        }
    }

    fetch(url+"/transfers", fetchConfig).then(response => {
        const status = response.status;
        response.json().then(resposta => {
            if(status == 201){
                atmBox.innerHTML = `<img class="img-box" src="/assets/images/Image.png" alt="imagem">`
                atualizarsaldo()
                extrato()
            }else {
                errorsTansfers(resposta);
            }
        }).catch(err => console.log(err))
    }).catch(err => console.log(err))
}

function errorsOperations(erros){
    if (erros.balance){
        erro(erros.balance[0]);
    }
}

function errorsTansfers(erros){
    if(erros.transfer_account){
        erro(erros.transfer_account[0]);
    }else if (erros.balance){
        erro(erros.balance[0]);
    }
}

function atualizarsaldo(){
    const fetchConfig = {
        method: "GET",
        headers: { "token": tokenAccount }
    }

    fetch(url+`/checking_account/user`, fetchConfig).then(response => {
        const status = response.status;
        response.json().then(checking_account => {
            if(status == 200){
                saldo.innerText = `R$ ${checking_account.balance}`;
            }
        }).catch(err => console.log(err))
    }).catch(err => console.log(err))
}

function extrato(){
    const fetchConfig = {
        method: "GET",
        headers: { "token": tokenAccount }
    }

    fetch(url+`/checking_account/extrato`, fetchConfig).then(response => {
        const status = response.status;
        response.json().then(extratos => {
            if(status == 200){
                renderExtrato(extratos);
            }
        }).catch(err => console.log(err))
    }).catch(err => console.log(err))
}

function renderExtrato(extratos){ 
    log.innerHTML = `
        <div class="log-caixa">
            <div class="log-inf">
                <h3>Descrição</h3>
                <p>valor</p>
                <p>Hora</p>
                <p>Data</p>
            </div>
        </div>
    `
    extratos.forEach(element => {
        if(element.status === "deposit" || element.status === "received"){
            log.innerHTML += `
            <div class="log-caixa">
                <div class="log-inf" id="div1">
                    <h3>${element.status}</h3>
                    <p>${element.balance}</p>
                    <p>${horaTimeStamp(element.created_at)}</p>
                    <p>${dateTimeStamp(element.created_at)}</p>
                </div>
            </div> 
            `
        }else if(element.status ==="requested") {
            log.innerHTML += `
            <div class="log-caixa">
                <div class="log-inf" id="div2">
                    <h3>${element.status}</h3>
                    <p>(-${50})</p>
                    <p>${horaTimeStamp(element.created_at)}</p>
                    <p>${dateTimeStamp(element.created_at)}</p>
                </div>
            </div>          
            `
        }else {
            log.innerHTML += `
            <div class="log-caixa">
                <div class="log-inf" id="div2">
                    <h3>${element.status}</h3>
                    <p>(-${element.balance})</p>
                    <p>${horaTimeStamp(element.created_at)}</p>
                    <p>${dateTimeStamp(element.created_at)}</p>
                </div>
            </div>          
            `
        }
    });
}

function dateTimeStamp(time){
    time = time.split("T");
    time = time[0].split("-");
    return `${time[2]}/${time[1]}/${time[0]%100}`;
}

function horaTimeStamp(hora){
    hora = hora.split("T");
    hora = hora[1].split(".");
    hora = hora[0].split(":");
    return `${hora[0]}:${hora[1]}`;
}

function rennderSolicitacaoGerente(){
    const botao = document.querySelector(".btn-opcao-gerente")
    if(botao && user.role === "comum"){
        document.querySelector(".btn-opcao-gerente").remove();
    }
}

renderInfoUser();
atualizarsaldo();
extrato()
rennderSolicitacaoGerente();