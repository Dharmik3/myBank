'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-07-26T17:01:17.194Z',
    '2022-02-16T23:36:17.929Z',
    '2022-02-17T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT',
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');
const conatinerError = document.querySelector('.error');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const formatMovementsDate = function (date) {
  const calcDaysPassed = (date1, date2) =>
    Math.round((Math.abs(date2 - date1) / (24 * 60 * 60 * 1000)));

const passedDays = calcDaysPassed(date, new Date());
  
  if (passedDays === 0) return 'Today';
  if (passedDays === 1) return 'Yesterday';
  if (passedDays <= 7) return `${passedDays} ago`;
  else {
    const day = `${date.getDate()}`.padStart(2, '0');
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }
};

const displayMovements = function (acc, sort = false) {
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  containerMovements.innerHTML = '';
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    // const date = acc.movementsDates[i];
    // console.log(movementsDates[i].getDate());
    // const displayDate = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementsDate(date);
    
    const html = `
    <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
    <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${mov.toFixed(2)}₹</div>
        </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((mov, cur) => mov + cur, 0);

  labelBalance.textContent = `${acc.balance.toFixed(2)} ₹`;
};

const calcDisplaySumarry = function (acc) {
  const income = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumIn.textContent = `${income.toFixed(2)}₹`;

  const outcomes = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumOut.textContent = `${Math.abs(outcomes).toFixed(2)}₹`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => int >= 1)
    .reduce((acc, int) => acc + int, 0);

  labelSumInterest.textContent = `${interest.toFixed(2)}₹`;
};

const createUsername = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(u => u[0])
      .join('');
  });
};

createUsername(accounts);

const updateUI = function (acc) {
  // display movement
  displayMovements(acc);
  // display summary
  calcDisplaySumarry(acc);
  // display balance
  calcDisplayBalance(acc);
};




// timer function
 const startTimer = function () {
   function tick() {
     const min = String(Math.trunc(time / 60)).padStart(2, 0);
     const second = String(time % 60).padStart(2, 0);

     labelTimer.textContent = `${min}:${second}`;
     if (time === 0) {
       clearInterval(timer);
       labelWelcome.textContent = 'Log in to get started';
       containerApp.style.opacity = 0;
     }
    //  console.log(min, second);
     time--;
   }
   let time = 300;
   tick();
   const timer = setInterval(tick, 1000);
   return timer;
 };



 let currentAccount,timer;

//login
btnLogin.addEventListener('click', function (e) {
  // prevention of default
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  const now = new Date();
  // console.log(now);

  const day = `${now.getDate()}`.padStart(2, '0');
  const month = `${now.getMonth()}`.padStart(2, '0');
  const year = now.getFullYear();
  const hour = `${now.getHours()}`.padStart(2, '0');
  const min = `${now.getMinutes()}`.padStart(2, '0');
  labelDate.textContent = `${day}/${month}/${year} ,${hour}:${min}`;

  if (currentAccount && currentAccount.pin === Number(inputLoginPin.value)) {
    // display UI
    conatinerError.style.opacity = 0;
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    inputLoginPin.value = inputLoginUsername.value = '';
    inputLoginPin.blur();
   
// timer
    // console.log(timer);
    if (timer) clearInterval(timer);
    timer=startTimer();
    //updating ui
    updateUI(currentAccount);
  } else {
    labelWelcome.textContent = 'Log in to get started';
    containerApp.style.opacity = 0;
    conatinerError.style.opacity = 100;
    inputLoginUsername.value = inputLoginPin.value = '';
  }
});

//transfer money

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const recevierAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  // console.log(amount,recevierAcc);

  inputTransferAmount.value = inputTransferTo.value = '';
  if (
    amount > 0 &&
    currentAccount.balance >= amount &&
    recevierAcc &&
    recevierAcc.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    recevierAcc.movements.push(amount);

    currentAccount.movementsDates.push(new Date().toISOString());
    recevierAcc.movementsDates.push(new Date().toISOString());

    clearInterval(timer);
    timer = startTimer();
    updateUI(currentAccount);
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    accounts.splice(index, 1);
    // console.log('deleted...');
    labelWelcome.textContent = 'Log in to get started';
    containerApp.style.opacity = 0;
  }
  inputClosePin.value = inputCloseUsername.value = '';
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);
  if (amount > 0 && currentAccount.balance * 0.5 >= amount) {
   setTimeout(function() {
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date().toISOString());

      // update UI
     clearInterval(timer);
     timer = startTimer();
      updateUI(currentAccount);
    },2500)
  }
  inputLoanAmount.value = '';
});

let sorted = false;

btnSort.addEventListener('click', function () {
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

// const withdrawal=account1.movements.filter(mov=>mov<0)

// console.log(withdrawal);

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

// array coding chalange 2

// const calcAverageHumanAge = function (ages) {
//   const humanAge = ages.map((age) => (age <= 2 ? 2 * age : 16 + age * 4));

//   const greater18Age = humanAge.filter((age) => age >= 18)

//   const averageAge = greater18Age.reduce((acc, age, i) => acc + age, 0) / greater18Age.length;

//   return averageAge
// }

// console.log(calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]));
// console.log(calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]));

//array section coding challange 3

// const calcAverageHumanAge = ages => {
//   const avgAge = ages.map(age => age <= 2 ? 2 * age : 16 + age * 4).filter(age => age >= 18).reduce((acc, age, i, arr) =>
//     acc + age/arr.length,0
// );
//   return avgAge;
// }

// console.log(calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]));
// console.log(calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]));


// setInterval(() => {
//   const now = new Date();

//   const sec = `${now.getSeconds()}`.padStart(2, '0');
//   const min = `${now.getMinutes()}`.padStart(2, '0');
//   const hour = `${now.getHours()}`.padStart(2, '0');
//   // console.log(`${hour}:${min}:${sec}`);
// },1000)