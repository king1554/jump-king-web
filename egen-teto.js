// egen-teto.js

const questions = [
  "감정에 따라 행동하는 편이다.",
  "타인의 감정을 잘 공감한다.",
  "섬세하게 주변을 관찰한다.",
  "감정 표현에 솔직하다.",
  "타인의 기분을 잘 살핀다.",
  "감성적인 영화나 음악을 좋아한다.",
  "논리적으로 상황을 분석한다.",
  "목표를 세우고 추진하는 편이다.",
  "리더 역할을 맡는 것이 익숙하다.",
  "경쟁 상황에서 동기부여가 된다.",
  "문제 해결에 집중한다.",
  "객관적으로 판단하려고 한다."
];

const answers = [
  { text: "매우 그렇다", value: 2 },
  { text: "약간 그렇다", value: 1 },
  { text: "보통이다", value: 0 },
  { text: "약간 아니다", value: -1 },
  { text: "전혀 아니다", value: -2 }
];

// 1~6번: 에겐 점수(에스트로겐), 7~12번: 테토 점수(테스토스테론)
let current = 0;
let egenScore = 0;
let tetoScore = 0;

function renderQuestion() {
  if (current >= questions.length) {
    showResult();
    return;
  }
  document.getElementById('progress').textContent = `${current + 1} / ${questions.length}`;
  document.getElementById('question').textContent = questions[current];
  const answersDiv = document.getElementById('answers');
  answersDiv.innerHTML = '';
  answers.forEach((ans, idx) => {
    const btn = document.createElement('button');
    btn.className = 'btn btn-outline-primary';
    btn.textContent = ans.text;
    btn.onclick = () => handleAnswer(ans.value);
    answersDiv.appendChild(btn);
  });
}

function handleAnswer(value) {
  if (current < 6) egenScore += value;
  else tetoScore += value;
  current++;
  renderQuestion();
}

function showResult() {
  // 점수 기준: 각 파트(6문항) * 2 = 12 ~ -12
  // 각 파트의 점수가 더 높은 쪽이 해당 성향
  const gender = localStorage.getItem('egenTetoGender');
  let type = '';
  let desc = '';
  if (egenScore >= tetoScore) {
    if (gender === 'male') {
      type = '에겐남';
      desc = '감성적이고 섬세한 에스트로겐 기반 남성형입니다.';
    } else {
      type = '에겐녀';
      desc = '감성적이고 섬세한 에스트로겐 기반 여성형입니다.';
    }
  } else {
    if (gender === 'male') {
      type = '테토남';
      desc = '논리적이고 주도적인 테스토스테론 기반 남성형입니다.';
    } else {
      type = '테토녀';
      desc = '논리적이고 주도적인 테스토스테론 기반 여성형입니다.';
    }
  }
  localStorage.setItem('egenTetoResult', JSON.stringify({ type, desc }));
  window.location.href = 'egen-teto-result.html';
}

// 페이지 로드 시 질문 시작
if (typeof document !== 'undefined' && document.getElementById('question')) {
  renderQuestion();
}
