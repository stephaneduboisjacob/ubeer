export type Locale = "en" | "fr" | "it" | "es" | "zh" | "ru";

export const localeLabels: Record<Locale, string> = { en: "English", fr: "Français", it: "Italiano", es: "Español", zh: "简体中文", ru: "Русский" };

export const translations: Record<string, Partial<Record<Locale, string>>> = {
  "↓": {
    "fr": "↓",
    "it": "↓",
    "es": "↓",
    "zh": "↓",
    "ru": "↓"
  },
  "Install app": {
    "fr": "Installer l'application",
    "it": "Installa l'app",
    "es": "Instalar aplicación",
    "zh": "安装应用程序",
    "ru": "Установить приложение"
  },
  "Close": {
    "fr": "Fermer",
    "it": "Chiudi",
    "es": "Cerrar",
    "zh": "关闭",
    "ru": "Закрыть"
  },
  "×": {
    "fr": "×",
    "it": "×",
    "es": "×",
    "zh": "×",
    "ru": "×"
  },
  "u": {
    "fr": "u",
    "it": "u",
    "es": "u",
    "zh": "u",
    "ru": "u"
  },
  ".": {
    "fr": ".",
    "it": ".",
    "es": ".",
    "zh": ".",
    "ru": "."
  },
  "UBEER IN YOUR POCKET": {
    "fr": "UBEER DANS VOTRE POCHE",
    "it": "UBERR IN TASCA",
    "es": "UBEER EN TU BOLSILLO",
    "zh": "口袋里的优啤酒",
    "ru": "UBEER В ВАШЕМ КАРМАНЕ"
  },
  "Add uBeer to your home screen.": {
    "fr": "Ajoutez uBeer à votre écran d'accueil.",
    "it": "Aggiungi uBeer alla schermata iniziale.",
    "es": "Agrega uBeer a tu pantalla de inicio.",
    "zh": "将 uBeer 添加到您的主屏幕。",
    "ru": "Добавьте uBeer на главный экран."
  },
  "Get the full ordering and driver app experience with an app icon and its own app window.": {
    "fr": "Bénéficiez d'une expérience complète de commande et d'application de chauffeur avec une icône d'application et sa propre fenêtre d'application.",
    "it": "Ottieni l'esperienza completa dell'app per ordini e autisti con l'icona dell'app e la relativa finestra dell'app.",
    "es": "Obtenga la experiencia completa de pedidos y controladores con un ícono de aplicación y su propia ventana de aplicación.",
    "zh": "通过应用程序图标及其自己的应用程序窗口获得完整的订购和驾驶员应用程序体验。",
    "ru": "Получите все возможности заказа и управления приложением с помощью значка приложения и собственного окна приложения."
  },
  "iPhone or iPad": {
    "fr": "iPhone ou iPad",
    "it": "iPhone o iPad",
    "es": "iPhone o iPad",
    "zh": "iPhone 或 iPad",
    "ru": "iPhone или iPad"
  },
  "Open this page in Safari, tap Share, then choose “Add to Home Screen”.": {
    "fr": "Ouvrez cette page dans Safari, appuyez sur Partager, puis choisissez « Ajouter à l'écran d'accueil ».",
    "it": "Apri questa pagina in Safari, tocca Condividi, quindi scegli \"Aggiungi alla schermata principale\".",
    "es": "Abra esta página en Safari, toque Compartir y luego elija \"Agregar a la pantalla de inicio\".",
    "zh": "在 Safari 中打开此页面，点击“共享”，然后选择“添加到主屏幕”。",
    "ru": "Откройте эту страницу в Safari, нажмите «Поделиться», затем выберите «Добавить на главный экран»."
  },
  "Android": {
    "fr": "Android",
    "it": "Android",
    "es": "Androide",
    "zh": "安卓",
    "ru": "Андроид"
  },
  "Open this page in Chrome and tap “Install app” or “Add to Home screen”.": {
    "fr": "Ouvrez cette page dans Chrome et appuyez sur « Installer l'application » ou « Ajouter à l'écran d'accueil ».",
    "it": "Apri questa pagina in Chrome e tocca \"Installa app\" o \"Aggiungi alla schermata Home\".",
    "es": "Abra esta página en Chrome y toque \"Instalar aplicación\" o \"Agregar a la pantalla de inicio\".",
    "zh": "在 Chrome 中打开此页面，然后点击“安装应用程序”或“添加到主屏幕”。",
    "ru": "Откройте эту страницу в Chrome и нажмите «Установить приложение» или «Добавить на главный экран»."
  },
  "Got it": {
    "fr": "Compris",
    "it": "Capito",
    "es": "Entendido",
    "zh": "明白了",
    "ru": "Понятно"
  },
  "ubeer": {
    "fr": "ubeer",
    "it": "ubeer",
    "es": "ubeer",
    "zh": "ubeer",
    "ru": "ubeer"
  },
  "My orders": {
    "fr": "Mes commandes",
    "it": "I miei ordini",
    "es": "Mis pedidos",
    "zh": "我的订单",
    "ru": "Мои заказы"
  },
  "Driver app": {
    "fr": "Application pilote",
    "it": "Applicazione conducente",
    "es": "Aplicación del controlador",
    "zh": "驱动程序应用程序",
    "ru": "Приложение для водителей"
  },
  "Admin": {
    "fr": "Admin",
    "it": "Admin",
    "es": "Admin",
    "zh": "Admin",
    "ru": "Admin"
  },
  "Start an order": {
    "fr": "Démarrer une commande",
    "it": "Avvia un ordine",
    "es": "Iniciar un pedido",
    "zh": "开始下单",
    "ru": "Начать заказ"
  },
  "↗": {
    "fr": "↗",
    "it": "↗",
    "es": "↗",
    "zh": "↗",
    "ru": "↗"
  },
  "Choose a matching address": {
    "fr": "Choisissez une adresse correspondante",
    "it": "Scegli un indirizzo corrispondente",
    "es": "Elija una dirección coincidente",
    "zh": "选择一个匹配的地址",
    "ru": "Выберите подходящий адрес"
  },
  "Choose the matching location": {
    "fr": "Choisissez l'emplacement correspondant",
    "it": "Scegli la località corrispondente",
    "es": "Elige la ubicación coincidente",
    "zh": "选择匹配位置",
    "ru": "Выберите подходящее местоположение"
  },
  "GOOD TIMES, CLOSE BY": {
    "fr": "DE BONS MOMENTS À PROXIMITÉ",
    "it": "BELLISSIMI TEMPI, VICINO",
    "es": "BUENOS MOMENTOS, CERCA",
    "zh": "美好时光，就在身边",
    "ru": "ХОРОШИЕ ВРЕМЕНА, РЯДОМ"
  },
  "Your weekend": {
    "fr": "Votre week-end",
    "it": "Il tuo fine settimana",
    "es": "Tu fin de semana",
    "zh": "你的周末",
    "ru": "Твои выходные"
  },
  "called.": {
    "fr": "a appelé.",
    "it": "ha chiamato.",
    "es": "llamó.",
    "zh": "打电话。",
    "ru": "позвонил."
  },
  "We’re on": {
    "fr": "Nous sommes sur",
    "it": "Siamo operativi",
    "es": "Estamos en",
    "zh": "我们正在进行",
    "ru": "Мы на связи"
  },
  "our way.": {
    "fr": "à notre façon.",
    "it": "a modo nostro.",
    "es": "a nuestra manera.",
    "zh": "我们的方式。",
    "ru": "по-нашему."
  },
  "Thoughtful local delivery for the moments that make the evening. Find out if we’re in your neighbourhood.": {
    "fr": "Livraison locale réfléchie pour les instants qui font la soirée. Découvrez si nous sommes dans votre quartier.",
    "it": "Consegna locale premurosa per i momenti che rendono speciale la serata. Scopri se siamo nel tuo quartiere.",
    "es": "Entrega local pensada para los momentos que alegran la velada. Descubra si estamos en su vecindario.",
    "zh": "周到的本地交付，让夜晚变得精彩。看看我们是否在您附近。",
    "ru": "Продуманная местная доставка для ярких моментов вечера. Узнайте, находимся ли мы в вашем районе."
  },
  "⌖": {
    "fr": "⌖",
    "it": "⌖",
    "es": "⌖",
    "zh": "⌖",
    "ru": "⌖"
  },
  "Address or postal code": {
    "fr": "Adresse ou code postal",
    "it": "Indirizzo o codice postale",
    "es": "Dirección o código postal",
    "zh": "地址或邮政编码",
    "ru": "Адрес или почтовый индекс"
  },
  "Enter your address or postal code": {
    "fr": "Entrez votre adresse ou votre code postal",
    "it": "Inserisci il tuo indirizzo o codice postale",
    "es": "Introduce tu dirección o código postal",
    "zh": "输入您的地址或邮政编码",
    "ru": "Введите свой адрес или почтовый индекс"
  },
  "Check delivery area": {
    "fr": "Vérifier la zone de livraison",
    "it": "Controlla la zona di consegna",
    "es": "Consultar zona de entrega",
    "zh": "查看送货区域",
    "ru": "Проверьте зону доставки"
  },
  "◎": {
    "fr": "◎",
    "it": "◎",
    "es": "◎",
    "zh": "◎",
    "ru": "◎"
  },
  "Use my current location": {
    "fr": "Utiliser ma position actuelle",
    "it": "Usa la mia posizione attuale",
    "es": "Usar mi ubicación actual",
    "zh": "使用我当前的位置",
    "ru": "Использовать мое текущее местоположение"
  },
  "Illustration of a cold drink and local delivery bag": {
    "fr": "Illustration d'une boisson fraîche et d'un sac de livraison locale",
    "it": "Illustrazione di una bevanda fredda e di una borsa per la consegna locale",
    "es": "Ilustración de una bebida fría y una bolsa de entrega local.",
    "zh": "冷饮和本地送货包的插图",
    "ru": "Иллюстрация холодного напитка и местной сумки для доставки."
  },
  "GOOD DRINKS.": {
    "fr": "BONNES BOISSONS.",
    "it": "BUONE BEVANDE.",
    "es": "BUENAS BEBIDAS.",
    "zh": "好饮料。",
    "ru": "ХОРОШИЕ НАПИТКИ."
  },
  "GOOD COMPANY.": {
    "fr": "BONNE COMPAGNIE.",
    "it": "BUONA AZIENDA.",
    "es": "BUENA COMPAÑÍA.",
    "zh": "好公司。",
    "ru": "ХОРОШАЯ КОМПАНИЯ."
  },
  "LOCAL": {
    "fr": "LOCALE",
    "it": "LOCALE",
    "es": "LOCALES",
    "zh": "本地",
    "ru": "ЛОКАЛЬНЫЙ"
  },
  "DELIVERY": {
    "fr": "LIVRAISON",
    "it": "CONSEGNA",
    "es": "ENTREGA",
    "zh": "交付",
    "ru": "ДОСТАВКА"
  },
  "HEINEKEN": {
    "fr": "HEINEKEN",
    "it": "HEINEKEN",
    "es": "HEINEKEN",
    "zh": "HEINEKEN",
    "ru": "HEINEKEN"
  },
  "EST. 1873": {
    "fr": "EST. 1873",
    "it": "ST. 1873",
    "es": "EST. 1873",
    "zh": "美国东部时间。 1873年",
    "ru": "Восточное восточное время. 1873 г."
  },
  "★": {
    "fr": "★",
    "it": "★",
    "es": "★",
    "zh": "★",
    "ru": "★"
  },
  "CHEERS": {
    "fr": "Bravo",
    "it": "SALUTE",
    "es": "SALUDOS",
    "zh": "干杯",
    "ru": "УРА"
  },
  "LOCAL GOOD": {
    "fr": "BON LOCAL",
    "it": "BENE LOCALE",
    "es": "BIEN LOCAL",
    "zh": "当地美食",
    "ru": "МЕСТНЫЕ ТОВАРЫ"
  },
  "✳": {
    "fr": "✳",
    "it": "✳",
    "es": "✳",
    "zh": "✳",
    "ru": "✳"
  },
  "✦": {
    "fr": "✦",
    "it": "✦",
    "es": "✦",
    "zh": "✦",
    "ru": "✦"
  },
  "GOOD": {
    "fr": "BON",
    "it": "BUONO",
    "es": "BUENO",
    "zh": "好",
    "ru": "ХОРОШО"
  },
  "EVENING": {
    "fr": "SOIR",
    "it": "SERA",
    "es": "TARDE",
    "zh": "晚上",
    "ru": "ВЕЧЕР"
  },
  "DELIVERY THAT": {
    "fr": "LIVRAISON QUE",
    "it": "CONSEGNA QUELLO",
    "es": "ENTREGA QUE",
    "zh": "交付",
    "ru": "ДОСТАВКА, КОТОРАЯ"
  },
  "FEELS NEARBY": {
    "fr": "SE SENT À PROXIMITÉ",
    "it": "SENTI VICINO",
    "es": "SE SIENTE CERCA",
    "zh": "感觉就在附近",
    "ru": "ЧУВСТВУЕТ РЯДОМ"
  },
  "01": {
    "fr": "01",
    "it": "01",
    "es": "01",
    "zh": "01",
    "ru": "01"
  },
  "LOCAL FIRST": {
    "fr": "LE LOCAL D'ABORD",
    "it": "PRIMA LOCALE",
    "es": "LOCAL PRIMERO",
    "zh": "本地第一",
    "ru": "ПЕРВЫЙ ЛОКАЛЬНЫЙ"
  },
  "Made for your neighbourhood": {
    "fr": "Conçu pour votre quartier",
    "it": "Realizzato per il tuo quartiere",
    "es": "Hecho para tu vecindario",
    "zh": "为您的社区打造",
    "ru": "Создано для вашего района"
  },
  "02": {
    "fr": "02",
    "it": "02",
    "es": "02",
    "zh": "02",
    "ru": "02"
  },
  "RIGHT ON TIME": {
    "fr": "JUSTE À L'HEURE",
    "it": "PUNTUALE",
    "es": "JUSTO A TIEMPO",
    "zh": "准时",
    "ru": "ПРАВИЛЬНО ВОВРЕМЯ"
  },
  "Delivered by a real local driver": {
    "fr": "Livré par un vrai chauffeur local",
    "it": "Consegnato da un vero autista locale",
    "es": "Entregado por un conductor local real",
    "zh": "由真正的本地司机送货",
    "ru": "Доставлено настоящим местным водителем"
  },
  "03": {
    "fr": "03",
    "it": "03",
    "es": "03",
    "zh": "03",
    "ru": "03"
  },
  "GOOD TO GO": {
    "fr": "BON À PARTIR",
    "it": "BUONO A PARTIRE",
    "es": "LISTO PARA IR",
    "zh": "好啦",
    "ru": "ХОРОШО ИДТИ"
  },
  "Age-checked, every time": {
    "fr": "L'âge est vérifié à chaque fois",
    "it": "L'età viene controllata ogni volta",
    "es": "Edad comprobada, cada vez",
    "zh": "每次都经过年龄检查",
    "ru": "Каждый раз проверяется возраст"
  },
  "THE NEIGHBOURHOOD CHECK": {
    "fr": "LE CONTRÔLE DE QUARTIER",
    "it": "IL CONTROLLO DEL QUARTIERE",
    "es": "EL CHEQUEO DE VECINDARIO",
    "zh": "邻里检查",
    "ru": "ПРОВЕРКА СОСЕДА"
  },
  "What’s in your": {
    "fr": "Qu'y a-t-il dans votre",
    "it": "Cosa c'è nel tuo",
    "es": "¿Qué hay en tu",
    "zh": "你的里面有什么",
    "ru": "Что у тебя"
  },
  "neck of the woods?": {
    "fr": "au coin du pays ?",
    "it": "collo dei boschi?",
    "es": "¿La zona del bosque?",
    "zh": "树林的尽头？",
    "ru": "лесной массив?"
  },
  "We deliver within the service areas our local drivers know best. Pop in your address and we’ll take a look.": {
    "fr": "Nous livrons dans les zones de service que nos chauffeurs locaux connaissent le mieux. Entrez votre adresse et nous y jetterons un œil.",
    "it": "Consegniamo nelle aree di servizio che i nostri autisti locali conoscono meglio. Inserisci il tuo indirizzo e daremo un'occhiata.",
    "es": "Realizamos entregas dentro de las áreas de servicio que nuestros conductores locales conocen mejor. Introduce tu dirección y echaremos un vistazo.",
    "zh": "我们在当地司机最熟悉的服务区域内送货。输入您的地址，我们会查看。",
    "ru": "Мы осуществляем доставку в те зоны обслуживания, которые наши местные водители знают лучше всего. Напишите свой адрес и мы посмотрим."
  },
  "First, let’s find your corner.": {
    "fr": "Tout d’abord, trouvons votre coin.",
    "it": "Innanzitutto, troviamo il tuo angolo.",
    "es": "Primero, busquemos tu rincón.",
    "zh": "首先，让我们找到你的角落。",
    "ru": "Для начала давайте найдём ваш угол."
  },
  "We’ll check your address against our active delivery areas.": {
    "fr": "Nous vérifierons votre adresse par rapport à nos zones de livraison actives.",
    "it": "Verificheremo il tuo indirizzo rispetto alle nostre aree di consegna attive.",
    "es": "Verificaremos su dirección con nuestras áreas de entrega activas.",
    "zh": "我们将根据我们的有效送货区域检查您的地址。",
    "ru": "Мы проверим ваш адрес по нашим активным зонам доставки."
  },
  "Street, city or postal code": {
    "fr": "Rue, ville ou code postal",
    "it": "Via, città o codice postale",
    "es": "Calle, ciudad o código postal",
    "zh": "街道、城市或邮政编码",
    "ru": "Улица, город или почтовый индекс"
  },
  "Check my area": {
    "fr": "Vérifier ma région",
    "it": "Controlla la mia zona",
    "es": "Revisa mi área",
    "zh": "检查我的区域",
    "ru": "Проверьте мой регион"
  },
  "→": {
    "fr": "→",
    "it": "→",
    "es": "→",
    "zh": "→",
    "ru": "→"
  },
  "Good news — we deliver to": {
    "fr": "Bonne nouvelle : nous livrons à",
    "it": "Buone notizie: consegniamo a",
    "es": "Buenas noticias: entregamos a",
    "zh": "好消息——我们交付给",
    "ru": "Хорошие новости — мы осуществляем доставку в"
  },
  "Delivery fee $": {
    "fr": "Frais de livraison $",
    "it": "Spese di spedizione $",
    "es": "Tarifa de envío $",
    "zh": "送货费 $",
    "ru": "Стоимость доставки, $"
  },
  "·": {
    "fr": "·",
    "it": "·",
    "es": "·",
    "zh": "·",
    "ru": "·"
  },
  "+ only": {
    "fr": "+ uniquement",
    "it": "+ solo",
    "es": "+ solo",
    "zh": "+ 仅",
    "ru": "+ только"
  },
  "Postal code coverage is approximate. Search your exact street address before ordering.": {
    "fr": "La couverture des codes postaux est approximative. Recherchez votre adresse postale exacte avant de commander.",
    "it": "La copertura del codice postale è approssimativa. Cerca il tuo indirizzo esatto prima di ordinare.",
    "es": "La cobertura del código postal es aproximada. Busque su dirección exacta antes de realizar el pedido.",
    "zh": "邮政编码覆盖范围为近似值。订购前搜索您的确切街道地址。",
    "ru": "Покрытие почтовых индексов является приблизительным. Прежде чем сделать заказ, найдите свой точный адрес."
  },
  "Change location": {
    "fr": "Changer d'emplacement",
    "it": "Cambia posizione",
    "es": "Cambiar ubicación",
    "zh": "更改位置",
    "ru": "Изменить местоположение"
  },
  "Loading the neighbourhood list…": {
    "fr": "Chargement de la liste des quartiers…",
    "it": "Caricamento dell'elenco dei quartieri…",
    "es": "Cargando la lista de barrios…",
    "zh": "正在加载邻居列表...",
    "ru": "Загрузка списка районов…"
  },
  "PURE MALT LAGER": {
    "fr": "LAGER PUR MALT",
    "it": "LAGER DI PURO MALTO",
    "es": "LAGER PURA DE MALTA",
    "zh": "纯麦芽啤酒",
    "ru": "ЧИСТЫЙ СОЛОДНОЙ ЛАГЕР"
  },
  "6-PACK": {
    "fr": "PACK DE 6",
    "it": "CONFEZIONE DA 6",
    "es": "PAQUETE DE 6",
    "zh": "6 件装",
    "ru": "НАБОР из 6 шт."
  },
  "TEST": {
    "fr": "ESSAYER",
    "it": "PROVA",
    "es": "PRUEBA",
    "zh": "测试",
    "ru": "ТЕСТ"
  },
  "LISTING": {
    "fr": "LISTE",
    "it": "ELENCO",
    "es": "LISTADO",
    "zh": "清单",
    "ru": "ЛИСТИНГ"
  },
  "THE CLASSIC": {
    "fr": "LE CLASSIQUE",
    "it": "IL CLASSICO",
    "es": "EL CLÁSICO",
    "zh": "经典",
    "ru": "КЛАССИКА"
  },
  "$": {
    "fr": "$",
    "it": "$",
    "es": "$",
    "zh": "$",
    "ru": "$"
  },
  "USD · 6 bottles": {
    "fr": "USD · 6 bouteilles",
    "it": "USD · 6 bottiglie",
    "es": "USD · 6 botellas",
    "zh": "美元 · 6 瓶",
    "ru": "Доллары США · 6 бутылок"
  },
  "Remove one": {
    "fr": "Supprimer un",
    "it": "Rimuovine uno",
    "es": "Eliminar uno",
    "zh": "删除一个",
    "ru": "Удалить один"
  },
  "−": {
    "fr": "−",
    "it": "−",
    "es": "-",
    "zh": "-",
    "ru": "-"
  },
  "Add one": {
    "fr": "Ajoutez-en un",
    "it": "Aggiungine uno",
    "es": "Agregar uno",
    "zh": "添加一个",
    "ru": "Добавить один"
  },
  "+": {
    "fr": "+",
    "it": "+",
    "es": "+",
    "zh": "+",
    "ru": "+"
  },
  "Nothing on the local menu yet. Check back soon.": {
    "fr": "Rien sur le menu local pour l'instant. Revenez bientôt.",
    "it": "Ancora niente nel menu locale. Ricontrolla presto.",
    "es": "Aún no hay nada en el menú local. Vuelve pronto.",
    "zh": "本地菜单上还没有任何内容。请尽快回来查看。",
    "ru": "В локальном меню пока ничего нет. Зайдите позже."
  },
  "YOUR BAG": {
    "fr": "VOTRE SAC",
    "it": "LA TUA BORSA",
    "es": "TU BOLSA",
    "zh": "你的包",
    "ru": "ВАША СУМКА"
  },
  "⌁": {
    "fr": "⌁",
    "it": "⌁",
    "es": "⌁",
    "zh": "⌁",
    "ru": "⌁"
  },
  "A good evening starts somewhere.": {
    "fr": "Une bonne soirée commence quelque part.",
    "it": "Una buona serata inizia da qualche parte.",
    "es": "Una buena noche comienza en alguna parte.",
    "zh": "美好的夜晚从某个地方开始。",
    "ru": "Хороший вечер где-то начинается."
  },
  "Add something from the local list and we’ll get it moving.": {
    "fr": "Ajoutez quelque chose de la liste locale et nous le ferons avancer.",
    "it": "Aggiungi qualcosa dall'elenco locale e lo faremo muovere.",
    "es": "Agregue algo de la lista local y lo pondremos en marcha.",
    "zh": "从本地列表中添加一些内容，我们就会让它移动。",
    "ru": "Добавьте что-нибудь из локального списка, и мы запустим его."
  },
  "Delivery fee": {
    "fr": "Frais de livraison",
    "it": "Spese di consegna",
    "es": "Tarifa de envío",
    "zh": "运费",
    "ru": "Стоимость доставки"
  },
  "Estimated total": {
    "fr": "Total estimé",
    "it": "Totale stimato",
    "es": "Total estimado",
    "zh": "预计总数",
    "ru": "Ориентировочная общая сумма"
  },
  "Email for your receipt": {
    "fr": "E-mail pour votre reçu",
    "it": "E-mail per la ricevuta",
    "es": "Correo electrónico para su recibo",
    "zh": "收据电子邮件",
    "ru": "Электронная почта для получения квитанции"
  },
  "you@example.com": {
    "fr": "vous@exemple.com",
    "it": "tu@esempio.com",
    "es": "tú@ejemplo.com",
    "zh": "you@example.com",
    "ru": "you@example.com"
  },
  "Delivery address": {
    "fr": "Adresse de livraison",
    "it": "Indirizzo di consegna",
    "es": "Dirección de entrega",
    "zh": "送货地址",
    "ru": "Адрес доставки"
  },
  "Street number, street, unit": {
    "fr": "Numéro, rue, unité",
    "it": "Numero civico, via, unità",
    "es": "Número de calle, calle, unidad",
    "zh": "门牌号、街道、单位",
    "ru": "Номер дома, улица, объект"
  },
  "I confirm I am at least": {
    "fr": "Je confirme que je suis au moins",
    "it": "Confermo almeno di sì",
    "es": "Confirmo que al menos estoy",
    "zh": "我确认我至少是",
    "ru": "Я подтверждаю, что по крайней мере"
  },
  "years old.": {
    "fr": "ans.",
    "it": "anni.",
    "es": "años de edad.",
    "zh": "岁。",
    "ru": "лет."
  },
  "Bitcoin · Lightning · on-chain": {
    "fr": "Bitcoin · Lightning · en chaîne",
    "it": "Bitcoin · Fulmine · on-chain",
    "es": "Bitcoin · Lightning · en cadena",
    "zh": "比特币·闪电·链上",
    "ru": "Биткойн · Молния · ончейн"
  },
  "WE’RE NOT THERE YET": {
    "fr": "NOUS N'Y SOMMES PAS ENCORE",
    "it": "NON CI SIAMO ANCORA",
    "es": "AÚN NO LLEGAMOS",
    "zh": "我们还没到那一步",
    "ru": "НАС ЕЩЁ НЕТ"
  },
  "Leave your email and we’ll let you know when local delivery reaches you.": {
    "fr": "Laissez votre e-mail et nous vous informerons lorsque la livraison locale vous parviendra.",
    "it": "Lascia la tua email e ti faremo sapere quando ti arriverà la consegna locale.",
    "es": "Deja tu correo electrónico y te avisaremos cuando llegue la entrega local.",
    "zh": "留下您的电子邮件，我们会在本地送货到达您时通知您。",
    "ru": "Оставьте свой адрес электронной почты, и мы сообщим вам, когда доставка доберется до вас."
  },
  "Email for waitlist": {
    "fr": "E-mail pour la liste d'attente",
    "it": "E-mail per la lista d'attesa",
    "es": "Correo electrónico para lista de espera",
    "zh": "候补名单电子邮件",
    "ru": "Электронная почта для списка ожидания"
  },
  "Your email address": {
    "fr": "Votre adresse e-mail",
    "it": "Il tuo indirizzo email",
    "es": "Su dirección de correo electrónico",
    "zh": "您的电子邮件地址",
    "ru": "Ваш адрес электронной почты"
  },
  "Keep me posted": {
    "fr": "Tenez-moi au courant",
    "it": "Tienimi aggiornato",
    "es": "Mantenme informado",
    "zh": "随时通知我",
    "ru": "Держите меня в курсе"
  },
  "✓": {
    "fr": "✓",
    "it": "✓",
    "es": "✓",
    "zh": "✓",
    "ru": "✓"
  },
  "Good times, responsibly.": {
    "fr": "De bons moments, de manière responsable.",
    "it": "Bei tempi, responsabilmente.",
    "es": "Buenos tiempos, con responsabilidad.",
    "zh": "美好时光，负责任。",
    "ru": "Доброе время, ответственно."
  },
  "Alcohol delivery is only available to eligible adults. A valid ID is required at handoff. Please enjoy thoughtfully.": {
    "fr": "La livraison d'alcool n'est disponible que pour les adultes éligibles. Une pièce d'identité valide est requise lors du transfert. S'il vous plaît, profitez-en de manière réfléchie.",
    "it": "La consegna di alcolici è disponibile solo per gli adulti idonei. Al momento del trasferimento è richiesto un documento d'identità valido. Per favore, divertiti con attenzione.",
    "es": "La entrega de alcohol solo está disponible para adultos elegibles. Se requiere una identificación válida al momento de la entrega. Por favor disfrútalo atentamente.",
    "zh": "酒精饮料仅适用于符合条件的成年人。交接时需提供有效身份证件。请用心欣赏。",
    "ru": "Доставка алкоголя доступна только взрослым, имеющим на это право. При передаче требуется действительный идентификатор. Пожалуйста, наслаждайтесь вдумчиво."
  },
  "Made for the neighbourhood. ©": {
    "fr": "Conçu pour le quartier. ©",
    "it": "Realizzato per il quartiere. ©",
    "es": "Hecho para el vecindario. ©",
    "zh": "为社区而生。 ©",
    "ru": "Сделано для района. ©"
  },
  "uBeer": {
    "fr": "uBeer",
    "it": "uBeer",
    "es": "uBeer",
    "zh": "uBeer",
    "ru": "uBeer"
  },
  "Become a driver ↗": {
    "fr": "Devenir chauffeur ↗",
    "it": "Diventa un autista ↗",
    "es": "Conviértete en conductor ↗",
    "zh": "成为一名司机 ↗",
    "ru": "Стать водителем ↗"
  },
  "YOUR ORDER IS READY": {
    "fr": "VOTRE COMMANDE EST PRÊTE",
    "it": "IL TUO ORDINE È PRONTO",
    "es": "TU PEDIDO ESTÁ LISTO",
    "zh": "您的订单已准备好",
    "ru": "ВАШ ЗАКАЗ ГОТОВ"
  },
  "One last stop.": {
    "fr": "Un dernier arrêt.",
    "it": "Un'ultima fermata.",
    "es": "Una última parada.",
    "zh": "最后一站。",
    "ru": "Последняя остановка."
  },
  "Your order is waiting at BTCPay’s secure checkout. Keep this delivery code for your driver.": {
    "fr": "Votre commande est en attente à la caisse sécurisée de BTCPay. Conservez ce code de livraison pour votre chauffeur.",
    "it": "Il tuo ordine è in attesa presso il checkout sicuro di BTCPay. Conserva questo codice di consegna per il tuo autista.",
    "es": "Su pedido está esperando en la caja segura de BTCPay. Guarde este código de entrega para su conductor.",
    "zh": "您的订单正在 BTCPay 的安全结账处等待。为您的司机保留此送货代码。",
    "ru": "Ваш заказ ожидает на безопасной кассе BTCPay. Сохраните этот код доставки для своего водителя."
  },
  "YOUR HANDOFF CODE": {
    "fr": "VOTRE CODE DE TRANSFERT",
    "it": "IL TUO CODICE DI CONSEGNA",
    "es": "TU CÓDIGO DE TRANSFERENCIA",
    "zh": "您的切换代码",
    "ru": "ВАШ КОД ПЕРЕДАЧИ ПЕРЕДАЧИ"
  },
  "Show this code to your driver when your order arrives.": {
    "fr": "Présentez ce code à votre chauffeur à l'arrivée de votre commande.",
    "it": "Mostra questo codice al tuo autista quando arriva il tuo ordine.",
    "es": "Muestra este código a tu conductor cuando llegue tu pedido.",
    "zh": "当您的订单到达时，请向您的司机出示此代码。",
    "ru": "Покажите этот код водителю, когда прибудет ваш заказ."
  },
  "Pay securely with Bitcoin ↗": {
    "fr": "Payez en toute sécurité avec Bitcoin ↗",
    "it": "Paga in sicurezza con Bitcoin ↗",
    "es": "Pague de forma segura con Bitcoin ↗",
    "zh": "使用比特币安全支付 ↗",
    "ru": "Безопасная оплата биткойнами ↗"
  },
  "Track this order instead": {
    "fr": "Suivez plutôt cette commande",
    "it": "Tieni traccia di questo ordine",
    "es": "En su lugar, sigue este pedido",
    "zh": "改为跟踪此订单",
    "ru": "Вместо этого отследите этот заказ"
  },
  "Payment is handled by BTCPay Server.": {
    "fr": "Le paiement est géré par le serveur BTCPay.",
    "it": "Il pagamento è gestito dal server BTCPay.",
    "es": "El pago es manejado por BTCPay Server.",
    "zh": "付款由 BTCPay 服务器处理。",
    "ru": "Платеж обрабатывается сервером BTCPay."
  },
  "ORDER TRACKING": {
    "fr": "SUIVI DES COMMANDES",
    "it": "TRACCIABILITÀ DELL'ORDINE",
    "es": "SEGUIMIENTO DE PEDIDOS",
    "zh": "订单追踪",
    "ru": "ОТСЛЕЖИВАНИЕ ЗАКАЗОВ"
  },
  "Your evening,": {
    "fr": "Votre soirée,",
    "it": "La tua serata,",
    "es": "Tu tarde,",
    "zh": "你的夜晚，",
    "ru": "Твой вечер,"
  },
  "in good hands.": {
    "fr": "entre de bonnes mains.",
    "it": "in buone mani.",
    "es": "en buenas manos.",
    "zh": "掌握得很好。",
    "ru": "в надежных руках."
  },
  "Finding your order…": {
    "fr": "Retrouver votre commande…",
    "it": "Ricerca del tuo ordine…",
    "es": "Encontrar su pedido…",
    "zh": "查找您的订单...",
    "ru": "Поиск заказа…"
  },
  "ORDER": {
    "fr": "COMMANDE",
    "it": "ORDINE",
    "es": "PEDIDO",
    "zh": "订单",
    "ru": "ЗАКАЗАТЬ"
  },
  "#": {
    "fr": "#",
    "it": "#",
    "es": "#",
    "zh": "#",
    "ru": "#"
  },
  "Delivering to": {
    "fr": "Livraison à",
    "it": "Consegna a",
    "es": "Entregando a",
    "zh": "交付至",
    "ru": "Доставка в"
  },
  "We refresh your order status automatically.": {
    "fr": "Nous actualisons automatiquement le statut de votre commande.",
    "it": "Aggiorniamo automaticamente lo stato del tuo ordine.",
    "es": "Actualizamos el estado de tu pedido automáticamente.",
    "zh": "我们会自动刷新您的订单状态。",
    "ru": "Мы автоматически обновляем статус вашего заказа."
  },
  "← Back to uBeer": {
    "fr": "← Retour à uBeer",
    "it": "← Torna a uBeer",
    "es": "← Volver a uCerveza",
    "zh": "← 返回 uBeer",
    "ru": "← Вернуться назад на uBeer"
  },
  "YOUR UBEER ACCOUNT": {
    "fr": "VOTRE COMPTE UBEER",
    "it": "IL TUO ACCOUNT UBEER",
    "es": "TU CUENTA UBEER",
    "zh": "您的优步帐户",
    "ru": "ВАШ АККАУНТ UBEER"
  },
  "Good to see": {
    "fr": "C'est bon à voir",
    "it": "Bello da vedere",
    "es": "Es bueno verlo",
    "zh": "很高兴看到",
    "ru": "Приятно видеть"
  },
  "you again.": {
    "fr": "encore toi.",
    "it": "ancora te.",
    "es": "tú de nuevo.",
    "zh": "又是你。",
    "ru": "снова ты."
  },
  "Your name": {
    "fr": "Votre nom",
    "it": "Il tuo nome",
    "es": "Tu nombre",
    "zh": "你的名字",
    "ru": "Ваше имя"
  },
  "Email": {
    "fr": "E-mail",
    "it": "E-mail",
    "es": "Correo electrónico",
    "zh": "电子邮件",
    "ru": "Электронная почта"
  },
  "Password": {
    "fr": "Mot de passe",
    "it": "Password",
    "es": "Contraseña",
    "zh": "密码",
    "ru": "Пароль"
  },
  "SIGNED IN AS": {
    "fr": "SIGNÉ COMME",
    "it": "FIRMATO COME",
    "es": "FIRMADO COMO",
    "zh": "登录身份",
    "ru": "ВОЙДЕН КАК"
  },
  "Sign out ↗": {
    "fr": "Se déconnecter ↗",
    "it": "Esci ↗",
    "es": "Cerrar sesión ↗",
    "zh": "退出 ↗",
    "ru": "Выход ↗"
  },
  "Your orders": {
    "fr": "Vos commandes",
    "it": "I tuoi ordini",
    "es": "Tus pedidos",
    "zh": "您的订单",
    "ru": "Ваши заказы"
  },
  "Loading order history…": {
    "fr": "Chargement de l'historique des commandes…",
    "it": "Caricamento cronologia ordini…",
    "es": "Cargando historial de pedidos…",
    "zh": "加载订单历史记录...",
    "ru": "Загрузка истории заказов…"
  },
  "No orders yet. Find your neighbourhood and start your first order.": {
    "fr": "Aucune commande pour l'instant. Trouvez votre quartier et lancez votre première commande.",
    "it": "Ancora nessun ordine. Trova il tuo quartiere e avvia il tuo primo ordine.",
    "es": "Aún no hay pedidos. Encuentra tu vecindario y comienza tu primer pedido.",
    "zh": "还没有订单。找到您的邻居并开始您的第一个订单。",
    "ru": "Заказов пока нет. Найдите свой район и начните свой первый заказ."
  },
  "← Browse uBeer": {
    "fr": "← Parcourir uBeer",
    "it": "← Sfoglia uBeer",
    "es": "← Explorar uBeer",
    "zh": "← 浏览 uBeer",
    "ru": "← Просмотреть uBeer"
  },
  "GOOD PEOPLE, GOOD ROUTES": {
    "fr": "BONNES GENS, BONS ITINÉRAIRES",
    "it": "BUONE PERSONE, BUONI PERCORSI",
    "es": "BUENA GENTE, BUENAS RUTAS",
    "zh": "好人，好路线",
    "ru": "ХОРОШИЕ ЛЮДИ, ХОРОШИЕ МАРШРУТЫ"
  },
  "Get paid to": {
    "fr": "Soyez payé pour",
    "it": "Fatti pagare",
    "es": "Recibir pagos por",
    "zh": "获得报酬",
    "ru": "Получайте оплату"
  },
  "know your way.": {
    "fr": "connaissez votre chemin.",
    "it": "conosci la tua strada.",
    "es": "conoce tu camino.",
    "zh": "知道你的路。",
    "ru": "знай свой путь."
  },
  "Join a local crew delivering great evenings across the neighbourhood.": {
    "fr": "Rejoignez une équipe locale qui organise de superbes soirées dans tout le quartier.",
    "it": "Unisciti a un gruppo locale che organizza serate fantastiche in tutto il quartiere.",
    "es": "Únase a un equipo local que ofrece excelentes veladas en todo el vecindario.",
    "zh": "加入当地工作人员，为社区带来美好的夜晚。",
    "ru": "Присоединяйтесь к местной команде, которая проводит отличные вечера по всему району."
  },
  "DRIVER CONSOLE": {
    "fr": "CONSOLE DU CONDUCTEUR",
    "it": "CONSOLE CONDUCENTE",
    "es": "CONSOLA DEL CONDUCTOR",
    "zh": "驾驶员控制台",
    "ru": "КОНСОЛЬ ВОДИТЕЛЯ"
  },
  "Hey,": {
    "fr": "Hé,",
    "it": "Ehi,",
    "es": "Oye,",
    "zh": "嘿，",
    "ru": "Привет,"
  },
  "EARNED": {
    "fr": "GAGNÉ",
    "it": "GUADAGNATO",
    "es": "GANADO",
    "zh": "已获",
    "ru": "ЗАРАБОТАНО"
  },
  "Your assignments": {
    "fr": "Vos missions",
    "it": "I tuoi compiti",
    "es": "Tus tareas",
    "zh": "你的作业",
    "ru": "Ваши задания"
  },
  "Refreshes every 10 sec": {
    "fr": "Actualisation toutes les 10 secondes",
    "it": "Si aggiorna ogni 10 secondi",
    "es": "Se actualiza cada 10 segundos.",
    "zh": "每 10 秒刷新一次",
    "ru": "Обновляется каждые 10 секунд."
  },
  "Order #": {
    "fr": "N° de commande",
    "it": "Ordine n.",
    "es": "N.º de pedido",
    "zh": "订单号",
    "ru": "Номер заказа"
  },
  "Open delivery location in maps ↗": {
    "fr": "Ouvrir le lieu de livraison sur les cartes ↗",
    "it": "Apri il luogo di consegna nelle mappe ↗",
    "es": "Abrir ubicación de entrega en mapas ↗",
    "zh": "在地图中打开送货地点 ↗",
    "ru": "Открыть место доставки на картах ↗"
  },
  "Decline": {
    "fr": "Refuser",
    "it": "Rifiuta",
    "es": "Rechazar",
    "zh": "拒绝",
    "ru": "Отказ"
  },
  "No orders assigned yet. Keep your location on while you’re available.": {
    "fr": "Aucune commande attribuée pour le moment. Gardez votre position pendant que vous êtes disponible.",
    "it": "Nessun ordine ancora assegnato. Mantieni attiva la tua posizione mentre sei disponibile.",
    "es": "Aún no hay pedidos asignados. Mantén tu ubicación activada mientras estés disponible.",
    "zh": "尚未分配订单。当您有空时，保持您的位置。",
    "ru": "Заказов пока не назначено. Сохраняйте свое местоположение, пока вы доступны."
  },
  "ALREADY ON THE CREW?": {
    "fr": "DÉJÀ DANS L'ÉQUIPAGE ?",
    "it": "GIÀ NELLA EQUIPAGGIO?",
    "es": "¿YA EN LA TRIPULACIÓN?",
    "zh": "已经加入团队了吗？",
    "ru": "УЖЕ В ЭКИПАЖЕ?"
  },
  "Driver sign in": {
    "fr": "Connexion du conducteur",
    "it": "Accesso dell'autista",
    "es": "Inicio de sesión del conductor",
    "zh": "司机登录",
    "ru": "Вход в систему водителя"
  },
  "Your password": {
    "fr": "Votre mot de passe",
    "it": "La tua password",
    "es": "Tu contraseña",
    "zh": "你的密码",
    "ru": "Ваш пароль"
  },
  "Sign in →": {
    "fr": "Connectez-vous →",
    "it": "Accedi →",
    "es": "Iniciar sesión →",
    "zh": "登录 →",
    "ru": "Войти →"
  },
  "Approved drivers only. Your account starts after admin review.": {
    "fr": "Pilotes agréés uniquement. Votre compte démarre après examen par l'administrateur.",
    "it": "Solo driver approvati. Il tuo account viene avviato dopo la revisione da parte dell'amministratore.",
    "es": "Solo conductores aprobados. Su cuenta comienza después de la revisión del administrador.",
    "zh": "仅限经批准的驱动程序。您的帐户在管理员审核后启动。",
    "ru": "Только одобренные драйверы. Ваша учетная запись заработает после проверки администратором."
  },
  "COME DRIVE WITH US": {
    "fr": "VENEZ CONDUIRE AVEC NOUS",
    "it": "VIENI A GUIDARE CON NOI",
    "es": "VEN A CONDUCIR CON NOSOTROS",
    "zh": "和我们一起开车",
    "ru": "ПОЕХАЙТЕ С НАМИ"
  },
  "Apply to drive": {
    "fr": "Postuler pour conduire",
    "it": "Applicare per guidare",
    "es": "Aplicar para conducir",
    "zh": "适用于驱动器",
    "ru": "Применить к диску"
  },
  "Full name": {
    "fr": "Nom complet",
    "it": "Nome completo",
    "es": "Nombre completo",
    "zh": "全名",
    "ru": "Полное имя"
  },
  "Phone": {
    "fr": "Téléphone",
    "it": "Telefono",
    "es": "Teléfono",
    "zh": "电话",
    "ru": "Телефон"
  },
  "Vehicle": {
    "fr": "Véhicule",
    "it": "Veicolo",
    "es": "Vehículo",
    "zh": "车辆",
    "ru": "Транспортное средство"
  },
  "Car, bicycle…": {
    "fr": "Voiture, vélo…",
    "it": "Auto, bicicletta...",
    "es": "Coche, bicicleta…",
    "zh": "汽车、自行车……",
    "ru": "Автомобиль, велосипед…"
  },
  "License number": {
    "fr": "Numéro de licence",
    "it": "Numero di licenza",
    "es": "Número de licencia",
    "zh": "许可证号",
    "ru": "Номер лицензии"
  },
  "Preferred region": {
    "fr": "Région préférée",
    "it": "Regione preferita",
    "es": "Región preferida",
    "zh": "首选区域",
    "ru": "Предпочтительный регион"
  },
  "Select a region": {
    "fr": "Sélectionnez une région",
    "it": "Selezionare una regione",
    "es": "Seleccione una región",
    "zh": "选择一个区域",
    "ru": "Выберите регион"
  },
  "ID document": {
    "fr": "pièce d'identité",
    "it": "Documento di identità",
    "es": "documento de identidad",
    "zh": "身份证件",
    "ru": "Документ, удостоверяющий личность"
  },
  "JPEG, PNG or PDF · 5 MB maximum": {
    "fr": "JPEG, PNG ou PDF · 5 Mo maximum",
    "it": "JPEG, PNG o PDF · 5 MB massimo",
    "es": "JPEG, PNG o PDF · 5 MB máximo",
    "zh": "JPEG、PNG 或 PDF · 最大 5 MB",
    "ru": "JPEG, PNG или PDF · максимум 5 МБ"
  },
  "Send application ↗": {
    "fr": "Envoyer la candidature ↗",
    "it": "Invia candidatura ↗",
    "es": "Enviar solicitud ↗",
    "zh": "发送申请 ↗",
    "ru": "Отправить заявку ↗"
  },
  "Your documents are stored securely and can only be accessed by the admin team.": {
    "fr": "Vos documents sont stockés en toute sécurité et ne sont accessibles que par l'équipe d'administration.",
    "it": "I tuoi documenti sono archiviati in modo sicuro e sono accessibili solo al team di amministratori.",
    "es": "Tus documentos se almacenan de forma segura y solo el equipo de administración puede acceder a ellos.",
    "zh": "您的文档被安全存储，并且只能由管理团队访问。",
    "ru": "Ваши документы надежно хранятся, и доступ к ним могут получить только администраторы."
  },
  "UBeer OPERATIONS": {
    "fr": "OPÉRATIONS UBeer",
    "it": "OPERAZIONI UBeer",
    "es": "OPERACIONES DE UBerra",
    "zh": "UBeer 运营",
    "ru": "ОПЕРАЦИИ UBeer"
  },
  "Admin sign in": {
    "fr": "Connexion administrateur",
    "it": "Accesso amministratore",
    "es": "Inicio de sesión de administrador",
    "zh": "管理员登录",
    "ru": "Вход администратора"
  },
  "Administrator access requires an authenticator code.": {
    "fr": "L'accès administrateur nécessite un code d'authentification.",
    "it": "L'accesso come amministratore richiede un codice autenticatore.",
    "es": "El acceso de administrador requiere un código de autenticación.",
    "zh": "管理员访问需要验证码。",
    "ru": "Для доступа администратора требуется код аутентификации."
  },
  "Authenticator code": {
    "fr": "Code d'authentification",
    "it": "Codice autenticatore",
    "es": "Código de autenticación",
    "zh": "验证码",
    "ru": "Код аутентификатора"
  },
  "000 000": {
    "fr": "000 000",
    "it": "000 000",
    "es": "000 000",
    "zh": "000 000",
    "ru": "000 000"
  },
  "Enter operations ↗": {
    "fr": "Saisir les opérations ↗",
    "it": "Immettere le operazioni ↗",
    "es": "Introducir operaciones ↗",
    "zh": "输入操作 ↗",
    "ru": "Ввод операций ↗"
  },
  "← Return to uBeer": {
    "fr": "← Retour à uBeer",
    "it": "← Ritorna a uBeer",
    "es": "← Volver a uBeer",
    "zh": "← 返回uBeer",
    "ru": "← Вернуться на uBeer"
  },
  "OPERATIONS": {
    "fr": "OPÉRATIONS",
    "it": "OPERAZIONI",
    "es": "OPERACIONES",
    "zh": "运营",
    "ru": "ОПЕРАЦИИ"
  },
  "ADMIN": {
    "fr": "ADMINISTRATEUR",
    "it": "AMMINISTRATORE",
    "es": "ADMINISTRADOR",
    "zh": "管理员",
    "ru": "АДМИН"
  },
  "Sign out": {
    "fr": "Se déconnecter",
    "it": "Esci",
    "es": "Cerrar sesión",
    "zh": "退出",
    "ru": "Выйти"
  },
  "UBeer /": {
    "fr": "UBière /",
    "it": "UBirra /",
    "es": "UBerveza /",
    "zh": "优啤酒/",
    "ru": "УБеер /"
  },
  "SYSTEM LIVE": {
    "fr": "SYSTÈME EN DIRECT",
    "it": "SISTEMA IN DIRETTA",
    "es": "SISTEMA EN VIVO",
    "zh": "系统上线",
    "ru": "СИСТЕМА В РАБОТЕ"
  },
  "YOUR DAILY BRIEF": {
    "fr": "VOTRE BREF QUOTIDIEN",
    "it": "IL TUO BRIEF GIORNALIERO",
    "es": "TU RESUMEN DIARIO",
    "zh": "您的每日简报",
    "ru": "ВАШ ЕЖЕДНЕВНЫЙ КРАТКИЙ ОБЗОР"
  },
  "Good operations": {
    "fr": "Bonnes opérations",
    "it": "Buone operazioni",
    "es": "Buenas operaciones",
    "zh": "良好的运营",
    "ru": "Хорошие операции"
  },
  "make good evenings.": {
    "fr": "faites de bonnes soirées.",
    "it": "fanno belle serate.",
    "es": "que tengas buenas noches.",
    "zh": "祝大家晚上好。",
    "ru": "добрых вечеров."
  },
  "Orders, local coverage and driver activity are all in one place.": {
    "fr": "Les commandes, la couverture locale et l'activité des chauffeurs sont réunies au même endroit.",
    "it": "Ordini, copertura locale e attività degli autisti sono tutti in un unico posto.",
    "es": "Los pedidos, la cobertura local y la actividad de los conductores están todos en un solo lugar.",
    "zh": "订单、本地覆盖范围和司机活动都集中在一处。",
    "ru": "Заказы, местное покрытие и действия водителей — все в одном месте."
  },
  "Review orders ↗": {
    "fr": "Réviser les commandes ↗",
    "it": "Rivedi gli ordini ↗",
    "es": "Revisar pedidos ↗",
    "zh": "审核订单 ↗",
    "ru": "Просмотр заказов ↗"
  },
  "Manage delivery regions ↗": {
    "fr": "Gérer les régions de livraison ↗",
    "it": "Gestisci le regioni di consegna ↗",
    "es": "Administrar regiones de entrega ↗",
    "zh": "管理配送区域 ↗",
    "ru": "Управление регионами доставки ↗"
  },
  "Review driver applications ↗": {
    "fr": "Examiner les demandes de conducteur ↗",
    "it": "Esamina le applicazioni dei driver ↗",
    "es": "Revisar aplicaciones de controladores ↗",
    "zh": "审查驱动程序申请 ↗",
    "ru": "Обзор приложений-драйверов ↗"
  },
  "Draw a polygon or rectangle to define a service area along the Island of Montréal coastline.": {
    "fr": "Dessinez un polygone ou un rectangle pour définir une zone de service le long du littoral de l'île de Montréal.",
    "it": "Disegna un poligono o un rettangolo per definire un'area di servizio lungo la costa dell'isola di Montréal.",
    "es": "Dibuje un polígono o un rectángulo para definir un área de servicio a lo largo de la costa de la isla de Montreal.",
    "zh": "绘制多边形或矩形，以沿蒙特利尔岛海岸线定义服务区域。",
    "ru": "Нарисуйте многоугольник или прямоугольник, чтобы определить зону обслуживания вдоль береговой линии острова Монреаль."
  },
  "REGION DETAILS": {
    "fr": "DÉTAILS DE LA RÉGION",
    "it": "DETTAGLI REGIONE",
    "es": "DETALLES DE LA REGIÓN",
    "zh": "地区详情",
    "ru": "ДЕТАЛИ РЕГИОНА"
  },
  "Map a neighbourhood.": {
    "fr": "Cartographier un quartier.",
    "it": "Mappa un quartiere.",
    "es": "Mapear un vecindario.",
    "zh": "绘制邻域地图。",
    "ru": "Нанесите на карту окрестности."
  },
  "Region name": {
    "fr": "Nom de la région",
    "it": "Nome della regione",
    "es": "Nombre de la región",
    "zh": "区域名称",
    "ru": "Название региона"
  },
  "Downtown area": {
    "fr": "Centre-ville",
    "it": "Zona del centro città",
    "es": "Zona centro",
    "zh": "市中心区",
    "ru": "Центр города"
  },
  "Delivery fee ($)": {
    "fr": "Frais de livraison ($)",
    "it": "Spese di spedizione ($)",
    "es": "Tarifa de envío ($)",
    "zh": "送货费 ($)",
    "ru": "Стоимость доставки ($)"
  },
  "Age gate": {
    "fr": "Porte d'âge",
    "it": "Cancello dell'età",
    "es": "Puerta de edad",
    "zh": "年龄门",
    "ru": "Возрастные ограничения"
  },
  "19+": {
    "fr": "19+",
    "it": "19+",
    "es": "19+",
    "zh": "19+",
    "ru": "19+"
  },
  "21+": {
    "fr": "21+",
    "it": "21+",
    "es": "21+",
    "zh": "21+",
    "ru": "21+"
  },
  "Minimum order ($)": {
    "fr": "Commande minimum ($)",
    "it": "Ordine minimo ($)",
    "es": "Pedido mínimo ($)",
    "zh": "最低订购量 ($)",
    "ru": "Минимальный заказ ($)"
  },
  "Active after saving": {
    "fr": "Actif après enregistrement",
    "it": "Attivo dopo il salvataggio",
    "es": "Activo después de guardar",
    "zh": "保存后有效",
    "ru": "Активно после сохранения"
  },
  "Save region ↗": {
    "fr": "Enregistrer la région ↗",
    "it": "Salva regione ↗",
    "es": "Guardar región ↗",
    "zh": "保存区域 ↗",
    "ru": "Сохранить регион ↗"
  },
  "Existing regions": {
    "fr": "Régions existantes",
    "it": "Regioni esistenti",
    "es": "Regiones existentes",
    "zh": "现有区域",
    "ru": "Существующие регионы"
  },
  "Products": {
    "fr": "Produits",
    "it": "Prodotti",
    "es": "Productos",
    "zh": "产品",
    "ru": "Продукты"
  },
  "CATALOG": {
    "fr": "CATALOGUE",
    "it": "CATALOGO",
    "es": "CATÁLOGO",
    "zh": "目录",
    "ru": "КАТАЛОГ"
  },
  "Add a product.": {
    "fr": "Ajouter un produit.",
    "it": "Aggiungi un prodotto.",
    "es": "Agregar un producto.",
    "zh": "添加产品。",
    "ru": "Добавьте товар."
  },
  "Name": {
    "fr": "Nom",
    "it": "Nome",
    "es": "Nombre",
    "zh": "姓名",
    "ru": "Имя"
  },
  "Description": {
    "fr": "Descriptif",
    "it": "Descrizione",
    "es": "Descripción",
    "zh": "说明",
    "ru": "Описание"
  },
  "Price ($)": {
    "fr": "Prix ($)",
    "it": "Prezzo ($)",
    "es": "Precio ($)",
    "zh": "价格 ($)",
    "ru": "Цена ($)"
  },
  "Stock": {
    "fr": "Actions",
    "it": "Azionario",
    "es": "Valores",
    "zh": "库存",
    "ru": "Акции"
  },
  "Available in": {
    "fr": "Disponible en",
    "it": "Disponibile in",
    "es": "Disponible en",
    "zh": "可用于",
    "ru": "Доступно в"
  },
  "Choose region": {
    "fr": "Choisir une région",
    "it": "Scegli la regione",
    "es": "Elige región",
    "zh": "选择区域",
    "ru": "Выберите регион"
  },
  "Mark as test listing": {
    "fr": "Marquer comme liste de tests",
    "it": "Contrassegna come elenco di prova",
    "es": "Marcar como listado de prueba",
    "zh": "标记为测试列表",
    "ru": "Отметить как тестовый список"
  },
  "Add to catalog ↗": {
    "fr": "Ajouter au catalogue ↗",
    "it": "Aggiungi al catalogo ↗",
    "es": "Añadir al catálogo ↗",
    "zh": "添加到目录 ↗",
    "ru": "Добавить в каталог ↗"
  },
  "Refresh": {
    "fr": "Actualiser",
    "it": "Aggiorna",
    "es": "Actualizar",
    "zh": "刷新",
    "ru": "Обновить"
  },
  "↻": {
    "fr": "↻",
    "it": "↻",
    "es": "↻",
    "zh": "↻",
    "ru": "↻"
  },
  "BTCPay secrets are read from the server environment and are never shown here.": {
    "fr": "Les secrets BTCPay sont lus à partir de l'environnement du serveur et ne sont jamais affichés ici.",
    "it": "I segreti BTCPay vengono letti dall'ambiente server e non vengono mai mostrati qui.",
    "es": "Los secretos de BTCPay se leen desde el entorno del servidor y nunca se muestran aquí.",
    "zh": "BTCPay 秘密是从服务器环境中读取的，并且不会在此处显示。",
    "ru": "Секреты BTCPay считываются из среды сервера и никогда здесь не отображаются."
  },
  "Approve": {
    "fr": "Approuver",
    "it": "Approva",
    "es": "Aprobar",
    "zh": "批准",
    "ru": "Одобрить"
  },
  "Reject": {
    "fr": "Rejeter",
    "it": "Rifiuta",
    "es": "Rechazar",
    "zh": "拒绝",
    "ru": "Отклонить"
  },
  "Change status": {
    "fr": "Changer de statut",
    "it": "Modifica lo stato",
    "es": "Cambiar estado",
    "zh": "更改状态",
    "ru": "Изменить статус"
  },
  "Refund note": {
    "fr": "Note de remboursement",
    "it": "Nota di rimborso",
    "es": "Nota de reembolso",
    "zh": "退款说明",
    "ru": "Примечание о возврате средств"
  },
  "Payout #": {
    "fr": "N° de paiement",
    "it": "Pagamento n.",
    "es": "Número de pago",
    "zh": "支付#",
    "ru": "Номер выплаты"
  },
  "· $": {
    "fr": "· $",
    "it": "· $",
    "es": "·$",
    "zh": "·$",
    "ru": "· $"
  },
  "Mark paid": {
    "fr": "Mark a payé",
    "it": "Mark ha pagato",
    "es": "Marca pagada",
    "zh": "标记已付款",
    "ru": "Отметить оплату"
  },
  "MANUAL PAYOUT": {
    "fr": "PAIEMENT MANUEL",
    "it": "PAGAMENTO MANUALE",
    "es": "PAGO MANUAL",
    "zh": "手动支付",
    "ru": "ВЫПЛАТА ВРУЧНУЮ"
  },
  "Record a driver payout.": {
    "fr": "Enregistrez un paiement de conducteur.",
    "it": "Registra un pagamento al conducente.",
    "es": "Registra el pago de un conductor.",
    "zh": "记录驾驶员支出。",
    "ru": "Запишите выплату водителю."
  },
  "Driver": {
    "fr": "Pilote",
    "it": "Autista",
    "es": "Conductor",
    "zh": "司机",
    "ru": "Драйвер"
  },
  "Select driver": {
    "fr": "Sélectionnez le pilote",
    "it": "Seleziona il driver",
    "es": "Seleccionar controlador",
    "zh": "选择驱动程序",
    "ru": "Выбор водителя"
  },
  "Amount ($)": {
    "fr": "Montant ($)",
    "it": "Importo ($)",
    "es": "Monto ($)",
    "zh": "金额 ($)",
    "ru": "Сумма ($)"
  },
  "Note": {
    "fr": "Remarque",
    "it": "Nota",
    "es": "Nota",
    "zh": "注意",
    "ru": "Примечание"
  },
  "Create payout ↗": {
    "fr": "Créer un paiement ↗",
    "it": "Crea pagamento ↗",
    "es": "Crear pago ↗",
    "zh": "创建付款 ↗",
    "ru": "Создать выплату ↗"
  },
  "DRIVER EARNINGS": {
    "fr": "REVENUS DU CONDUCTEUR",
    "it": "GUADAGNO DEL PILOTA",
    "es": "GANANCIAS DEL CONDUCTOR",
    "zh": "车手收入",
    "ru": "ЗАРАБОТКИ ВОДИТЕЛЕЙ"
  },
  "Platform fee": {
    "fr": "Frais de plateforme",
    "it": "Tariffa della piattaforma",
    "es": "Tarifa de plataforma",
    "zh": "平台费用",
    "ru": "Плата за платформу"
  },
  "Fee percentage": {
    "fr": "Pourcentage des frais",
    "it": "Percentuale della commissione",
    "es": "Porcentaje de tarifa",
    "zh": "费用百分比",
    "ru": "Процент комиссии"
  },
  "Save platform fee ↗": {
    "fr": "Économisez sur les frais de plateforme ↗",
    "it": "Risparmia sulla tariffa della piattaforma ↗",
    "es": "Ahorrar tarifa de plataforma ↗",
    "zh": "节省平台费 ↗",
    "ru": "Сохранить комиссию за платформу ↗"
  },
  "No records here yet.": {
    "fr": "Aucun enregistrement ici pour l'instant.",
    "it": "Ancora nessun record qui.",
    "es": "Aún no hay registros aquí.",
    "zh": "这里还没有记录。",
    "ru": "Здесь пока нет записей."
  },
  "404 · OFF THE MAP": {
    "fr": "404 · HORS CARTE",
    "it": "404 · FUORI DALLA MAPPA",
    "es": "404 · FUERA DEL MAPA",
    "zh": "404 · 地图外",
    "ru": "404 · ВНЕ КАРТЫ"
  },
  "Wrong turn.": {
    "fr": "Mauvais virage.",
    "it": "Svolta sbagliata.",
    "es": "Giro equivocado.",
    "zh": "转弯错误。",
    "ru": "Неправильный поворот."
  },
  "Let’s head home.": {
    "fr": "Rentrons à la maison.",
    "it": "Andiamo a casa.",
    "es": "Vámonos a casa.",
    "zh": "我们回家吧。",
    "ru": "Поехали домой."
  },
  "Back to uBeer": {
    "fr": "Retour à uBeer",
    "it": "Torniamo a uBeer",
    "es": "Volver a uCerveza",
    "zh": "返回uBeer",
    "ru": "Назад в uBeer"
  },
  "We accept over 2,000 cryptocurrencies": {
    "fr": "Nous acceptons plus de 2 000 crypto-monnaies",
    "it": "Accettiamo oltre 2.000 criptovalute",
    "es": "Aceptamos más de 2000 criptomonedas",
    "zh": "我们接受超过 2,000 种加密货币",
    "ru": "Мы принимаем более 2000 криптовалют."
  },
  "Including Bitcoin and Lightning": {
    "fr": "Y compris Bitcoin et Lightning",
    "it": "Inclusi Bitcoin e Lightning",
    "es": "Incluyendo Bitcoin y Lightning",
    "zh": "包括比特币和闪电网络",
    "ru": "Включая Биткойн и Lightning"
  },
  "Download the uBeer mobile app": {
    "fr": "Téléchargez l'application mobile uBeer",
    "it": "Scarica l'app mobile uBeer",
    "es": "Descargue la aplicación móvil uBeer",
    "zh": "下载uBeer移动应用程序",
    "ru": "Загрузите мобильное приложение uBeer"
  },
  "Download Android app": {
    "fr": "Télécharger l'application Android",
    "it": "Scarica l'app Android",
    "es": "Descargar la aplicación Android",
    "zh": "下载 Android 应用",
    "ru": "Скачать приложение для Android"
  },
  "Install Android app": {
    "fr": "Installer l'application Android",
    "it": "Installa l'app Android",
    "es": "Instalar la aplicación Android",
    "zh": "安装 Android 应用",
    "ru": "Установить приложение для Android"
  },
  "Download Android APK": {
    "fr": "Télécharger l'APK Android",
    "it": "Scarica l'APK Android",
    "es": "Descargar APK de Android",
    "zh": "下载 Android APK",
    "ru": "Скачать APK для Android"
  },
  "Language": {
    "fr": "Langue",
    "it": "Linguaggio",
    "es": "Idioma",
    "zh": "语言",
    "ru": "Язык"
  },
  "Automatic": {
    "fr": "Automatique",
    "it": "Automatico",
    "es": "Automático",
    "zh": "自动",
    "ru": "Автоматически"
  },
  "English": {
    "fr": "anglais",
    "it": "Inglese",
    "es": "Inglés",
    "zh": "英语",
    "ru": "английский"
  },
  "Français": {
    "fr": "Français",
    "it": "Français",
    "es": "Francés",
    "zh": "法语",
    "ru": "Французский"
  },
  "Italiano": {
    "fr": "Italien",
    "it": "Italiano",
    "es": "Italiano",
    "zh": "意大利语",
    "ru": "Итальянский"
  },
  "Español": {
    "fr": "espagnol",
    "it": "Español",
    "es": "English",
    "zh": "西班牙语",
    "ru": "Испанский"
  },
  "简体中文": {
    "fr": "简体中文",
    "it": "简体中文",
    "es": "简体中文",
    "zh": "简体中文",
    "ru": "简体中文"
  },
  "Русский": {
    "fr": "Russe",
    "it": "Russo",
    "es": "Ruso",
    "zh": "俄罗斯",
    "ru": "Русский"
  },
  "Enter a full street address or Canadian postal code.": {
    "fr": "Entrez une adresse postale complète ou un code postal canadien.",
    "it": "Inserisci un indirizzo completo o un codice postale canadese.",
    "es": "Ingrese una dirección postal completa o un código postal canadiense.",
    "zh": "输入完整的街道地址或加拿大邮政编码。",
    "ru": "Введите полный адрес или почтовый индекс Канады."
  },
  "We are not delivering here just yet. Join the waitlist and we’ll let you know when we arrive.": {
    "fr": "Nous ne livrons pas encore ici. Inscrivez-vous sur la liste d'attente et nous vous informerons de notre arrivée.",
    "it": "Non stiamo ancora effettuando consegne qui. Iscriviti alla lista d'attesa e ti faremo sapere quando arriveremo.",
    "es": "Aún no realizamos entregas aquí. Únase a la lista de espera y le avisaremos cuando lleguemos.",
    "zh": "我们还没有在这里交付。加入候补名单，我们到达时会通知您。",
    "ru": "Мы пока не осуществляем доставку. Присоединяйтесь к листу ожидания, и мы сообщим вам, когда приедем."
  },
  "Search your exact street address to order.": {
    "fr": "Recherchez votre adresse postale exacte pour commander.",
    "it": "Cerca il tuo indirizzo esatto per ordinare.",
    "es": "Busque su dirección exacta para realizar el pedido.",
    "zh": "搜索您的确切街道地址进行订购。",
    "ru": "Чтобы сделать заказ, найдите свой точный адрес."
  },
  "Search your exact street address before continuing to checkout.": {
    "fr": "Recherchez votre adresse exacte avant de continuer à payer.",
    "it": "Cerca il tuo indirizzo esatto prima di continuare con il pagamento.",
    "es": "Busque su dirección exacta antes de continuar con el pago.",
    "zh": "在继续结帐之前搜索您的确切街道地址。",
    "ru": "Прежде чем продолжить оформление заказа, найдите свой точный адрес."
  },
  "Add a product to your cart first.": {
    "fr": "Ajoutez d'abord un produit à votre panier.",
    "it": "Aggiungi prima un prodotto al carrello.",
    "es": "Primero agregue un producto a su carrito.",
    "zh": "首先将产品添加到您的购物车。",
    "ru": "Сначала добавьте товар в корзину."
  },
  "Please confirm that you are at least": {
    "fr": "Veuillez confirmer que vous êtes au moins",
    "it": "Per favore conferma che lo sei almeno",
    "es": "Por favor confirma que eres al menos",
    "zh": "请确认您至少",
    "ru": "Пожалуйста, подтвердите, что вы как минимум"
  },
  "Enter the full street address where the order should be delivered.": {
    "fr": "Saisissez l'adresse postale complète à laquelle la commande doit être livrée.",
    "it": "Inserisci l'indirizzo completo dove deve essere consegnato l'ordine.",
    "es": "Ingrese la dirección completa donde se debe entregar el pedido.",
    "zh": "输入订单应交付的完整街道地址。",
    "ru": "Введите полный почтовый адрес, по которому должен быть доставлен заказ."
  },
  "Location services are not available in this browser.": {
    "fr": "Les services de localisation ne sont pas disponibles dans ce navigateur.",
    "it": "I servizi di localizzazione non sono disponibili in questo browser.",
    "es": "Los servicios de ubicación no están disponibles en este navegador.",
    "zh": "位置服务在此浏览器中不可用。",
    "ru": "Службы определения местоположения недоступны в этом браузере."
  },
  "We could not access your location. Enter an address instead.": {
    "fr": "Nous n'avons pas pu accéder à votre position. Saisissez plutôt une adresse.",
    "it": "Non siamo riusciti ad accedere alla tua posizione. Inserisci invece un indirizzo.",
    "es": "No pudimos acceder a tu ubicación. Introduzca una dirección en su lugar.",
    "zh": "我们无法访问您的位置。请输入地址。",
    "ru": "Нам не удалось получить доступ к вашему местоположению. Вместо этого введите адрес."
  },
  "Allow location access while you are online.": {
    "fr": "Autoriser l'accès à la localisation lorsque vous êtes en ligne.",
    "it": "Consenti l'accesso alla posizione mentre sei online.",
    "es": "Permitir el acceso a la ubicación mientras estás en línea.",
    "zh": "允许在线时访问位置。",
    "ru": "Разрешить доступ к местоположению, пока вы онлайн."
  },
  "Ask the customer for their six-digit delivery code": {
    "fr": "Demander au client son code de livraison à six chiffres",
    "it": "Chiedi al cliente il codice di consegna a sei cifre",
    "es": "Solicite al cliente su código de entrega de seis dígitos",
    "zh": "向客户询问六位数的送货代码",
    "ru": "Попросите у клиента шестизначный код доставки."
  },
  "Thanks for joining uBeer.": {
    "fr": "Merci d'avoir rejoint uBeer.",
    "it": "Grazie per esserti iscritto a uBeer.",
    "es": "Gracias por unirte a uBeer.",
    "zh": "感谢您加入 uBeer。",
    "ru": "Спасибо, что присоединились к uBeer."
  },
  "French": {
    "fr": "français",
    "it": "Francese",
    "es": "francés",
    "zh": "法语",
    "ru": "Французский"
  },
  "Italian": {
    "fr": "italien",
    "it": "Italiano",
    "es": "italiano",
    "zh": "意大利语",
    "ru": "Итальянский"
  },
  "Spanish": {
    "fr": "espagnol",
    "it": "Spagnolo",
    "es": "Español",
    "zh": "西班牙语",
    "ru": "Испанский"
  },
  "Chinese": {
    "fr": "Chinois",
    "it": "Cinese",
    "es": "chino",
    "zh": "中文",
    "ru": "Китайский"
  },
  "Russian": {
    "fr": "Russe",
    "it": "Russo",
    "es": "Ruso",
    "zh": "俄语",
    "ru": "Русский"
  },
  "Close navigation": {
    "fr": "Fermer la navigation",
    "it": "Chiudi la navigazione",
    "es": "Cerrar navegación",
    "zh": "关闭导航",
    "ru": "Закрыть навигацию"
  },
  "Open navigation": {
    "fr": "Ouvrir la navigation",
    "it": "Apri la navigazione",
    "es": "Abrir navegación",
    "zh": "打开导航",
    "ru": "Открыть навигацию"
  },
  "Exact street address": {
    "fr": "Adresse exacte",
    "it": "Indirizzo esatto",
    "es": "Dirección exacta",
    "zh": "确切的街道地址",
    "ru": "Точный адрес"
  },
  "Postal code estimate": {
    "fr": "Estimation du code postal",
    "it": "Stima del codice postale",
    "es": "Estimación del código postal",
    "zh": "邮政编码估计",
    "ru": "Приблизительный почтовый индекс"
  },
  "Order status": {
    "fr": "État de la commande",
    "it": "Stato dell'ordine",
    "es": "Estado del pedido",
    "zh": "订单状态",
    "ru": "Статус заказа"
  },
  "Order accepted": {
    "fr": "Commande acceptée",
    "it": "Ordine accettato",
    "es": "Pedido aceptado",
    "zh": "订单已接受",
    "ru": "Заказ принят"
  },
  "Payment failed": {
    "fr": "Échec du paiement",
    "it": "Pagamento non riuscito",
    "es": "Pago fallido",
    "zh": "支付失败",
    "ru": "Платеж не выполнен"
  },
  "Preparing": {
    "fr": "Préparation",
    "it": "Preparazione",
    "es": "Preparando",
    "zh": "准备",
    "ru": "Подготовка"
  },
  "Out for delivery": {
    "fr": "En livraison",
    "it": "In consegna",
    "es": "Fuera de entrega",
    "zh": "待发货",
    "ru": "Готово к доставке"
  },
  "Delivered": {
    "fr": "Livré",
    "it": "Consegnato",
    "es": "Entregado",
    "zh": "已交付",
    "ru": "Доставлено"
  },
  "Cancelled": {
    "fr": "Annulé",
    "it": "Annullato",
    "es": "Cancelado",
    "zh": "已取消",
    "ru": "Отменено"
  },
  "Refunded": {
    "fr": "Remboursé",
    "it": "Rimborsato",
    "es": "Reembolsado",
    "zh": "已退款",
    "ru": "Возврат средств"
  },
  "Failed": {
    "fr": "Échec",
    "it": "Non riuscito",
    "es": "Falló",
    "zh": "失败",
    "ru": "Не удалось"
  },
  "Invalid request": {
    "fr": "Demande invalide",
    "it": "Richiesta non valida",
    "es": "Solicitud no válida",
    "zh": "无效请求",
    "ru": "Неверный запрос"
  },
  "A record with these details already exists": {
    "fr": "Un enregistrement avec ces détails existe déjà",
    "it": "Esiste già un record con questi dettagli",
    "es": "Ya existe un registro con estos detalles",
    "zh": "包含这些详细信息的记录已存在",
    "ru": "Запись с такими данными уже существует"
  },
  "Internal server error": {
    "fr": "Erreur de serveur interne",
    "it": "Errore interno del server",
    "es": "Error interno del servidor",
    "zh": "内部服务器错误",
    "ru": "Внутренняя ошибка сервера"
  },
  "Enter a full address or Canadian postal code": {
    "fr": "Entrez une adresse complète ou un code postal canadien",
    "it": "Inserisci un indirizzo completo o un codice postale canadese",
    "es": "Ingrese una dirección completa o un código postal canadiense",
    "zh": "输入完整地址或加拿大邮政编码",
    "ru": "Введите полный адрес или почтовый индекс Канады."
  },
  "Please enter a valid email address": {
    "fr": "Veuillez saisir une adresse e-mail valide",
    "it": "Inserisci un indirizzo email valido",
    "es": "Por favor ingrese una dirección de correo electrónico válida",
    "zh": "请输入有效的电子邮件地址",
    "ru": "Пожалуйста, введите действительный адрес электронной почты"
  },
  "Delivery is not available at this location": {
    "fr": "La livraison n'est pas disponible à cet endroit",
    "it": "La consegna non è disponibile in questa località",
    "es": "La entrega no está disponible en esta ubicación",
    "zh": "此地点不提供送货服务",
    "ru": "Доставка недоступна по этому адресу."
  },
  "A product is unavailable in this region": {
    "fr": "Un produit n'est pas disponible dans cette région",
    "it": "Un prodotto non è disponibile in questa regione",
    "es": "Un producto no está disponible en esta región",
    "zh": "该地区不提供该产品",
    "ru": "Товар недоступен в этом регионе."
  },
  "A product has insufficient stock": {
    "fr": "Un produit a un stock insuffisant",
    "it": "Un prodotto ha scorte insufficienti",
    "es": "Un producto no tiene stock suficiente",
    "zh": "某产品库存不足",
    "ru": "Товара недостаточно на складе"
  },
  "Check your delivery area, age confirmation, email, and cart": {
    "fr": "Vérifiez votre zone de livraison, votre confirmation d'âge, votre e-mail et votre panier.",
    "it": "Controlla l'area di consegna, la conferma dell'età, l'e-mail e il carrello",
    "es": "Consulta tu zona de entrega, confirmación de edad, correo electrónico y carrito",
    "zh": "检查您的送货区域、年龄确认、电子邮件和购物车",
    "ru": "Проверьте зону доставки, подтверждение возраста, электронную почту и корзину."
  },
  "One or more products are unavailable in this region": {
    "fr": "Un ou plusieurs produits ne sont pas disponibles dans cette région",
    "it": "Uno o più prodotti non sono disponibili in questa regione",
    "es": "Uno o más productos no están disponibles en esta región",
    "zh": "一种或多种产品在此地区不可用",
    "ru": "Один или несколько товаров недоступны в этом регионе."
  },
  "Minimum order is": {
    "fr": "La commande minimum est",
    "it": "L'ordine minimo è",
    "es": "El pedido mínimo es",
    "zh": "最小订单为",
    "ru": "Минимальный заказ"
  },
  "Authentication required": {
    "fr": "Authentification requise",
    "it": "Autenticazione richiesta",
    "es": "Se requiere autenticación",
    "zh": "需要身份验证",
    "ru": "Требуется аутентификация"
  },
  "Session expired": {
    "fr": "Session expirée",
    "it": "Sessione scaduta",
    "es": "La sesión expiró",
    "zh": "会话已过期",
    "ru": "Срок действия сессии истек"
  },
  "Email or password is incorrect": {
    "fr": "L'e-mail ou le mot de passe est incorrect",
    "it": "L'e-mail o la password non sono corrette",
    "es": "El correo electrónico o la contraseña son incorrectos",
    "zh": "电子邮件或密码不正确",
    "ru": "Адрес электронной почты или пароль неверны."
  },
  "Your account starts after admin review.": {
    "fr": "Votre compte démarre après examen par l'administrateur.",
    "it": "Il tuo account viene avviato dopo la revisione da parte dell'amministratore.",
    "es": "Su cuenta comienza después de la revisión del administrador.",
    "zh": "您的帐户在管理员审核后启动。",
    "ru": "Ваш аккаунт заработает после проверки администратором."
  },
  "WE DELIVER 24 HOURS PER DAY": {
    "fr": "NOUS LIVRONS 24 HEURES PAR JOUR",
    "it": "CONSEGNIAMO 24 ORE AL GIORNO",
    "es": "ENTREGAMOS LAS 24 HORAS DEL DÍA",
    "zh": "我们每天 24 小时送货",
    "ru": "МЫ ДОСТАВЛЯЕМ 24 ЧАСА В СУТКИ"
  },
  "We deliver 24 hours a day": {
    "fr": "Nous livrons 24h/24",
    "it": "Consegniamo 24 ore su 24",
    "es": "Entregamos las 24 horas del día",
    "zh": "我们全天 24 小时送货",
    "ru": "Доставляем круглосуточно."
  },
  "Photo of a local drinks delivery in Montréal": {
    "fr": "Photo d'une livraison de boissons locales à Montréal",
    "it": "Foto di una consegna di bevande locali a Montréal",
    "es": "Foto de una entrega de bebidas locales en Montreal",
    "zh": "蒙特利尔当地饮料配送照片",
    "ru": "Фотография доставки местных напитков в Монреале."
  },
  "Six-pack of Heineken beer": {
    "fr": "Pack de six bières Heineken",
    "it": "Confezione da sei di birra Heineken",
    "es": "Paquete de seis cervezas Heineken",
    "zh": "六罐装喜力啤酒",
    "ru": "Шесть упаковок пива Heineken"
  },
  "Neighbourhood delivery waitlist illustration": {
    "fr": "Illustration de la liste d'attente pour les livraisons de quartier",
    "it": "Illustrazione della lista d'attesa per la consegna nel quartiere",
    "es": "Ilustración de la lista de espera de entrega en el vecindario",
    "zh": "邻里送货等候名单插图",
    "ru": "Иллюстрация списка ожидания доставки по району"
  },
  "Montreal driver with delivery bag": {
    "fr": "Chauffeur montréalais avec sac de livraison",
    "it": "Autista di Montreal con borsa per la consegna",
    "es": "Conductor de Montreal con bolsa de entrega",
    "zh": "蒙特利尔司机提着送货包",
    "ru": "Водитель из Монреаля с сумкой для доставки"
  },
  "Order delivered to the door": {
    "fr": "Commande livrée à la porte",
    "it": "Ordine consegnato alla porta",
    "es": "Pedido entregado en puerta",
    "zh": "订单送货上门",
    "ru": "Заказ доставлен до двери"
  },
  "Install uBeer on your phone for easy ordering and order tracking.": {
    "fr": "Installez uBeer sur votre téléphone pour faciliter les commandes et le suivi des commandes.",
    "it": "Installa uBeer sul tuo telefono per ordinare e monitorare facilmente gli ordini.",
    "es": "Instale uBeer en su teléfono para realizar pedidos y rastrearlos fácilmente.",
    "zh": "在您的手机上安装 uBeer，以便轻松订购和订单跟踪。",
    "ru": "Установите uBeer на свой телефон, чтобы упростить оформление и отслеживание заказов."
  },
  "Automatic (based on your region)": {
    "fr": "Automatique (en fonction de votre région)",
    "it": "Automatico (in base alla tua regione)",
    "es": "Automático (según su región)",
    "zh": "自动（根据您所在的地区）",
    "ru": "Автоматически (в зависимости от вашего региона)"
  },
  "Select display language": {
    "fr": "Sélectionner la langue d'affichage",
    "it": "Selezionare la lingua di visualizzazione",
    "es": "Seleccionar idioma de visualización",
    "zh": "选择显示语言",
    "ru": "Выбор языка дисплея"
  },
  "Customer language": {
    "fr": "Langue du client",
    "it": "Lingua del cliente",
    "es": "Idioma del cliente",
    "zh": "客户语言",
    "ru": "Язык клиента"
  },
  "uBeer — Local drinks, delivered": {
    "fr": "uBeer — des boissons locales, livrées",
    "it": "uBeer — bevande locali, consegnate",
    "es": "uBeer — bebidas locales a domicilio",
    "zh": "uBeer — 本地饮品，即时送达",
    "ru": "uBeer — местные напитки с доставкой"
  },
  "uBeer — local drinks, delivered responsibly.": {
    "fr": "uBeer — des boissons locales livrées de façon responsable.",
    "it": "uBeer — bevande locali consegnate responsabilmente.",
    "es": "uBeer — bebidas locales entregadas responsablemente.",
    "zh": "uBeer — 负责任地配送本地饮品。",
    "ru": "uBeer — ответственная доставка местных напитков."
  },
  "Install uBeer": {
    "fr": "Installer uBeer",
    "it": "Installa uBeer",
    "es": "Instalar uBeer",
    "zh": "安装 uBeer",
    "ru": "Установите uBeer"
  },
  "Over 2,000 cryptocurrencies accepted": {
    "fr": "Plus de 2 000 crypto-monnaies acceptées",
    "it": "Sono accettate oltre 2.000 criptovalute",
    "es": "Se aceptan más de 2000 criptomonedas",
    "zh": "接受超过 2,000 种加密货币",
    "ru": "Принимается более 2000 криптовалют."
  },
  "6-Pack Heineken Beer": {
    "fr": "Pack de 6 bières Heineken",
    "it": "Confezione da 6 birre Heineken",
    "es": "Pack de 6 cervezas Heineken",
    "zh": "6瓶装喜力啤酒",
    "ru": "Упаковка из 6 бутылок пива Heineken"
  },
  "Test listing: six-pack of Heineken beer.": {
    "fr": "Article de test : pack de six bières Heineken.",
    "it": "Articolo di prova: confezione da sei birre Heineken.",
    "es": "Producto de prueba: paquete de seis cervezas Heineken.",
    "zh": "测试商品：六瓶装喜力啤酒。",
    "ru": "Тестовый товар: упаковка из шести бутылок Heineken."
  },
  "Montréal Island": {
    "fr": "Île de Montréal",
    "it": "Isola di Montréal",
    "es": "Isla de Montreal",
    "zh": "蒙特利尔岛",
    "ru": "Остров Монреаль"
  },
  "pending payment": {
    "fr": "en attente de paiement",
    "it": "in attesa di pagamento",
    "es": "pago pendiente",
    "zh": "待付款",
    "ru": "ожидает платежа"
  },
  "paid": {
    "fr": "payé",
    "it": "pagato",
    "es": "pagado",
    "zh": "已付费",
    "ru": "оплачено"
  },
  "accepted": {
    "fr": "accepté",
    "it": "accettato",
    "es": "aceptado",
    "zh": "已接受",
    "ru": "принято"
  },
  "preparing": {
    "fr": "préparation",
    "it": "preparazione",
    "es": "preparando",
    "zh": "准备",
    "ru": "подготовка"
  },
  "out for delivery": {
    "fr": "en livraison",
    "it": "in consegna",
    "es": "listo para entrega",
    "zh": "待发货",
    "ru": "готово к доставке"
  },
  "delivered": {
    "fr": "livré",
    "it": "consegnato",
    "es": "entregado",
    "zh": "已交付",
    "ru": "доставлено"
  },
  "cancelled": {
    "fr": "annulé",
    "it": "annullato",
    "es": "cancelado",
    "zh": "已取消",
    "ru": "отменено"
  },
  "refunded": {
    "fr": "remboursé",
    "it": "rimborsato",
    "es": "reembolsado",
    "zh": "已退款",
    "ru": "возмещено"
  },
  "failed": {
    "fr": "a échoué",
    "it": "fallito",
    "es": "falló",
    "zh": "失败",
    "ru": "не удалось"
  },
  "active": {
    "fr": "actif",
    "it": "attivo",
    "es": "activo",
    "zh": "活跃",
    "ru": "активен"
  },
  "inactive": {
    "fr": "inactif",
    "it": "inattivo",
    "es": "inactivo",
    "zh": "不活动",
    "ru": "неактивно"
  },
  "banned": {
    "fr": "interdit",
    "it": "vietato",
    "es": "prohibido",
    "zh": "禁止",
    "ru": "забанен"
  },
  "archived": {
    "fr": "archivé",
    "it": "archiviato",
    "es": "archivado",
    "zh": "已存档",
    "ru": "в архиве"
  },
  "approved": {
    "fr": "approuvé",
    "it": "approvato",
    "es": "aprobado",
    "zh": "已批准",
    "ru": "одобрено"
  },
  "rejected": {
    "fr": "rejeté",
    "it": "respinto",
    "es": "rechazado",
    "zh": "被拒绝",
    "ru": "отклонено"
  },
  "suspended": {
    "fr": "suspendu",
    "it": "sospeso",
    "es": "suspendido",
    "zh": "暂停",
    "ru": "приостановлено"
  },
  "One moment…": {
    "fr": "Un instant…",
    "it": "Un momento...",
    "es": "Un momento…",
    "zh": "一会儿……",
    "ru": "Один момент…"
  },
  "Getting checkout ready…": {
    "fr": "Préparation du paiement…",
    "it": "Preparazione del pagamento...",
    "es": "Preparando el pago…",
    "zh": "准备结帐...",
    "ru": "Подготовка к оформлению заказа…"
  },
  "Continue to secure checkout ↗": {
    "fr": "Continuer à sécuriser le paiement ↗",
    "it": "Continua con il pagamento sicuro ↗",
    "es": "Continuar para asegurar el pago ↗",
    "zh": "继续确保结帐安全 ↗",
    "ru": "Продолжить безопасную оплату ↗"
  },
  "Create account →": {
    "fr": "Créer un compte →",
    "it": "Crea un account →",
    "es": "Crear cuenta →",
    "zh": "创建帐户 →",
    "ru": "Создать аккаунт →"
  },
  "Already have an account? Sign in": {
    "fr": "Vous avez déjà un compte ? Connectez-vous",
    "it": "Hai già un account? Accedi",
    "es": "¿Ya tienes una cuenta? Iniciar sesión",
    "zh": "已经有帐户？登录",
    "ru": "У вас уже есть аккаунт? Войти"
  },
  "New here? Create an account": {
    "fr": "Nouveau ici ? Créer un compte",
    "it": "Nuovo qui? Crea un account",
    "es": "¿Nuevo aquí? Crear una cuenta",
    "zh": "新来的？创建帐户",
    "ru": "Впервые здесь? Создать учетную запись"
  },
  "Delivery address unavailable": {
    "fr": "Adresse de livraison indisponible",
    "it": "Indirizzo di consegna non disponibile",
    "es": "Dirección de entrega no disponible",
    "zh": "送货地址不可用",
    "ru": "Адрес доставки недоступен"
  },
  "You’re online": {
    "fr": "Vous êtes en ligne",
    "it": "Sei online",
    "es": "Estás en línea",
    "zh": "你在线",
    "ru": "Вы онлайн"
  },
  "Go online": {
    "fr": "Aller en ligne",
    "it": "Vai online",
    "es": "Ir en línea",
    "zh": "上网",
    "ru": "Выйти в Интернет"
  },
  "Getting location…": {
    "fr": "Obtenir l'emplacement…",
    "it": "Ottenere la posizione…",
    "es": "Obteniendo ubicación…",
    "zh": "获取位置...",
    "ru": "Получение местоположения…"
  },
  "This postal code only gives an approximate service check. Search your exact street address to order.": {
    "fr": "Ce code postal ne donne qu'un chèque de service approximatif. Recherchez votre adresse postale exacte pour commander.",
    "it": "Questo codice postale fornisce solo un controllo approssimativo del servizio. Cerca il tuo indirizzo esatto per ordinare.",
    "es": "Este código postal sólo proporciona una verificación de servicio aproximada. Busque su dirección exacta para realizar el pedido.",
    "zh": "该邮政编码仅提供大致的服务检查。搜索您的确切街道地址进行订购。",
    "ru": "Этот почтовый индекс дает лишь приблизительную оценку обслуживания. Чтобы сделать заказ, найдите свой точный адрес."
  },
  "You’re on the list. We’ll email you when uBeer reaches your area.": {
    "fr": "Vous êtes sur la liste. Nous vous enverrons un e-mail lorsque uBeer arrivera dans votre région.",
    "it": "Sei sulla lista. Ti invieremo un'e-mail quando uBeer raggiunge la tua zona.",
    "es": "Estás en la lista. Le enviaremos un correo electrónico cuando uBeer llegue a su área.",
    "zh": "你在名单上。当 uBeer 到达您所在地区时，我们会向您发送电子邮件。",
    "ru": "Вы в списке. Мы отправим вам электронное письмо, когда uBeer достигнет вашего региона."
  },
  "You’re signed in. Switch on when you’re ready to drive.": {
    "fr": "Vous êtes connecté. Allumez-le lorsque vous êtes prêt à conduire.",
    "it": "Hai effettuato l'accesso. Accendilo quando sei pronto per guidare.",
    "es": "Has iniciado sesión. Enciéndelo cuando estés listo para conducir.",
    "zh": "您已登录。准备好开车时打开。",
    "ru": "Вы вошли в систему. Включите ее, когда будете готовы к поездке."
  },
  "Application received. We’ll review your details and email you after admin review.": {
    "fr": "Demande reçue. Nous examinerons vos coordonnées et vous enverrons un e-mail après examen par l'administrateur.",
    "it": "Domanda ricevuta. Esamineremo i tuoi dettagli e ti invieremo un'e-mail dopo la revisione da parte dell'amministratore.",
    "es": "Solicitud recibida. Revisaremos sus datos y le enviaremos un correo electrónico después de la revisión del administrador.",
    "zh": "申请已收到。我们将审核您的详细信息，并在管理员审核后向您发送电子邮件。",
    "ru": "Заявка получена. Мы проверим ваши данные и отправим вам электронное письмо после проверки администратором."
  },
  "Something went wrong. Please try again.": {
    "fr": "Quelque chose s'est mal passé. Veuillez réessayer.",
    "it": "Qualcosa è andato storto. Per favore riprova.",
    "es": "Algo salió mal. Por favor inténtalo de nuevo.",
    "zh": "出了点问题。请再试一次。",
    "ru": "Что-то пошло не так. Пожалуйста, попробуйте еще раз."
  },
  "Valid latitude and longitude are required": {
    "fr": "Une latitude et une longitude valides sont requises",
    "it": "Sono richieste latitudine e longitudine valide",
    "es": "Se requieren latitud y longitud válidas",
    "zh": "需要有效的纬度和经度",
    "ru": "Укажите действительные широту и долготу."
  },
  "We could not verify a full street address or postal code. Add a street number, street name, or full Canadian postal code.": {
    "fr": "Nous n'avons pas pu vérifier une adresse postale complète ou un code postal. Ajoutez un numéro de rue, un nom de rue ou un code postal canadien complet.",
    "it": "Non è stato possibile verificare l'indirizzo completo o il codice postale. Aggiungi un numero civico, il nome di una strada o il codice postale canadese completo.",
    "es": "No pudimos verificar la dirección postal o el código postal completos. Agregue un número de calle, nombre de calle o código postal canadiense completo.",
    "zh": "我们无法验证完整的街道地址或邮政编码。添加街道号码、街道名称或完整的加拿大邮政编码。",
    "ru": "Нам не удалось проверить полный адрес или почтовый индекс. Добавьте номер улицы, название улицы или полный почтовый индекс Канады."
  },
  "Address lookup is temporarily unavailable": {
    "fr": "La recherche d'adresse est temporairement indisponible",
    "it": "La ricerca dell'indirizzo è temporaneamente non disponibile",
    "es": "La búsqueda de direcciones no está disponible temporalmente",
    "zh": "地址查找暂时不可用",
    "ru": "Поиск адреса временно недоступен"
  },
  "A valid regionId is required": {
    "fr": "Un identifiant de région valide est requis",
    "it": "È richiesto un ID regione valido",
    "es": "Se requiere un ID de región válido",
    "zh": "需要有效的regionId",
    "ru": "Требуется действительный идентификатор региона."
  },
  "Region not found or inactive": {
    "fr": "Région introuvable ou inactive",
    "it": "Regione non trovata o inattiva",
    "es": "Región no encontrada o inactiva",
    "zh": "区域未找到或处于非活动状态",
    "ru": "Регион не найден или неактивен"
  },
  "Invalid cart": {
    "fr": "Panier invalide",
    "it": "Carrello non valido",
    "es": "Carrito no válido",
    "zh": "购物车无效",
    "ru": "Неверная корзина"
  },
  "A valid administrator authenticator code is required": {
    "fr": "Un code d'authentification administrateur valide est requis",
    "it": "È richiesto un codice di autenticazione amministratore valido",
    "es": "Se requiere un código de autenticación de administrador válido",
    "zh": "需要有效的管理员验证码",
    "ru": "Требуется действительный код аутентификации администратора."
  },
  "Driver account is awaiting approval": {
    "fr": "Le compte conducteur est en attente d'approbation",
    "it": "L'account conducente è in attesa di approvazione",
    "es": "La cuenta del conductor está pendiente de aprobación",
    "zh": "司机帐户正在等待批准",
    "ru": "Аккаунт водителя ожидает одобрения"
  },
  "Administrator access required": {
    "fr": "Accès administrateur requis",
    "it": "È richiesto l'accesso come amministratore",
    "es": "Se requiere acceso de administrador",
    "zh": "需要管理员访问权限",
    "ru": "Требуется доступ администратора"
  },
  "Enter your name, a valid email, and a password of at least 12 characters": {
    "fr": "Saisissez votre nom, un email valide et un mot de passe d'au moins 12 caractères",
    "it": "Inserisci il tuo nome, un'e-mail valida e una password di almeno 12 caratteri",
    "es": "Ingresa tu nombre, un correo electrónico válido y una contraseña de al menos 12 caracteres",
    "zh": "输入您的姓名、有效电子邮件地址以及至少 12 个字符的密码",
    "ru": "Введите свое имя, действительный адрес электронной почты и пароль длиной не менее 12 символов."
  },
  "Invalid login details": {
    "fr": "Informations de connexion invalides",
    "it": "Dettagli di accesso non validi",
    "es": "Detalles de inicio de sesión no válidos",
    "zh": "登录详细信息无效",
    "ru": "Неверные данные для входа."
  },
  "Select an active delivery region": {
    "fr": "Sélectionnez une région de livraison active",
    "it": "Seleziona una regione di consegna attiva",
    "es": "Seleccione una región de entrega activa",
    "zh": "选择有效的交付区域",
    "ru": "Выберите активный регион доставки"
  },
  "Enter new order status": {
    "fr": "Entrez le nouveau statut de la commande",
    "it": "Inserisci il nuovo stato dell'ordine",
    "es": "Ingrese el estado del nuevo pedido",
    "zh": "输入新订单状态",
    "ru": "Введите новый статус заказа"
  },
  "Audit note": {
    "fr": "Note d'audit",
    "it": "Nota di audit",
    "es": "Nota de auditoría",
    "zh": "审计记录",
    "ru": "Аудиторское примечание"
  },
  "Manual refund note": {
    "fr": "Note de remboursement manuel",
    "it": "Nota di rimborso manuale",
    "es": "Nota de reembolso manual",
    "zh": "手动退款单",
    "ru": "Примечание о возврате средств вручную"
  },
  "This delivery region sets the default app language.": {
    "fr": "Cette région de livraison définit la langue par défaut de l'application.",
    "it": "Questa regione di consegna imposta la lingua predefinita dell'app.",
    "es": "Esta región de entrega establece el idioma predeterminado de la aplicación.",
    "zh": "此交付区域设置默认应用程序语言。",
    "ru": "В этом регионе доставки устанавливается язык приложения по умолчанию."
  },
  "Delivery boundary drawn": {
    "fr": "Limite de livraison tracée",
    "it": "Confine di consegna tracciato",
    "es": "Límite de entrega dibujado",
    "zh": "已绘制配送边界",
    "ru": "Граница доставки нарисована"
  },
  "Draw the boundary on the map": {
    "fr": "Tracez la limite sur la carte",
    "it": "Disegna il confine sulla mappa",
    "es": "Dibuja el límite en el mapa",
    "zh": "在地图上绘制边界",
    "ru": "Нарисуйте границу на карте"
  },
  "2,000+ cryptocurrencies · Bitcoin · Lightning": {
    "fr": "Plus de 2 000 crypto-monnaies · Bitcoin · Lightning",
    "it": "Oltre 2.000 criptovalute · Bitcoin · Fulmine",
    "es": "Más de 2000 criptomonedas · Bitcoin · Lightning",
    "zh": "2,000 多种加密货币 · 比特币 · 闪电网络",
    "ru": "Более 2000 криптовалют · Биткойн · Lightning"
  },
  "Pay securely with over 2,000 cryptocurrencies ↗": {
    "fr": "Payez en toute sécurité avec plus de 2 000 crypto-monnaies ↗",
    "it": "Paga in sicurezza con oltre 2.000 criptovalute ↗",
    "es": "Pague de forma segura con más de 2000 criptomonedas ↗",
    "zh": "使用 2,000 多种加密货币安全支付 ↗",
    "ru": "Безопасная оплата более чем 2000 криптовалютами ↗"
  },
  "Your neighbourhood is on our list.": {
    "fr": "Votre quartier est sur notre liste.",
    "it": "Il tuo quartiere è nel nostro elenco.",
    "es": "Tu vecindario está en nuestra lista.",
    "zh": "您的社区在我们的名单上。",
    "ru": "Ваш район в нашем списке."
  },
  "Create an account": {
    "fr": "Créer un compte",
    "it": "Crea un account",
    "es": "Crear una cuenta",
    "zh": "创建帐户",
    "ru": "Создать учетную запись"
  },
  "Sign in to your orders": {
    "fr": "Connectez-vous à vos commandes",
    "it": "Accedi ai tuoi ordini",
    "es": "Inicia sesión en tus pedidos",
    "zh": "登录您的订单",
    "ru": "Войдите в свои заказы"
  },
  "Active": {
    "fr": "Actif",
    "it": "Attivo",
    "es": "Activo",
    "zh": "活跃",
    "ru": "Активен"
  },
  "Inactive": {
    "fr": "Inactif",
    "it": "Inattivo",
    "es": "Inactivo",
    "zh": "不活动",
    "ru": "Неактивно"
  },
  "Deactivate": {
    "fr": "Désactiver",
    "it": "Disattiva",
    "es": "Desactivar",
    "zh": "停用",
    "ru": "Деактивировать"
  },
  "Activate": {
    "fr": "Activer",
    "it": "Attiva",
    "es": "Activar",
    "zh": "激活",
    "ru": "Активировать"
  },
  "Archived": {
    "fr": "Archivé",
    "it": "Archiviato",
    "es": "Archivado",
    "zh": "已存档",
    "ru": "В архиве"
  },
  "Pause": {
    "fr": "Pause",
    "it": "Pausa",
    "es": "Pausa",
    "zh": "暂停",
    "ru": "Пауза"
  },
  "Reactivate": {
    "fr": "Réactiver",
    "it": "Riattiva",
    "es": "Reactivar",
    "zh": "重新激活",
    "ru": "Повторно активировать"
  },
  "Applications & drivers": {
    "fr": "Applications et pilotes",
    "it": "Applicazioni e driver",
    "es": "Aplicaciones y controladores",
    "zh": "应用程序和驱动程序",
    "ru": "Приложения и драйверы"
  },
  "records": {
    "fr": "enregistrements",
    "it": "record",
    "es": "registros",
    "zh": "记录",
    "ru": "записи"
  },
  "Banned": {
    "fr": "Interdit",
    "it": "Bandito",
    "es": "Prohibido",
    "zh": "禁止",
    "ru": "Запрещено"
  },
  "Unban": {
    "fr": "Annuler le bannissement",
    "it": "Sbanca",
    "es": "Desbanear",
    "zh": "解禁",
    "ru": "Разбанить"
  },
  "Ban": {
    "fr": "Interdiction",
    "it": "Divieto",
    "es": "Prohibición",
    "zh": "禁令",
    "ru": "Бан"
  },
  "Dashboard": {
    "fr": "Tableau de bord",
    "it": "Cruscotto",
    "es": "Panel de control",
    "zh": "仪表板",
    "ru": "Панель управления"
  },
  "Orders": {
    "fr": "Commandes",
    "it": "Ordini",
    "es": "Órdenes",
    "zh": "订单",
    "ru": "Заказы"
  },
  "Regions": {
    "fr": "Régions",
    "it": "Regioni",
    "es": "Regiones",
    "zh": "地区",
    "ru": "Регионы"
  },
  "Drivers": {
    "fr": "Pilotes",
    "it": "Driver",
    "es": "Conductores",
    "zh": "驱动程序",
    "ru": "Драйверы"
  },
  "Users": {
    "fr": "Utilisateurs",
    "it": "Utenti",
    "es": "Usuarios",
    "zh": "用户",
    "ru": "Пользователи"
  },
  "Payouts": {
    "fr": "Paiements",
    "it": "Pagamenti",
    "es": "Pagos",
    "zh": "支出",
    "ru": "Выплаты"
  },
  "Audit log": {
    "fr": "Journal d'audit",
    "it": "Registro di controllo",
    "es": "Registro de auditoría",
    "zh": "审核日志",
    "ru": "Журнал аудита"
  },
  "Settings": {
    "fr": "Paramètres",
    "it": "Impostazioni",
    "es": "Configuración",
    "zh": "设置",
    "ru": "Настройки"
  },
  "A look around.": {
    "fr": "Un regard autour de soi.",
    "it": "Uno sguardo intorno.",
    "es": "Una mirada a nuestro alrededor.",
    "zh": "环顾四周。",
    "ru": "Оглядимся вокруг."
  },
  "Orders today": {
    "fr": "Commandes aujourd'hui",
    "it": "Ordini oggi",
    "es": "Pedidos hoy",
    "zh": "今日订单",
    "ru": "Заказы сегодня"
  },
  "Paid revenue": {
    "fr": "Revenus payés",
    "it": "Entrate pagate",
    "es": "Ingresos pagados",
    "zh": "付费收入",
    "ru": "Выплаченный доход"
  },
  "Drivers online": {
    "fr": "Pilotes en ligne",
    "it": "Driver online",
    "es": "Conductores en línea",
    "zh": "司机在线",
    "ru": "Драйверы онлайн"
  },
  "Failed payments": {
    "fr": "Paiements échoués",
    "it": "Pagamenti non riusciti",
    "es": "Pagos fallidos",
    "zh": "付款失败",
    "ru": "Неудачные платежи"
  },
  "orders": {
    "fr": "commandes",
    "it": "ordini",
    "es": "pedidos",
    "zh": "订单",
    "ru": "заказы"
  },
  "today": {
    "fr": "aujourd'hui",
    "it": "oggi",
    "es": "hoy",
    "zh": "今天",
    "ru": "сегодня"
  },
  "USD today": {
    "fr": "USD aujourd'hui",
    "it": "USD oggi",
    "es": "USD hoy",
    "zh": "今日美元",
    "ru": "Доллар США сегодня"
  },
  "Not configured": {
    "fr": "Non configuré",
    "it": "Non configurato",
    "es": "No configurado",
    "zh": "未配置",
    "ru": "Не настроено"
  },
  "region": {
    "fr": "région",
    "it": "regione",
    "es": "región",
    "zh": "地区",
    "ru": "регион"
  },
  "created at": {
    "fr": "créé à",
    "it": "creato a",
    "es": "creado en",
    "zh": "创建于",
    "ru": "создано в"
  },
  "updated at": {
    "fr": "mis à jour à",
    "it": "aggiornato alle",
    "es": "actualizado en",
    "zh": "更新于",
    "ru": "обновлено на"
  },
  "delivery fee cents": {
    "fr": "centimes de frais de livraison",
    "it": "centesimi di spese di consegna",
    "es": "centavos de tarifa de envío",
    "zh": "运费分钱",
    "ru": "стоимость доставки в центах"
  },
  "minimum order cents": {
    "fr": "centimes de commande minimum",
    "it": "ordine minimo centesimi",
    "es": "centavos de pedido mínimo",
    "zh": "最低订购分",
    "ru": "минимальный заказ в центах"
  },
  "age gate": {
    "fr": "limite d'âge",
    "it": "cancello dell'età",
    "es": "puerta de edad",
    "zh": "年龄门",
    "ru": "возрастные ограничения"
  },
  "language code": {
    "fr": "code de langue",
    "it": "codice della lingua",
    "es": "código de idioma",
    "zh": "语言代码",
    "ru": "код языка"
  },
  "We accept 2,000+ cryptocurrencies": {
    "fr": "Nous acceptons plus de 2 000 crypto-monnaies",
    "it": "Accettiamo oltre 2.000 criptovalute",
    "es": "Aceptamos más de 2000 criptomonedas",
    "zh": "我们接受 2,000 多种加密货币",
    "ru": "Мы принимаем более 2000 криптовалют."
  },
  "Invalid order access": {
    "fr": "Accès à la commande invalide",
    "it": "Accesso all'ordine non valido",
    "es": "Acceso al pedido no válido",
    "zh": "订单访问无效",
    "ru": "Неверный доступ к заказу"
  },
  "Order not found": {
    "fr": "Commande introuvable",
    "it": "Ordine non trovato",
    "es": "Orden no encontrada",
    "zh": "未找到订单",
    "ru": "Заказ не найден"
  },
  "BTCPay webhook secret is not configured": {
    "fr": "Le secret du webhook BTCPay n'est pas configuré",
    "it": "Il segreto del webhook BTCPay non è configurato",
    "es": "El secreto del webhook de BTCPay no está configurado",
    "zh": "BTCPay webhook 秘密未配置",
    "ru": "Секрет вебхука BTCPay не настроен."
  },
  "Invalid webhook signature": {
    "fr": "Signature de webhook invalide",
    "it": "Firma del webhook non valida",
    "es": "Firma de webhook no válida",
    "zh": "无效的 webhook 签名",
    "ru": "Неверная подпись вебхука"
  },
  "Malformed BTCPay webhook payload": {
    "fr": "Charge utile du webhook BTCPay malformée",
    "it": "Payload del webhook BTCPay non valido",
    "es": "Carga útil del webhook BTCPay con formato incorrecto",
    "zh": "格式错误的 BTCPay webhook 负载",
    "ru": "Неправильно сформированная полезная нагрузка вебхука BTCPay"
  },
  "Platform fee must be from 0% to 50%": {
    "fr": "Les frais de plateforme doivent être compris entre 0 % et 50 %",
    "it": "La tariffa della piattaforma deve essere compresa tra lo 0% e il 50%",
    "es": "La tarifa de la plataforma debe ser del 0% al 50%",
    "zh": "平台费用必须为 0% 至 50%",
    "ru": "Комиссия платформы должна составлять от 0% до 50%."
  },
  "Invalid region details": {
    "fr": "Détails de la région non valides",
    "it": "Dettagli della regione non validi",
    "es": "Detalles de región no válidos",
    "zh": "区域详细信息无效",
    "ru": "Неверные данные региона."
  },
  "Invalid region update": {
    "fr": "Mise à jour de la région non valide",
    "it": "Aggiornamento della regione non valido",
    "es": "Actualización de región no válida",
    "zh": "区域更新无效",
    "ru": "Неверное обновление региона."
  },
  "Invalid product details": {
    "fr": "Détails du produit non valides",
    "it": "Dettagli del prodotto non validi",
    "es": "Detalles del producto no válidos",
    "zh": "无效的产品详细信息",
    "ru": "Неверные сведения о продукте."
  },
  "Invalid product update": {
    "fr": "Mise à jour du produit invalide",
    "it": "Aggiornamento del prodotto non valido",
    "es": "Actualización de producto no válida",
    "zh": "无效的产品更新",
    "ru": "Недопустимое обновление продукта."
  },
  "Invalid product id": {
    "fr": "Identifiant de produit invalide",
    "it": "ID prodotto non valido",
    "es": "ID de producto no válido",
    "zh": "无效的产品 ID",
    "ru": "Неверный идентификатор продукта"
  },
  "Invalid filters": {
    "fr": "Filtres invalides",
    "it": "Filtri non validi",
    "es": "Filtros no válidos",
    "zh": "过滤器无效",
    "ru": "Неверные фильтры"
  },
  "Invalid status change": {
    "fr": "Changement de statut non valide",
    "it": "Modifica dello stato non valida",
    "es": "Cambio de estado no válido",
    "zh": "状态更改无效",
    "ru": "Недопустимое изменение статуса"
  },
  "A refund note is required": {
    "fr": "Une note de remboursement est requise",
    "it": "È necessaria una nota di rimborso",
    "es": "Se requiere una nota de reembolso",
    "zh": "需要退款单",
    "ru": "Требуется уведомление о возврате средств."
  },
  "Invalid filter": {
    "fr": "Filtre invalide",
    "it": "Filtro non valido",
    "es": "Filtro no válido",
    "zh": "过滤器无效",
    "ru": "Неверный фильтр"
  },
  "Invalid application id": {
    "fr": "Identifiant d'application invalide",
    "it": "ID applicazione non valido",
    "es": "ID de aplicación no válida",
    "zh": "无效的应用程序 ID",
    "ru": "Неверный идентификатор приложения"
  },
  "ID document not found": {
    "fr": "Document d'identité introuvable",
    "it": "Documento d'identità non trovato",
    "es": "Documento de identidad no encontrado",
    "zh": "找不到身份证件",
    "ru": "Документ, удостоверяющий личность, не найден"
  },
  "Invalid application review": {
    "fr": "Examen de la candidature invalide",
    "it": "Revisione della domanda non valida",
    "es": "Revisión de solicitud no válida",
    "zh": "无效申请审核",
    "ru": "Неверная проверка заявки"
  },
  "Application not found": {
    "fr": "Application introuvable",
    "it": "Applicazione non trovata",
    "es": "Aplicación no encontrada",
    "zh": "未找到应用程序",
    "ru": "Приложение не найдено"
  },
  "Unexpected file field": {
    "fr": "Champ de fichier inattendu",
    "it": "Campo file imprevisto",
    "es": "Campo de archivo inesperado",
    "zh": "意外的文件字段",
    "ru": "Неожиданное поле файла"
  },
  "ID must be a JPEG, PNG, or PDF": {
    "fr": "L'identifiant doit être au format JPEG, PNG ou PDF",
    "it": "L'ID deve essere JPEG, PNG o PDF",
    "es": "El ID debe ser JPEG, PNG o PDF",
    "zh": "ID 必须是 JPEG、PNG 或 PDF",
    "ru": "Идентификатор должен быть в формате JPEG, PNG или PDF."
  },
  "The uploaded file does not match its declared type": {
    "fr": "Le fichier téléchargé ne correspond pas à son type déclaré",
    "it": "Il file caricato non corrisponde al tipo dichiarato",
    "es": "El archivo subido no coincide con su tipo declarado",
    "zh": "上传的文件与其声明的类型不匹配",
    "ru": "Загруженный файл не соответствует заявленному типу"
  },
  "Complete all required fields and upload a valid ID document": {
    "fr": "Remplissez tous les champs obligatoires et téléchargez une pièce d'identité valide",
    "it": "Completa tutti i campi obbligatori e carica un documento d'identità valido",
    "es": "Complete todos los campos obligatorios y cargue un documento de identificación válido",
    "zh": "填写所有必填字段并上传有效的身份证件",
    "ru": "Заполните все обязательные поля и загрузите действительный документ, удостоверяющий личность."
  },
  "Approved driver access required": {
    "fr": "Accès du conducteur approuvé requis",
    "it": "È richiesto l'accesso del conducente approvato",
    "es": "Se requiere acceso de conductor aprobado",
    "zh": "需要经过批准的驱动程序访问权限",
    "ru": "Требуется одобренный доступ водителя"
  },
  "online must be true or false": {
    "fr": "en ligne doit être vrai ou faux",
    "it": "online deve essere vero o falso",
    "es": "en línea debe ser verdadero o falso",
    "zh": "网上一定是真还是假",
    "ru": "онлайн должно быть правдой или ложью"
  },
  "Driver approval required": {
    "fr": "Approbation du conducteur requise",
    "it": "È richiesta l'approvazione del conducente",
    "es": "Se requiere aprobación del conductor",
    "zh": "需要驾驶员批准",
    "ru": "Требуется разрешение водителя"
  },
  "Location is outside your assigned service region": {
    "fr": "L'emplacement se trouve en dehors de la région de service qui vous a été attribuée",
    "it": "La posizione è al di fuori dell'area di servizio assegnata",
    "es": "La ubicación está fuera de su región de servicio asignada",
    "zh": "位置超出您指定的服务区域",
    "ru": "Местоположение находится за пределами назначенного вам региона обслуживания."
  },
  "Invalid order status update": {
    "fr": "Mise à jour du statut de la commande invalide",
    "it": "Aggiornamento dello stato dell'ordine non valido",
    "es": "Actualización de estado de pedido no válida",
    "zh": "订单状态更新无效",
    "ru": "Неверное обновление статуса заказа."
  },
  "Assigned order not found": {
    "fr": "Commande attribuée introuvable",
    "it": "Ordine assegnato non trovato",
    "es": "Orden asignada no encontrada",
    "zh": "未找到分配的订单",
    "ru": "Назначенный заказ не найден"
  },
  "Enter the six-digit customer delivery code to complete delivery": {
    "fr": "Saisissez le code de livraison client à six chiffres pour finaliser la livraison",
    "it": "Inserisci il codice di consegna del cliente a sei cifre per completare la consegna",
    "es": "Ingrese el código de entrega del cliente de seis dígitos para completar la entrega",
    "zh": "输入六位客户配送码即可完成配送",
    "ru": "Введите шестизначный код доставки клиента, чтобы завершить доставку."
  },
  "Invalid order id": {
    "fr": "Identifiant de commande invalide",
    "it": "ID ordine non valido",
    "es": "ID de pedido no válido",
    "zh": "订单 ID 无效",
    "ru": "Неверный идентификатор заказа"
  },
  "Invalid user search": {
    "fr": "Recherche d'utilisateur invalide",
    "it": "Ricerca utente non valida",
    "es": "Búsqueda de usuario no válida",
    "zh": "无效的用户搜索",
    "ru": "Неверный поиск пользователя"
  },
  "Invalid ban update": {
    "fr": "Mise à jour du bannissement invalide",
    "it": "Aggiornamento del divieto non valido",
    "es": "Actualización de prohibición no válida",
    "zh": "禁令更新无效",
    "ru": "Неверное обновление бана"
  },
  "Invalid limit": {
    "fr": "Limite invalide",
    "it": "Limite non valido",
    "es": "Límite no válido",
    "zh": "限制无效",
    "ru": "Неверный лимит"
  },
  "Invalid payout": {
    "fr": "Paiement invalide",
    "it": "Pagamento non valido",
    "es": "Pago no válido",
    "zh": "无效支付",
    "ru": "Неверная выплата"
  },
  "Invalid payout update": {
    "fr": "Mise à jour du paiement invalide",
    "it": "Aggiornamento del pagamento non valido",
    "es": "Actualización de pago no válida",
    "zh": "支付更新无效",
    "ru": "Неверное обновление выплаты."
  },
  "Open uBeer AI support chat": {
    "fr": "Ouvrir le clavardage de soutien IA uBeer",
    "it": "Apri la chat di assistenza IA uBeer",
    "es": "Abrir el chat de soporte con IA de uBeer",
    "zh": "打开 uBeer AI 客服聊天",
    "ru": "Открыть чат поддержки uBeer с ИИ"
  },
  "Close support chat": {
    "fr": "Fermer le clavardage de soutien",
    "it": "Chiudi la chat di assistenza",
    "es": "Cerrar el chat de soporte",
    "zh": "关闭客服聊天",
    "ru": "Закрыть чат поддержки"
  },
  "uBeer Support": {
    "fr": "Soutien uBeer",
    "it": "Assistenza uBeer",
    "es": "Soporte de uBeer",
    "zh": "uBeer 客服",
    "ru": "Поддержка uBeer"
  },
  "AI support · powered locally": {
    "fr": "Soutien IA · exécuté localement",
    "it": "Assistenza IA · eseguita in locale",
    "es": "Soporte de IA · ejecutado localmente",
    "zh": "AI 客服 · 本地运行",
    "ru": "Поддержка ИИ · работает локально"
  },
  "Start a new chat": {
    "fr": "Commencer un nouveau clavardage",
    "it": "Inizia una nuova chat",
    "es": "Iniciar un nuevo chat",
    "zh": "开始新聊天",
    "ru": "Начать новый чат"
  },
  "A LITTLE HELP, RIGHT HERE": {
    "fr": "UN PETIT COUP DE MAIN, JUSTE ICI",
    "it": "UN PICCOLO AIUTO, PROPRIO QUI",
    "es": "UN POCO DE AYUDA, JUSTO AQUÍ",
    "zh": "就在这里，为您提供帮助",
    "ru": "ПОМОЩЬ РЯДОМ, ПРЯМО ЗДЕСЬ"
  },
  "Hi! I’m uBeer’s AI support assistant. Ask me about delivery areas, orders, payments, drivers, or installing the app.": {
    "fr": "Bonjour! Je suis l'assistant IA de soutien uBeer. Posez-moi vos questions sur les zones de livraison, les commandes, les paiements, les chauffeurs ou l'installation de l'application.",
    "it": "Ciao! Sono l'assistente IA di uBeer. Chiedimi informazioni sulle zone di consegna, gli ordini, i pagamenti, i corrieri o l'installazione dell'app.",
    "es": "¡Hola! Soy el asistente de soporte con IA de uBeer. Pregúntame sobre zonas de entrega, pedidos, pagos, repartidores o cómo instalar la aplicación.",
    "zh": "你好！我是 uBeer 的 AI 客服助手。您可以问我配送区域、订单、付款、配送员或如何安装应用。",
    "ru": "Привет! Я ИИ-помощник uBeer. Спрашивайте о зонах доставки, заказах, оплате, водителях или установке приложения."
  },
  "Where do you deliver?": {
    "fr": "Où livrez-vous?",
    "it": "Dove effettuate le consegne?",
    "es": "¿Dónde hacen entregas?",
    "zh": "你们配送到哪里？",
    "ru": "Куда вы доставляете?"
  },
  "How do I place an order?": {
    "fr": "Comment passer une commande?",
    "it": "Come faccio a effettuare un ordine?",
    "es": "¿Cómo hago un pedido?",
    "zh": "如何下单？",
    "ru": "Как оформить заказ?"
  },
  "How do I install the app?": {
    "fr": "Comment installer l'application?",
    "it": "Come installo l'app?",
    "es": "¿Cómo instalo la aplicación?",
    "zh": "如何安装应用？",
    "ru": "Как установить приложение?"
  },
  "Message uBeer Support…": {
    "fr": "Écrivez au soutien uBeer…",
    "it": "Scrivi all'assistenza uBeer…",
    "es": "Escribe al soporte de uBeer…",
    "zh": "给 uBeer 客服留言…",
    "ru": "Напишите в поддержку uBeer…"
  },
  "Send message": {
    "fr": "Envoyer le message",
    "it": "Invia messaggio",
    "es": "Enviar mensaje",
    "zh": "发送消息",
    "ru": "Отправить сообщение"
  },
  "Thinking…": {
    "fr": "Réflexion…",
    "it": "Sto pensando…",
    "es": "Pensando…",
    "zh": "正在思考…",
    "ru": "Думаю…"
  },
  "I couldn't reach our support assistant just now. Please try again in a moment.": {
    "fr": "Je n'arrive pas à joindre notre assistant de soutien. Veuillez réessayer dans un instant.",
    "it": "Non riesco a contattare l'assistente di supporto. Riprova tra un momento.",
    "es": "No pude conectar con el asistente de soporte. Inténtalo de nuevo en un momento.",
    "zh": "暂时无法连接客服助手，请稍后重试。",
    "ru": "Не удалось связаться с помощником поддержки. Попробуйте ещё раз через минуту."
  },
  "Local AI · Don’t share passwords, verification or delivery codes, payment details, or ID documents.": {
    "fr": "IA locale · Ne partagez pas vos mots de passe, codes de vérification ou de livraison, données de paiement ou pièces d'identité.",
    "it": "IA locale · Non condividere password, codici di verifica o consegna, dati di pagamento o documenti d'identità.",
    "es": "IA local · No compartas contraseñas, códigos de verificación o entrega, datos de pago ni documentos de identidad.",
    "zh": "本地 AI · 请勿分享密码、验证码、配送码、付款信息或身份证件。",
    "ru": "Локальный ИИ · Не отправляйте пароли, коды подтверждения или доставки, платёжные данные и документы."
  },
  "Chat with uBeer": {
    "fr": "Jaser avec uBeer",
    "it": "Chatta con uBeer",
    "es": "Chatea con uBeer",
    "zh": "联系 uBeer",
    "ru": "Чат с uBeer"
  }
};
