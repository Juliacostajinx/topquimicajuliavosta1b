document.addEventListener('DOMContentLoaded', () => {

    // --- Pop-up de Boas-Vindas ---
    const welcomePopup = document.getElementById('welcome-popup');
    const welcomeButton = document.getElementById('welcome-button');

    // Mostra o pop-up ao carregar a página
    welcomePopup.classList.add('active');

    welcomeButton.addEventListener('click', () => {
        welcomePopup.classList.remove('active');
        // Opcional: remover o elemento do DOM após a animação
        welcomePopup.addEventListener('transitionend', () => {
            welcomePopup.remove();
        }, { once: true });
    });

    // --- Menu Retrátil Pop-up ---
    const menuToggleButton = document.getElementById('menu-toggle-button');
    const menuPopup = document.getElementById('menu-popup');
    const closeMenuButton = document.getElementById('close-menu-button');
    const menuLinks = document.querySelectorAll('#menu-popup nav ul li a');

    menuToggleButton.addEventListener('click', () => {
        menuPopup.classList.toggle('active');
    });

    closeMenuButton.addEventListener('click', () => {
        menuPopup.classList.remove('active');
    });

    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // Impede o comportamento padrão do link
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                menuPopup.classList.remove('active'); // Fecha o menu ao clicar
                setTimeout(() => { // Pequeno atraso para a transição do menu
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }, 400); // Deve ser maior que a duração da transição do menu
            }
        });
    });

    // --- Efeito de Partículas ao Toque/Clique ---
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    const particleColors = ['#ff004c', '#00ffff', '#a020f0', '#00ff00', '#ffcc00'];

    // Ajusta o canvas ao tamanho da janela
    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 5 + 1;
            this.speedX = Math.random() * 3 - 1.5;
            this.speedY = Math.random() * 3 - 1.5;
            this.color = particleColors[Math.floor(Math.random() * particleColors.length)];
            this.opacity = 1;
            this.life = 100; // Vida útil da partícula
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.opacity -= 0.01;
            this.life--;
            if (this.size > 0.2) this.size -= 0.1; // Diminui o tamanho
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.opacity;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }

    const createParticles = (x, y, count) => {
        for (let i = 0; i < count; i++) {
            particles.push(new Particle(x, y));
        }
    };

    const animateParticles = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            if (particles[i].opacity <= 0 || particles[i].life <= 0 || particles[i].size <= 0.2) {
                particles.splice(i, 1);
                i--;
            }
        }
        requestAnimationFrame(animateParticles);
    };

    animateParticles();

    // Evento de toque/clique para criar partículas
    document.body.addEventListener('click', (e) => {
        createParticles(e.clientX, e.clientY, 15); // 15 partículas por clique
    });
    document.body.addEventListener('touchstart', (e) => {
        for (let i = 0; i < e.touches.length; i++) {
            createParticles(e.touches[i].clientX, e.touches[i].clientY, 15);
        }
    });

    // --- Patinho Andando ---
    const duck = document.getElementById('duck');
    let duckX = 0;
    let duckY = 0;
    let duckDirectionX = 1; // 1 para direita, -1 para esquerda
    let duckDirectionY = 1; // 1 para baixo, -1 para cima
    const duckSpeed = 0.9; // Velocidade do patinho em px por frame
    const duckSize = 80; // Largura/altura do patinho

    const moveDuck = () => {
        // Movimento horizontal
        duckX += duckDirectionX * duckSpeed;
        if (duckX + duckSize > window.innerWidth || duckX < 0) {
            duckDirectionX *= -1; // Inverte a direção horizontal
            duckX = Math.max(0, Math.min(window.innerWidth - duckSize, duckX)); // Corrige posição
            duck.style.transform = `scaleX(${duckDirectionX})`; // Vira o patinho
        }

        // Movimento vertical (mais aleatório ou ligado ao scroll, por exemplo)
        // Por simplicidade, vamos fazer ele flutuar verticalmente um pouco aleatoriamente
        duckY += duckDirectionY * (Math.random() * 2 - 1); // Pequenas flutuações
        if (duckY + duckSize > window.innerHeight || duckY < 0) {
            duckDirectionY *= -1;
            duckY = Math.max(0, Math.min(window.innerHeight - duckSize, duckY));
        }


        // Mantém o patinho dentro da tela
        duckX = Math.max(0, Math.min(window.innerWidth - duckSize, duckX));
        duckY = Math.max(0, Math.min(window.innerHeight - duckSize, duckY));


        duck.style.left = `${duckX}px`;
        duck.style.top = `${duckY}px`;

        requestAnimationFrame(moveDuck);
    };

    // Posição inicial aleatória do patinho
    duckX = Math.random() * (window.innerWidth - duckSize);
    duckY = Math.random() * (window.innerHeight - duckSize);
    moveDuck();


    // --- Tabela Periódica Interativa ---
    const elements = document.querySelectorAll('.periodic-table-grid .element');
    const elementPopup = document.getElementById('element-popup');
    const closeElementPopup = document.getElementById('close-element-popup');
    const elementName = document.getElementById('element-name');
    const elementSymbol = document.getElementById('element-symbol');
    const elementNumber = document.getElementById('element-number');
    const elementImage = document.getElementById('element-image');

    elements.forEach(element => {
        element.addEventListener('click', () => {
            elementName.textContent = element.dataset.name;
            elementSymbol.textContent = element.dataset.symbol;
            elementNumber.textContent = element.dataset.number;
            elementImage.src = element.dataset.image;
            elementPopup.classList.add('active');
        });
    });

    closeElementPopup.addEventListener('click', () => {
        elementPopup.classList.remove('active');
    });

    // Fechar pop-up do elemento ao clicar fora
    elementPopup.addEventListener('click', (e) => {
        if (e.target === elementPopup) {
            elementPopup.classList.remove('active');
        }
    });


    // --- Quiz da Química ---
    const quizQuestion = document.getElementById('quiz-question');
    const quizOptions = document.getElementById('quiz-options');
    const quizNextButton = document.getElementById('quiz-next-button');
    const quizSkipButton = document.getElementById('quiz-skip-button');
    const quizHelpButton = document.getElementById('quiz-help-button');
    const helpCountSpan = document.getElementById('help-count');
    const currentScoreSpan = document.getElementById('current-score');
    const feedbackResult = document.getElementById('quiz-result-feedback');
    const feedbackImage = document.getElementById('feedback-image');
    const feedbackSound = document.getElementById('feedback-sound');

    let currentQuestionIndex = 0;
    let score = 0;
    let helpUses = 3;
    let quizQuestions; // Será carregado com as perguntas
    let answeredQuestions = new Set(); // Para evitar perguntas repetidas em um quiz
    let currentOptions = []; // Para armazenar as opções da pergunta atual

    // Arrays de imagens e sons para feedback
    const happyImages = [
        'acertou1.gif',
        'acertou2.gif',
        'acertou3.gif','acertou4.gif',
        'acertou5.gif',
        'acertou6.gif', 'acertou7.gif',
        'acertou8.gif',
        // Adicione mais URLs de imagens felizes
    ];
    const sadImages = [
        'errou1.gif',
        'errou2.gif',
        'errou3.gif','errou4.gif',
        'errou5.gif',
        'errou6.gif','errou7.gif',
        'errou8.gif',
        
        // Adicione mais URLs de imagens tristes
    ];
    const happySounds = [
        'fsom1.mp3',  // Exemplo: som feliz
        'fsom2.mp3','fsom3.mp3',  // Exemplo: som feliz
        'fsom4.mp3','fsom5.mp3',  // Exemplo: som feliz
        'fsom6.mp3','fsom7.mp3',  // Exemplo: som feliz
        'fsom8.mp3',
        // Adicbione mais URLs de sons felizes
    ];
    const sadSounds = [
        'tsom1.mp3', // Exemplo: som triste
        'tsom2.mp3', 'tsom4.mp3', // Exemplo: som triste
        'tsom3.mp3','tsom5.mp3', // Exemplo: som triste
        'tsom6.mp3', 'tsom7.mp3', // Exemplo: som triste
        'tsom8.mp3',
        // Adicione mais URLs de sons tristes
    ];

    // Função para buscar perguntas (simulando uma API ou arquivo JSON)
    const loadQuizQuestions = async () => {
        // Em um cenário real, você buscaria de um JSON. Aqui, está hardcoded.
        quizQuestions = [
            {
                question: "Qual o símbolo químico da água?",
                options: ["$H_2O$", "CO2", "NaCl", "CH4"],
                answer: "$H_2O$"
            },
            {
                question: "Qual elemento é essencial para a vida e base da química orgânica?",
                options: ["Oxigênio", "Hidrogênio", "Carbono", "Nitrogênio"],
                answer: "Carbono"
            },
            {
                question: "O que é um próton?",
                options: ["Partícula com carga negativa", "Partícula sem carga", "Partícula com carga positiva", "Um tipo de elétron"],
                answer: "Partícula com carga positiva"
            },
            {
                question: "Qual o pH de uma solução neutra?",
                options: ["0", "7", "14", "Depende da temperatura"],
                answer: "7"
            },
            {
                question: "Qual o nome da ligação química onde há compartilhamento de elétrons?",
                options: ["Iônica", "Metálica", "Covalente", "De hidrogênio"],
                answer: "Covalente"
            },
            {
                question: "Qual gás é liberado durante a fotossíntese?",
                options: ["Dióxido de Carbono", "Oxigênio", "Nitrogênio", "Metano"],
                answer: "Oxigênio"
            },
            {
                question: "Qual é o número atômico do Oxigênio (O)?",
                options: ["6", "7", "8", "9"],
                answer: "8"
            },
            {
                question: "Substância formada pela reação de um ácido e uma base:",
                options: ["Óxido", "Sal", "Polímero", "Álcool"],
                answer: "Sal"
            },
            {
                question: "Qual a fórmula química do Gás Carbônico?",
                options: ["$H_2O$", "$O_2$", "$CO_2$", "$N_2$"],
                answer: "$CO_2$"
            },
            {
                question: "Qual a função do catalisador em uma reação química?",
                options: ["Diminuir a temperatura", "Aumentar a pressão", "Acelerar a reação", "Desacelerar a reação"],
                answer: "Acelerar a reação"
            },
            {
                question: "Qual desses é um metal alcalino?",
                options: ["Cálcio", "Sódio", "Ferro", "Alumínio"],
                answer: "Sódio"
            },
            {
                question: "O que significa 'mol' na química?",
                options: ["Uma medida de volume", "Uma unidade de massa", "Uma quantidade de substância", "Uma unidade de temperatura"],
                answer: "Uma quantidade de substância"
            },
            {
                question: "Qual o processo de transformação de líquido para gás?",
                options: ["Condensação", "Fusão", "Solidificação", "Vaporização"],
                answer: "Vaporização"
            },
            {
                question: "Elemento químico com símbolo Fe:",
                options: ["Flúor", "Ferro", "Fósforo", "Frâncio"],
                answer: "Ferro"
            },
            {
                question: "Qual a propriedade que distingue um ácido de uma base?",
                options: ["Cor", "Cheiro", "pH", "Densidade"],
                answer: "pH"
            },
            {
                question: "Qual tipo de reação ocorre quando dois ou mais reagentes formam um único produto?",
                options: ["Decomposição", "Síntese", "Simples Troca", "Dupla Troca"],
                answer: "Síntese"
            },
            {
                question: "O que são polímeros?",
                options: ["Pequenas moléculas", "Moléculas inorgânicas", "Macromoléculas formadas por monômeros", "Substâncias simples"],
                answer: "Macromoléculas formadas por monômeros"
            },
            {
                question: "Qual a camada mais externa do átomo?",
                options: ["Núcleo", "Prótons", "Elétrons de valência", "Nêutrons"],
                answer: "Elétrons de valência"
            },
            {
                question: "O que é um isótopo?",
                options: ["Átomos com o mesmo número de nêutrons", "Átomos com o mesmo número de prótons e nêutrons", "Átomos do mesmo elemento com diferentes números de nêutrons", "Átomos de diferentes elementos"],
                answer: "Átomos do mesmo elemento com diferentes números de nêutrons"
            },
            {
                question: "Qual a principal aplicação da química na medicina?",
                options: ["Construção civil", "Desenvolvimento de medicamentos", "Previsão do tempo", "Pesquisa de estrelas"],
                answer: "Desenvolvimento de medicamentos"
            },
            {
                question: "Qual o tipo de ligação presente no diamante?",
                options: ["Iônica", "Metálica", "Covalente", "Dátiva"],
                answer: "Covalente"
            },
            {
                question: "Qual o nome do fenômeno que a água ferve a 100°C ao nível do mar?",
                options: ["Solidificação", "Condensação", "Vaporização", "Ebulição"],
                answer: "Ebulição"
            },
            {
                question: "Qual o estado da matéria que tem forma e volume definidos?",
                options: ["Gasoso", "Líquido", "Sólido", "Plasma"],
                answer: "Sólido"
            },
            {
                question: "O que é uma solução na química?",
                options: ["Uma mistura heterogênea", "Uma mistura homogênea de duas ou mais substâncias", "Um composto puro", "Um elemento químico"],
                answer: "Uma mistura homogênea de duas ou mais substâncias"
            },
            {
                question: "Qual o principal componente do ar que respiramos?",
                options: ["Oxigênio", "Dióxido de Carbono", "Nitrogênio", "Argônio"],
                answer: "Nitrogênio"
            },
            {
                question: "Qual o ácido presente no suco de limão?",
                options: ["Ácido sulfúrico", "Ácido nítrico", "Ácido clorídrico", "Ácido cítrico"],
                answer: "Ácido cítrico"
            },
            {
                question: "O que é um eletrólito?",
                options: ["Substância que não conduz eletricidade", "Substância que conduz eletricidade quando dissolvida ou fundida", "Um metal", "Um isolante"],
                answer: "Substância que conduz eletricidade quando dissolvida ou fundida"
            },
            {
                question: "Qual o nome do aparelho usado para medir pH?",
                options: ["Termômetro", "Balança", "pHmetro", "Densímetro"],
                answer: "pHmetro"
            },
            {
                question: "Qual o símbolo químico do ouro?",
                options: ["Ag", "Au", "Fe", "Cu"],
                answer: "Au"
            },
            {
                question: "O que são óxidos?",
                options: ["Compostos formados por hidrogênio e oxigênio", "Compostos formados por oxigênio e outro elemento", "Compostos orgânicos", "Sais inorgânicos"],
                answer: "Compostos formados por oxigênio e outro elemento"
            },
            {
                question: "Qual a lei que diz que a massa não é criada nem destruída em uma reação química?",
                options: ["Lei de Lavoisier", "Lei de Proust", "Lei de Dalton", "Lei de Boyle"],
                answer: "Lei de Lavoisier"
            },
            {
                question: "Qual o elemento mais abundante na crosta terrestre?",
                options: ["Ferro", "Alumínio", "Silício", "Oxigênio"],
                answer: "Oxigênio"
            },
            {
                question: "Qual o tipo de ligação que forma o sal de cozinha (NaCl)?",
                options: ["Covalente", "Metálica", "Iônica", "De hidrogênio"],
                answer: "Iônica"
            },
            {
                question: "O que é uma reação de combustão?",
                options: ["Reação que absorve calor", "Reação que libera oxigênio", "Reação com oxigênio que libera calor e luz", "Reação de decomposição"],
                answer: "Reação com oxigênio que libera calor e luz"
            },
            {
                question: "Qual o nome da transformação de gás para líquido?",
                options: ["Vaporização", "Fusão", "Condensação", "Solidificação"],
                answer: "Condensação"
            },
            {
                question: "Qual o nome do modelo atômico que se assemelha a um 'pudim de passas'?",
                options: ["Modelo de Rutherford", "Modelo de Bohr", "Modelo de Thomson", "Modelo de Dalton"],
                answer: "Modelo de Thomson"
            },
            {
                question: "Qual a função dos anticorpos no corpo humano?",
                options: ["Transportar oxigênio", "Combater infecções", "Produzir energia", "Digerir alimentos"],
                answer: "Combater infecções"
            },
            {
                question: "Qual o principal gás responsável pelo efeito estufa?",
                options: ["Oxigênio", "Nitrogênio", "Dióxido de Carbono", "Metano"],
                answer: "Dióxido de Carbono"
            },
            {
                question: "O que é um catalisador biológico?",
                options: ["Um tipo de enzima", "Um mineral", "Uma vitamina", "Um hormônio"],
                answer: "Um tipo de enzima"
            },
            {
                question: "Qual o estado da matéria que não tem forma nem volume definidos?",
                options: ["Sólido", "Líquido", "Gasoso", "Plasma"],
                answer: "Gasoso"
            },
            {
                question: "Qual o processo de separação de misturas baseado em diferentes pontos de ebulição?",
                options: ["Filtração", "Decantação", "Destilação", "Centrifugação"],
                answer: "Destilação"
            },
            {
                question: "Qual o elemento químico presente em todos os compostos orgânicos?",
                options: ["Nitrogênio", "Oxigênio", "Hidrogênio", "Carbono"],
                answer: "Carbono"
            },
            {
                question: "Qual o nome da força de atração entre moléculas de água?",
                options: ["Ligação covalente", "Ligação iônica", "Ponte de hidrogênio", "Força de Van der Waals"],
                answer: "Ponte de hidrogênio"
            },
            {
                question: "O que é um pH menor que 7?",
                options: ["Básico", "Neutro", "Ácido", "Alcalino"],
                answer: "Ácido"
            },
            {
                question: "Qual o elemento químico que forma a camada de ozônio?",
                options: ["Oxigênio", "Nitrogênio", "Carbono", "Hidrogênio"],
                answer: "Oxigênio"
            },
            {
                question: "Qual o nome do processo de transformação de sólido para líquido?",
                options: ["Vaporização", "Condensação", "Solidificação", "Fusão"],
                answer: "Fusão"
            },
            {
                question: "Qual o nome da menor partícula de um elemento químico?",
                options: ["Molécula", "Composto", "Átomo", "Íon"],
                answer: "Átomo"
            },
            {
                question: "Qual o símbolo químico do sódio?",
                options: ["S", "Na", "So", "Nd"],
                answer: "Na"
            },
            {
                question: "Qual o nome do processo de decomposição da água por corrente elétrica?",
                options: ["Hidrólise", "Eletrólise", "Oxidação", "Redução"],
                answer: "Eletrólise"
            },
            {
                question: "Qual o principal gás da atmosfera terrestre que é inerte?",
                options: ["Oxigênio", "Dióxido de Carbono", "Argônio", "Nitrogênio"],
                answer: "Nitrogênio"
            },
            {
                question: "Qual o ácido presente no estômago humano?",
                options: ["Ácido sulfúrico", "Ácido cítrico", "Ácido clorídrico", "Ácido nítrico"],
                answer: "Ácido clorídrico"
            },
            {
                question: "Qual o nome do processo de formação de chuva ácida?",
                options: ["Fotossíntese", "Precipitação", "Ciclo do carbono", "Emissão de óxidos de enxofre e nitrogênio"],
                answer: "Emissão de óxidos de enxofre e nitrogênio"
            },
            {
                question: "O que é um radical livre na química?",
                options: ["Uma molécula estável", "Um átomo ou molécula com elétrons desemparelhados", "Um íon", "Um composto orgânico"],
                answer: "Um átomo ou molécula com elétrons desemparelhados"
            },
            {
                question: "Qual o elemento mais abundante no corpo humano?",
                options: ["Carbono", "Hidrogênio", "Oxigênio", "Nitrogênio"],
                answer: "Oxigênio"
            },
            {
                question: "O que é um pH maior que 7?",
                options: ["Ácido", "Neutro", "Básico", "Alcalino"],
                answer: "Básico"
            },
            {
                question: "Qual o metal mais leve?",
                options: ["Ferro", "Alumínio", "Lítio", "Sódio"],
                answer: "Lítio"
            },
            {
                question: "Qual o nome da força que mantém os prótons e nêutrons juntos no núcleo?",
                options: ["Força eletromagnética", "Força gravitacional", "Força nuclear forte", "Força nuclear fraca"],
                answer: "Força nuclear forte"
            },
            {
                question: "O que é a densidade?",
                options: ["Massa por unidade de volume", "Volume por unidade de massa", "Temperatura por unidade de pressão", "Massa total de um objeto"],
                answer: "Massa por unidade de volume"
            },
            {
                question: "Qual o gás usado para encher balões que flutuam?",
                options: ["Oxigênio", "Nitrogênio", "Dióxido de Carbono", "Hélio"],
                answer: "Hélio"
            },
            {
                question: "Qual o nome do processo onde o sólido passa diretamente para o estado gasoso?",
                options: ["Fusão", "Sublimação", "Vaporização", "Condensação"],
                answer: "Sublimação"
            },
            {
                question: "Qual o metal líquido à temperatura ambiente?",
                options: ["Ferro", "Chumbo", "Mercúrio", "Alumínio"],
                answer: "Mercúrio"
            },
            {
                question: "O que é um átomo neutro?",
                options: ["Tem mais prótons que elétrons", "Tem mais elétrons que prótons", "Tem número igual de prótons e elétrons", "Não tem nêutrons"],
                answer: "Tem número igual de prótons e elétrons"
            },
            {
                question: "Qual o nome do processo de produção de amônia ($NH_3$) industrialmente?",
                options: ["Processo Haber-Bosch", "Processo Ostwald", "Processo Solvay", "Processo de Contacto"],
                answer: "Processo Haber-Bosch"
            },
            {
                question: "Qual o composto principal do mármore?",
                options: ["Cloreto de Sódio", "Carbonato de Cálcio", "Dióxido de Silício", "Óxido de Ferro"],
                answer: "Carbonato de Cálcio"
            },
            {
                question: "O que é alotropia?",
                options: ["Fenômeno de um elemento existir em mais de um estado físico", "Fenômeno de um elemento existir em mais de uma forma alotrópica", "Mistura de elementos", "Formação de compostos"],
                answer: "Fenômeno de um elemento existir em mais de uma forma alotrópica"
            },
            {
                question: "Qual o nome do aparelho que transforma energia química em energia elétrica?",
                options: ["Motor", "Gerador", "Bateria", "Aquecedor"],
                answer: "Bateria"
            },
            {
                question: "Qual o principal componente da gasolina?",
                options: ["Metano", "Etanol", "Octano", "Butano"],
                answer: "Octano"
            },
            {
                question: "O que é a camada de valência?",
                options: ["A camada mais interna de elétrons", "A camada mais externa de elétrons", "O núcleo do átomo", "Uma ligação química"],
                answer: "A camada mais externa de elétrons"
            },
            {
                question: "Qual o nome da reação de uma substância com a água?",
                options: ["Oxidação", "Redução", "Hidrólise", "Combustão"],
                answer: "Hidrólise"
            },
            {
                question: "Qual o símbolo químico do cálcio?",
                options: ["Cl", "Ca", "Co", "Cr"],
                answer: "Ca"
            },
            {
                question: "O que é um radical livre?",
                options: ["Um átomo com excesso de prótons", "Um átomo com elétrons desemparelhados", "Uma molécula estável", "Um composto inorgânico"],
                answer: "Um átomo com elétrons desemparelhados"
            },
            {
                question: "Qual o nome do processo de purificação da água usando calor e condensação?",
                options: ["Filtração", "Decantação", "Destilação", "Cloração"],
                answer: "Destilação"
            },
            {
                question: "Qual o metal mais abundante na crosta terrestre?",
                options: ["Ferro", "Cobre", "Alumínio", "Ouro"],
                answer: "Alumínio"
            },
            {
                question: "Qual o nome do composto que dá a cor verde às plantas?",
                options: ["Hemoglobina", "Melanina", "Clorofila", "Caroteno"],
                answer: "Clorofila"
            },
            {
                question: "O que é a eletroquímica?",
                options: ["Estudo do movimento dos elétrons", "Estudo das reações químicas que envolvem eletricidade", "Estudo da luz e química", "Estudo do calor e química"],
                answer: "Estudo das reações químicas que envolvem eletricidade"
            },
            {
                question: "Qual o nome da quebra de uma molécula pela luz?",
                options: ["Fotólise", "Hidrólise", "Termólise", "Eletrólise"],
                answer: "Fotólise"
            },
            {
                question: "Qual o símbolo químico da prata?",
                options: ["Au", "Ag", "Pt", "Cu"],
                answer: "Ag"
            },
            {
                question: "Qual o nome do processo de quebra de polímeros em monômeros?",
                options: ["Polimerização", "Condensação", "Hidrólise", "Despolimerização"],
                answer: "Despolimerização"
            },
            {
                question: "O que é a camada de ozônio?",
                options: ["Uma camada de $CO_2$ na atmosfera", "Uma camada de $O_3$ na estratosfera", "Uma camada de $O_2$ na troposfera", "Uma camada de água na atmosfera"],
                answer: "Uma camada de $O_3$ na estratosfera"
            },
            {
                question: "Qual o nome da reação de um metal com oxigênio para formar um óxido?",
                options: ["Redução", "Oxidação", "Neutralização", "Substituição"],
                answer: "Oxidação"
            },
            {
                question: "Qual o principal gás usado em extintores de incêndio?",
                options: ["Oxigênio", "Nitrogênio", "Dióxido de Carbono", "Hélio"],
                answer: "Dióxido de Carbono"
            },
            {
                question: "Qual o nome da ciência que estuda a composição, estrutura e propriedades da matéria?",
                options: ["Física", "Biologia", "Química", "Astronomia"],
                answer: "Química"
            },
            {
                question: "Qual o elemento químico que é um gás nobre e tem número atômico 10?",
                options: ["Argônio", "Hélio", "Neônio", "Criptônio"],
                answer: "Neônio"
            },
            {
                question: "O que é um catalisador?",
                options: ["Substância que aumenta a energia de ativação", "Substância que diminui a velocidade da reação", "Substância que aumenta a velocidade da reação sem ser consumida", "Substância que é um reagente na reação"],
                answer: "Substância que aumenta a velocidade da reação sem ser consumida"
            },
            {
                question: "Qual o nome do processo que transforma gás em líquido?",
                options: ["Sublimação", "Vaporização", "Condensação", "Fusão"],
                answer: "Condensação"
            },
            {
                question: "Qual o tipo de ligação presente na molécula de $O_2$?",
                options: ["Iônica", "Metálica", "Covalente", "Ponte de hidrogênio"],
                answer: "Covalente"
            },
            {
                question: "O que é a radioatividade?",
                options: ["Emissão de luz por substâncias", "Emissão de partículas ou radiação por núcleos atômicos instáveis", "Absorção de calor por substâncias", "Processo de dissolução"],
                answer: "Emissão de partículas ou radiação por núcleos atômicos instáveis"
            },
            {
                question: "Qual o elemento químico com símbolo K?",
                options: ["Criptônio", "Potássio", "Carbono", "Cálcio"],
                answer: "Potássio"
            },
            {
                question: "O que é uma reação endotérmica?",
                options: ["Reação que libera calor", "Reação que absorve calor", "Reação que libera luz", "Reação que não envolve calor"],
                answer: "Reação que absorve calor"
            },
            {
                question: "Qual o nome do processo de separação de componentes de uma mistura heterogênea por diferença de densidade?",
                options: ["Filtração", "Destilação", "Decantação", "Evaporação"],
                answer: "Decantação"
            },
            {
                question: "Qual o elemento químico mais abundante no universo?",
                options: ["Oxigênio", "Carbono", "Hélio", "Hidrogênio"],
                answer: "Hidrogênio"
            },
            {
                question: "O que é um pHmetro?",
                options: ["Instrumento para medir temperatura", "Instrumento para medir massa", "Instrumento para medir pH", "Instrumento para medir volume"],
                answer: "Instrumento para medir pH"
            },
            {
                question: "Qual o nome do processo de transformação de líquido para sólido?",
                options: ["Fusão", "Vaporização", "Solidificação", "Condensação"],
                answer: "Solidificação"
            },
            {
                question: "Qual o ácido que se encontra no vinagre?",
                options: ["Ácido sulfúrico", "Ácido nítrico", "Ácido acético", "Ácido clorídrico"],
                answer: "Ácido acético"
            },
            {
                question: "Qual o nome da força que mantém os átomos unidos em uma molécula?",
                options: ["Força gravitacional", "Ligação química", "Força magnética", "Força elétrica"],
                answer: "Ligação química"
            },
            {
                question: "Qual o símbolo químico do flúor?",
                options: ["F", "Fl", "Fe", "Fr"],
                answer: "F"
            },
            {
                question: "O que é uma substância pura?",
                options: ["Uma mistura de dois elementos", "Um composto que não pode ser separado", "Uma substância com composição e propriedades fixas", "Uma solução"],
                answer: "Uma substância com composição e propriedades fixas"
            },
            {
                question: "Qual o nome do processo que a água em estado gasoso vira gelo diretamente?",
                options: ["Sublimação", "Re-sublimação (ou deposição)", "Condensação", "Congelamento"],
                answer: "Re-sublimação (ou deposição)"
            },
            {
                question: "Qual o símbolo químico do boro?",
                options: ["Bo", "Br", "B", "Ba"],
                answer: "B"
            },
            {
                question: "O que é a quiralidade na química?",
                options: ["Propriedade de uma molécula ser simétrica", "Propriedade de uma molécula ser assimétrica e não sobreponível à sua imagem especular", "Capacidade de conduzir eletricidade", "Capacidade de dissolver outras substâncias"],
                answer: "Propriedade de uma molécula ser assimétrica e não sobreponível à sua imagem especular"
            },
            {
                question: "Qual o nome da reação onde um elemento mais reativo desloca outro menos reativo de um composto?",
                options: ["Síntese", "Decomposição", "Simples Troca", "Dupla Troca"],
                answer: "Simples Troca"
            },
            {
                question: "Qual o principal componente da celulose?",
                options: ["Glicose", "Amido", "Proteína", "Lipídio"],
                answer: "Glicose"
            },
            {
                question: "O que é um solvente universal?",
                options: ["Ácido", "Água", "Óleo", "Álcool"],
                answer: "Água"
            }
            // Adicione mais perguntas aqui para chegar a mais de 50
        ];
        // Embaralha as perguntas
        quizQuestions = quizQuestions.sort(() => Math.random() - 0.5);
    };


    const displayQuestion = () => {
        if (currentQuestionIndex >= quizQuestions.length) {
            endQuiz();
            return;
        }

        const questionData = quizQuestions[currentQuestionIndex];
        quizQuestion.textContent = questionData.question;
        quizOptions.innerHTML = ''; // Limpa as opções anteriores
        currentOptions = [...questionData.options]; // Copia as opções para manipulação

        // Embaralha as opções para que a resposta não esteja sempre na mesma posição
        currentOptions.sort(() => Math.random() - 0.5);

        currentOptions.forEach(option => {
            const optionDiv = document.createElement('div');
            optionDiv.classList.add('quiz-option');
            optionDiv.textContent = option;
            optionDiv.addEventListener('click', () => selectOption(optionDiv, option, questionData.answer));
            quizOptions.appendChild(optionDiv);
        });

        // Habilita/desabilita botão de ajuda
        quizHelpButton.disabled = helpUses === 0;
        quizHelpButton.classList.toggle('disabled', helpUses === 0);
        helpCountSpan.textContent = helpUses;

        // Reinicia o estado dos botões de controle
        quizNextButton.disabled = true; // Desabilita até uma resposta ser selecionada
        quizSkipButton.disabled = false;
    };

    const selectOption = (selectedOptionDiv, selectedAnswer, correctAnswer) => {
        // Desabilita todas as opções após uma seleção
        Array.from(quizOptions.children).forEach(option => {
            option.classList.add('disabled');
            option.style.pointerEvents = 'none';
        });

        quizNextButton.disabled = false; // Habilita o botão "Próxima Pergunta"

        if (selectedAnswer === correctAnswer) {
            score += Math.round(100 / quizQuestions.length); // Pontuação proporcional
            if (score > 100) score = 100; // Garante que a nota não passe de 100
            currentScoreSpan.textContent = score;
            selectedOptionDiv.classList.add('correct');
            showFeedback(true);
        } else {
            selectedOptionDiv.classList.add('wrong');
            // Encontrar e marcar a resposta correta
            Array.from(quizOptions.children).forEach(option => {
                if (option.textContent === correctAnswer) {
                    option.classList.add('correct');
                }
            });
            showFeedback(false);
        }
    };

    const showFeedback = (isCorrect) => {
        const images = isCorrect ? happyImages : sadImages;
        const sounds = isCorrect ? happySounds : sadSounds;

        feedbackImage.src = images[Math.floor(Math.random() * images.length)];
        feedbackSound.src = sounds[Math.floor(Math.random() * sounds.length)];

        feedbackResult.classList.add('active');
        feedbackSound.play();

        // Esconde o feedback após alguns segundos
        setTimeout(() => {
            feedbackResult.classList.remove('active');
            feedbackSound.pause();
            feedbackSound.currentTime = 0; // Reseta o som
        }, 4000); // 2 segundos
    };

    const nextQuestion = () => {
        currentQuestionIndex++;
        displayQuestion();
    };

    const skipQuestion = () => {
        score -= Math.round(100 / quizQuestions.length / 2); // Penalidade por pular
        if (score < 0) score = 0;
        currentScoreSpan.textContent = score;
        nextQuestion();
    };

    const useHelp = () => {
        if (helpUses > 0) {
            helpUses--;
            helpCountSpan.textContent = helpUses;
            quizHelpButton.classList.toggle('disabled', helpUses === 0);

            let wrongOptions = Array.from(quizOptions.children).filter(option =>
                option.textContent !== quizQuestions[currentQuestionIndex].answer &&
                !option.classList.contains('disabled') // Apenas opções não desabilitadas
            );

            // Se houver mais de 2 opções erradas, remova 2
            if (wrongOptions.length > 2) {
                // Remove duas opções erradas aleatoriamente
                for (let i = 0; i < 2; i++) {
                    const randomIndex = Math.floor(Math.random() * wrongOptions.length);
                    wrongOptions[randomIndex].classList.add('disabled');
                    wrongOptions[randomIndex].style.pointerEvents = 'none';
                    wrongOptions.splice(randomIndex, 1); // Remove do array temporário para não selecionar novamente
                }
            } else if (wrongOptions.length > 0) { // Se houver 1 ou 2 opções erradas, remove todas
                 wrongOptions.forEach(option => {
                    option.classList.add('disabled');
                    option.style.pointerEvents = 'none';
                });
            }
        }
    };

    const endQuiz = () => {
        quizQuestion.textContent = `Quiz Finalizado! Sua pontuação final foi: ${score} / 100`;
        quizOptions.innerHTML = '';
        quizControls.innerHTML = ''; // Remove os botões
    };

    quizNextButton.addEventListener('click', nextQuestion);
    quizSkipButton.addEventListener('click', skipQuestion);
    quizHelpButton.addEventListener('click', useHelp);

    // Inicia o quiz
    loadQuizQuestions().then(() => {
        displayQuestion();
    });
});

