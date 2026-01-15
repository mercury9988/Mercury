// offers.js - Конфигурация офферов
const offersConfig = {
    topOffers: [
        {
            id: 1,
            title: "Тинькофф Платинум",
            reward: "+3 500 ₽",
            category: "credit",
            icon: "fa-credit-card",
            image: "https://via.placeholder.com/300x200/00f3ff/000?text=Tinkoff",
            description: "Оформите кредитную карту Тинькофф с бесплатным обслуживанием и кэшбэком до 30%",
            link: "https://tinkoff.ru/offer",
            requirements: "Возраст 18+, паспорт РФ"
        },
        // Добавьте другие офферы
    ],
    
    categories: {
        debit: {
            name: "Дебетовые карты",
            icon: "fa-credit-card",
            color: "var(--neon-blue)",
            offers: [
                {
                    id: 101,
                    title: "Альфа-Банк Premium",
                    reward: "+1 200 ₽",
                    image: "https://via.placeholder.com/300x200/b967ff/000?text=Alpha",
                    link: "#"
                },
                // Добавьте больше офферов
            ]
        },
        // Другие категории
    }
};