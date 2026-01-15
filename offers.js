// offers.js - Управление офферами
const offersConfig = {
    // Топ офферы на главной
    topOffers: [
        {
            id: 1,
            title: "Тинькофф Платинум",
            reward: "+3 500 ₽",
            category: "credit",
            icon: "fa-credit-card",
            badge: "🔥 Топ-1",
            image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=200&fit=crop",
            description: "Оформите кредитную карту с бесплатным обслуживанием",
            link: "https://tinkoff.ru",
            requirements: "Паспорт РФ, возраст 18+"
        },
        {
            id: 2,
            title: "Открытие ИП",
            reward: "+8 000 ₽",
            category: "business",
            icon: "fa-building",
            badge: "🔥 Топ-2",
            image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=300&h=200&fit=crop",
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
            image: "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=300&h=200&fit=crop",
            description: "Получите микрозайм на выгодных условиях",
            link: "https://webbankir.com",
            requirements: "Паспорт РФ, возраст 21+"
        }
    ],
    
    // Все категории
    categories: {
        debit: {
            name: "Дебетовые карты",
            icon: "fa-credit-card",
            color: "linear-gradient(135deg, #00f3ff, #00a8ff)",
            stats: "12 предложений • до 4.500 ₽",
            offers: [
                { id: 101, title: "Альфа-Банк Premium", reward: "+1 200 ₽" },
                { id: 102, title: "Тинькофф Black", reward: "+1 500 ₽" },
                { id: 103, title: "Сбербанк Premier", reward: "+1 000 ₽" }
            ]
        },
        credit: {
            name: "Кредитные карты",
            icon: "fa-file-invoice-dollar",
            color: "linear-gradient(135deg, #b967ff, #9d4edd)",
            stats: "8 предложений • до 8.700 ₽",
            offers: [
                { id: 201, title: "Тинькофф Платинум", reward: "+3 500 ₽" },
                { id: 202, title: "Альфа-Банк Кредитная", reward: "+2 800 ₽" },
                { id: 203, title: "ВТБ Кредитная карта", reward: "+2 100 ₽" }
            ]
        },
        business: {
            name: "Бизнес + РКО счета",
            icon: "fa-building",
            color: "linear-gradient(135deg, #ff2a9d, #ff006e)",
            stats: "6 предложений • до 15.000 ₽",
            offers: [
                { id: 301, title: "Открытие ИП", reward: "+8 000 ₽" },
                { id: 302, title: "РКО Тинькофф", reward: "+5 000 ₽" },
                { id: 303, title: "РКО Модульбанк", reward: "+4 500 ₽" }
            ]
        },
        loan: {
            name: "Микрозаймы",
            icon: "fa-coins",
            color: "linear-gradient(135deg, #ffde00, #ff9e00)",
            stats: "15 предложений • до 2.500 ₽",
            offers: [
                { id: 401, title: "Webbankir", reward: "+1 800 ₽" },
                { id: 402, title: "MoneyMan", reward: "+1 500 ₽" },
                { id: 403, title: "Займер", reward: "+1 200 ₽" }
            ]
        },
        yandex: {
            name: "Яндекс Еда - курьеры",
            icon: "fa-motorcycle",
            color: "linear-gradient(135deg, #ff0055, #ff5500)",
            stats: "Безлимит • 1.500 ₽/чел",
            offers: [
                { id: 501, title: "Курьер пеший", reward: "+1 500 ₽" },
                { id: 502, title: "Курьер на авто", reward: "+1 500 ₽" },
                { id: 503, title: "Курьер на велосипеде", reward: "+1 500 ₽" }
            ]
        }
    }
};

// Функция для добавления нового оффера
function addNewOffer(category, offerData) {
    if (offersConfig.categories[category]) {
        offersConfig.categories[category].offers.push(offerData);
        console.log(`✅ Оффер "${offerData.title}" добавлен в категорию "${category}"`);
    }
}

// Пример добавления оффера:
// addNewOffer('debit', {
//     id: 104,
//     title: "ВТБ Дебетовая",
//     reward: "+900 ₽"
// });
