// Общий баланс (используем localStorage)
let balance = parseFloat(localStorage.getItem('balance'));

// Проверяем, является ли баланс числом. Если нет, устанавливаем его в 0.
if (isNaN(balance)) {
  balance = 0;
  localStorage.setItem('balance', balance); // Сохраняем начальное значение
}

// Функция для обновления баланса
function updateBalance() {
  document.getElementById('global-balance').textContent = `Баланс: ${balance} монет`;
  localStorage.setItem('balance', balance); // Сохраняем баланс в localStorage
}

// Пополнение баланса (общая логика для всех страниц)
function setupDepositModal() {
  const depositModal = document.getElementById('depositModal');
  const depositButton = document.getElementById('deposit') || document.getElementById('deposit-main');
  const confirmDepositButton = document.getElementById('confirmDeposit');
  const closeModalButton = document.getElementById('closeModal');

  if (depositButton) {
    depositButton.addEventListener('click', () => {
      depositModal.style.display = 'block';
    });
  }

  if (confirmDepositButton) {
    confirmDepositButton.addEventListener('click', () => {
      const amount = parseFloat(document.getElementById('depositAmount').value);
      if (amount > 0) {
        balance += amount;
        updateBalance();
        depositModal.style.display = 'none';
      } else {
        alert('Введите корректную сумму!');
      }
    });
  }

  if (closeModalButton) {
    closeModalButton.addEventListener('click', () => {
      depositModal.style.display = 'none';
    });
  }
}

// Главное меню
if (document.getElementById('rocket-mode')) {
  document.getElementById('rocket-mode').addEventListener('click', () => {
    window.location.href = 'rocket.html'; // Переход на страницу "Ракетка"
  });

  document.getElementById('slots-mode').addEventListener('click', () => {
    window.location.href = 'slots.html'; // Переход на страницу "Слоты"
  });

  document.getElementById('other-mode').addEventListener('click', () => {
    alert('Этот режим пока недоступен!');
  });
}

// Режим "Ракетка"
if (document.getElementById('start')) {
  let multiplier = 1.0;
  let isFlying = false;
  let interval;

  document.getElementById('start').addEventListener('click', () => {
    const betInput = document.getElementById('bet').value;
    const bet = parseFloat(betInput);

    if (isNaN(bet) || betInput.trim() === '') {
      alert('Введите корректное число!');
      return;
    }

    if (bet < 10) return alert('Минимальная ставка — 10 монет!');
    if (bet > balance) return alert('Недостаточно монет на балансе!');

    balance -= bet;
    updateBalance();

    isFlying = true;
    multiplier = 1.0;
    document.getElementById('multiplier').textContent = `${multiplier.toFixed(2)}x`;

    interval = setInterval(() => {
      if (!isFlying) return;
      multiplier += 0.1;
      document.getElementById('multiplier').textContent = `${multiplier.toFixed(2)}x`;

      if (Math.random() < 0.01) {
        endGame(false);
      }
    }, 100);
  });

  document.getElementById('cashout').addEventListener('click', () => {
    if (!isFlying) return;
    endGame(true);
  });

  function endGame(isWin) {
    clearInterval(interval);
    isFlying = false;

    const bet = parseFloat(document.getElementById('bet').value);
    if (isWin) {
      const winAmount = bet * multiplier;
      balance += winAmount;
      alert(`Вы выиграли ${winAmount.toFixed(2)} монет!`);
    } else {
      alert('Вы проиграли ставку!');
    }
    updateBalance();
  }
}

// Режим "Слоты"
if (document.getElementById('spin')) {
  const symbols = ["🍒", "🍋", "🍉", "BAR", "7", "⭐"];
  const paytable = {
    "🍒🍒🍒": 10,
    "🍋🍋🍋": 15,
    "🍉🍉🍉": 30,
    "BAR BAR BAR": 200,
    "777": 1000,
    "⭐⭐⭐": 500,
  };

  document.getElementById('spin').addEventListener('click', () => {
    const reels = document.querySelectorAll('.reel');
    const resultElement = document.getElementById('result');
    const bet = parseFloat(document.getElementById('bet').value);

    if (isNaN(bet) || bet < 10) {
      resultElement.textContent = "Минимальная ставка — 10 монет!";
      return;
    }

    if (bet > balance) {
      resultElement.textContent = "Недостаточно монет на балансе!";
      return;
    }

    // Списываем ставку
    balance -= bet;
    updateBalance();

    // Вращение барабанов
    reels.forEach((reel) => {
      reel.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    });

    // Проверка выигрыша
    setTimeout(() => {
      const combination = Array.from(reels)
        .map((reel) => reel.textContent)
        .join("");
      const winMultiplier = paytable[combination] || 0;

      if (winMultiplier > 0) {
        const winAmount = bet * winMultiplier;
        balance += winAmount;
        resultElement.textContent = `Вы выиграли ${winAmount} монет! (${winMultiplier}x)`;
      } else {
        resultElement.textContent = "Повезёт в следующий раз!";
      }

      updateBalance();
    }, 1000); // Задержка для анимации
  });
}

// Кнопка возврата в главное меню
if (document.getElementById('back-to-menu')) {
  document.getElementById('back-to-menu').addEventListener('click', () => {
    window.location.href = 'index.html'; // Переход на главную страницу
  });
}

// Инициализация
updateBalance();
setupDepositModal();