/**
 * Gerencia a lógica do questionário de múltiplas perguntas.
 */
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Dados do Quiz ---
    const questions = [
        "Você gosta de sorvete?",
        "Você acredita em alien?",
        "Você teria um cachorro?",
        "Você teria um gato?",
        "Você costuma ler?",
        "Escuta música todo dia?",
        "Gosta de olhar as estrelas?",
        "Gosta de conversar por texto?",
        "Gosta de ficar em ligação?",
        "Você namoraria a distância?"
    ];

    // --- 2. Estado do Quiz ---
    let currentQuestionIndex = 0;
    // Cria um array para salvar as respostas (ex: ['yes', 'no', null, ...])
    const answers = new Array(questions.length).fill(null);

    // --- 3. Seletores do DOM ---
    const questionText = document.querySelector('.quiz-card__question');
    const optionButtons = document.querySelectorAll('.quiz-card__option');
    const progressLabel = document.querySelector('.quiz-card__progress-label');
    const progressBarValue = document.querySelector('.quiz-card__progress-value');
    const progressBar = document.querySelector('.quiz-card__progress-bar');
    const backButton = document.querySelector('.quiz-card__nav-button--back');
    const nextButton = document.querySelector('.quiz-card__nav-button--next');
    const quizCard = document.querySelector('.quiz-card'); // Para a tela final

    // --- 4. Funções Principais ---

    /**
     * Renderiza a pergunta atual na tela.
     */
    function renderQuestion() {
        // Pega a pergunta atual
        const question = questions[currentQuestionIndex];
        questionText.textContent = question;

        // Atualiza a barra de progresso
        const progressPercent = ((currentQuestionIndex + 1) / questions.length) * 100;
        progressBarValue.style.width = `${progressPercent}%`;
        progressLabel.textContent = `${currentQuestionIndex + 1}/${questions.length}`;
        progressBar.setAttribute('aria-valuenow', progressPercent);
        progressLabel.setAttribute('aria-label', `Pergunta ${currentQuestionIndex + 1} de ${questions.length}`);

        // Atualiza os botões "Sim/Não"
        updateOptionButtons();

        // Atualiza os botões de Navegação
        updateNavigationButtons();
    }

    /**
     * Atualiza o estado (selecionado ou não) dos botões "Sim/Não".
     */
    function updateOptionButtons() {
        // Pega a resposta salva para esta pergunta
        const currentAnswer = answers[currentQuestionIndex];

        optionButtons.forEach(button => {
            const buttonValue = button.dataset.value;
            if (buttonValue === currentAnswer) {
                button.classList.add('quiz-card__option--selected');
            } else {
                button.classList.remove('quiz-card__option--selected');
            }
        });
    }

    /**
     * Habilita/Desabilita os botões "Voltar" e "Avançar".
     */
    function updateNavigationButtons() {
        // Botão Voltar: desabilitado se for a primeira pergunta
        backButton.disabled = (currentQuestionIndex === 0);

        // Botão Avançar: desabilitado se nenhuma resposta foi dada AINDA
        nextButton.disabled = (answers[currentQuestionIndex] === null);
    }

    /**
     * Mostra a tela final quando o quiz acabar.
     */
    function showFinalScreen() {
        // Formata o texto das respostas
        let resultsString = "Respostas do Quiz: 💖\n";
        questions.forEach((question, index) => {
            const answer = answers[index] === 'yes' ? 'Sim' : 'Não';
            resultsString += `${index + 1}. ${question} -> ${answer}\n`;
        });

        // Atualiza o HTML do card
        quizCard.innerHTML = `
            <h2 class="quiz-card__question" style="min-height: auto;">Obrigado por responder!</h2>
            <p class="quiz-card__final-text">Espero que tenha gostado. 😊</p>
            <p class="quiz-card__final-text" style="font-weight: 600; color: var(--color-text-dark);">
                Clique no botão abaixo para copiar suas respostas e me mandar!
            </p>
            <button type="button" class="quiz-card__copy-button">
                <i class="fa-solid fa-copy"></i> Copiar respostas
            </button>
        `;

        // Adiciona o listener ao novo botão
        const copyButton = quizCard.querySelector('.quiz-card__copy-button');
        copyButton.addEventListener('click', () => {
            // Usa a API de Clipboard para copiar o texto
            navigator.clipboard.writeText(resultsString)
                .then(() => {
                    // Sucesso!
                    copyButton.innerHTML = '<i class="fa-solid fa-check"></i> Copiado! (só colar no chat)';
                    copyButton.disabled = true;
                })
                .catch(err => {
                    // Erro
                    console.error('Falha ao copiar: ', err);
                    copyButton.textContent = "Falha ao copiar";
                });
        });
    }

    // --- 5. Manipuladores de Eventos ---

    /**
     * Chamado quando "Sim" ou "Não" é clicado.
     */
    function handleOptionClick(event) {
        const selectedValue = event.currentTarget.dataset.value;

        // Salva a resposta no nosso array
        answers[currentQuestionIndex] = selectedValue;

        // Atualiza os botões "Sim/Não" para refletir a seleção
        updateOptionButtons();

        // Habilita o botão "Avançar"
        nextButton.disabled = false;
    }

    /**
     * Chamado quando "Avançar" é clicado.
     */
    function handleNextClick() {
        // Verifica se estamos na última pergunta
        if (currentQuestionIndex < questions.length - 1) {
            // Se não, avança para a próxima
            currentQuestionIndex++;
            renderQuestion();
        } else {
            // Se sim, loga as respostas (para debug) e mostra a tela final
            console.log("Respostas Finais:", answers);
            showFinalScreen();
        }
    }

    /**
     * Chamado quando "Voltar" é clicado.
     */
    function handleBackClick() {
        // Só volta se não for a primeira pergunta
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            renderQuestion();
        }
    }

    // --- 6. Inicialização ---

    // Adiciona os listeners aos botões
    optionButtons.forEach(button => {
        button.addEventListener('click', handleOptionClick);
    });

    nextButton.addEventListener('click', handleNextClick);
    backButton.addEventListener('click', handleBackClick);

    // Renderiza a primeira pergunta ao carregar a página
    renderQuestion();
});