// Инициализация Telegram WebApp
let tg = null;
let user = null;

// Инициализация приложения
document.addEventListener('DOMContentLoaded', function() {
    // Проверяем, запущено ли приложение в Telegram
    if (typeof window.Telegram !== 'undefined') {
        tg = window.Telegram.WebApp;
        
        // Настройки WebApp
        tg.expand(); // Полноэкранный режим
        tg.enableClosingConfirmation(); // Подтверждение закрытия
        tg.setHeaderColor('#0a0a14');
        tg.setBackgroundColor('#0a0a14');
        
        // Получаем данные пользователя
        user = tg.initDataUnsafe.user;
        initUserData();
    } else {
        // Для локального тестирования
        user = {
            id: 123456789,
            first_name: 'Тестовый',
            last_name: 'Пользователь',
            username: 'test_user'
        };
        initUserData();
        console.log('Приложение запущено вне Telegram. Включён тестовый режим.');
    }
    
    // Инициализация компонентов
    initTabs();
    initFAQ();
    initTheme();
    initModals();
    initEventListeners();
});

// Инициализация данных пользователя
function initUserData() {
    if (user) {
        const userId = user.id || '123456789';
        const userName = user.first_name || 'Пользователь';
        
        document.getElementById('userId').textContent = `ID: ${userId}`;
        document.getElementById('menuUserId').textContent = `ID: ${userId}`;
        
        // Обновляем аватар, если есть фото
        if (user.photo_url) {
            document.querySelectorAll('.user-avatar i, .profile-avatar i').forEach(icon => {
                icon.style.display = 'none';
                icon.parentElement.style.backgroundImage = `url(${user.photo_url})`;
                icon.parentElement.style.backgroundSize = 'cover';
                icon.parentElement.style.backgroundPosition = 'center';
            });
        }
    }
}

// Инициализация вкладок
function initTabs() {
    const tabButtons = document.querySelectorAll('.nav-item');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const tabName = this.getAttribute('data-tab');
            
            // Удаляем активный класс у всех кнопок
            tabButtons.forEach(btn => btn.classList.remove('active'));
            // Добавляем активный класс текущей кнопке
            this.classList.add('active');
            
            // Скрываем все вкладки
            tabContents.forEach(content => {
                content.classList.remove('active');
            });
            
            // Показываем выбранную вкладку
            const activeTab = document.getElementById(tabName);
            if (activeTab) {
                activeTab.classList.add('active');
                
                // Отправляем событие в Telegram о просмотре страницы
                if (tg) {
                    tg.HapticFeedback.impactOccurred('light');
                }
            }
        });
    });
}

// Инициализация FAQ
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            // Закрываем все остальные элементы
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Переключаем текущий элемент
            item.classList.toggle('active');
            
            // Тактильная обратная связь
            if (tg) {
                tg.HapticFeedback.impactOccurred('light');
            }
        });
    });
}

// Инициализация темы
function initTheme() {
    const themeSwitch = document.getElementById('themeSwitch');
    const themeToggle = document.getElementById('toggleTheme');
    const toggleSwitch = document.querySelector('.toggle-switch');
    
    // Проверяем сохранённую тему
    const savedTheme = localStorage.getItem('mercury-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    // Обработчик для переключателя в сайдбаре
    themeSwitch.addEventListener('click', function() {
        toggleTheme();
    });
    
    // Обработчик для переключателя в меню
    if (themeToggle) {
        themeToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleTheme();
        });
    }
    
    // Обработчик для toggle switch
    if (toggleSwitch) {
        toggleSwitch.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleTheme();
        });
    }
    
    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('mercury-theme', newTheme);
        updateThemeIcon(newTheme);
        
        // Тактильная обратная связь
        if (tg) {
            tg.HapticFeedback.impactOccurred('medium');
        }
    }
    
    function updateThemeIcon(theme) {
        const icon = themeSwitch.querySelector('i');
        if (theme === 'dark') {
            icon.className = 'fas fa-moon';
            icon.style.color = 'var(--neon-yellow)';
        } else {
            icon.className = 'fas fa-sun';
            icon.style.color = 'var(--neon-yellow)';
        }
    }
}

// Инициализация модальных окон
function initModals() {
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close-modal');
    
    // Закрытие модальных окон
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal);
        });
    });
    
    // Закрытие при клике вне модального окна
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this);
            }
        });
    });
    
    // Обработчик для кнопки "Заказать выплату"
    document.getElementById('requestPayout')?.addEventListener('click', function() {
        openPayoutModal();
    });
    
    // Обработчик для подтверждения выплаты
    document.getElementById('confirmPayout')?.addEventListener('click', function() {
        processPayout();
    });
    
    // Обработчики для кнопок офферов
    document.querySelectorAll('.offer-btn, .category-btn').forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.offer-card, .category-card');
            openOfferModal(card);
        });
    });
    
    // Обработчик для кнопки "Начать зарабатывать"
    document.getElementById('startEarning')?.addEventListener('click', function() {
        // Переходим на вкладку заработка
        document.querySelector('[data-tab="earnings"]').click();
        
        // Тактильная обратная связь
        if (tg) {
            tg.HapticFeedback.impactOccurred('medium');
        }
    });
}

// Открытие модального окна с оффером
function openOfferModal(card) {
    const title = card.querySelector('h3')?.textContent || 'Оффер';
    const reward = card.querySelector('.offer-reward, .offer-price')?.textContent || '0 ₽';
    
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalReward').textContent = reward;
    
    // Генерация описания в зависимости от типа оффера
    let description = '';
    if (title.includes('карт')) {
        description = 'Оформление банковской карты с бесплатным обслуживанием и кэшбэком.';
    } else if (title.includes('ИП') || title.includes('РКО')) {
        description = 'Регистрация ИП и открытие расчётного счёта для бизнеса.';
    } else if (title.includes('займ')) {
        description = 'Оформление микрозайма на выгодных условиях.';
    } else if (title.includes('Яндекс')) {
        description = 'Трудоустройство курьером в Яндекс Еду с гибким графиком.';
    } else {
        description = 'Высокодоходное предложение от наших партнёров.';
    }
    
    document.getElementById('modalDescription').textContent = description;
    
    const modal = document.getElementById('offerModal');
    modal.classList.add('active');
    
    // Тактильная обратная связь
    if (tg) {
        tg.HapticFeedback.impactOccurred('medium');
    }
}

// Открытие модального окна выплаты
function openPayoutModal() {
    const balance = parseFloat(document.getElementById('balance').textContent.replace(/[^\d]/g, ''));
    const hold = parseFloat(document.getElementById('holdBalance').textContent.replace(/[^\d]/g, ''));
    const available = balance - hold;
    
    document.getElementById('availablePayout').textContent = `${available.toLocaleString()} ₽`;
    document.getElementById('payoutAmount').max = available;
    document.getElementById('payoutAmount').value = Math.min(500, available);
    
    const modal = document.getElementById('payoutModal');
    modal.classList.add('active');
    
    // Тактильная обратная связь
    if (tg) {
        tg.HapticFeedback.impactOccurred('medium');
    }
}

// Обработка выплаты
function processPayout() {
    const amount = parseInt(document.getElementById('payoutAmount').value);
    const method = document.getElementById('payoutMethod').value;
    
    if (amount < 500) {
        alert('Минимальная сумма выплаты - 500 ₽');
        return;
    }
    
    // В реальном приложении здесь был бы запрос к API
    console.log(`Запрошена выплата: ${amount} ₽, способ: ${method}`);
    
    // Показываем уведомление
    if (tg) {
        tg.showAlert(`Заявка на выплату ${amount} ₽ создана! Ожидайте зачисления в течение 24 часов.`);
        tg.HapticFeedback.notificationOccurred('success');
    } else {
        alert(`Заявка на выплату ${amount} ₽ создана! Ожидайте зачисления в течение 24 часов.`);
    }
    
    // Закрываем модальное окно
    closeModal(document.getElementById('payoutModal'));
}

// Закрытие модального окна
function closeModal(modal) {
    modal.classList.remove('active');
    
    // Тактильная обратная связь
    if (tg) {
        tg.HapticFeedback.impactOccurred('light');
    }
}

// Инициализация обработчиков событий
function initEventListeners() {
    // Кнопки в меню
    document.getElementById('historyBtn')?.addEventListener('click', function(e) {
        e.preventDefault();
        showNotification('История операций скоро будет доступна');
    });
    
    document.getElementById('reviewsBtn')?.addEventListener('click', function(e) {
        e.preventDefault();
        showNotification('Раздел с отзывами в разработке');
    });
    
    document.getElementById('referralBtn')?.addEventListener('click', function(e) {
        e.preventDefault();
        showNotification('Реферальная программа скоро будет запущена');
    });
    
    // Кнопка "Перейти к офферу"
    document.getElementById('goToOffer')?.addEventListener('click', function() {
        const modal = document.getElementById('offerModal');
        const title = document.getElementById('modalTitle').textContent;
        
        // В реальном приложении здесь была бы ссылка на оффер
        console.log(`Переход к офферу: ${title}`);
        
        if (tg) {
            tg.showAlert(`Вы переходите к офферу "${title}". Заполните заявку полностью для получения вознаграждения.`);
            tg.HapticFeedback.notificationOccurred('success');
        } else {
            alert(`Вы переходите к офферу "${title}". Заполните заявку полностью для получения вознаграждения.`);
        }
        
        closeModal(modal);
    });
}

// Показать уведомление
function showNotification(message) {
    if (tg) {
        tg.showAlert(message);
        tg.HapticFeedback.impactOccurred('light');
    } else {
        alert(message);
    }
}

// Имитация обновления баланса (для демонстрации)
function simulateBalanceUpdate() {
    setInterval(() => {
        const balanceElement = document.getElementById('balance');
        const holdElement = document.getElementById('holdBalance');
        const menuBalance = document.getElementById('menuBalance');
        const menuHold = document.getElementById('menuHold');
        
        // Случайное небольшое увеличение баланса
        const currentBalance = parseFloat(balanceElement.textContent.replace(/[^\d]/g, ''));
        const currentHold = parseFloat(holdElement.textContent.replace(/[^\d]/g, ''));
        
        // Случайное событие: либо новый заработок, либо перевод из холда
        if (Math.random() > 0.7) {
            const newEarning = Math.floor(Math.random() * 500) + 100;
            const newBalance = currentBalance + newEarning;
            
            balanceElement.textContent = `${newBalance.toLocaleString()} ₽`;
            menuBalance.textContent = `${newBalance.toLocaleString()} ₽`;
            
            // Анимация обновления
            balanceElement.style.animation = 'glow 1s';
            setTimeout(() => {
                balanceElement.style.animation = '';
            }, 1000);
        }
        
        if (Math.random() > 0.8 && currentHold > 0) {
            const released = Math.floor(Math.random() * currentHold / 2);
            const newBalance = currentBalance + released;
            const newHold = currentHold - released;
            
            balanceElement.textContent = `${newBalance.toLocaleString()} ₽`;
            holdElement.textContent = `${newHold.toLocaleString()} ₽`;
            menuBalance.textContent = `${newBalance.toLocaleString()} ₽`;
            menuHold.textContent = `${newHold.toLocaleString()} ₽`;
        }
    }, 10000); // Обновление каждые 10 секунд
}

// Запускаем симуляцию обновления баланса через 5 секунд после загрузки
setTimeout(simulateBalanceUpdate, 5000);

// Обработка закрытия приложения
window.addEventListener('beforeunload', function() {
    if (tg) {
        tg.close();
    }
});
