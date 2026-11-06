# VELVET — подарок для Юки

Чистые HTML + CSS + JavaScript, без сборки.

## Запуск
Из-за `fetch()` сайт нельзя открывать двойным кликом. В папке проекта:
`python3 -m http.server 8000` → http://localhost:8000 (админка: /admin.html)

## Что заменить
- `assets/photo.jpg` — ваша общая фотография.
- `assets/music/` — MP3-файлы; названия и пути в `data/playlist.json` (минимум 5 треков, поле `art` — обложка, можно пустым).
- `data/content.json` — все тексты (en и ru), письмо, секретное сообщение, подпись к фото. Три карточки «Her little world» — заглушки в квадратных скобках, впишите свои слова.

## Supabase (гостевая книга и админка)
1. Создайте проект на supabase.com.
2. SQL Editor → вставьте `supabase/setup.sql` → Run.
3. Authentication → Users → Add user (ваш email и пароль). В Authentication → Sign In / Providers отключите публичную регистрацию (Allow new users to sign up).
4. Выполните в SQL Editor последнюю закомментированную строку из `setup.sql` со своим email — это делает вас администратором.
5. Settings → API: скопируйте Project URL и anon public key в `js/config.js`. Ключ `service_role` не используйте нигде.

Деплой с переменными окружения (Netlify/Vercel): в build command сгенерируйте конфиг:
`echo "window.VELVET_CONFIG={SUPABASE_URL:\"$SUPABASE_URL\",SUPABASE_ANON_KEY:\"$SUPABASE_ANON_KEY\"};" > js/config.js`
Anon-ключ публичный по замыслу: защиту дают политики RLS (читать и удалять может только админ из таблицы `admins`).

## Публикация
Подойдёт любой статический хостинг (Netlify, Vercel, GitHub Pages, Cloudflare Pages): загрузите папку целиком.
