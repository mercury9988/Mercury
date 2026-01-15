// Инициализация приложения
document.addEventListener('DOMContentLoaded', function() {
    console.log('Mercury Partner приложение запущено');
    
    // Инициализация вкладок
    initTabs();
    
    // Инициализация FAQ
    initFAQ();
    
    // Инициализация темы
    initTheme();
    
    // Инициализация кнопок
    initButtons();
    
    // Инициализация данных пользователя
    initUserData();
    
    // Инициализация уведомлений
    initNotifications();
    
    // Инициализация Telegram WebApp (если есть)
    initTelegramWebApp();
});

// Переключение вкладок
function initTabs() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Удаляем активный класс у всех кнопок навигации
            navItems.forEach(navItem => {
                navItem.classList.remove('active');
            });
            
            // Добавляем активный класс текущей кнопке
            this.classList.add('active');
            
            // Скрываем все вкладки
            document.querySelectorAll('.tab-content').forEach(tab => {
                tab.classList.remove('active');
            });
            
            // Показываем выбранную вкладку
            document.getElementById(tabId).classList.add('active');
            
            // Показываем уведомление о переключении (только не на главной)
            if (tabId !== 'home') {
                const tabNames = {
                    'earnings': 'Заработок',
                    'support': 'Поддержка',
                    'menu': 'Меню'
                };
                showNotification(`Открыта вкладка "${tabNames[tabId]}"`);
            }
        });
    });
}

// Инициализация FAQ
function initFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.parentElement;
            const isActive = faqItem.classList.contains('active');
            
            // Закрываем все вопросы
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Открываем текущий, если он был закрыт
            if (!isActive) {
                faqItem.classList.add('active');
            }
        });
    });
}

// Инициализация темы
function initTheme() {
    // Проверяем сохранённую тему
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    
    // Обработка переключателя темы в меню
    const themeOptions = document.querySelectorAll('.theme-option');
    themeOptions.forEach(option => {
        option.addEventListener('click', function() {
            const theme = this.getAttribute('data-theme');
            
            // Удаляем активный класс у всех опций
            themeOptions.forEach(opt => opt.classList.remove('active'));
            
            // Добавляем активный класс текущей опции
            this.classList.add('active');
            
            // Устанавливаем тему
            setTheme(theme);
            
            // Показываем уведомление
            showNotification(`Тема изменена на ${theme === 'dark' ? 'тёмную' : 'светлую'}`);
        });
    });
    
    // Кнопка переключения темы в шапке
    document.getElementById('themeToggle').addEventListener('click', function() {
        const currentTheme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // Устанавливаем новую тему
        setTheme(newTheme);
        
        // Обновляем переключатель в меню
        document.querySelectorAll('.theme-option').forEach(option => {
            option.classList.toggle('active', option.getAttribute('data-theme') === newTheme);
        });
        
        // Анимация кнопки
        this.style.transform = 'rotate(180deg)';
        setTimeout(() => {
            this.style.transform = 'rotate(0deg)';
        }, 300);
        
        showNotification(`Тема изменена на ${newTheme === 'dark' ? 'тёмную' : 'светлую'}`);
    });
}

// Установка темы
function setTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.remove('light-theme');
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
    }
    
    // Сохраняем в localStorage
    localStorage.setItem('theme', theme);
}

// Инициализация кнопок
function initButtons() {
    // Кнопка "Перейти к заработку" на главной
    document.querySelector('.start-earning').addEventListener('click', function() {
        showNotification('Переходим к предложениям...');
        
        // Переключаем на вкладку заработка
        setTimeout(() => {
            document.querySelector('[data-tab="earnings"]').click();
        }, 500);
    });
    
    // Кнопка "Заказать выплату" в меню
    document.querySelector('.withdraw-btn').addEventListener('click', function() {
        showNotification('Открываем форму заказа выплаты...');
        
        // В реальном приложении здесь будет модальное окно с формой
        setTimeout(() => {
            showNotification('Минимальная сумма для вывода: 500 ₽');
        }, 1000);
    });
    
    // Кнопка "FAQ" в поддержке
    document.querySelector('.faq-btn').addEventListener('click', function() {
        showNotification('Открываем FAQ...');
        
        // Прокручиваем к FAQ
        const faqSection = document.querySelector('.faq-section');
        faqSection.scrollIntoView({ behavior: 'smooth' });
    });
    
    // Кнопка "Поддержка" в поддержке
    document.querySelector('.contact-btn').addEventListener('click', function() {
        showNotification('Открываем чат с поддержкой...');
        
        // В реальном приложении здесь будет открытие чата
        setTimeout(() => {
            showNotification('Поддержка ответит вам в течение 5 минут');
        }, 800);
    });
    
    // Кнопка "Посмотреть все отзывы"
    document.querySelector('.view-all-reviews').addEventListener('click', function() {
        showNotification('Загружаем все отзывы...');
        
        // В реальном приложении здесь будет загрузка отзывов
        setTimeout(() => {
            showNotification('Все отзывы будут загружены в новом окне');
        }, 800);
    });
    
    // Клики по предложениям в разделе заработка
    document.querySelectorAll('.offer-item').forEach(offer => {
        offer.addEventListener('click', function() {
            const offerName = this.querySelector('.offer-name').textContent;
            const offerReward = this.querySelector('.offer-reward').textContent;
            
            showNotification(`Открываем оформление: ${offerName}`);
            
            // В реальном приложении здесь будет переход по партнёрской ссылке
            // window.open('https://example.com/offer', '_blank');
        });
    });
    
    // Клики по настройкам в меню
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function(e) {
            if (this.id === 'themeSelector') return;
            
            const itemName = this.querySelector('h4').textContent;
            
            if (itemName.includes('История операций')) {
                showNotification('Загружаем историю операций...');
            } else if (itemName.includes('Отзывы')) {
                showNotification('Открываем отзывы...');
            } else if (itemName.includes('Реферальная')) {
                showNotification('Открываем реферальную программу...');
            }
        });
    });
}

// Инициализация данных пользователя
function initUserData() {
    // В реальном приложении здесь будет запрос к API или получение данных из Telegram
    
    // Имитация загрузки данных
    setTimeout(() => {
        // Установим случайный ID пользователя для демонстрации
        const randomId = Math.floor(Math.random() * 1000000000);
        document.getElementById('userId').textContent = randomId;
        
        // Можно загрузить и другие данные пользователя
        console.log('Данные пользователя загружены');
    }, 1000);
}

// Инициализация уведомлений
function initNotifications() {
    // Система уже готова, можно добавить дополнительные уведомления
}

// Показать уведомление
function showNotification(message) {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notification-text');
    
    notificationText.textContent = message;
    notification.style.display = 'block';
    
    // Автоматическое скрытие через 3 секунды
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

// Инициализация Telegram WebApp
function initTelegramWebApp() {
    if (typeof window.Telegram !== 'undefined') {
        const tg = window.Telegram.WebApp;
        
        // Расширить на весь экран
        tg.expand();
        
        // Получить данные пользователя из Telegram
        const user = tg.initDataUnsafe?.user;
        
        if (user) {
            // Обновить имя пользователя
            const userNameElements = document.querySelectorAll('.profile-info h3');
            userNameElements.forEach(el => {
                el.textContent = user.first_name || 'Пользователь';
            });
            
            // Обновить ID
            if (user.id) {
                document.getElementById('userId').textContent = user.id;
            }
            
            // Настроить кнопку Telegram
            tg.MainButton.setParams({
                text: 'ОТКРЫТЬ БОТА',
                color: '#3b82f6',
                text_color: '#ffffff'
            });
            
            tg.MainButton.onClick(() => {
                tg.openTelegramLink('https://t.me/PKOTESTBOT');
            });
            
            tg.MainButton.show();
        }
        
        // Настроить тему Telegram
        tg.setHeaderColor('#3b82f6');
        tg.setBackgroundColor('#f8f9fa');
        
        // Если у пользователя тёмная тема в Telegram
        if (tg.colorScheme === 'dark') {
            setTheme('dark');
            document.querySelector('.theme-option[data-theme="dark"]').classList.add('active');
            document.querySelector('.theme-option[data-theme="light"]').classList.remove('active');
        }
    }
}

// Обновление времени (если нужно)
function updateTime() {
    const timeElements = document.querySelectorAll('.current-time');
    if (timeElements.length > 0) {
        const now = new Date();
        const timeString = now.toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit'
        });
        
        timeElements.forEach(el => {
            el.textContent = timeString;
        });
    }
}

// Обновление времени каждую минуту
setInterval(updateTime, 60000);
updateTime();

// Анимация загрузки
function simulateLoading() {
    const loadingElements = document.querySelectorAll('.loading');
    
    loadingElements.forEach(el => {
        el.classList.remove('loading');
    });
}

// Убираем анимацию загрузки через 1 секунду
setTimeout(simulateLoading, 1000);