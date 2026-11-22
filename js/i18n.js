/* ================================================================
   HubPad — js/i18n.js
   Все строки интерфейса живут здесь. Код приложения не содержит
   текста: он обращается к ключам через HubPadI18n.t('ключ').

   КАК ДОБАВИТЬ НОВЫЙ ЯЗЫК (например, немецкий):
     HubPadI18n.register('de',
       { tag:'de-DE', name:'Deutsch', english:'German', dir:'ltr' },
       { ...словарь по образцу ниже... });
   Кнопка выбора языка, палитра команд и форматирование чисел,
   дат и множественных форм подхватят новый язык автоматически.
   Недостающие ключи откатываются на русский, затем на сам ключ.
   ================================================================ */
(function(){
'use strict';

const STORAGE_KEY = 'hubpad.lang';

/* ---------------- РУССКИЙ ---------------- */
const RU = {
  app:{
    title:'HubPad — HTML-редактор в стиле GitHub',
    noscript:'HubPad требует включённый JavaScript.',
    lang:'Язык интерфейса'
  },
  top:{
    public:'Public',
    search:'Поиск или команда…',
    searchTitle:'Поиск и команды (Ctrl+K)',
    toLight:'Светлая тема',
    toDark:'Тёмная тема',
    download:'Скачать',
    downloadTitle:'Скачать файл с выбранным именем (Ctrl+S)',
    open:'Открыть',
    star:'Звезда',
    starred:'Звезда есть',
    starTitle:'Отметить проект звездой'
  },
  sidebar:{
    title:'Файлы проекта',
    filter:'Фильтр по имени…',
    filterClear:'Очистить фильтр',
    sort:'Сортировка файлов',
    sortManual:'Свой порядок',
    sortName:'По имени',
    sortUpdated:'По изменению',
    sortSize:'По размеру',
    new:'Новый файл',
    import:'Импортировать файлы',
    empty:'В проекте пока нет файлов.<br>Создайте новый или импортируйте свои.',
    emptyFiltered:'Ничего не найдено по фильтру «{query}»',
    usage:'{count} · {size} · локально',
    drag:'Перетащите, чтобы изменить порядок',
    select:'Выбрать {name}',
    actions:'Действия с файлом',
    divider:'Потяните, чтобы изменить ширину'
  },
  bulk:{
    zip:'Скачать выбранные как .zip',
    del:'Удалить выбранные',
    clear:'Снять выделение',
    zipDone:'Выбранные файлы скачаны как hubpad-selection.zip'
  },
  tabs:{ close:'Закрыть вкладку', closeNamed:'Закрыть {name}' },
  toolbar:{
    sidebar:'Показать/скрыть файлы (Ctrl+B)',
    sidebarAria:'Показать или скрыть панель файлов',
    rename:'Переименовать файл',
    undo:'Отменить (Ctrl+Z)',
    undoAria:'Отменить',
    redo:'Повторить (Ctrl+Shift+Z)',
    redoAria:'Повторить',
    copy:'Скопировать содержимое файла',
    wrap:'Перенос строк (Alt+Z)',
    indent:'Ширина отступа',
    indentOpt:'Отступ: {n}',
    fontMinus:'Уменьшить шрифт',
    fontPlus:'Увеличить шрифт',
    layout:'Режим отображения',
    code:'Код', codeTitle:'Только код',
    split:'Сплит', splitTitle:'Код и предпросмотр',
    preview:'Превью', previewTitle:'Только предпросмотр'
  },
  editor:{
    aria:'Редактор кода',
    emptyTitle:'Нет открытого файла',
    emptyText:'Создайте новый файл, импортируйте свой или откройте что-нибудь из проекта.',
    new:'Новый файл',
    import:'Импорт',
    commentUnsupported:'Комментарии не поддерживаются для этого типа файла'
  },
  status:{
    branchTitle:'Локальный проект',
    saved:'Сохранено',
    saving:'Сохранение…',
    memory:'Только в памяти',
    lnCol:'Стр {line}, кол {col}',
    selected:'Выделено: {n}',
    indent:'Пробелы: {n}',
    problems:'Быстрая проверка кода',
    ok:'Без проблем'
  },
  preview:{
    title:'Предпросмотр',
    auto:'Авто',
    autoTitle:'Обновлять предпросмотр при вводе',
    autoAria:'Автообновление предпросмотра',
    refresh:'Обновить предпросмотр',
    open:'Открыть в новой вкладке (Ctrl+Enter)',
    close:'Скрыть предпросмотр',
    device:'Ширина предпросмотра',
    mobile:'Мобильный · 375px',
    tablet:'Планшет · 768px',
    full:'Во всю ширину',
    stale:'Есть изменения — обновите',
    chipOpen:'Открыть {name} в редакторе',
    chipAsset:'Предпросмотр: {target} (использует {asset})',
    iframe:'Предпросмотр страницы',
    divider:'Потяните, чтобы изменить ширину · двойной клик — сброс',
    emptyTitle:'Нечего показывать',
    emptyText:'Добавьте HTML-страницу, SVG или Markdown — предпросмотр оживёт сам.',
    emptyAction:'Создать HTML-страницу',
    nav:'Переход: {name}'
  },
  palette:{
    aria:'Палитра команд',
    placeholder:'Файл, текст в коде или команда…',
    inputAria:'Поиск файлов и команд',
    nav:'навигация',
    open:'открыть',
    cmd:'только команды',
    recent:'Недавние файлы',
    commands:'Команды',
    files:'Файлы',
    matches:'Совпадения в коде',
    line:'стр. {n}',
    empty:'Ничего не найдено. Попробуйте «>» для списка команд.'
  },
  download:{
    title:'Скачать файл',
    name:'Имя файла',
    empty:'Введите имя файла',
    bad:'Недопустимые символы в имени',
    hint:'Будет сохранён как {name} · {size}',
    hintStandalone:' · автономный',
    standalone:'Автономная страница — встроить связанные CSS, JS и SVG прямо в файл',
    go:'Скачать файл',
    zip:'Скачать проект (.zip)',
    zipNote:'Все файлы проекта: {count} · {size}',
    done:'Скачан «{name}» · {size}',
    noFile:'Нет открытого файла',
    emptyProject:'Проект пуст',
    zipDone:'Проект скачан как playground.zip'
  },
  menu:{
    open:'Открыть', rename:'Переименовать', dup:'Дублировать',
    dl:'Скачать', info:'Сведения', del:'Удалить'
  },
  problems:{
    title:'Быстрая проверка',
    note:'теги и скобки · эвристика',
    ok:'Явных проблем не найдено',
    unclosed:'Не закрыт тег <{tag}>',
    extra:'Лишний закрывающий тег </{tag}>',
    stray:'Непарная скобка «{ch}»',
    unclosedBracket:'Не закрыта скобка «{ch}»'
  },
  drawer:{
    title:'Сведения о файле',
    size:'Размер', lines:'Строк', chars:'Символов',
    created:'Создан', updated:'Изменён', encoding:'Кодировка',
    open:'Открыть в редакторе', rename:'Переименовать', dup:'Дублировать',
    dl:'Скачать…', del:'Удалить файл'
  },
  modal:{ cancel:'Отмена', close:'Закрыть', ok:'Понятно', dialog:'Диалог' },
  file:{
    newTitle:'Новый файл',
    renameTitle:'Переименовать файл',
    name:'Имя файла',
    placeholder:'например, page.html',
    phEmpty:'например, notes.txt',
    phMd:'например, README.md',
    phTpl:'например, page.{ext}',
    hintRename:'Расширение определяет подсветку и предпросмотр',
    hintNew:'Без расширения файл будет обычным текстом',
    willCreate:'Будет создан: {name}',
    currentName:'Текущее имя',
    newName:'Новое имя: {name}',
    create:'Создать файл',
    rename:'Переименовать',
    created:'Создан файл «{name}»',
    renamed:'Переименовано в «{name}»',
    duplicated:'Создана копия: «{name}»',
    deletedOne:'Удалён файл «{name}»',
    deletedMany:'Удалено {count}',
    undo:'Отменить',
    restored:'Восстановлено',
    imported:'Импортировано: {count}',
    skipped:' · пропущено: {n}',
    importBad:'Файлы не подошли: текстовые форматы до 1,5 МБ'
  },
  validate:{
    empty:'Введите имя файла',
    tooLong:'Слишком длинное имя (макс. 64 символа)',
    badChars:'Недопустимые символы: \\ / : * ? " < > | # % &',
    exists:'Файл «{name}» уже существует'
  },
  tpl:{
    empty:'Пустой', emptyDesc:'чистый лист',
    html:'HTML', htmlDesc:'каркас страницы',
    css:'CSS', cssDesc:'базовые стили',
    js:'JS', jsDesc:'скрипт-модуль',
    svg:'SVG', svgDesc:'векторная иконка',
    md:'Markdown', mdDesc:'документ'
  },
  shortcuts:{
    title:'Горячие клавиши',
    app:'Приложение', editor:'Редактор',
    kPalette:'Палитра: файлы, поиск в коде, команды',
    kSave:'Скачать текущий файл',
    kDeploy:'Открыть страницу в новой вкладке',
    kSidebar:'Показать / скрыть панель файлов',
    kWrap:'Перенос длинных строк',
    kHelp:'Это окно',
    kUndo:'Отменить',
    kRedo:'Повторить',
    kComment:'Закомментировать строки',
    kDup:'Дублировать строку',
    kTab:'Отступ · Shift+Tab — назад',
    kEnter:'Умный перенос с отступом',
    note:'На macOS вместо Ctrl используйте ⌘. Скобки и кавычки закрываются автоматически. HubPad не аффилирован с GitHub, Inc.'
  },
  legal:{
    short:'Не аффилирован с GitHub, Inc.',
    more:'Подробнее',
    title:'О проекте и дисклеймер',
    p1:'<b>HubPad</b> — независимый редактор кода с интерфейсом, вдохновлённым оформлением GitHub.',
    p2:'Проект <b>не аффилирован с GitHub, Inc.</b>, не спонсируется и не одобряется ею. GitHub и логотип GitHub (Invertocat) — товарные знаки GitHub, Inc. В HubPad не используются логотипы, фирменные знаки и исходный код GitHub.',
    p3:'Цветовая палитра близка к открытой дизайн-системе Primer (MIT); сам код Primer в проект не включён. Иконки и логотип HubPad нарисованы отдельно для этого проекта. Демо-проект Pulse — оригинальный пример.',
    p4:'Редактор предоставляется «как есть», без каких-либо гарантий. Все файлы хранятся локально в браузере и никуда не отправляются.'
  },
  commands:{
    new:'Создать новый файл',
    dl:'Скачать текущий файл…',
    zip:'Скачать проект как .zip',
    deploy:'Открыть страницу в новой вкладке',
    import:'Импортировать файлы…',
    theme:'Переключить тему (светлая / тёмная)',
    sidebar:'Показать / скрыть панель файлов',
    split:'Режим: код и предпросмотр',
    code:'Режим: только код',
    preview:'Режим: только предпросмотр',
    keys:'Горячие клавиши',
    legal:'О проекте и дисклеймер',
    lang:'Переключить язык интерфейса',
    reset:'Сбросить демо-проект'
  },
  reset:{
    title:'Сбросить проект?',
    text:'Все файлы будут заменены исходным демо-проектом Pulse на текущем языке интерфейса. Ваши изменения потеряются.',
    action:'Сбросить',
    done:'Демо-проект восстановлен'
  },
  deploy:{
    noPage:'Нет страницы для открытия — создайте HTML-файл',
    noPageTitle:'Нет страницы для открытия',
    openTitle:'Открыть «{name}» в новой вкладке (Ctrl+Enter)',
    blocked:'Браузер заблокировал новую вкладку',
    retry:'Повторить',
    failed:'Не удалось открыть: {error}',
    site:'Сайт открыт в новой вкладке · {count}, ссылки работают',
    page:'Страница «{name}» открыта в новой вкладке',
    preview:'Предпросмотр «{name}» открыт в новой вкладке'
  },
  toast:{
    storageOff:'Автосохранение недоступно — изменения живут только в этой вкладке',
    storageWarn:'Локальное хранилище недоступно — проект не сохранится после закрытия',
    welcome:'Демо-проект Pulse загружен. Ctrl+K — палитра команд.',
    copied:'Скопировано {count}',
    copyFailed:'Не удалось скопировать — выделите текст и нажмите Ctrl+C',
    langChanged:'Язык интерфейса: {name}'
  },
  copy:{ zip:'.zip' },
  units:{ b:'Б', kb:'КБ', mb:'МБ' },
  time:{ now:'только что', sec:'{n} с назад', min:'{n} мин назад', hour:'{n} ч назад', day:'{n} дн назад' },
  filetype:{ html:'HTML', css:'CSS', js:'JavaScript', md:'Markdown', plain:'Текст', svg:'SVG', json:'JSON' },
  plural:{
    files:{ one:'файл', few:'файла', many:'файлов', other:'файла' },
    pages:{ one:'страница', few:'страницы', many:'страниц', other:'страницы' },
    problems:{ one:'проблема', few:'проблемы', many:'проблем', other:'проблемы' },
    symbols:{ one:'символ', few:'символа', many:'символов', other:'символа' }
  },
  seed:{
    comment:'Фоновые световые пятна',
    cssComment:'Pulse — общие стили',
    jsComment:'Pulse — немного интерактива для демо',
    jsRestart:'перезапуск анимации',
    title:'Pulse — трекер привычек',
    home:'Главная', about:'О проекте',
    chip:'✦ Версия 2.0 — уже здесь',
    h1a:'Привычки, которые', h1b:'держатся дольше',
    lead:'Pulse превращает маленькие ежедневные действия в устойчивый ритм. Отмечайте дни, следите за сериями и не разрывайте цепочку.',
    cta:'Начать бесплатно',
    demo:'＋ Отметить день',
    statDays:'дней подряд', statKeep:'удержание', statRate:'оценка',
    c1t:'Серии', c1p:'Огонёк горит, пока вы не пропускаете день. Простая мотивация, которая работает.',
    c2t:'Статистика', c2p:'Тепловая карта года, лучшие серии и мягкие напоминания без давления.',
    c3t:'Фокус-режим', c3p:'Вечерний ритуал: одна привычка, один тап, ноль лишнего шума.',
    footer:'© {year} Pulse. Сделано с любовью к ритму.',
    aboutTitle:'О проекте — Pulse',
    aboutChip:'О проекте',
    aboutH1a:'Ритм важнее', aboutH1b:'интенсивности',
    aboutLead:'Мы верим, что двадцать минут каждый день сильнее, чем три часа раз в месяц. Поэтому Pulse построен вокруг одной идеи — не разрывать цепочку.',
    quote:'«Мы — то, что мы делаем изо дня в день. Совершенство — не действие, а привычка.»',
    p1:'Один тап — одна отметка. Никаких форм и настроек.',
    p2:'Пропустили день? Серия замораживается, а не сгорает.',
    p3:'Данные остаются на устройстве. Всегда.',
    back:'← На главную',
    readme:'# Pulse — демо-проект HubPad\n\nНебольшой многостраничный сайт, который живёт прямо в редакторе.\nОтредактируйте `styles.css` — предпросмотр обновится сам.\n\n## Файлы\n\n- `index.html` — главная страница\n- `about.html` — страница «О проекте»\n- `styles.css` — общие стили\n- `script.js` — счётчик серии и искры\n- `logo.svg` — логотип\n\n## Как попробовать\n\n1. Нажмите **Открыть ↗** — сайт откроется в новой вкладке.\n2. Перейдите по ссылке «О проекте» — работает даже там.\n3. Скачайте файл под своим именем или весь проект как `.zip`.\n\n> Совет: `Ctrl+K` открывает палитру команд.\n\n## Каркас\n\n```html\n<section class="hero">\n  <h1>Привычки, которые держатся</h1>\n</section>\n```\n\nСделано в **HubPad** — редакторе в стиле GitHub.'
  },
  starter:{
    htmlTitle:'Новая страница',
    htmlH1a:'Привет,', htmlH1b:'мир',
    jsClick:'Клик!',
    md:'# Заголовок\n\nКороткое описание документа.\n\n## Раздел\n\n- Первый пункт\n- Второй пункт\n\n> Цитата или заметка.\n\nКод: `console.log(\'привет\')`'
  },
  diag:{
    title:'HubPad не смог собраться',
    intro:'Разметка на месте, но внешние ресурсы подхватились не все. Вот точный статус:',
    loaded:'— загружен', notLoaded:'— НЕ загружен',
    ran:'— выполнен', notRan:'— НЕ выполнен',
    init:'Инициализация редактора', initOk:'— завершена', initBad:'— не завершена',
    proto:'Протокол страницы: <b>{proto}</b>',
    err:' · браузер сообщил об ошибке загрузки',
    check:'Что проверить',
    content:'Страница открыта через <b>content://</b> (файловый менеджер отдал её как поток). В этом режиме соседние файлы недоступны. Откройте index.html как <b>file://</b> или поднимите локальный сервер и зайдите на http://localhost.',
    noCss:'Файл <b>css/styles.css</b> не найден или пуст. В него нужно вставить всё, что было между &lt;style&gt; и &lt;/style&gt;, <b>без самих тегов</b>.',
    noI18n:'Файл <b>js/i18n.js</b> не загрузился. Без словаря интерфейс не может отрисоваться. Проверьте, что файл лежит в папке js/ и подключён <b>до</b> app.js.',
    noJs:'Файл <b>js/app.js</b> не запустился. Частая причина — скопированы теги &lt;script&gt; и &lt;/script&gt;: внутри .js их быть не должно. Вторая причина — файл лежит не в папке js/.',
    brokenInit:'Скрипт загрузился, но инициализация оборвалась. Откройте консоль браузера (F12 → Console) и посмотрите красную ошибку — обычно это опечатка при копировании.',
    generic:'Проверьте, что рядом с index.html есть папки <b>css</b> и <b>js</b> с файлами внутри, и что имена написаны в нижнем регистре.',
    hide:'Показать страницу как есть',
    retry:'Проверить ещё раз'
  }
};

/* ---------------- ENGLISH ---------------- */
const EN = {
  app:{
    title:'HubPad — a GitHub-flavoured HTML editor',
    noscript:'HubPad needs JavaScript enabled.',
    lang:'Interface language'
  },
  top:{
    public:'Public',
    search:'Search or run a command…',
    searchTitle:'Search and commands (Ctrl+K)',
    toLight:'Light theme',
    toDark:'Dark theme',
    download:'Download',
    downloadTitle:'Download the file under a chosen name (Ctrl+S)',
    open:'Open',
    star:'Star',
    starred:'Starred',
    starTitle:'Star this project'
  },
  sidebar:{
    title:'Project files',
    filter:'Filter by name…',
    filterClear:'Clear filter',
    sort:'Sort files',
    sortManual:'Custom order',
    sortName:'By name',
    sortUpdated:'By modified',
    sortSize:'By size',
    new:'New file',
    import:'Import files',
    empty:'No files in the project yet.<br>Create one or import your own.',
    emptyFiltered:'Nothing matches the filter “{query}”',
    usage:'{count} · {size} · local',
    drag:'Drag to reorder',
    select:'Select {name}',
    actions:'File actions',
    divider:'Drag to resize'
  },
  bulk:{
    zip:'Download selected as .zip',
    del:'Delete selected',
    clear:'Clear selection',
    zipDone:'Selected files downloaded as hubpad-selection.zip'
  },
  tabs:{ close:'Close tab', closeNamed:'Close {name}' },
  toolbar:{
    sidebar:'Show/hide files (Ctrl+B)',
    sidebarAria:'Show or hide the file panel',
    rename:'Rename file',
    undo:'Undo (Ctrl+Z)',
    undoAria:'Undo',
    redo:'Redo (Ctrl+Shift+Z)',
    redoAria:'Redo',
    copy:'Copy file contents',
    wrap:'Word wrap (Alt+Z)',
    indent:'Indent width',
    indentOpt:'Indent: {n}',
    fontMinus:'Decrease font size',
    fontPlus:'Increase font size',
    layout:'View mode',
    code:'Code', codeTitle:'Code only',
    split:'Split', splitTitle:'Code and preview',
    preview:'Preview', previewTitle:'Preview only'
  },
  editor:{
    aria:'Code editor',
    emptyTitle:'No file open',
    emptyText:'Create a file, import your own, or open something from the project.',
    new:'New file',
    import:'Import',
    commentUnsupported:'Comments are not supported for this file type'
  },
  status:{
    branchTitle:'Local project',
    saved:'Saved',
    saving:'Saving…',
    memory:'In memory only',
    lnCol:'Ln {line}, Col {col}',
    selected:'Selected: {n}',
    indent:'Spaces: {n}',
    problems:'Quick code check',
    ok:'No problems'
  },
  preview:{
    title:'Preview',
    auto:'Auto',
    autoTitle:'Refresh the preview as you type',
    autoAria:'Auto-refresh preview',
    refresh:'Refresh preview',
    open:'Open in a new tab (Ctrl+Enter)',
    close:'Hide preview',
    device:'Preview width',
    mobile:'Mobile · 375px',
    tablet:'Tablet · 768px',
    full:'Full width',
    stale:'Unsaved changes — refresh',
    chipOpen:'Open {name} in the editor',
    chipAsset:'Previewing {target} (uses {asset})',
    iframe:'Page preview',
    divider:'Drag to resize · double-click to reset',
    emptyTitle:'Nothing to show',
    emptyText:'Add an HTML page, an SVG or Markdown and the preview comes alive.',
    emptyAction:'Create an HTML page',
    nav:'Navigated to {name}'
  },
  palette:{
    aria:'Command palette',
    placeholder:'A file, text in code, or a command…',
    inputAria:'Search files and commands',
    nav:'navigate',
    open:'open',
    cmd:'commands only',
    recent:'Recent files',
    commands:'Commands',
    files:'Files',
    matches:'Matches in code',
    line:'ln {n}',
    empty:'Nothing found. Type “>” to list every command.'
  },
  download:{
    title:'Download file',
    name:'File name',
    empty:'Enter a file name',
    bad:'Invalid characters in the name',
    hint:'Will be saved as {name} · {size}',
    hintStandalone:' · standalone',
    standalone:'Standalone page — inline the linked CSS, JS and SVG into the file',
    go:'Download file',
    zip:'Download project (.zip)',
    zipNote:'All project files: {count} · {size}',
    done:'Downloaded “{name}” · {size}',
    noFile:'No file open',
    emptyProject:'The project is empty',
    zipDone:'Project downloaded as playground.zip'
  },
  menu:{
    open:'Open', rename:'Rename', dup:'Duplicate',
    dl:'Download', info:'Details', del:'Delete'
  },
  problems:{
    title:'Quick check',
    note:'tags and brackets · heuristic',
    ok:'No obvious problems found',
    unclosed:'Unclosed tag <{tag}>',
    extra:'Unexpected closing tag </{tag}>',
    stray:'Unmatched bracket “{ch}”',
    unclosedBracket:'Unclosed bracket “{ch}”'
  },
  drawer:{
    title:'File details',
    size:'Size', lines:'Lines', chars:'Characters',
    created:'Created', updated:'Modified', encoding:'Encoding',
    open:'Open in editor', rename:'Rename', dup:'Duplicate',
    dl:'Download…', del:'Delete file'
  },
  modal:{ cancel:'Cancel', close:'Close', ok:'Got it', dialog:'Dialog' },
  file:{
    newTitle:'New file',
    renameTitle:'Rename file',
    name:'File name',
    placeholder:'e.g. page.html',
    phEmpty:'e.g. notes.txt',
    phMd:'e.g. README.md',
    phTpl:'e.g. page.{ext}',
    hintRename:'The extension drives highlighting and preview',
    hintNew:'Without an extension the file is plain text',
    willCreate:'Will be created: {name}',
    currentName:'Current name',
    newName:'New name: {name}',
    create:'Create file',
    rename:'Rename',
    created:'Created “{name}”',
    renamed:'Renamed to “{name}”',
    duplicated:'Duplicate created: “{name}”',
    deletedOne:'Deleted “{name}”',
    deletedMany:'Deleted {count}',
    undo:'Undo',
    restored:'Restored',
    imported:'Imported: {count}',
    skipped:' · skipped: {n}',
    importBad:'Those files did not qualify: text formats up to 1.5 MB'
  },
  validate:{
    empty:'Enter a file name',
    tooLong:'Name is too long (64 characters max)',
    badChars:'Invalid characters: \\ / : * ? " < > | # % &',
    exists:'A file named “{name}” already exists'
  },
  tpl:{
    empty:'Empty', emptyDesc:'a blank sheet',
    html:'HTML', htmlDesc:'page skeleton',
    css:'CSS', cssDesc:'base styles',
    js:'JS', jsDesc:'script module',
    svg:'SVG', svgDesc:'vector icon',
    md:'Markdown', mdDesc:'document'
  },
  shortcuts:{
    title:'Keyboard shortcuts',
    app:'Application', editor:'Editor',
    kPalette:'Palette: files, code search, commands',
    kSave:'Download the current file',
    kDeploy:'Open the page in a new tab',
    kSidebar:'Show / hide the file panel',
    kWrap:'Wrap long lines',
    kHelp:'This window',
    kUndo:'Undo',
    kRedo:'Redo',
    kComment:'Toggle line comments',
    kDup:'Duplicate line',
    kTab:'Indent · Shift+Tab to outdent',
    kEnter:'Smart newline with indent',
    note:'On macOS use ⌘ instead of Ctrl. Brackets and quotes close automatically. HubPad is not affiliated with GitHub, Inc.'
  },
  legal:{
    short:'Not affiliated with GitHub, Inc.',
    more:'Learn more',
    title:'About & disclaimer',
    p1:'<b>HubPad</b> is an independent code editor with an interface inspired by GitHub’s design.',
    p2:'This project is <b>not affiliated with, sponsored by, or endorsed by GitHub, Inc.</b> GitHub and the GitHub logo (Invertocat) are trademarks of GitHub, Inc. HubPad uses no GitHub logos, brand marks or source code.',
    p3:'The colour palette is close to the open-source Primer design system (MIT); no Primer code is bundled. HubPad’s icons and logo were drawn separately for this project. The Pulse demo is original sample content.',
    p4:'The editor is provided “as is”, without warranty of any kind. Every file stays local in your browser and is never uploaded anywhere.'
  },
  commands:{
    new:'Create a new file',
    dl:'Download the current file…',
    zip:'Download the project as .zip',
    deploy:'Open the page in a new tab',
    import:'Import files…',
    theme:'Switch theme (light / dark)',
    sidebar:'Show / hide the file panel',
    split:'View: code and preview',
    code:'View: code only',
    preview:'View: preview only',
    keys:'Keyboard shortcuts',
    legal:'About & disclaimer',
    lang:'Switch interface language',
    reset:'Reset the demo project'
  },
  reset:{
    title:'Reset the project?',
    text:'Every file will be replaced by the original Pulse demo in the current interface language. Your changes will be lost.',
    action:'Reset',
    done:'Demo project restored'
  },
  deploy:{
    noPage:'No page to open — create an HTML file first',
    noPageTitle:'No page to open',
    openTitle:'Open “{name}” in a new tab (Ctrl+Enter)',
    blocked:'The browser blocked the new tab',
    retry:'Try again',
    failed:'Could not open: {error}',
    site:'Site opened in a new tab · {count}, links work',
    page:'Page “{name}” opened in a new tab',
    preview:'Preview of “{name}” opened in a new tab'
  },
  toast:{
    storageOff:'Autosave unavailable — changes live only in this tab',
    storageWarn:'Local storage unavailable — the project will not survive a reload',
    welcome:'The Pulse demo is loaded. Ctrl+K opens the command palette.',
    copied:'Copied {count}',
    copyFailed:'Copy failed — select the text and press Ctrl+C',
    langChanged:'Interface language: {name}'
  },
  copy:{ zip:'.zip' },
  units:{ b:'B', kb:'KB', mb:'MB' },
  time:{ now:'just now', sec:'{n}s ago', min:'{n}m ago', hour:'{n}h ago', day:'{n}d ago' },
  filetype:{ html:'HTML', css:'CSS', js:'JavaScript', md:'Markdown', plain:'Text', svg:'SVG', json:'JSON' },
  plural:{
    files:{ one:'file', other:'files' },
    pages:{ one:'page', other:'pages' },
    problems:{ one:'problem', other:'problems' },
    symbols:{ one:'character', other:'characters' }
  },
  seed:{
    comment:'Ambient light blobs',
    cssComment:'Pulse — shared styles',
    jsComment:'Pulse — a little interactivity for the demo',
    jsRestart:'restart the animation',
    title:'Pulse — habit tracker',
    home:'Home', about:'About',
    chip:'✦ Version 2.0 is here',
    h1a:'Habits that', h1b:'actually stick',
    lead:'Pulse turns small daily actions into a steady rhythm. Check off days, watch your streaks grow, and never break the chain.',
    cta:'Start for free',
    demo:'＋ Check off a day',
    statDays:'day streak', statKeep:'retention', statRate:'rating',
    c1t:'Streaks', c1p:'The flame stays lit while you keep showing up. Simple motivation that works.',
    c2t:'Insights', c2p:'A year heat map, personal bests and gentle reminders without the pressure.',
    c3t:'Focus mode', c3p:'An evening ritual: one habit, one tap, zero noise.',
    footer:'© {year} Pulse. Built with love for rhythm.',
    aboutTitle:'About — Pulse',
    aboutChip:'About',
    aboutH1a:'Rhythm beats', aboutH1b:'intensity',
    aboutLead:'We believe twenty minutes every day beats three hours once a month. That is why Pulse is built around a single idea — never break the chain.',
    quote:'“We are what we repeatedly do. Excellence, then, is not an act but a habit.”',
    p1:'One tap, one check-off. No forms, no settings.',
    p2:'Missed a day? Your streak freezes instead of burning down.',
    p3:'Your data stays on the device. Always.',
    back:'← Back home',
    readme:'# Pulse — a HubPad demo project\n\nA small multi-page site that lives right inside the editor.\nEdit `styles.css` and the preview updates on its own.\n\n## Files\n\n- `index.html` — the home page\n- `about.html` — the About page\n- `styles.css` — shared styles\n- `script.js` — streak counter and sparks\n- `logo.svg` — the logo\n\n## Try it\n\n1. Hit **Open ↗** — the site opens in a new tab.\n2. Follow the About link — it works there too.\n3. Download a file under your own name, or grab the whole project as `.zip`.\n\n> Tip: `Ctrl+K` opens the command palette.\n\n## Skeleton\n\n```html\n<section class="hero">\n  <h1>Habits that actually stick</h1>\n</section>\n```\n\nMade in **HubPad** — a GitHub-flavoured editor.'
  },
  starter:{
    htmlTitle:'New page',
    htmlH1a:'Hello,', htmlH1b:'world',
    jsClick:'Click!',
    md:'# Heading\n\nA short description of the document.\n\n## Section\n\n- First point\n- Second point\n\n> A quote or a note.\n\nCode: `console.log(\'hello\')`'
  },
  diag:{
    title:'HubPad could not assemble itself',
    intro:'The markup is here, but not every external resource loaded. Exact status:',
    loaded:'— loaded', notLoaded:'— NOT loaded',
    ran:'— executed', notRan:'— NOT executed',
    init:'Editor initialisation', initOk:'— completed', initBad:'— incomplete',
    proto:'Page protocol: <b>{proto}</b>',
    err:' · the browser reported a load error',
    check:'What to check',
    content:'The page was opened over <b>content://</b> (a file manager handed it over as a stream). Sibling files are unreachable in that mode. Open index.html as <b>file://</b>, or run a local server and visit http://localhost.',
    noCss:'<b>css/styles.css</b> is missing or empty. Paste everything that sat between &lt;style&gt; and &lt;/style&gt;, <b>without the tags themselves</b>.',
    noI18n:'<b>js/i18n.js</b> did not load. Without the dictionary the interface cannot render. Make sure the file is in js/ and included <b>before</b> app.js.',
    noJs:'<b>js/app.js</b> did not run. A common cause is copying the &lt;script&gt; and &lt;/script&gt; tags — a .js file must not contain them. Another cause is the file not living in js/.',
    brokenInit:'The script loaded but initialisation broke. Open the browser console (F12 → Console) and read the red error — usually a copy-paste typo.',
    generic:'Check that the <b>css</b> and <b>js</b> folders sit next to index.html with the files inside, and that all names are lower case.',
    hide:'Show the page as is',
    retry:'Check again'
  }
};

/* ---------------- движок ---------------- */
const DICTS = { ru:RU, en:EN };
const META  = {
  ru:{ tag:'ru-RU', name:'Русский', english:'Russian', dir:'ltr' },
  en:{ tag:'en-US', name:'English', english:'English', dir:'ltr' }
};

const listeners = new Set();
let lang = detect();

function detect(){
  try{
    const saved = localStorage.getItem(STORAGE_KEY);
    if(saved && DICTS[saved]) return saved;
  }catch(e){}
  const navs = (navigator.languages && navigator.languages.length) ? navigator.languages : [navigator.language || 'ru'];
  for(const n of navs){
    const short = String(n).toLowerCase().split('-')[0];
    if(DICTS[short]) return short;
  }
  return 'ru';
}
function lookup(dict, key){
  return String(key).split('.').reduce((o,k)=> (o && typeof o==='object') ? o[k] : undefined, dict);
}
function interpolate(str, vars){
  if(!vars) return String(str);
  return String(str).replace(/\{(\w+)\}/g, (m,k)=> (k in vars) ? String(vars[k]) : m);
}
function t(key, vars){
  let v = lookup(DICTS[lang], key);
  if(typeof v !== 'string') v = lookup(DICTS.ru, key);
  if(typeof v !== 'string') return key;
  return interpolate(v, vars);
}
function meta(code){ return META[code || lang] || META.ru; }
function category(n){
  try{
    if(typeof Intl !== 'undefined' && Intl.PluralRules) return new Intl.PluralRules(meta().tag).select(n);
  }catch(e){}
  if(lang === 'ru'){
    const a = Math.abs(n) % 100, b = a % 10;
    if(a > 10 && a < 20) return 'many';
    if(b > 1 && b < 5) return 'few';
    if(b === 1) return 'one';
    return 'many';
  }
  return Math.abs(n) === 1 ? 'one' : 'other';
}
function plural(key, n){
  const forms = lookup(DICTS[lang], 'plural.'+key) || lookup(DICTS.ru, 'plural.'+key) || {};
  return forms[category(n)] || forms.other || forms.many || forms.one || key;
}
function num(n){
  try{ return new Intl.NumberFormat(meta().tag).format(n); }catch(e){ return String(n); }
}
function decimal(n, digits){
  try{ return new Intl.NumberFormat(meta().tag,{minimumFractionDigits:digits, maximumFractionDigits:digits}).format(n); }
  catch(e){ return n.toFixed(digits); }
}
function np(key, n){ return num(n) + ' ' + plural(key, n); }
function date(ts, opts){
  try{ return new Date(ts).toLocaleDateString(meta().tag, opts); }
  catch(e){ return new Date(ts).toLocaleDateString('ru-RU', opts); }
}
function dateTime(ts, opts){
  try{ return new Date(ts).toLocaleString(meta().tag, opts); }
  catch(e){ return new Date(ts).toLocaleString('ru-RU', opts); }
}
function apply(root){
  const scope = root || document;
  scope.querySelectorAll('[data-i18n]').forEach(el=>{
    el.textContent = t(el.getAttribute('data-i18n'));
  });
  scope.querySelectorAll('[data-i18n-html]').forEach(el=>{
    el.innerHTML = t(el.getAttribute('data-i18n-html'));
  });
  scope.querySelectorAll('[data-i18n-attr]').forEach(el=>{
    el.getAttribute('data-i18n-attr').split(';').forEach(pair=>{
      const i = pair.indexOf(':');
      if(i < 0) return;
      const attr = pair.slice(0,i).trim(), key = pair.slice(i+1).trim();
      if(attr && key) el.setAttribute(attr, t(key));
    });
  });
  document.documentElement.lang = lang;
  document.documentElement.dir = meta().dir || 'ltr';
  document.title = t('app.title');
}
function set(next){
  if(!DICTS[next] || next === lang) return false;
  lang = next;
  try{ localStorage.setItem(STORAGE_KEY, next); }catch(e){}
  apply(document);
  listeners.forEach(fn=>{ try{ fn(lang); }catch(e){ console.error(e); } });
  return true;
}
function onChange(fn){ listeners.add(fn); return ()=>listeners.delete(fn); }
function list(){ return Object.keys(DICTS).map(code=>({ code, ...META[code] })); }
function register(code, info, dict){
  if(!code || !dict) return false;
  DICTS[code] = dict;
  META[code] = Object.assign({ tag:code, name:code, english:code, dir:'ltr' }, info||{});
  return true;
}

window.HubPadI18n = {
  t, plural, np, num, decimal, date, dateTime,
  apply, set, onChange, list, register, meta,
  get lang(){ return lang; },
  has: code => !!DICTS[code]
};

/* Первичная локализация статики: скрипт подключён с defer, DOM уже разобран. */
apply(document);

})();
