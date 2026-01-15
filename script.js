// Конфигурация API
const API_BASE_URL = 'http://localhost:3000/api'; // Замените на ваш сервер

// Глобальные переменные
let currentUser = null;
let transactionHistory = [];

// Инициализация приложения
async function initApp() {
    // Проверка на Telegram
    if (typeof window.Telegram === 'undefined') {
        showError('Пожалуйста, откройте приложение через Telegram бота.');
        return;
    }
    
    const tg = window.Telegram.WebApp;
    tg.ready();
    tg.expand();
    tg.enableClosingConfirmation();
    
    // Получаем данные пользователя
    const userData = tg.initDataUnsafe.user;
    if (!userData) {
        showError('Не удалось получить данные пользователя');
        return;
    }
    
    // Регистрация/авторизация пользователя
    await registerUser(userData);
    
    // Загрузка данных
    await loadUserData();
    await loadTransactionHistory();
    await loadOffers();
    
    // Инициализация интерфейса
    initTabs();
    initFAQ();
    initTheme();
    initModals();
    initEventListeners();
    initMobileNavigation();
    
    // Анимация загрузки завершена
    document.body.classList.add('loaded');
}

// Регистрация пользователя
async function registerUser(userData) {
    try {
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                telegramId: userData.id.toString(),
                username: userData.username,
                firstName: userData.first_name,
                lastName: userData.last_name
            })
        });
        
        const data = await response.json();
        currentUser = data.user;
        
        // Обновляем интерфейс
        updateUserInfo(currentUser);
    } catch (error) {
        console.error('Registration error:', error);
    }
}

// Загрузка данных пользователя
async function loadUserData() {
    if (!currentUser) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/user/${currentUser.telegramId}`);
        const userData = await response.json();
        
        // Обновляем баланс
        document.getElementById('balance').textContent = `${userData.balance.toLocaleString()} ₽`;
        document.getElementById('holdBalance').textContent = `${userData.holdBalance.toLocaleString()} ₽`;
        
        // Обновляем в меню
        document.getElementById('menuBalance').textContent = `${userData.balance.toLocaleString()} ₽`;
        document.getElementById('menuHold').textContent = `${userData.holdBalance.toLocaleString()} ₽`;
        
        currentUser = userData;
    } catch (error) {
        console.error('Load user data error:', error);
    }
}

// Загрузка истории операций
async function loadTransactionHistory() {
    if (!currentUser) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/transactions/${currentUser.telegramId}`);
        transactionHistory = await response.json();
        
        // Здесь можно обновить интерфейс истории
        updateTransactionHistoryUI();
    } catch (error) {
        console.error('Load transactions error:', error);
    }
}

// Загрузка офферов с сервера
async function loadOffers() {
    try {
        const response = await fetch(`${API_BASE_URL}/offers`);
        const offers = await response.json();
        
        renderOffers(offers);
    } catch (error) {
        console.error('Load offers error:', error);
        // Используем локальные офферы как fallback
        renderOffers(offersConfig);
    }
}

// Рендеринг офферов
function renderOffers(offers) {
    const topOffersContainer = document.querySelector('.offers-grid');
    const categoriesContainer = document.querySelector('.earnings-categories');
    
    if (!topOffersContainer || !categoriesContainer) return;
    
    // Рендерим топ офферы
    topOffersContainer.innerHTML = offers.topOffers.map(offer => `
        <div class="offer-card neon-card offer-card-with-image">
            ${offer.image ? `<img src="${offer.image}" alt="${offer.title}" class="offer-image">` : ''}
            <div class="offer-content">
                <div class="offer-header">
                    <div class="offer-icon">
                        <i class="fas ${offer.icon}"></i>
                    </div>
                    <span class="offer-badge">${offer.badge}</span>
                </div>
                <h3>${offer.title}</h3>
                <p class="offer-description">${offer.description || ''}</p>
                <p class="offer-reward">${offer.reward}</p>
                <button class="offer-btn" data-offer-id="${offer.id}">
                    Получить
                </button>
            </div>
        </div>
    `).join('');
    
    // Рендерим категории
    categoriesContainer.innerHTML = Object.entries(offers.categories).map(([key, category]) => `
        <div class="category-card neon-card">
            <div class="category-header">
                <div class="category-icon" style="background: ${category.color || 'var(--gradient-blue-purple)'}">
                    <i class="fas ${category.icon}"></i>
                </div>
                <div class="category-info">
                    <h3>${category.name}</h3>
                    <p class="category-stats">${category.stats}</p>
                </div>
            </div>
            <div class="category-offers">
                ${category.offers.map(offer => `
                    <div class="offer-line" data-offer-id="${offer.id}">
                        <span>${offer.title}</span>
                        <span class="offer-price">${offer.reward}</span>
                    </div>
                `).join('')}
            </div>
            <button class="category-btn" data-category="${key}">
                Смотреть все (${category.offers.length})
            </button>
        </div>
    `).join('');
}

// Инициализация мобильной навигации
function initMobileNavigation() {
    const backButton = document.getElementById('backButton');
    const bottomNavItems = document.querySelectorAll('.bottom-nav-item');
    
    let tabHistory = ['home'];
    let currentTab = 'home';
    
    // Обработчики для нижней навигации
    bottomNavItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const tabName = this.getAttribute('data-tab');
            
            // Добавляем в историю
            if (tabName !== currentTab) {
                tabHistory.push(currentTab);
                currentTab = tabName;
                
                // Обновляем активные элементы
                bottomNavItems.forEach(i => i.classList.remove('active'));
                this.classList.add('active');
                
                // Переключаем вкладку
                switchTab(tabName);
                
                // Показываем кнопку назад если есть история
                if (tabHistory.length > 1) {
                    backButton.style.display = 'flex';
                }
            }
        });
    });
    
    // Обработчик кнопки назад
    backButton.addEventListener('click', function() {
        if (tabHistory.length > 1) {
            const prevTab = tabHistory.pop();
            currentTab = tabHistory[tabHistory.length - 1];
            
            // Переключаем на предыдущую вкладку
            switchTab(currentTab);
            
            // Обновляем активные элементы
            bottomNavItems.forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('data-tab') === currentTab) {
                    item.classList.add('active');
                }
            });
            
            // Скрываем кнопку если это последняя вкладка в истории
            if (tabHistory.length <= 1) {
                this.style.display = 'none';
            }
        }
    });
}

// Функция запроса выплаты
async function requestPayout(amount, method) {
    if (!currentUser) {
        showNotification('Ошибка авторизации', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/withdrawal/request`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                telegramId: currentUser.telegramId,
                amount: parseInt(amount),
                paymentMethod: method
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showNotification('Заявка на вывод успешно создана!', 'success');
            await loadUserData(); // Обновляем баланс
        } else {
            showNotification(data.error, 'error');
        }
    } catch (error) {
        showNotification('Ошибка соединения с сервером', 'error');
    }
}

// Функция завершения оффера
async function completeOffer(offerId) {
    if (!currentUser) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/offer/complete`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: currentUser.telegramId,
                offerId: offerId
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showNotification(`Оффер завершен! Начислено: ${data.reward} ₽`, 'success');
            await loadUserData(); // Обновляем баланс
        }
    } catch (error) {
        console.error('Complete offer error:', error);
    }
}

// Уведомления
function showNotification(message, type = 'info') {
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Добавляем в DOM
    document.body.appendChild(notification);
    
    // Анимация появления
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Автоматическое скрытие
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Обновление истории транзакций в интерфейсе
function updateTransactionHistoryUI() {
    const historyContainer = document.getElementById('historyContainer');
    if (!historyContainer) return;
    
    historyContainer.innerHTML = transactionHistory.map(transaction => `
        <div class="transaction-item">
            <div class="transaction-info">
                <div class="transaction-type ${transaction.type}">
                    <i class="fas ${getTransactionIcon(transaction.type)}"></i>
                    <span>${getTransactionTypeLabel(transaction.type)}</span>
                </div>
                <div class="transaction-date">
                    ${new Date(transaction.date).toLocaleDateString()}
                </div>
            </div>
            <div class="transaction-amount ${transaction.amount > 0 ? 'positive' : 'negative'}">
                ${transaction.amount > 0 ? '+' : ''}${transaction.amount} ₽
            </div>
            <div class="transaction-status ${transaction.status}">
                ${getTransactionStatusLabel(transaction.status)}
            </div>
        </div>
    `).join('');
}

// Вспомогательные функции
function getTransactionIcon(type) {
    const icons = {
        deposit: 'fa-plus-circle',
        withdrawal: 'fa-minus-circle',
        earning: 'fa-coins',
        hold: 'fa-clock'
    };
    return icons[type] || 'fa-exchange-alt';
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', initApp);
