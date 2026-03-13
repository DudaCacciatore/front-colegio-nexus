async function gerarBoletim({ 
    nomeAluno, 
    turmaAluno, 
    anoLetivo = new Date().getFullYear(), 
    escola = "Escola", 
    materias = [] 
}) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', 'a4');

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text('BOLETIM ESCOLAR', 105, 15, { align: "center" });

    doc.setLineWidth(0.5);
    doc.rect(10, 20, 190, 25);

    doc.setFontSize(10);
    doc.text(escola, 12, 28);

    doc.setFont("helvetica", "normal");
    doc.text(`Nome: ${nomeAluno}`, 12, 35);
    doc.text(`Ano Letivo: ${anoLetivo}`, 150, 42);

    const dadosBoletim = materias.map(m => [
        m.materia,
        m.n1,
        m.n2,
        m.media,
        m.situacao
    ]);

    doc.autoTable({
        startY: 55,
        head: [['Matéria', 'N1', 'N2', 'Média Final', 'Situação']],
        body: dadosBoletim,
        theme: 'grid'
    });

    const finalY = doc.lastAutoTable.finalY + 30;

    doc.line(10, finalY, 80, finalY);
    doc.text("Assinatura do Secretário", 10, finalY + 5);

    doc.line(120, finalY, 190, finalY);
    doc.text("Assinatura do Diretor", 120, finalY + 5);

    doc.save(`Boletim_${nomeAluno.replace(/\s+/g, '_')}.pdf`);
}


function decodificarJWT(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error("Erro ao decodificar JWT:", error);
        return null;
    }
}

window.onload = function() {
    const botaoBoletim = document.querySelector(".actionButton button");
    if (botaoBoletim) {
        botaoBoletim.addEventListener("click", async () => {
            try {
                const token = localStorage.getItem("token");
                
                if (!token) {
                    alert("Você precisa fazer login primeiro!");
                    window.location.href = "Login.html";
                    return;
                }

                const payload = decodificarJWT(token);
                if (!payload) {
                    alert("Token inválido!");
                    return;
                }

                const emailAluno = payload?.sub || payload?.email;
                console.log("Email do token:", emailAluno);
                
                const alunoResponse = await fetch(`${urlBase}/aluno/list`, {
                    headers: { "Authorization": "Bearer " + token }
                });
                
                if (!alunoResponse.ok) {
                    throw new Error(`Erro ao buscar alunos: ${alunoResponse.status}`);
                }

                const alunos = await alunoResponse.json();
                console.log("Alunos encontrados:", alunos);

                const alunoAtual = alunos.find(a => a.email === emailAluno);
                
                if (!alunoAtual) {
                    alert("Aluno não encontrado no banco de dados!");
                    console.error("Email procurado:", emailAluno);
                    console.error("Emails disponíveis:", alunos.map(a => a.email));
                    return;
                }

                const matricula = alunoAtual.matricula;
                console.log("Matrícula do aluno:", matricula);
                
                const boletinsResponse = await fetch(`${urlBase}/boletim/list`, {
                    headers: { "Authorization": "Bearer " + token }
                });
                
                if (!boletinsResponse.ok) {
                    throw new Error(`Erro ao buscar boletins: ${boletinsResponse.status}`);
                }

                const boletins = await boletinsResponse.json();
                console.log("Boletins encontrados:", boletins);

                const boletinsAluno = boletins.filter(b => b.id_aluno === matricula);
                console.log("Boletins do aluno:", boletinsAluno);

                if (boletinsAluno.length === 0) {
                    alert("Nenhum boletim encontrado para este aluno!");
                    return;
                }
                
                // Buscar disciplinas para mapear nomes
                const disciplinasResponse = await fetch(`${urlBase}/disciplina/list`, {
                    headers: { "Authorization": "Bearer " + token }
                });
                
                if (!disciplinasResponse.ok) {
                    throw new Error(`Erro ao buscar disciplinas: ${disciplinasResponse.status}`);
                }

                const disciplinas = await disciplinasResponse.json();
                console.log("Disciplinas encontradas:", disciplinas);

                const mapDisciplinas = disciplinas.reduce((acc, d) => {
                    acc[d.id] = d.nome;
                    return acc;
                }, {});
                
                const dados = {
                    nomeAluno: alunoAtual.nome,
                    turmaAluno: alunoAtual.turma || "Turma não informada",
                    anoLetivo: new Date().getFullYear(),
                    escola: "Colégio Nexus",
                    materias: boletinsAluno.map(b => ({
                        materia: mapDisciplinas[b.id_disciplina] || `Disciplina ${b.id_disciplina}`, 
                        n1: b.n1 || 0,
                        n2: b.n2 || 0,
                        media: b.media || 0,
                        situacao: (b.media || 0) >= 7 ? "Aprovado" : "Reprovado"
                    }))
                };

                console.log("Dados do boletim:", dados);
                await gerarBoletim(dados);
                alert("✅ Boletim gerado com sucesso!");
            } catch (error) {
                console.error("Erro ao gerar boletim:", error);
                alert(`❌ Erro ao gerar boletim: ${error.message}`);
            }
        });
    } else {
        console.error("Botão de boletim não encontrado!");
    }
};
