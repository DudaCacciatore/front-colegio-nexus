// CONFIG

var urlBase = "https://proj-diegoback.onrender.com";
let alunoSelecionado = null;

function getToken() {
    return localStorage.getItem("token");
}


// UI FUNCTIONS

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


// LOGIN

function handleResponse(res) {

    if (!res.ok) {
        return res.text().then(text => {
            throw new Error(res.status + " - " + text);
        });
    }

    return res.json();
}

function loginStudent(email, password) {

    fetch(urlBase + "/login/aluno", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: email,
            senha: password
        })
    })
        .then(handleResponse)
        .then(dados => {

            localStorage.setItem("token", dados.token);

            alert("Login aluno realizado!");
            redirecionar("Student.html");

        })
        .catch(err => {
            console.error(err);
            alert("Erro login aluno: " + err.message);
        });
}

function loginAdmin(usuario, password) {

    fetch(urlBase + "/login/admin", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            usuario: usuario,
            senha: password
        })
    })
        .then(handleResponse)
        .then(dados => {

            localStorage.setItem("token", dados.token);

            alert("Login admin realizado!");
            redirecionar("Admin.html");

        })
        .catch(err => {
            console.error(err);
            alert("Erro login admin: " + err.message);
        });
}

function loginTeacher(usuario, password) {

    fetch(urlBase + "/login/professor", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            usuario: usuario,
            senha: password
        })
    })
        .then(handleResponse)
        .then(dados => {

            localStorage.setItem("token", dados.token);

            alert("Login professor realizado!");
            redirecionar("Teacher.html");

        })
        .catch(err => {
            console.error(err);
            alert("Erro login professor: " + err.message);
        });
}


// STUDENT

function registerStudent(name, email, password) {

    fetch(urlBase + "/aluno/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + getToken()
        },
        body: JSON.stringify({
            nome: name,
            email: email,
            senha: password
        })
    })
        .then(handleResponse)
        .then(() => {

            alert("Aluno cadastrado com sucesso!");
            redirecionar("StudentPage.html");

        })
        .catch(err => {
            alert("Erro cadastro aluno: " + err.message);
        });
}

function listStudents() {

    fetch(urlBase + "/aluno/list", {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + getToken()
        }
    })
        .then(handleResponse)
        .then(students => {

            const tbody = document.getElementById("tabela-alunos");
            tbody.innerHTML = "";

            students.forEach(student => {

                const tr = document.createElement("tr");

                tr.innerHTML = `    
                <td>${student.nome}</td>
                <td>${student.matricula}</td>
                <td>${student.email}</td>
                <td>
                    <button onclick="abrirNotas('${student.matricula}')">
                        Lançar nota
                    </button>

                    <button onclick="abrirObservacao('${student.matricula}')">
                        Adicionar observação
                    </button>
                </td>
            `;

                tbody.appendChild(tr);
            });

        })
        .catch(err => alert("Erro ao listar alunos: " + err.message));
}

function findStudent(matricula) {

    fetch(urlBase + "/aluno/findAluno/" + matricula, {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + getToken()
        }
    })
        .then(handleResponse)
        .then(students => {

            const tbody = document.getElementById("tabela-alunos");
            tbody.innerHTML = "";

            if (students.length === 0) {
                tbody.innerHTML = "<tr><td colspan='3'>Aluno não encontrado</td></tr>";
                return;
            }

            students.forEach(student => {

                const tr = document.createElement("tr");

                tr.innerHTML = `
                <td>${student.nome}</td>
                <td>${student.matricula}</td>
                <td>
                    <button onclick="abrirNotas('${student.matricula}')">
                        Lançar nota
                    </button>

                    <button onclick="abrirObservacao('${student.matricula}')">
                        Adicionar observação
                    </button>
                </td>
            `;

                tbody.appendChild(tr);

            });

        })
        .catch(err => alert("Erro ao buscar aluno: " + err.message));
}

function abrirNotas(matricula) {

    alunoSelecionado = matricula;

    abrirPopup("popupGrades");
}

function abrirObservacao(matricula) {

    alunoSelecionado = matricula;

    abrirPopup("popupInfo");
}

function deleteStudent(registration) {

    fetch(urlBase + "/aluno/delete/" + registration, {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + getToken()
        }
    })
        .then(handleResponse)
        .then(() => alert("Aluno deletado com sucesso"))
        .catch(err => alert("Erro deletar aluno: " + err.message));
}


// ADMIN

function listAdmins() {

    fetch(urlBase + "/Admin/list", {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + getToken()
        }
    })
        .then(handleResponse)
        .then(admins => {

            const tbody = document.getElementById("tabela-admins");
            tbody.innerHTML = "";

            admins.forEach(admin => {

                const tr = document.createElement("tr");

                tr.innerHTML = `
                <td>${admin.id}</td>
                <td>${admin.usuario}</td>
                <td>
                    <button onclick="deleteAdmin('${admin.usuario}')">Excluir</button>
                </td>
            `;

                tbody.appendChild(tr);
            });

        })
        .catch(err => alert("Erro ao listar admins: " + err.message));
}

function registerAdmin(id, usuario, password) {

    fetch(urlBase + "/Admin/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + getToken()
        },
        body: JSON.stringify({
            id: id,
            usuario: usuario,
            senha: password
        })
    })
        .then(handleResponse)
        .then(() => alert("Admin cadastrado com sucesso"))
        .catch(err => alert("Erro cadastro admin: " + err.message));
}


// TEACHER

function listTeachers() {

    fetch(urlBase + "/professor/list", {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + getToken()
        }
    })
        .then(handleResponse)
        .then(teachers => {

            const tbody = document.getElementById("tabela-professores");
            tbody.innerHTML = "";

            teachers.forEach(teacher => {

                const tr = document.createElement("tr");

                tr.innerHTML = `
                <td>${teacher.nome}</td>
                <td>${teacher.disciplina}</td>
                <td>${teacher.usuario}</td>
                <td>
                    <button onclick="deleteTeacher('${teacher.usuario}')">Excluir</button>
                </td>
            `;

                tbody.appendChild(tr);
            });

        })
        .catch(err => alert("Erro ao listar professores: " + err.message));
}

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
        .then(res => {
            alert("Professor cadastrado com sucesso");
        })
        .catch(err => alert("Erro cadastro professor: " + err.message));
}


// VERIFY USER

function verifyUser(user, password) {

    const emailRegexStudent = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const atStartRegexAdmin = /^@[a-zA-Z0-9_]+$/;
    const teacherRegex = /^[a-zA-Z0-9_]+\.[a-zA-Z0-9_]+$/;

    if (emailRegexStudent.test(user)) {

        loginStudent(user, password);

    }
    else if (atStartRegexAdmin.test(user)) {

        loginAdmin(user, password);

    }
    else if (teacherRegex.test(user)) {

        loginTeacher(user, password);

    }
    else {

        alert("Formato de usuário inválido");

    }

}

// FORM HANDLERS (para os popups com <form>)

function cadastrarAluno(event) {

    event.preventDefault();

    const nome = document.getElementById("studentName").value;
    const email = document.getElementById("studentEmail").value;
    const senha = document.getElementById("studentPassword").value;

    registerStudent(nome, email, senha);

    fecharPopup("popupAluno");
}

function cadastrarAdmin(event) {

    event.preventDefault();

    const usuario = document.getElementById("adminUsuario").value;
    const senha = document.getElementById("adminSenha").value;

    // id não existe no form → enviamos null
    registerAdmin(null, usuario, senha);

    fecharPopup("popupAdm");
}

function cadastrarProfessor(event) {

    event.preventDefault();

    const nome = document.getElementById("nomeProfessor").value;
    const disciplina = document.getElementById("disciplinaProfessor").value;
    const usuario = document.getElementById("usuarioProfessor").value;
    const senha = document.getElementById("senhaProfessor").value;

    registerTeacher(nome, usuario, senha, disciplina);

    fecharPopup("popupProfessor");
}