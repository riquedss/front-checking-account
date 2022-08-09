const url = "https://api-account-current.herokuapp.com";
const responseText = document.querySelector('.response');

function enviar(botaoEnviar){
    const form = botaoEnviar.parentElement.parentElement.children[1];
    const name = form.children[0];
    const lastName = form.children[1];
    const email = form.children[2];
    const cpf = form.children[3];
    const password = form.children[4];
    const passwordConfirmation = form.children[5];

    if(name.value&&lastName.value&&email.value&&cpf.value&&password.value&&passwordConfirmation.value){
        const user = {
            'name': name.value,
            'last_name': lastName.value,
            'email': email.value,
            'cpf': cpf.value,
            'password': password.value,
            'password_confirmation': passwordConfirmation.value
        }

        signup(user, form);
    }else {
        responseText.innerText = 'empty field!';
    }
}

function signup(user) {
    const fetchConfig = {
        method: "POST",
        body: JSON.stringify({ user: user }),
        headers: {"Content-Type":"application/json"}
    }

    fetch(url+"/signup", fetchConfig).then(response => {
        const status = response.status;
        response.json().then(resposta => {
            if(status == 201){
                mensagemSucesso()
                form.children[0].value=''; form.children[1].value=''; form.children[2].value=''; 
                form.children[3].value=''; form.children[4].value=''; form.children[5].value='';
            }else {
                responseText.innerText = mensagemErro(resposta);
            }
        }).catch(err => console.log(err))
    }).catch(err => console.log(err))
}

function mensagemSucesso(){
    responseText.innerText = "Request Made!"
}

function mensagemErro(erros){
    if(erros.name){
        return "Name " + erros.name[0];
    }else if(erros.last_name){
        return "Last Name " + erros.last_name[0];
    }else if(erros.email){
        return "Email " + erros.email[0];
    }else if(erros.cpf){
        return "Cpf " + erros.cpf[0];
    }else if(erros.password){
        return "Password " + erros.password[0];
    }else if(erros.password_confirmation){
        return "Password confirmation " + erros.password_confirmation[0];
    }
}


function deleteMensageSignup(tagMain){
    tagMain.children[0].children[0].children[2].innerText = '';
}
