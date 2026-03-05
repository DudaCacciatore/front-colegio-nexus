// ========================
// CONFIG BASE URL
// ========================
var urlBase = "https://proj-diegoback.onrender.com";


// ========================
// UI FUNCTIONS
// ========================
function abrirPopup(id) {
    const el = document.getElementById(id);
    if (el) el.style.display = "flex";
}

function fecharPopup(id) {
    const el = document.getElementById(id);
    if (el) el.style.display = "none";
}

function redirecionar(nextPage) {
    setTimeout(() => {
        window.location.href = nextPage;
    }, 1500);
}

function showSection(id, button) {

    const sections = document.querySelectorAll(".secao");
    sections.forEach(secao => secao.style.display = "none");

    const buttons = document.querySelectorAll(".tabs button");
    buttons.forEach(btn => btn.classList.remove("active"));

    const section = document.getElementById(id);
    if (section) section.style.display = "block";

    if (button) button.classList.add("active");
}

window.onload = function () {
    const firstButton = document.querySelector(".tabs button");
    if (firstButton) {
        showSection("admins", firstButton);
    }
};


// ========================
// LOGIN
// ========================
function loginStudent(email, password) {
    fetch(urlBase + "/login/aluno", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha: password })
    })
        .then(handleResponse)
        .then(saveTokenAndRedirect("Student.html"))
        .catch(handleError("aluno"));
}

function loginAdmin(usuario, password) {
    fetch(urlBase + "/login/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            usuario: usuario, 
            senha: password })
    })
        .then(handleResponse)
        .then(saveTokenAndRedirect("Admin.html"))
        .catch(handleError("admin"));
}

function loginTeacher(usuario, password) {
    fetch(urlBase + "/login/professor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, senha: password })
    })
        .then(handleResponse)
        .then(saveTokenAndRedirect("Teacher.html"))
        .catch(handleError("professor"));
}


// ========================
// TOKEN HANDLERS
// ========================
function handleResponse(res) {
    if (!res.ok) {
        return res.text().then(text => {
            throw new Error(res.status + " - " + text);
        });
    }
    return res.json();
}

function saveTokenAndRedirect(page) {
    return function (dados) {
        if (!dados.token) {
            throw new Error("Token não retornado pelo backend.");
        }
        localStorage.setItem("token", dados.token);
        alert("Login realizado com sucesso!");
        redirecionar(page);
    };
}

function handleError(tipo) {
    return function (err) {
        console.error("Erro login " + tipo + ":", err);
        alert("Erro no login " + tipo + ": " + err.message);
    };
}

function getToken() {
    return localStorage.getItem("token");
}


// ========================
// STUDENT
// ========================
function registerStudent(name, email, password) {
    fetch(urlBase + "/aluno/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + getToken()
        },
        body: JSON.stringify({ nome: name, email, senha: password })
    })
        .then(handleResponse)
        .then(() => alert("Aluno cadastrado com sucesso!"))
        .catch(err => alert("Erro: " + err.message));
}


// ========================
// ADMIN
// ========================
function registerAdmin(id, usuario, password) {
    fetch(urlBase + "/Admin/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + getToken()
        },
        body: JSON.stringify({ id, usuario, senha: password })
    })
        .then(handleResponse)
        .then(() => alert("Admin cadastrado com sucesso!"))
        .catch(err => alert("Erro: " + err.message));
}


// ========================
// TEACHER
// ========================
function registerTeacher(name, user, password, subject) {
    fetch(urlBase + "/professor/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + getToken()
        },
        body: JSON.stringify({
            nome: name,
            usuario: user,
            senha: password,
            disciplina: subject
        })
    })
        .then(handleResponse)
        .then(() => alert("Professor cadastrado com sucesso!"))
        .catch(err => alert("Erro: " + err.message));
}


// ========================
// VERIFY USER
// ========================
function verifyUser(user, password) {

    const emailRegexStudent = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const atStartRegexAdmin = /^@[a-zA-Z0-9_]+$/;
    const dotBetweenRegexTeacher = /^[a-zA-Z0-9_]+\.[a-zA-Z0-9_]+$/;

    if (emailRegexStudent.test(user)) {
        // Login de aluno (email)
        loginStudent(user, password);

    } else if (atStartRegexAdmin.test(user)) {
        // Login de admin (começa com @)
        loginAdmin(user, password); 
        
    } else if (dotBetweenRegexTeacher.test(user)) {
        // Login de professor (nome.sobrenome)
        loginTeacher(user, password);

    } else {
        alert("Formato de usuário inválido.");
    }
}