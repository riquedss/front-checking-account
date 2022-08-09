const url = "https://api-account-current.herokuapp.com";
const responseText = document.querySelector('.response');

function enviar(botaoEnviar){
    const form = botaoEnviar.parentElement.parentElement.children[1];
    const cpf = form.children[0];
    const password = form.children[1];

    if(cpf.value&&password.value){
        login({'cpf': cpf.value,'password': password.value});
        cpf.value=''; password.value='';
    }else {
        responseText.innerText = 'empty field!';
    }
}

function login(user) {
    const fetchConfig = {
        method: "POST",
        body: JSON.stringify({ user: user }),
        headers: {"Content-Type":"application/json"}
    }

    fetch(url+"/login", fetchConfig).then(response => {
        const status = response.status;
        response.json().then(resposta => {
            if(status == 200){
                pagOfUser(resposta);
            }else{
                responseText.innerText =  `${resposta.message}`;
            }
                
        }).catch(err => console.log(err))
    }).catch(err => console.log(err))
}

function mensageSucess(){
    responseText.innerText = "Request Made!";
}

function pagOfUser(dados){
    const user = dados.user;
    sessionStorage.token = dados.token;
    sessionStorage.user = JSON.stringify(user);

    if( user.role === "manager"){
        window.location.href="/views/pagGerente.html";
    }else {
        window.location.href="/views/pagUser.html";
    }
}

function deleteMensageSignup(tagMain){
    tagMain.children[0].children[0].children[2].innerText = '';
}
