[![Tests](../../actions/workflows/tests-13-sprint.yml/badge.svg)](../../actions/workflows/tests-13-sprint.yml) [![Tests](../../actions/workflows/tests-14-sprint.yml/badge.svg)](../../actions/workflows/tests-14-sprint.yml)
# Проект Mesto фронтенд + бэкенд
https://github.com/OlgaKriukova/express-mesto-gha

## Директории1

`/routes` — папка с файлами роутера  
`/controllers` — папка с файлами контроллеров пользователя и карточки   
`/models` — папка с файлами описания схем пользователя и карточки  
  
Остальные директории вспомогательные, создаются при необходимости разработчиком

## Запуск проекта

`npm run start` — запускает сервер   
`npm run dev` — запускает сервер с hot-reload


## Описание проекта

Проект Mesto фронтенд + бэкенд является учебным проектом по созданию бэкенда с использованием Node.js, и бызы данных MongoDB.
В этой части мы реализовали авторизацию и регистрацию пользователя с использованием JWT токенов, а так же дополнительные проверки роутов с использованием middleware Joi и celebrate.
