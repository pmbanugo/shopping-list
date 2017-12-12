import * as shared from "shared.js";

function getIndexTemplate() {
  let template = document.querySelector("#list").innerHTML;
  return template;
}

function init() {
  shared.updateDOMLoginStatus();

  hoodie.store
    .withIdPrefix("list")
    .findAll()
    .then(function(savedList) {
      for (let list of savedList) {
        let template = getIndexTemplate();
        template = template.replace(
          "{{date}}",
          new Date(list.hoodie.createdAt).toDateString()
        );
        template = template.replace("{{cost}}", list.cost);
        document.getElementById("list-history").innerHTML += template;
      }
    });

  window.pageEvents = {
    closeLogin: shared.closeLoginDialog,
    showLogin: shared.showLoginDialog,
    closeRegister: shared.closeRegisterDialog,
    showRegister: shared.showRegisterDialog,
    login: shared.login,
    register: shared.register,
    signout: shared.signOut
  };
}

init();
