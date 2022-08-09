const url = "https://api-account-current.herokuapp.com";
const token = sessionStorage.token;
const user = JSON.parse(sessionStorage.user);
const container = document.querySelector(".container-conta");
const responseText = document.querySelector(".response");

function rederSectionContasHTML(){
    const contas = document.querySelector(".contas");
    contas.children[0].children[0].innerText = `${ user.name } ${ user.last_name }`
}

function solicitarConta(){
    window.location.href="/views/signupAccount.html";
}

function voltar(){
    sessionStorage.tokenAccount = "";
    window.location.href="/views/login.html";
}

function showAccountActive(){
    const fetchConfig = {
        method: "GET",
        headers: { "token": token }
    }

    fetch(url+`/checking_account/active/user?id=${ user.id }`, fetchConfig).then(response => {
        const status = response.status;
        response.json().then(checkingAccounts => {
            if(status == 200){
                renderAccounts(checkingAccounts)
            }
        }).catch(err => console.log(err))
    }).catch(err => console.log(err))
}

function renderAccounts(checkingAccounts){
    checkingAccounts.forEach((account) => {
        container.innerHTML +=  `<div class="conta-inf">
                                    <h3>conta: ${account.account}</h3>
                                    <h3>senha: ****</h3>
                                </div>`    
    });
}

function enviarAccount(botao){
    const form = botao.parentElement.parentElement.children[1];
    const account = form.children[0];
    const password = form.children[1];

    if(account.value&&password.value){
        loginAcount({"account": account.value, "password": password.value});
    }else{
        responseText.innerText = 'empty field!';
    }
}

function loginAcount(account) {
    const fetchConfig = {
        method: "POST",
        body: JSON.stringify({ checking_account: account }),
        headers: { "Content-Type":"application/json", "token": token }
    }

    fetch(url+"/checking_account/login", fetchConfig).then(response => {
        const status = response.status;
        response.json().then(resposta => {
            if(status == 200){
                const account = resposta.checking_account;
                sessionStorage.tokenAccount = resposta.token_account;
                sessionStorage.account = JSON.stringify(account)
                window.location.href="/views/pagBank.html"
            }else {
                responseText.innerText = `${resposta.message}`;
            }       
        }).catch(err => console.log(err))
    }).catch(err => console.log(err))
}

showAccountActive()
rederSectionContasHTML()
