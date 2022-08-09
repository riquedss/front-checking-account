const url = "https://api-account-current.herokuapp.com";
const token = sessionStorage.token;
const responseText = document.querySelector('.response');
const container = document.querySelector(".container-conta");

function checkingAccountsOnHold(){
    const fetchConfig = {
        method: "GET",
        headers: { "token": token }
    }

    fetch(url+"/checking_accounts?status=on_hold", fetchConfig).then(response => {
        const status = response.status;

        response.json().then(checkingAaccounts => {
            if(status == 200){
                renderAccounts(checkingAaccounts)
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

function aceitar(elemento){
    const form = elemento.parentElement.children[0].children[0]
    if(form.value){
        update({ "account": form.value })
        form.value="";
    }else{
        responseText.innerText = "empty field!";
    }
}

function update(checking_account){   
    const fetchConfig = {     
        method: "PUT",
        body: JSON.stringify({ checking_account: checking_account }),
        headers: { "Content-Type":"application/json", "token": token }
    }

    fetch(url+"/checking_account/active", fetchConfig).then(response => {
        const status = response.status;

        response.json().then(() => {
            if(status == 200){
                container.innerHTML = "";
                checkingAccountsOnHold();
                responseText.innerText = "Sucess"
            }else {
                responseText.innerText = "Invalid account";
            }
        }).catch(err => console.log(err))
    }).catch(err => console.log(err))
}

function deleteMensage(){
    responseText.innerText = "";
}

checkingAccountsOnHold();
