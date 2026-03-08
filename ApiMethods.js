// CONFIG

var urlBase = "https://proj-diegoback.onrender.com";

let selectedStudent = null;
let editingAdminId = null;
let editingTeacherId = null;
let editingStudentId = null;

function getToken() {
    return localStorage.getItem("token");
}


// UI

function openPopup(id) {
    const el = document.getElementById(id);
    if (el) el.style.display = "flex";
}

function closePopup(id) {
    const el = document.getElementById(id);
    if (el) el.style.display = "none";
}

function redirect(nextPage) {
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


// ================= ADMINS =================


// LIST ADMINS

function listAdmins() {

    fetch(urlBase + "/Admin/list", {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + getToken()
        }
    })
        .then(res => res.json())
        .then(admins => {

            const tbody = document.getElementById("tabela-admins");
            tbody.innerHTML = "";

            admins.forEach(admin => {

                const tr = document.createElement("tr");

                tr.innerHTML = `
                <td>${admin.id}</td>
                <td>${admin.usuario}</td>
                <td>
                    <button onclick="editAdmin('${admin.id}','${admin.usuario}')">Edit</button>
                    <button onclick="deleteAdmin('${admin.id}')">Delete</button>
                </td>
            `;

                tbody.appendChild(tr);
            });

        })
        .catch(err => alert("Error listing admins: " + err.message));
}

// DELETE ADMIN

function deleteAdmin(id) {

    if (!confirm("Deletar admin?")) return;

    fetch(urlBase + "/Admin/delete/" + id, {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + getToken()
        }
    })
        .then(res => {

            if (res.status === 200 || res.status === 204) {

                alert("Admin deleted");
                listAdmins();

            } else {

                alert("Error deleting admin");

            }

        })
        .catch(err => alert("Error deleting admin: " + err.message));
}




// CREATE ADMIN

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
        .then(res => res.json())
        .then(() => {

            alert("Admin created");

            listAdmins();

        })
        .catch(err => alert("Error creating admin: " + err.message));
}


// UPDATE ADMIN

function updateAdmin(id, usuario, senha) {

    fetch(urlBase + "/Admin/update/" + id, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + getToken()
        },
        body: JSON.stringify({
            usuario: usuario,
            senha: senha
        })
    })
        .then(res => res.json())
        .then(() => {

            alert("Admin updated");

            editingAdminId = null;

            listAdmins();
            closePopup("popupAdm");

        })
        .catch(err => alert("Error updating admin: " + err.message));
}


// EDIT ADMIN

function editAdmin(id, usuario) {

    editingAdminId = id;

    document.getElementById("adminUsuario").value = usuario;

    openPopup("popupAdm");
}


// FORM ADMIN

function cadastrarAdmin(event) {

    event.preventDefault();

    const usuario = document.getElementById("adminUsuario").value;
    const senha = document.getElementById("adminSenha").value;

    if (editingAdminId) {

        updateAdmin(editingAdminId, usuario, senha);

    } else {

        registerAdmin(null, usuario, senha);

    }

    document.getElementById("adminUsuario").value = "";
    document.getElementById("adminSenha").value = "";

}



// ================= PROFESSORES =================


// LIST TEACHERS

function listTeachers() {

    fetch(urlBase + "/professor/list", {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + getToken()
        }
    })
        .then(res => res.json())
        .then(teachers => {

            const tbody = document.getElementById("tabela-professores");
            tbody.innerHTML = "";

            teachers.forEach(teacher => {

                const tr = document.createElement("tr");

                tr.innerHTML = `
                <td>${teacher.nome}</td>
                <td>${teacher.disciplina[0].nome}</td>
                <td>${teacher.usuario}</td>
                <td>
                    <button onclick="editTeacher('${teacher.id}','${teacher.nome}','${teacher.disciplina ? teacher.disciplina.nome : ""}','${teacher.usuario}')">Edit</button>
                    <button onclick="deleteTeacher('${teacher.id}')">Delete</button>
                </td>
            `;

                tbody.appendChild(tr);

            });

        })
        .catch(err => alert("Error listing teachers: " + err.message));
}
// DELETE TEACHER

function deleteTeacher(id) {

    if (!confirm("Deletar professor?")) return;

    fetch(urlBase + "/professor/delete/" + id, {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + getToken()
        }
    })
        .then(res => {

            if (res.status === 200 || res.status === 204) {

                alert("Teacher deleted");
                listTeachers();

            } else {

                alert("Error deleting teacher");

            }

        })
        .catch(err => alert("Error deleting teacher: " + err.message));
}



// CREATE TEACHER

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
        .then(res => res.json())
        .then(() => {

            alert("Teacher created");

            listTeachers();

        })
        .catch(err => alert("Error creating teacher: " + err.message));
}


// UPDATE TEACHER

function updateTeacher(id, name, user, password, subject) {

    fetch(urlBase + "/professor/update/" + id, {
        method: "PUT",
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
        .then(res => res.json())
        .then(() => {

            alert("Teacher updated");

            editingTeacherId = null;

            listTeachers();
            closePopup("popupProfessor");

        })
        .catch(err => alert("Error updating teacher: " + err.message));
}


// EDIT TEACHER

function editTeacher(id, name, subject, user) {

    editingTeacherId = id;

    document.getElementById("nomeProfessor").value = name;
    document.getElementById("disciplinaProfessor").value = subject;
    document.getElementById("usuarioProfessor").value = user;

    openPopup("popupProfessor");
}


// FORM PROFESSOR

function cadastrarProfessor(event) {

    event.preventDefault();

    const name = document.getElementById("nomeProfessor").value;
    const subject = document.getElementById("disciplinaProfessor").value;
    const user = document.getElementById("usuarioProfessor").value;
    const password = document.getElementById("senhaProfessor").value;

    if (editingTeacherId) {

        updateTeacher(editingTeacherId, name, user, password, subject);

    } else {

        registerTeacher(name, user, password, subject);

    }

    listTeachers();

}



// ================= ALUNOS =================


// LIST STUDENTS

function listStudents() {

    fetch(urlBase + "/aluno/list", {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + getToken()
        }
    })
        .then(res => res.json())
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
                    <button onclick="editStudent('${student.matricula}','${student.nome}','${student.email}')">
                        Edit
                    </button><button onclick="deleteStudent('${student.matricula}')">
                        Delete
                    </button>
                </td>
            `;

                tbody.appendChild(tr);

            });

        })
        .catch(err => alert("Error listing students: " + err.message));
}
function listStudentsTeachers() {

    fetch(urlBase + "/aluno/list", {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + getToken()
        }
    })
        .then(res => res.json())
        .then(students => {

            const tbody = document.getElementById("studentsTable");
            tbody.innerHTML = "";

            students.forEach(student => {

                const tr = document.createElement("tr");

                tr.innerHTML = `    
                <td>${student.nome}</td>
                <td>${student.matricula}</td>
                <td>${student.email}</td>
                <td>
                    <button onclick="openPopup('popupInfo')">
                        Enviar observação
                    </button><button onclick="openPopup('popupGrades')">
                        Lançar notas
                    </button>
                </td>
            `;

                tbody.appendChild(tr);

            });

        })
        .catch(err => alert("Error listing students: " + err.message));
}
// DELETE STUDENT

function deleteStudent(matricula) {

    if (!confirm("Deletar este aluno?")) return;

    fetch(urlBase + "/aluno/delete/" + matricula, {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + getToken()
        }
    })
        .then(res => {

            if (res.status === 200 || res.status === 204) {

                alert("Student deleted");
                listStudents();

            } else {

                alert("Error deleting student");

            }

        })
        .catch(err => alert("Error deleting student: " + err.message));
}


// CREATE STUDENT

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
        .then(res => res.json())
        .then(() => {

            alert("Student created");

            listStudents();

        })
        .catch(err => alert("Error creating student: " + err.message));
}


// UPDATE STUDENT

function updateStudent(matricula, name, email, password) {

    fetch(urlBase + "/aluno/update/" + matricula, {
        method: "PUT",
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
        .then(res => res.json())
        .then(() => {

            alert("Student updated");

            editingStudentId = null;

            listStudents();
            closePopup("popupAluno");

        })
        .catch(err => alert("Error updating student: " + err.message));
}


// EDIT STUDENT

function editStudent(matricula, name, email) {

    editingStudentId = matricula;

    document.getElementById("studentName").value = name;
    document.getElementById("studentEmail").value = email;

    openPopup("popupAluno");
}


// FORM ALUNO

function cadastrarAluno(event) {

    event.preventDefault();

    const name = document.getElementById("studentName").value;
    const email = document.getElementById("studentEmail").value;
    const password = document.getElementById("studentPassword").value;

    if (editingStudentId) {

        updateStudent(editingStudentId, name, email, password);

    } else {

        registerStudent(name, email, password);

    }

}

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
            redirect("Student.html");

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
            redirect("Admin.html");

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
            redirect("Teacher.html");

        })
        .catch(err => {
            console.error(err);
            alert("Erro login professor: " + err.message);
        });
}

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

//OBSERVAÇÕES
function listarObservacoes() {

    fetch(urlBase + "/observacao/list", {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + getToken()
        }
    })
        .then(res => res.json())
        .then(observacoes => {

            const tbody = document.getElementById("tabela-observacoes");
            tbody.innerHTML = "";

            observacoes.forEach(observacao => {

                const tr = document.createElement("tr");

                tr.innerHTML = `
                <h1>Observação ${observacao.professor}</h1>
                <p>${observacao.descricao}</p>
            `;

                tbody.appendChild(tr);

            });

        })
        .catch(err => alert("Error listing observations: " + err.message));
}


                const tr = document.createElement("tr");

                tr.innerHTML = `    
                <td>${student.nome}</td>
                <td>${student.matricula}</td>
                <td>${student.email}</td>
                <td>
                    <button onclick="editStudent('${student.matricula}','${student.nome}','${student.email}')">
                        Edit
                    </button><button onclick="deleteStudent('${student.matricula}')">
                        Delete
                    </button>
                </td>
            `;

                tbody.appendChild(tr);

            });

        })
        .catch(err => alert("Error listing students: " + err.message));
}