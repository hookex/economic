/**
 * @param money 本金
 * @param rate 年化收益
 * @param years 多少年后的结果
 * @param moneyLoopYears 循环缴纳本金的年数
 */
export function compound(money: number, rate: number, years: number, moneyLoopYears = 1) {
  let total = 0;
  let i = 1;

  while (i <= moneyLoopYears) {
    console.log('money', years, i, years - i, money * Math.pow((1 + rate), (years - i)))
    total += money * Math.pow((1 + rate), (years - i + 1));
    i++;
  }

  return total;
}

export interface CompoundByYears {
  total: number[],
  base: number[],
  interest: number[],
}

export function compoundGroupByYears(money: number, rate: number, years: number, moneyLoopYears = 1): CompoundByYears {
  let total = 0;
  let i = 1;

  let totalMoney: number[] = [];
  let base: number[] = [];
  let interestMoney: number[] = [];

  while (i <= years) {
    let newMoney = 0;

    if (moneyLoopYears > 0) {
      moneyLoopYears--;
      total += money;
      newMoney = money;
    }

    if (base.length === 0) {
      base.push(newMoney);
    } else {
      base.push(base[base.length-1] + newMoney);
    }

    let interest = total * rate;
    total += interest;

    if (interestMoney.length === 0) {
      interestMoney.push(interest);
    } else {
      interestMoney.push(interestMoney[interestMoney.length-1] + interest);
    }

    totalMoney.push(total);
    i++;
  }

  return {
    total: totalMoney,
    base,
    interest: interestMoney,
  };
}

// 本金1W2, 缴纳25年，年化6%，30年之后本金+收益总共：949975W
// 本金1W2, 缴纳25年，年化6%，40年之后本金+收益总共：1701260W
// compound(12000, 0.06, 30, 25)
