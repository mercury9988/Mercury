// data.js - Конфигурация офферов и данных сайта

// Топ офферы на главной
const topOffers = [
    {
        id: 1,
        title: "Тинькофф Платинум",
        reward: "+3 500 ₽",
        category: "credit",
        icon: "fa-credit-card",
        badge: "🔥 Топ-1",
        image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=200&fit=crop",
        description: "Оформите кредитную карту Тинькофф с бесплатным обслуживанием и кэшбэком до 30%",
        link: "https://tinkoff.ru",
        requirements: "Возраст 18+, паспорт РФ"
    },
    {
        id: 2,
        title: "Открытие ИП",
        reward: "+8 000 ₽",
        category: "business",
        icon: "fa-building",
        badge: "🔥 Топ-2",
        image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=200&fit=crop",
        description: "Регистрация ИП с открытием расчётного счёта",
        link: "https://www.open.ru",
        requirements: "Паспорт РФ, ИНН"
    },
    {
        id: 3,
        title: "Webbankir Займ",
        reward: "+1 800 ₽",
        category: "loan",
        icon: "fa-coins",
        badge: "🔥 Топ-3",
        image: "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=400&h=200&fit=crop",
        description: "Получите микрозайм на выгодных условиях",
        link: "https://webbankir.com",
        requirements: "Паспорт РФ, возраст 21+"
    }
];

// Категории заработка
const categories = [
    {
        id: "debit",
        name: "Дебетовые карты",
        icon: "fa-credit-card",
        color: "var(--neon-blue)",
        stats: "12 предложений • до 4.500 ₽",
        offers: [
            { id: 101, title: "Альфа-Банк Premium", reward: "+1 200 ₽" },
            { id: 102, title: "Тинькофф Black", reward: "+1 500 ₽" },
            { id: 103, title: "Сбербанк Premier", reward: "+1 000 ₽" },
            { id: 104, title: "ВТБ МИР", reward: "+900 ₽" }
        ]
    },
    {
        id: "credit",
        name: "Кредитные карты",
        icon: "fa-file-invoice-dollar",
        color: "var(--neon-purple)",
        stats: "8 предложений • до 8.700 ₽",
        offers: [
            { id: 201, title: "Тинькофф Платинум", reward: "+3 500 ₽" },
            { id: 202, title: "Альфа-Банк Кредитная", reward: "+2 800 ₽" },
            { id: 203, title: "ВТБ Кредитная карта", reward: "+2 100 ₽" },
            { id: 204, title: "Сбербанк Кредитная", reward: "+1 800 ₽" }
        ]
    },
    {
        id: "business",
        name: "Бизнес + РКО счета",
        icon: "fa-building",
        color: "var(--neon-pink)",
        stats: "6 предложений • до 15.000 ₽",
        offers: [
            { id: 301, title: "Открытие ИП", reward: "+8 000 ₽" },
            { id: 302, title: "РКО Тинькофф", reward: "+5 000 ₽" },
            { id: 303, title: "РКО Модульбанк", reward: "+4 500 ₽" },
            { id: 304, title: "РКО Альфа-Банк", reward: "+4 000 ₽" }
        ]
    },
    {
        id: "loan",
        name: "Микрозаймы",
        icon: "fa-coins",
        color: "var(--neon-orange)",
        stats: "15 предложений • до 2.500 ₽",
        offers: [
            { id: 401, title: "Webbankir", reward: "+1 800 ₽" },
            { id: 402, title: "MoneyMan", reward: "+1 500 ₽" },
            { id: 403, title: "Займер", reward: "+1 200 ₽" },
            { id: 404, title: "МигКредит", reward: "+1 000 ₽" }
        ]
    },
    {
        id: "yandex",
        name: "Яндекс Еда - курьеры",
        icon: "fa-motorcycle",
        color: "var(--neon-red)",
        stats: "Безлимит • 1.500 ₽/чел",
        offers: [
            { id: 501, title: "Курьер пеший", reward: "+1 500 ₽" },
            { id: 502, title: "Курьер на авто", reward: "+1 500 ₽" },
            { id: 503, title: "Курьер на велосипеде", reward: "+1 500 ₽" },
            { id: 504, title: "Курьер на самокате", reward: "+1 500 ₽" }
        ]
    }
];

// Настройки сайта
const siteConfig = {
    name: "Mercury Bot",
    telegramSupport: "https://t.me/GoogleAsistent",
    minWithdrawal: 500,
    adminPassword: "mercury2024", // Измените этот пароль!
    adminTelegram: "https://t.me/GoogleAsistent",
    version: "1.0.0"
};

// Системные сообщения
const messages = {
    welcome: "Оформление услуг только по ссылкам. Не пытайтесь обмануть сайт",
    withdrawalSuccess: "Заявка на выплату отправлена! Ожидайте поступления средств в течение 24 часов.",
    withdrawalError: "Минимальная сумма вывода 500 ₽",
    offerCompleted: "Переход к офферу выполнен. Заполните заявку полностью для получения вознаграждения."
};

// Функции для работы с данными
function getTopOffers() {
    return topOffers;
}

function getCategories() {
    return categories;
}

function getSiteConfig() {
    return siteConfig;
}

function addOffer(categoryId, offer) {
    const category = categories.find(cat => cat.id === categoryId);
    if (category) {
        category.offers.push(offer);
        saveToLocalStorage();
        return true;
    }
    return false;
}

function updateOffer(categoryId, offerId, newData) {
    const category = categories.find(cat => cat.id === categoryId);
    if (category) {
        const offerIndex = category.offers.findIndex(offer => offer.id === offerId);
        if (offerIndex !== -1) {
            category.offers[offerIndex] = { ...category.offers[offerIndex], ...newData };
            saveToLocalStorage();
            return true;
        }
    }
    return false;
}

function deleteOffer(categoryId, offerId) {
    const category = categories.find(cat => cat.id === categoryId);
    if (category) {
        const initialLength = category.offers.length;
        category.offers = category.offers.filter(offer => offer.id !== offerId);
        if (category.offers.length < initialLength) {
            saveToLocalStorage();
            return true;
        }
    }
    return false;
}

// Сохранение в localStorage
function saveToLocalStorage() {
    const data = {
        topOffers,
        categories,
        lastUpdated: new Date().toISOString()
    };
    localStorage.setItem('mercury_data', JSON.stringify(data));
}

// Загрузка из localStorage
function loadFromLocalStorage() {
    const saved = localStorage.getItem('mercury_data');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            if (data.topOffers && data.categories) {
                topOffers.length = 0;
                topOffers.push(...data.topOffers);
                
                categories.length = 0;
                categories.push(...data.categories);
                
                console.log('Данные загружены из localStorage');
            }
        } catch (e) {
            console.error('Ошибка загрузки данных:', e);
        }
    }
}

// Инициализация
loadFromLocalStorage();

// Экспорт для использования в других файлах
window.mercuryData = {
    getTopOffers,
    getCategories,
    getSiteConfig,
    addOffer,
    updateOffer,
    deleteOffer,
    saveToLocalStorage,
    messages
};
