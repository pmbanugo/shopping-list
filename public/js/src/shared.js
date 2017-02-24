
    if("serviceWorker" in navigator){
        navigator.serviceWorker.register("sw.js")
        .then(console.log)
        .catch(console.error);
    }

//register dialog element
let loginDialog = document.querySelector('#login-dialog');
dialogPolyfill.registerDialog(loginDialog);  
let registerDialog = document.querySelector('#register-dialog');
dialogPolyfill.registerDialog(registerDialog);

let closeLoginDialog = function (){
    loginDialog.close();
}

let showLoginDialog = function (){
    loginDialog.showModal();
}

let closeRegisterDialog = function (){
    registerDialog.close();
}

let showRegisterDialog = function (){
    registerDialog.showModal();
}

let showAnonymous = function (){
    document.getElementsByClassName("login")[0].style.display = "inline";
    document.getElementsByClassName("login")[1].style.display = "inline";
    document.getElementsByClassName("register")[0].style.display = "inline";
    document.getElementsByClassName("register")[1].style.display = "inline";
    document.getElementsByClassName("logout")[0].style.display = "none";
    document.getElementsByClassName("logout")[1].style.display = "none";        
}

let showLoggedIn = function (){
    document.getElementsByClassName("login")[0].style.display = "none";
    document.getElementsByClassName("login")[1].style.display = "none";
    document.getElementsByClassName("register")[0].style.display = "none";
    document.getElementsByClassName("register")[1].style.display = "none";
    document.getElementsByClassName("logout")[0].style.display = "inline";
    document.getElementsByClassName("logout")[1].style.display = "inline";
}

let login = function (){
    var username = document.querySelector('#login-username').value;
    var password = document.querySelector('#login-password').value;

    hoodie.account.signIn({
        username: username,
        password: password
    })
    .then(function() {
        showLoggedIn();
        closeLoginDialog();

        var snackbarContainer = document.querySelector('#toast');
        snackbarContainer.MaterialSnackbar.showSnackbar({message: 'You logged in'});
    })
    .catch(function (error){
        console.log(error);
        document.querySelector('#login-error').innerHTML = error.message;
    });
}

let signOut = function (){
    hoodie.account.signOut().then(function() {
        showAnonymous();
        var snackbarContainer = document.querySelector('#toast');
        snackbarContainer.MaterialSnackbar.showSnackbar({message: 'You logged out'});
    })
    .catch(function(){
        var snackbarContainer = document.querySelector('#toast');
        snackbarContainer.MaterialSnackbar.showSnackbar({message: 'Could not logout'});
    });
}

let register = function (){
    var username = document.querySelector('#register-username').value;
    var password = document.querySelector('#register-password').value;
    var options = { username: username, password: password }

    hoodie.account.signUp(options)
    .then(function (account){
    return hoodie.account.signIn(options);
    })
    .then( account => showLoggedIn() || account)
    .catch(function (error){
    console.log(error);
    document.querySelector('#register-error').innerHTML = error.message;
    });
}

let updateDOMLoginStatus = () => {
    if(hoodie.account.isSignedIn()){
        showLoggedIn();
    }
    else{
        showAnonymous();
    }
}

export { register,
         login, 
         signOut, 
         showRegisterDialog, 
         closeRegisterDialog, 
         showLoginDialog,
         closeLoginDialog,
         showLoggedIn,
         showAnonymous,
         updateDOMLoginStatus
        }