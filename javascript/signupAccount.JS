const url = "https://api-account-current.herokuapp.com";
const token = sessionStorage.token;
const responseText = document.querySelector('.response');

function signupAccount(botao){
    const form = botao.parentElement.parentElement.children[1];
    const password = form.children[0];
    const passwordConfirmation = form.children[1];

    if(password.value&&passwordConfirmation.value){
        const checkingAccount = {
            'password': password.value,
            'password_confirmation': passwordConfirmation.value
        }

        signupAccountServer(checkingAccount);
        password.value=''; passwordConfirmation.value='';
    }else {
        responseText.innerText = 'empty field!';
    }
}

function signupAccountServer(checkingAccount){
    const fetchConfig = {
        method: "POST",
        body: JSON.stringify({ checking_account: checkingAccount }),
        headers: {
            "Content-Type":"application/json",
            "token": token
        }
    }

    fetch(url+"/checking_account/signup", fetchConfig).then(response => {
        const status = response.status;

        response.json().then(resposta => {
            if(status == 201){
                window.location.href="/views/pagUser.html"
            }else {
                responseText.innerText = `${resposta.password}`;
            }
        }).catch(err => console.log(err))
    }).catch(err => console.log(err))
}
