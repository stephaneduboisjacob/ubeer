# Guida al lancio e alle operazioni

## Gate per il lancio all’estero

L’ambiente di produzione è un prototipo di Montréal, non un marketplace pronto per l’estero. La regione attiva è l’isola di Montréal; l’unico prodotto iniziale è una confezione da sei contrassegnata TEST LISTING a 30,00 USD; la ricerca indirizzi è bloccata sul Canada e su un’area di Montréal; la valuta delle fatture è USD; le soglie di età sono solo 19 o 21. Il controllo per disegnare regioni nell’admin non è collegato. Non accettare ordini da nuovi paesi finché questi limiti non sono risolti, implementati e verificati.

Per ogni paese e città, chiedi a consulenti locali qualificati e alle autorità di confermare le regole per venditori, marketplace, alcol, consegna, pubblicità, lavoratori, imposte, consumatori, privacy, pagamenti e identificazione. Definisci quale soggetto autorizzato vende e consegna ogni prodotto, come verificare i documenti e gestire le consegne rifiutate, orari consentiti, conservazione dei dati, imposte e rimborsi, lingua di supporto ed escalation d’emergenza. I requisiti variano; questo elenco non è consulenza legale.

Poi configura e verifica: ricerca indirizzi per il paese; confine di regione preciso e applicato dal server; età locale e relativo controllo; prodotti, scorte, valuta, imposte e tariffe; personale e orari; testi tradotti e avvisi legali; conservazione dei dati; asset e webhook BTCPay; assistenza; procedure di riconciliazione e incidenti. Esegui ordini di prova con ogni metodo di pagamento e verifica tutti gli stati di consegna prima dell’annuncio.

## Pagamenti e assistenza

uBeer reindirizza il pagamento a BTCPay Server, verifica le firme dei webhook fattura e pianifica un’attività di riconciliazione. Registra il webhook a questo URL:

https://ubeer.example.com/api/webhooks/btcpay

Sottoscrivi InvoiceCreated, InvoiceReceivedPayment, InvoiceProcessing, InvoiceSettled, InvoiceExpired e InvoiceInvalid. Inserisci BTCPAY_STORE_ID, BTCPAY_API_KEY e BTCPAY_WEBHOOK_SECRET nel file .env protetto sul server. Non inserire i valori in questo documento, chat o repository. Il checkout crea fatture USD. I metodi visualizzati dipendono dal negozio BTCPay.

L’assistente AI usa un servizio Ollama locale. Risponde a domande generali, ma non consulta ordini né esegue azioni. Non chiedere segreti ai clienti. Il trasporto e-mail predefinito è console finché non si configura un adattatore SMTP; non promettere l’invio e-mail senza una verifica completa.

## Checklist operativa

Prima di ogni turno, controlla API, database, Redis, Nginx e Ollama; verifica regioni e prodotti attivi e la copertura dei corrieri. Dopo il turno, riconcilia le fatture BTCPay con gli ordini uBeer, indaga pagamenti falliti o in attesa e controlla note di rimborso, pagamenti e audit. Non modificare lo stato solo per correggere dashboard; annota il motivo e riconcilia separatamente pagamento e magazzino.

I comandi server sono riservati agli operatori autorizzati:

- Riavvio API: sudo systemctl restart ubeer-api
- Log API: sudo journalctl -u ubeer-api -f
- Convalida Nginx: sudo nginx -t
- Servizi Compose: cd /opt/ubeer && sudo docker compose ps
- Rilascio: da /opt/ubeer esegui npm ci, npm run build e npm run db:migrate; copia apps/web/dist in /var/www/ubeer/web e riavvia ubeer-api.

Esegui backup regolari PostgreSQL con pg_dump e conservali fuori server con accesso limitato. Includi /var/lib/ubeer/uploads, che contiene documenti dei candidati corrieri. Prova il ripristino. Conserva un backup cifrato della chiave Android; gli aggiornamenti futuri devono usare la stessa chiave. RUNBOOK.md descrive comandi completi e rotazione delle chiavi BTCPay.

## Risposte rapide di assistenza

**Il mio indirizzo non è coperto.** Il servizio è limitato alle regioni attive. L’ambiente ha solo l’isola di Montréal e ricerca limitata al Canada. La lista d’attesa non prenota una consegna.

**Il pagamento è in attesa.** Controlla la fattura BTCPay e conserva la ricevuta. Il supporto deve riconciliarla prima di chiedere un altro pagamento.

**La fattura è scaduta o non riuscita.** Non presumere che i fondi siano tornati e non riprovare alla cieca. Il supporto verifica lo stato BTCPay e applica la policy di rimborso regionale.

**L’assistenza AI può vedere o modificare il mio ordine?** No. La chat dà indicazioni generali. Usa il canale ufficiale e il riferimento dell’ordine, mai il codice di consegna o credenziali di pagamento.

**Come funzionano rimborsi e pagamenti ai corrieri?** Il pannello registra note e pagamenti; non emette automaticamente rimborsi BTCPay né trasferisce denaro ai corrieri. Un operatore deve elaborare e verificare separatamente la transazione effettiva.

## Gestione incidenti

Se un segreto viene esposto, ruotalo alla fonte, aggiorna la configurazione protetta, riavvia l’API, verifica l’integrazione e revoca la vecchia credenziale. Se gli eventi di pagamento si interrompono, controlla API e Redis, errori firma webhook, fatture BTCPay e attività di riconciliazione. Se vengono esposti dati personali, limita l’accesso, conserva i dettagli, informa il responsabile privacy e segui gli obblighi locali di notifica. Non cancellare log o prove necessari alla revisione dell’incidente.

---

Contact: Stephane Jacob <jacobstephane@outlook.com>
