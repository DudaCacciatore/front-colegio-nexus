var urlBase = "https://proj-diegoback.onrender.com"

function abrirPopup(id) {
    document.getElementById(id).style.display = "flex";
}

function fecharPopup(id) {
    document.getElementById(id).style.display = "none";
}

function registerStudent(nome, email, senha) {
    fetch(urlBase + "/aluno/create",
        {
            headers: {
                'Accept': "application/json",
                'Content-type': "application/json"
            },
            method: "POST",
            body: JSON.stringify({
                nome: nome,
                email: email,
                senha: senha
            })
        }
    )
        .then(function (res) {
            const resposta = res.status;
            if (resposta == 20) {
                window.alert("Cadastro realizado com sucesso! ")
                redirecionar("StudentPage.html")
            }
        })
        .catch(function (res) { console.log(res.status) })
}

function login(matricula, senha) {
    fetch(urlBase + "/aluno/findAluno/" + matricula,
        {
            headers: {
                'Accept': "application/json",
                'Content-type': "application/json"
            },
            method: "POST",
            body: JSON.stringify({
                matricula: matricula,
                senha: senha
            })
        }
    )
        .then(function (res) {
            const resposta = res.status;
            if (resposta == 200) {
                window.alert("Login realizado com sucesso! ")
                redirecionar("StudentPage.html")
            }
        })
        .catch(function (res) { console.log(res.status) })
}

// function listStudents() {
//     fetch(urlBase + "/aluno/list",
//         {
//             headers: {
//                 'Accept': "application/json",
//                 'Content-type': "application/json"
//             },
//             method: "GET"
//         }
//     )
//         .then(function (res) {
//             const resposta = res.status;
//             if (resposta == 200) {
//                 window.alert("Login realizado com sucesso! ")
//                 redirecionar("StudentPage.html")
//             }
//         })
//         .catch(function (res) { console.log(res.status) })
//}

function redirecionar(nextPage) {
    setTimeout(function () {
        window.location.href = nextPage;
    }, 1500);
}


// Redirecionamento de abas - admin
function showSection(id, botaoClicado) {

    const secoes = document.querySelectorAll(".secao");
    secoes.forEach(secao => {
        secao.style.display = "none";
    });

    const botoes = document.querySelectorAll(".tabs button");
    botoes.forEach(btn => {
        btn.classList.remove("active");
    });

    document.getElementById(id).style.display = "block";

    botaoClicado.classList.add("active");
}

window.onload = function () {
    showSection("admins", document.querySelector(".tabs button"));
};
