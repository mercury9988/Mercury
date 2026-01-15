// script.js - Основная логика приложения

// Глобальные переменные
let currentTab = 'home';
let tabHistory = ['home'];
let currentUser = null;
let currentOffer = null;

// Инициализация приложения
document.addEventListener('DOMContentLoaded', function() {
    console.log('Mercury Bot инициализирован');
    
    // Инициализация Telegram WebApp
    initTelegram();
    
    // Загрузка данных пользователя
    loadUserData();
    
    // Инициализация интерфейса
    initNavigation();
    initTabs();
    initFAQ();
    initTheme();
    initModals();
    initButtons();
    renderContent();
    
    // Проверка мобильного устройства
    checkMobile();
    
    // Инициализация админ-доступа
    initAdminAccess();
    
    // Запуск проверки обновлений
    checkForUpdates();
});

// Инициализация Telegram WebApp
function initTelegram() {
    if (typeof window.Telegram !== 'undefined') {
        try {
            const tg = window.Telegram.WebApp;
            
            // Настройка WebApp
            tg.expand(); // Полноэкранный режим
            tg.enableClosingConfirmation(); // Подтверждение закрытия
            
            // Получение данных пользователя
            const user = tg.initDataUnsafe?.user;
            if (user) {
                currentUser = {
                    id: user.id,
                    username: user.username || `user_${user.id}`,
                    firstName: user.first_name || 'Пользователь',
                    lastName: user.last_name || ''
                };
                
                // Сохраняем пользователя
                saveUserData();
            }
            
            console.log('Telegram WebApp инициализирован');
        } catch (error) {
            console.error('Ошибка Telegram WebApp:', error);
        }
    } else {
        console.log('Приложение запущено вне Telegram');
        // Тестовый пользователь для разработки
        currentUser = {
            id: Date.now(),
            username: 'test_user',
            firstName: 'Тестовый',
            lastName: 'Пользователь'
        };
    }
}

// Загрузка данных пользователя
function loadUserData() {
    const userId = currentUser?.id || 'default';
    const saved = localStorage.getItem(`mercury_user_${userId}`);
    
    if (saved) {
        try {
            const data = JSON.parse(saved);
            updateBalanceDisplay(data.balance || 0, data.hold || 0);
            console.log('Данные пользователя загружены');
        } catch (e) {
            console.error('Ошибка загрузки данных пользователя:', e);
            updateBalanceDisplay(0, 0);
        }
    } else {
        updateBalanceDisplay(0, 0);
    }
}

// Сохранение данных пользователя
function saveUserData() {
    if (!currentUser) return;
    
    const data = {
        id: currentUser.id,
        username: currentUser.username,
        balance: getCurrentBalance(),
        hold: getCurrentHold(),
        lastActive: new Date().toISOString()
    };
    
    localStorage.setItem(`mercury_user_${currentUser.id}`, JSON.stringify(data));
}

// Обновление отображения баланса
function updateBalanceDisplay(balance, hold) {
    const balanceElement = document.getElementById('balanceAmount');
    const holdElement = document.getElementById('holdAmount');
    const menuBalanceElement = document.getElementById('menuBalance');
    const menuHoldElement = document.getElementById('menuHold');
    
    if (balanceElement) balanceElement.textContent = `${balance.toLocaleString()} ₽`;
    if (holdElement) holdElement.textContent = `${hold.toLocaleString()} ₽`;
    if (menuBalanceElement) menuBalanceElement.textContent = `${balance.toLocaleString()} ₽`;
    if (menuHoldElement) menuHoldElement.textContent = `${hold.toLocaleString()} ₽`;
}

// Получение текущего баланса
function getCurrentBalance() {
    const balanceElement = document.getElementById('balanceAmount');
    if (balanceElement) {
        const text = balanceElement.textContent;
        return parseInt(text.replace(/[^\d]/g, '') || '0');
    }
    return 0;
}

// Получение текущего холда
function getCurrentHold() {
    const holdElement = document.getElementById('holdAmount');
    if (holdElement) {
        const text = holdElement.textContent;
        return parseInt(text.replace(/[^\d]/g, '') || '0');
    }
    return 0;
}

// Инициализация навигации
function initNavigation() {
    const backBtn = document.getElementById('backBtn');
    
    if (backBtn) {
        backBtn.addEventListener('click', goBack);
    }
    
    // История переходов
    window.addEventListener('popstate', function() {
        if (tabHistory.length > 1) {
            tabHistory.pop();
            const prevTab = tabHistory[tabHistory.length - 1];
            switchTab(prevTab);
        }
    });
}

// Переход назад
function goBack() {
    if (tabHistory.length > 1) {
        tabHistory.pop();
        const prevTab = tabHistory[tabHistory.length - 1];
        switchTab(prevTab);
        updateBackButton();
    }
}

// Обновление кнопки "Назад"
function updateBackButton() {
    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
        backBtn.style.display = tabHistory.length > 1 ? 'flex' : 'none';
    }
}

// Инициализация вкладок
function initTabs() {
    // Боковая навигация
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const tabName = this.getAttribute('data-tab');
            switchTab(tabName);
        });
    });
    
    // Нижняя навигация
    const bottomNavItems = document.querySelectorAll('.nav-btn');
    bottomNavItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const tabName = this.getAttribute('data-tab');
            switchTab(tabName);
        });
    });
}

// Переключение вкладки
function switchTab(tabName) {
    if (currentTab === tabName) return;
    
    // Обновляем историю
    tabHistory.push(tabName);
    if (tabHistory.length > 10) {
        tabHistory = tabHistory.slice(-10);
    }
    
    // Скрываем текущую вкладку
    const currentTabElement = document.getElementById(currentTab);
    if (currentTabElement) {
        currentTabElement.classList.remove('active');
    }
    
    // Показываем новую вкладку
    const newTabElement = document.getElementById(tabName);
    if (newTabElement) {
        newTabElement.classList.add('active');
        currentTab = tabName;
    }
    
    // Обновляем активные кнопки
    updateActiveNavButtons(tabName);
    
    // Обновляем кнопку "Назад"
    updateBackButton();
    
    // Тактильная обратная связь (в Telegram)
    if (typeof window.Telegram !== 'undefined') {
        try {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
        } catch (e) {
            // Игнорируем ошибки если не в Telegram
        }
    }
}

// Обновление активных кнопок навигации
function updateActiveNavButtons(tabName) {
    // Боковая навигация
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-tab') === tabName) {
            item.classList.add('active');
        }
    });
    
    // Нижняя навигация
    const bottomNavItems = document.querySelectorAll('.nav-btn');
    bottomNavItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-tab') === tabName) {
            item.classList.add('active');
        }
    });
}

// Инициализация FAQ
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        if (question) {
            question.addEventListener('click', function() {
                // Закрываем все другие
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Переключаем текущий
                item.classList.toggle('active');
            });
        }
    });
}

// Инициализация темы
function initTheme() {
    const themeSwitch = document.getElementById('themeSwitch');
    const themeToggle = document.getElementById('themeToggle');
    
    // Загрузка сохранённой темы
    const savedTheme = localStorage.getItem('mercury_theme') || 'dark';
    setTheme(savedTheme);
    
    // Переключатель в сайдбаре
    if (themeSwitch) {
        themeSwitch.addEventListener('click', toggleTheme);
    }
    
    // Переключатель в меню
    if (themeToggle) {
        themeToggle.addEventListener('click', function(e) {
            if (e.target.closest('.toggle-switch')) {
                toggleTheme();
            }
        });
    }
    
    // Обновление иконки темы
    updateThemeIcon(savedTheme);
}

// Переключение темы
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    setTheme(newTheme);
    localStorage.setItem('mercury_theme', newTheme);
    updateThemeIcon(newTheme);
    
    // Тактильная обратная связь
    if (typeof window.Telegram !== 'undefined') {
        try {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
        } catch (e) {}
    }
}

// Установка темы
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    
    // Обновляем переключатель
    const toggleSlider = document.querySelector('.toggle-slider');
    if (toggleSlider) {
        if (theme === 'light') {
            toggleSlider.style.left = '31px';
            toggleSlider.style.background = 'var(--neon-yellow)';
            toggleSlider.style.boxShadow = '0 0 10px rgba(255, 222, 0, 0.5)';
        } else {
            toggleSlider.style.left = '3px';
            toggleSlider.style.background = 'var(--neon-blue)';
            toggleSlider.style.boxShadow = '0 0 10px rgba(0, 243, 255, 0.5)';
        }
    }
}

// Обновление иконки темы
function updateThemeIcon(theme) {
    const themeIcon = document.querySelector('#themeSwitch i');
    if (themeIcon) {
        if (theme === 'dark') {
            themeIcon.className = 'fas fa-moon';
            themeIcon.style.color = 'var(--neon-yellow)';
        } else {
            themeIcon.className = 'fas fa-sun';
            themeIcon.style.color = 'var(--neon-yellow)';
        }
    }
}

// Инициализация модальных окон
function initModals() {
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.modal-close');
    
    // Закрытие по кнопке
    closeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal);
        });
    });
    
    // Закрытие по клику вне окна
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this);
            }
        });
    });
    
    // Закрытие по ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            modals.forEach(modal => {
                if (modal.classList.contains('active')) {
                    closeModal(modal);
                }
            });
        }
    });
}

// Открытие модального окна
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Тактильная обратная связь
        if (typeof window.Telegram !== 'undefined') {
            try {
                window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
            } catch (e) {}
        }
    }
}

// Закрытие модального окна
function closeModal(modal) {
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Тактильная обратная связь
        if (typeof window.Telegram !== 'undefined') {
            try {
                window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
            } catch (e) {}
        }
    }
}

// Инициализация кнопок
function initButtons() {
    // Кнопка "Начать зарабатывать"
    const startEarningBtn = document.getElementById('startEarning');
    if (startEarningBtn) {
        startEarningBtn.addEventListener('click', function() {
            switchTab('earnings');
        });
    }
    
    // Кнопка "Заказать выплату"
    const requestPayoutBtn = document.getElementById('requestPayout');
    if (requestPayoutBtn) {
        requestPayoutBtn.addEventListener('click', function() {
            openPayoutModal();
        });
    }
    
    // Подтверждение выплаты
    const confirmPayoutBtn = document.getElementById('confirmPayout');
    if (confirmPayoutBtn) {
        confirmPayoutBtn.addEventListener('click', processPayout);
    }
    
    // Переход к офферу
    const goToOfferBtn = document.getElementById('goToOffer');
    if (goToOfferBtn) {
        goToOfferBtn.addEventListener('click', function() {
            if (currentOffer) {
                window.open(currentOffer.link, '_blank');
                showNotification(window.mercuryData.messages.offerCompleted);
                closeModal(document.getElementById('offerModal'));
            }
        });
    }
}

// Открытие модального окна выплаты
function openPayoutModal() {
    const balance = getCurrentBalance();
    const hold = getCurrentHold();
    const available = balance - hold;
    
    if (available < 500) {
        showNotification(window.mercuryData.messages.withdrawalError, 'error');
        return;
    }
    
    const amountInput = document.getElementById('payoutAmount');
    if (amountInput) {
        amountInput.value = Math.max(500, Math.min(available, 500));
        amountInput.max = available;
    }
    
    openModal('payoutModal');
}

// Обработка выплаты
async function processPayout() {
    const amountInput = document.getElementById('payoutAmount');
    const phoneInput = document.getElementById('phoneNumber');
    const methodSelect = document.getElementById('paymentMethod');
    
    const amount = parseInt(amountInput.value);
    const phone = phoneInput.value.trim();
    const method = methodSelect.value;
    const methodText = methodSelect.options[methodSelect.selectedIndex].text;
    
    // Валидация
    if (!amount || amount < 500) {
        showNotification('Минимальная сумма вывода 500 ₽', 'error');
        return;
    }
    
    if (!phone || phone.length < 10) {
        showNotification('Введите корректный номер телефона', 'error');
        return;
    }
    
    const balance = getCurrentBalance();
    const hold = getCurrentHold();
    const available = balance - hold;
    
    if (amount > available) {
        showNotification('Недостаточно средств для вывода', 'error');
        return;
    }
    
    // Формирование сообщения для Telegram
    const message = `🎯 НОВАЯ ЗАЯВКА НА ВЫВОД:\n\n` +
                   `💰 Сумма: ${amount} ₽\n` +
                   `📱 Номер: ${phone}\n` +
                   `🏦 Способ: ${methodText}\n` +
                   `👤 Пользователь: ${currentUser?.username || 'Неизвестно'}\n` +
                   `🆔 ID: ${currentUser?.id || 'Неизвестно'}\n` +
                   `⏰ Время: ${new Date().toLocaleString()}`;
    
    // Отправка в Telegram
    const telegramUrl = `https://t.me/GoogleAsistent?text=${encodeURIComponent(message)}`;
    window.open(telegramUrl, '_blank');
    
    // Обновление баланса
    const newHold = hold + amount;
    updateBalanceDisplay(balance, newHold);
    saveUserData();
    
    // Показываем уведомление
    showNotification(window.mercuryData.messages.withdrawalSuccess);
    
    // Закрываем модальное окно
    closeModal(document.getElementById('payoutModal'));
    
    // Очищаем поля
    phoneInput.value = '';
}

// Рендеринг контента
function renderContent() {
    renderTopOffers();
    renderCategories();
}

// Рендеринг топ офферов
function renderTopOffers() {
    const container = document.getElementById('topOffers');
    if (!container) return;
    
    const offers = window.mercuryData?.getTopOffers() || [];
    
    container.innerHTML = offers.map(offer => `
        <div class="offer-card neon-card-blue">
            ${offer.image ? `<img src="${offer.image}" alt="${offer.title}" class="offer-image">` : ''}
            <div class="offer-content">
                <div class="offer-header">
                    <div class="offer-icon">
                        <i class="fas ${offer.icon}"></i>
                    </div>
                    <span class="offer-badge">${offer.badge}</span>
                </div>
                <h3 class="offer-title">${offer.title}</h3>
                <p class="offer-description">${offer.description}</p>
                <div class="offer-reward neon-text-green">${offer.reward}</div>
                <button class="offer-btn" data-offer-id="${offer.id}">
                    Получить
                </button>
            </div>
        </div>
    `).join('');
    
    // Добавляем обработчики для кнопок офферов
    const offerButtons = container.querySelectorAll('.offer-btn');
    offerButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const offerId = parseInt(this.getAttribute('data-offer-id'));
            const offer = offers.find(o => o.id === offerId);
            if (offer) {
                openOfferModal(offer);
            }
        });
    });
}

// Рендеринг категорий
function renderCategories() {
    const container = document.getElementById('categoriesGrid');
    if (!container) return;
    
    const categories = window.mercuryData?.getCategories() || [];
    
    container.innerHTML = categories.map(category => `
        <div class="category-card">
            <div class="category-header">
                <div class="category-icon" style="background: ${category.color}">
                    <i class="fas ${category.icon}"></i>
                </div>
                <div class="category-info">
                    <h3>${category.name}</h3>
                    <p class="category-stats">${category.stats}</p>
                </div>
            </div>
            <div class="category-offers">
                ${category.offers.slice(0, 3).map(offer => `
                    <div class="offer-line" data-offer-id="${offer.id}">
                        <span>${offer.title}</span>
                        <span class="offer-price">${offer.reward}</span>
                    </div>
                `).join('')}
            </div>
            <button class="category-btn" data-category="${category.id}">
                Смотреть все (${category.offers.length})
            </button>
        </div>
    `).join('');
    
    // Добавляем обработчики для кнопок категорий
    const categoryButtons = container.querySelectorAll('.category-btn');
    categoryButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const categoryId = this.getAttribute('data-category');
            const category = categories.find(c => c.id === categoryId);
            if (category) {
                showCategoryOffers(category);
            }
        });
    });
    
    // Добавляем обработчики для офферов в категориях
    const offerLines = container.querySelectorAll('.offer-line');
    offerLines.forEach(line => {
        line.addEventListener('click', function() {
            const offerId = parseInt(this.getAttribute('data-offer-id'));
            const category = categories.find(c => 
                c.offers.some(o => o.id === offerId)
            );
            if (category) {
                const offer = category.offers.find(o => o.id === offerId);
                if (offer) {
                    openOfferModal({
                        ...offer,
                        category: category.name,
                        icon: category.icon
                    });
                }
            }
        });
    });
}

// Показ офферов категории
function showCategoryOffers(category) {
    const modal = document.getElementById('offerModal');
    if (!modal) return;
    
    // Создаем временное модальное окно для категории
    const tempModal = modal.cloneNode(true);
    tempModal.id = 'categoryModal';
    
    // Наполняем контентом
    const title = tempModal.querySelector('#offerTitle');
    const reward = tempModal.querySelector('#offerReward');
    const description = tempModal.querySelector('#offerDescription');
    const instructions = tempModal.querySelector('.offer-instructions');
    const goToOfferBtn = tempModal.querySelector('#goToOffer');
    
    if (title) title.textContent = category.name;
    if (reward) reward.textContent = 'Выберите оффер';
    if (description) description.textContent = `Всего офферов: ${category.offers.length}`;
    
    if (instructions) {
        instructions.innerHTML = `
            <h4><i class="fas fa-list-ol"></i> Доступные офферы:</h4>
            <div class="category-offers-list">
                ${category.offers.map(offer => `
                    <div class="offer-line-large" data-offer-id="${offer.id}">
                        <span>${offer.title}</span>
                        <span class="offer-price">${offer.reward}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    if (goToOfferBtn) {
        goToOfferBtn.style.display = 'none';
    }
    
    // Добавляем стили
    const style = document.createElement('style');
    style.textContent = `
        .offer-line-large {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px;
            margin: 8px 0;
            background: var(--bg-card-light);
            border-radius: var(--border-radius-sm);
            cursor: pointer;
            transition: var(--transition);
            border: 2px solid transparent;
        }
        .offer-line-large:hover {
            border-color: var(--neon-blue);
            transform: translateX(5px);
        }
        .category-offers-list {
            max-height: 300px;
            overflow-y: auto;
        }
    `;
    document.head.appendChild(style);
    
    // Добавляем в DOM
    document.body.appendChild(tempModal);
    
    // Показываем модальное окно
    tempModal.classList.add('active');
    
    // Обработчики для офферов
    setTimeout(() => {
        const offerLines = tempModal.querySelectorAll('.offer-line-large');
        offerLines.forEach(line => {
            line.addEventListener('click', function() {
                const offerId = parseInt(this.getAttribute('data-offer-id'));
                const offer = category.offers.find(o => o.id === offerId);
                if (offer) {
                    document.body.removeChild(tempModal);
                    openOfferModal({
                        ...offer,
                        category: category.name,
                        icon: category.icon
                    });
                }
            });
        });
        
        // Закрытие по клику вне окна
        tempModal.addEventListener('click', function(e) {
            if (e.target === this) {
                document.body.removeChild(tempModal);
                document.head.removeChild(style);
            }
        });
        
        // Закрытие по кнопке
        const closeBtn = tempModal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                document.body.removeChild(tempModal);
                document.head.removeChild(style);
            });
        }
    }, 100);
}

// Открытие модального окна оффера
function openOfferModal(offer) {
    currentOffer = offer;
    
    const modal = document.getElementById('offerModal');
    if (!modal) return;
    
    const title = document.getElementById('offerTitle');
    const reward = document.getElementById('offerReward');
    const description = document.getElementById('offerDescription');
    const goToOfferBtn = document.getElementById('goToOffer');
    
    if (title) title.textContent = offer.title;
    if (reward) reward.textContent = offer.reward;
    if (description) description.textContent = offer.description || 'Высокодоходное предложение от наших партнёров';
    
    if (goToOfferBtn) {
        goToOfferBtn.style.display = 'flex';
    }
    
    openModal('offerModal');
}

// Показ уведомления
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    if (!notification) return;
    
    const text = notification.querySelector('#notificationText');
    const icon = notification.querySelector('i');
    
    if (text) text.textContent = message;
    
    // Меняем иконку в зависимости от типа
    if (icon) {
        if (type === 'error') {
            icon.className = 'fas fa-exclamation-circle';
            icon.style.color = 'var(--neon-red)';
            notification.style.borderLeftColor = 'var(--neon-red)';
        } else if (type === 'warning') {
            icon.className = 'fas fa-exclamation-triangle';
            icon.style.color = 'var(--neon-yellow)';
            notification.style.borderLeftColor = 'var(--neon-yellow)';
        } else {
            icon.className = 'fas fa-check-circle';
            icon.style.color = 'var(--neon-green)';
            notification.style.borderLeftColor = 'var(--neon-green)';
        }
    }
    
    // Показываем уведомление
    notification.classList.add('show');
    
    // Автоматическое скрытие
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Проверка мобильного устройства
function checkMobile() {
    const isMobile = window.innerWidth <= 768;
    
    // Показываем/скрываем нижнюю навигацию
    const bottomNav = document.querySelector('.bottom-nav');
    if (bottomNav) {
        bottomNav.style.display = isMobile ? 'flex' : 'none';
    }
    
    // Обновляем кнопку "Назад"
    updateBackButton();
    
    // Пересчитываем размеры элементов
    setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
    }, 100);
}

// Инициализация админ-доступа
function initAdminAccess() {
    const adminLink = document.getElementById('adminAccess');
    if (adminLink) {
        adminLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            const password = prompt('Введите пароль администратора:');
            const config = window.mercuryData?.getSiteConfig();
            
            if (password === config?.adminPassword) {
                window.location.href = 'admin.html';
            } else {
                alert('Неверный пароль!');
            }
        });
    }
}

// Проверка обновлений
function checkForUpdates() {
    const lastUpdate = localStorage.getItem('mercury_last_update');
    const now = new Date().getTime();
    
    if (!lastUpdate || (now - parseInt(lastUpdate)) > 86400000) { // 24 часа
        // Можно добавить проверку обновлений с сервера
        localStorage.setItem('mercury_last_update', now.toString());
    }
}

// Обработчик изменения размера окна
window.addEventListener('resize', checkMobile);

// Инициализация при полной загрузке
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    // Анимация появления
    setTimeout(() => {
        const elements = document.querySelectorAll('.balance-item, .offer-card, .feature-card');
        elements.forEach((el, index) => {
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }, 500);
});

// Экспорт функций для использования в консоли разработчика
window.mercury = {
    switchTab,
    openModal,
    closeModal,
    showNotification,
    updateBalance: function(balance, hold) {
        updateBalanceDisplay(balance, hold);
        saveUserData();
    },
    getBalance: getCurrentBalance,
    getHold: getCurrentHold,
    getUser: function() {
        return currentUser;
    }
};

console.log('Mercury Bot готов к работе!');
console.log('Для управления используйте window.mercury');
