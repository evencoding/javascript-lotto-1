import pickLotto from './pickLotto.js';
import ScoreBoard from './ScoreBoard.js';

import { GAME_VALUE, RANK } from '../constants/index.js';

class LottoGame {
  #lottos;
  #scoreBoard;

  constructor(budget) {
    const lottoCount = budget / GAME_VALUE.LOTTO_PRICE;
    this.#lottos = Array.from({ length: lottoCount }, () => {
      return pickLotto(GAME_VALUE.MAX_LOTTO_NUMBER, GAME_VALUE.LOTTO_SIZE);
    });
    this.#scoreBoard = new ScoreBoard(lottoCount);
  }

  getBoughtLottos() {
    return this.#lottos;
  }

  getMatchedLottoCount(lotto, winningNumber) {
    const matchedCount = winningNumber.filter((number) => lotto.includes(number)).length;

    return matchedCount;
  }

  checkBonusNumber(lotto, bonusNumber) {
    return lotto.includes(bonusNumber);
  }

  getRank(matchedCount, hasBonusNumber) {
    if (matchedCount === 6) return RANK.FIRST;
    if (matchedCount === 5 && hasBonusNumber) return RANK.SECOND;
    if (matchedCount === 5) return RANK.THIRD;
    if (matchedCount === 4) return RANK.FOURTH;
    if (matchedCount === 3) return RANK.FIFTH;

    return 0;
  }

  getWinningStatus(winningNumber, bonusNumber) {
    this.#lottos.forEach((lotto) => {
      const matchedCount = this.getMatchedLottoCount(lotto, winningNumber);
      const hasBonusNumber = this.checkBonusNumber(lotto, bonusNumber);
      const rank = this.getRank(matchedCount, hasBonusNumber);
      this.#scoreBoard.writeBoard(rank);
    });

    return this.#scoreBoard.getBoard();
  }

  getProfitRate() {
    return this.#scoreBoard.getProfitRate();
  }
}

export default LottoGame;
