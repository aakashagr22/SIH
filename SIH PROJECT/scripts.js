const constitutionData = {
    Legislature: {
        "Article 79": "Parliament consists of the President and two Houses - Lok Sabha and Rajya Sabha.",
        "Article 80": "Composition of the Rajya Sabha.",
        "Article 81": "Composition of the Lok Sabha."
    },
    Executive: {
        "Article 52": "There shall be a President of India.",
        "Article 53": "Executive power of the Union vested in the President.",
        "Article 74": "Council of Ministers to aid and advise President."
    },
    Judiciary: {
        "Article 124": "Establishment and constitution of Supreme Court.",
        "Article 214": "High Courts for States.",
        "Article 233": "Appointment of district judges."
    }
};


function showSection(sectionId) {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => section.style.display = 'none');
    document.getElementById(sectionId).style.display = 'block';
}

function spinWheel() {
    const organ = document.getElementById('organSelect').value;
    const articles = Object.keys(constitutionData[organ]);
    const randomArticle = articles[Math.floor(Math.random() * articles.length)];
    document.getElementById('wheelResult').textContent = `The wheel landed on: ${randomArticle} - ${constitutionData[organ][randomArticle]}`;
}


function drawCard() {
    const allArticles = Object.entries(constitutionData).flatMap(([organ, articles]) => 
        Object.entries(articles).map(([article, explanation]) => ({organ, article, explanation}))
    );
    const randomCard = allArticles[Math.floor(Math.random() * allArticles.length)];
    document.getElementById('cardResult').textContent = `You drew: ${randomCard.article} (${randomCard.organ}) - ${randomCard.explanation}`;
}


let quizScore = 0;
let currentQuestion = {};

function generateQuizQuestion() {
    const allQuestions = Object.entries(constitutionData).flatMap(([organ, articles]) => 
        Object.entries(articles).map(([article, explanation]) => ({
            question: `Which article of the Constitution deals with: ${explanation}`,
            correctAnswer: article
        }))
    );
    return allQuestions[Math.floor(Math.random() * allQuestions.length)];
}

function loadQuiz() {
    currentQuestion = generateQuizQuestion();
    document.getElementById('quizQuestion').textContent = currentQuestion.question;
}

function submitQuizAnswer() {
    const userAnswer = document.getElementById('quizAnswer').value.trim();
    const feedbackElement = document.getElementById('quizFeedback');
    if (userAnswer.toLowerCase() === currentQuestion.correctAnswer.toLowerCase()) {
        feedbackElement.textContent = "Correct!";
        quizScore++;
    } else {
        feedbackElement.textContent = `Incorrect. The correct answer is ${currentQuestion.correctAnswer}`;
    }
    document.getElementById('quizScore').textContent = quizScore;
    loadQuiz();
}


loadQuiz();

const wheel = document.getElementById("wheel");
const spinBtn = document.getElementById("spin-btn");
const finalValue = document.getElementById("final-value");


const articleNumbers = Array.from({ length: 40 }, (_, i) => i + 1);

const pieColors = Array(articleNumbers.length).fill().map((_, i) => (i % 2 === 0 ? "#8b35bc" : "#b163da"));

let myChart = new Chart(wheel, {
  plugins: [ChartDataLabels],
  type: "pie",
  data: {
    labels: articleNumbers,
    datasets: [
      {
        backgroundColor: pieColors,
        data: Array(articleNumbers.length).fill(1), 
      },
    ],
  },
  options: {
    responsive: true,
    animation: { duration: 0 },
    plugins: {
      tooltip: false,
      legend: { display: false },
      datalabels: {
        color: "#ffffff",
        formatter: (_, context) => context.chart.data.labels[context.dataIndex],
        font: { size: 10 }, 
      },
    },
  },
});

const valueGenerator = (angleValue) => {
  const sliceAngle = 360 / articleNumbers.length;
  const selectedIndex = Math.floor(angleValue / sliceAngle);
  finalValue.innerHTML = `<p>Article Number: ${articleNumbers[selectedIndex]}</p>`;
  spinBtn.disabled = false;
};

spinBtn.addEventListener("click", () => {
  spinBtn.disabled = true;
  finalValue.innerHTML = `<p>Good Luck!</p>`;
  let randomDegree = Math.floor(Math.random() * 360);
  let count = 0;
  let resultValue = 101;

  const rotationInterval = setInterval(() => {
    myChart.options.rotation += resultValue;
    myChart.update();

    if (myChart.options.rotation >= 360) {
      count += 1;
      resultValue -= 5;
      myChart.options.rotation = 0;
    } else if (count > 15 && myChart.options.rotation === randomDegree) {
      valueGenerator(randomDegree);
      clearInterval(rotationInterval);
      count = 0;
      resultValue = 101;
    }
  }, 10);
});



