export default {
translation: {
    rssForm: {
        errors: {
            invalid_url: 'Ссылка должна быть валидным URL',
            url_required: 'Не должно быть пустым',
            url_exists: 'RSS уже существует',
            no_rss: 'Ресурс не содержит валидный RSS',
            network_error: 'Ошибка сети'
        },
        messages: {
            success: 'RSS успешно загружен',
        },
        },
    feeds: {
        defaultTitle: 'Без названия',
        defaultDesc: 'Без описания',
        
    },
    template: {
        feeds: {
            title: "Фиды"
        },
        posts: {
            title: "Посты"
        },
        mainForm: {
            example: "Пример: https://lorem-rss.hexlet.app/feed",
            message: "Начните читать RSS сегодня! Это легко, это красиво.",
            title: "RSS агрегатор",
            addButton: "Добавить"
        }
    }
}
}