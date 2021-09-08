'use-strict';
const $form = document.querySelector('#form');
const $input = document.querySelector('#input');
const $result = document.querySelector('#result');
const $chanceLeft = document.querySelector('#chanceLeft');
const $countOut = document.querySelector('#countOut');

// 1~9 숫자 모음
const numbers = [];
for (let n = 1; n < 10; n++) {
  numbers.push(n);
}

// 4가지 숫자 픽
const answer = [];
for (let n = 0; n < 4; n++) {
  const index = Math.floor(Math.random() * numbers.length);
  answer.push(numbers[index]);
  numbers.splice(index, 1);
}
console.log(answer);
// 시도한 값들
const tries = [];

// out 세팅, 표시
let countOut = 0;
$countOut.textContent = countOut;
function setCountOut() {
  countOut++;
  $countOut.textContent = countOut;
}

// 입력창 초기화
function inputClear() {
  $input.value = '';
  $input.focus();
}

// 남은 기회 표시
function setChanceLeft() {
  $chanceLeft.textContent = 10 - tries.length;
}
setChanceLeft();

// 입력 값 유효성 검사
function checkInput(input) {
  // 4자리 수 체크
  if (input.length !== 4) {
    alert('4자리 숫자를 입력해 주세요.');
    return false;
  }
  // 숫자인지 체크
  if (!(input * 1)) {
    alert('숫자를 입력해 주세요.');
    return false;
  }
  // 중복된 수 체크
  if (new Set(input).size !== 4) {
    alert('중복되지 않게 숫자를 입력해 주세요.');
    return false;
  }
  // 이미 시도한 수
  if (tries.includes(input)) {
    alert('이미 시도한 숫자입니다.');
    return false;
  }
  return true;
}

$form.addEventListener('submit', (event) => {
  event.preventDefault(); // form 태그의 기본동작(새로고침) 막기

  // 입력 값 유효성 검사
  const value = $input.value;
  const valid = checkInput(value);
  if (!valid) {
    inputClear();
    return;
  }

  // 입력 값 홈런 검사
  if (answer.join('') === value) {
    $result.append(
      `${value}: HOMERUN!! You win!!`,
      document.createElement('br')
    );
    tries.push(value);
    setChanceLeft();
    $input.disabled = true;
    return;
  }

  // no chance 게임오버 검사
  if (tries.length === 9) {
    $result.append(
      `${value}: No Chance... You Lose ㅠㅠ... Answer is '${answer.join('')}'`,
      document.createElement('br')
    );
    tries.push(value);
    setChanceLeft();
    $input.disabled = true;

    return;
  }

  // 3 out 게임오버 검사

  // 스트라이크,볼 검사
  let strike = 0;
  let ball = 0;
  answer.forEach((answerNumber, answerIndex) => {
    const index = value.indexOf(answerNumber);
    if (index > -1) {
      if (index === answerIndex) {
        strike += 1;
      } else {
        ball += 1;
      }
    }
  });

  // 스트라이크 or 볼이 1개 이상 있을 때
  if (!(strike === 0 && ball === 0)) {
    $result.append(
      `${value}: ${strike} strike ${ball} ball !!`,
      document.createElement('br')
    );
    tries.push(value);
    setChanceLeft();
    inputClear();
    return;
  }

  // 0스트라이크 0볼 일 때
  if (countOut === 2) {
    setCountOut();
    $result.append(
      `${value}: 3 OUT!!... You Lose ㅠㅠ... Answer is '${answer.join('')}'`,
      document.createElement('br')
    );
    tries.push(value);
    setChanceLeft();
    $input.disabled = true;
    return;
  }

  setCountOut();
  $result.append(`${value}: ${countOut} OUT !!`, document.createElement('br'));
  tries.push(value);
  setChanceLeft();
  inputClear();
});
