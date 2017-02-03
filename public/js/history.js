(function() {
    "use strict";
    //TODO: Refactor Code for DRY

    if("serviceWorker" in navigator){
        navigator.serviceWorker.register("sw.js")
        .then(console.log)
        .catch(console.error);
    }

    //register dialog element
    var loginDialog = document.querySelector('#login-dialog');
    dialogPolyfill.registerDialog(loginDialog);  
    var registerDialog = document.querySelector('#register-dialog');
    dialogPolyfill.registerDialog(registerDialog);  

    function getIndexTemplate(){
        var template = document.querySelector('#list').innerHTML;
        return template;
    }

    function closeLoginDialog(){
        loginDialog.close();
    }

    function showLoginDialog(){
        loginDialog.showModal();
    }

    function closeRegisterDialog(){
        registerDialog.close();
    }

    function showRegisterDialog(){
        registerDialog.showModal();
    }

    function showAnonymous(){
        document.getElementsByClassName("login")[0].style.display = "inline";
        document.getElementsByClassName("login")[1].style.display = "inline";
        document.getElementsByClassName("register")[0].style.display = "inline";
        document.getElementsByClassName("register")[1].style.display = "inline";
        document.getElementsByClassName("logout")[0].style.display = "none";
        document.getElementsByClassName("logout")[1].style.display = "none";        
    }

    function showLoggedIn(){
        document.getElementsByClassName("login")[0].style.display = "none";
        document.getElementsByClassName("login")[1].style.display = "none";
        document.getElementsByClassName("register")[0].style.display = "none";
        document.getElementsByClassName("register")[1].style.display = "none";
        document.getElementsByClassName("logout")[0].style.display = "inline";
        document.getElementsByClassName("logout")[1].style.display = "inline";
    }

    function login(){
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

    function signOut(){
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

    function register(){
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

    hoodie.ready.then(function () {
        // all hoodie APIs are ready now
        if(hoodie.account.isSignedIn()){
            showLoggedIn();

        }
        else{
            showAnonymous();
        }

        hoodie.store('list').findAll().then(function (listCollection){
            for(var list of listCollection){
                var template = getIndexTemplate();
                template = template.replace("{{date}}", new Date(list.createdAt).toDateString());
                template = template.replace("{{cost}}", list.cost);
                document.getElementById("list-history").innerHTML +=template; 
            }            
        });

        window.pageEvents = {
            closeLogin: closeLoginDialog,
            showLogin: showLoginDialog,
            closeRegister: closeRegisterDialog,
            showRegister: showRegisterDialog,
            login: login,
            register: register,
            signout: signOut
        }
    });
})();