import '../reset.css';
import '../style.css';
import '../modal.css';

import validator from './domain/validator';
import LottoGame from './domain/LottoGame';

const $budgetForm = document.querySelector('.budget_form');
const $budgetInput = document.querySelector('.budget_input');
const $budgetError = document.querySelector('.budget_error');

const $step2 = document.querySelector('#step2');

const $lottoCount = document.querySelector('.lotto_count');
const $lottoList = document.querySelector('.lotto_list_box');

const $lottoNumberForm = document.querySelector('.lotto_number_form');
const $winningNumberInput = document.querySelectorAll('.winning_number');
const $bonusNumberInput = document.querySelector('.bonus_number');
const $numberError = document.querySelector('.number_error');

const $modal = document.querySelector('#modal');
const $winningCounts = document.querySelectorAll('.winning_count');
const $profitRate = document.querySelector('.profit_rate');
const $modalCloseButton = document.querySelector('.modal_close');
const $modalBackground = document.querySelector('.modal_background');

const $retryButton = document.querySelector('.retry_btn');

let lottoGame;

const convertVisibilityToHidden = (...doms) => {
  return [...doms].forEach((dom) => (dom.style.visibility = 'hidden'));
};
const convertVisibilityToVisible = (...doms) => {
  return [...doms].forEach((dom) => (dom.style.visibility = 'visible'));
};

const displayModal = (winningNumbers, bonusNumber) => {
  const winningStatus = [...lottoGame.getWinningStatus(winningNumbers, bonusNumber)].reverse();
  const profitRate = lottoGame.getProfitRate().toFixed(2);
  [...$winningCounts].forEach((winningCount, index) => {
    winningCount.innerText = winningStatus[index];
  });
  $profitRate.innerText = `당신의 총 수익률은 ${profitRate}%입니다.`;
};

const displayBudgetError = (message) => {
  $budgetError.innerText = message;
  convertVisibilityToVisible($budgetError);
};

const displayLottoNumberError = (message) => {
  $numberError.innerText = message;
  convertVisibilityToVisible($numberError);
};

const displayBoughtLottos = (lottos) => {
  const lottoDivs = [...lottos].reduce((lottoDivs, lotto) => {
    return (lottoDivs += `
    <div class='lotto'>
      <div>🎟️</div>
      <span>${lotto.join(', ')}</span>
    </div>`);
  }, '');
  $lottoList.innerHTML = lottoDivs;
};

const onSubmitBudgetForm = (event) => {
  event.preventDefault();
  const budget = event.target[0].value;
  try {
    validator.validateBudget(budget);
    $budgetError.innerText = '';
  } catch ({ message }) {
    return displayBudgetError(message);
  }

  $lottoCount.innerText = `총 ${budget / 1000}개를 구매하였습니다.`;
  convertVisibilityToVisible($step2);
  lottoGame = new LottoGame(budget);
  displayBoughtLottos(lottoGame.getBoughtLottos());
};

const onSubmitLottoNumberForm = (event) => {
  event.preventDefault();
  const winningNumbers = [...$winningNumberInput].map((input) => Number(input.value));
  const bonusNumber = $bonusNumberInput.value;
  try {
    validator.validateWinningNumber(winningNumbers.join(','));
    validator.validateBonusNumber(bonusNumber);
    convertVisibilityToHidden($numberError);
  } catch ({ message }) {
    return displayLottoNumberError(message);
  }

  displayModal(winningNumbers, bonusNumber);
  convertVisibilityToVisible($modal);
};

const onClickRetryButton = () => {
  $budgetInput.value = '';
  convertVisibilityToHidden($modal, $step2);
  [...$winningNumberInput].forEach((input) => {
    input.value = '';
  });
  $bonusNumberInput.value = '';
};

$budgetForm.addEventListener('submit', onSubmitBudgetForm);
$lottoNumberForm.addEventListener('submit', onSubmitLottoNumberForm);

$modalCloseButton.addEventListener('click', () => convertVisibilityToHidden($modal));
$modalBackground.addEventListener('click', () => convertVisibilityToHidden($modal));

$retryButton.addEventListener('click', onClickRetryButton);
