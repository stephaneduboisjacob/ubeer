# Guida amministratore

## Accesso e sicurezza

Apri https://ubeer.btcpay.exchange/admin. Accedi con e-mail e password amministrative predisposte per questa installazione, poi inserisci il codice attuale a sei cifre dell’app di autenticazione. Il TOTP è obbligatorio per gli amministratori. Le credenziali iniziali sono conservate separatamente sul server: non copiarle in questo manuale, ticket o chat. Se l’autenticatore non è ancora stato registrato, segui le istruzioni protette di inizializzazione. L’app non offre recupero autonomo di password o TOTP; limita il recupero lato server agli operatori fidati e ruota ogni segreto esposto.

Per questa installazione, il file temporaneo delle credenziali iniziali è /root/ubeer-admin-credentials.txt ed è leggibile solo dall’amministratore del server. Chiedi all’operatore autorizzato di fornire l’accesso tramite un canale sicuro, registra l’autenticatore e poi fai eliminare il file. Non inserire password o segreto TOTP in e-mail, ticket o documentazione.

Usa una password unica, proteggi i dispositivi e disconnettiti dai computer condivisi. Le modifiche admin generano record di audit; controlla il registro dopo le modifiche sensibili.

## Dashboard e ordini

La panoramica mostra ordini giornalieri, ricavi pagati in USD, corrieri approvati online e pagamenti non riusciti. In Ordini controlla gli ordini recenti e filtra per stato: pending_payment, paid, accepted, preparing, out_for_delivery, delivered, cancelled, refunded o failed.

Usa Cambia stato solo per correggere un’eccezione operativa e inserisci nella nota di audit il motivo e le prove. Una modifica forzata non rimborsa BTCPay, non restituisce automaticamente un pagamento, non avvisa necessariamente tutte le parti e non garantisce l’aggiornamento delle scorte. Nota rimborso registra la decisione e imposta lo stato uBeer su refunded, ma non emette un rimborso BTCPay o on-chain. Gestisci separatamente il rimborso effettivo secondo il provider e la policy locale, poi registra l’esito.

## Regioni e configurazione del mercato

Una regione definisce il confine di consegna applicato dal server, la lingua predefinita, lo stato attivo, l’ordine minimo, la tariffa e l’età mostrata. La verifica del punto e il checkout sono applicati dall’API. Disattivando una regione si bloccano nuovi ordini in quell’area. L’app consente attualmente solo soglie di 19 o 21 anni e il checkout è fisso in USD.

**Limite attuale dell’interfaccia:** la pagina mostra le geometrie esistenti, ma il controllo per disegnare non è collegato. Non presumere di poter creare un poligono cliccando sulla mappa. L’API accetta GeoJSON, ma la creazione o modifica delle coperture richiede attualmente una procedura verificata di ingegneria/operazioni. Verifica le coordinate rispetto ai confini legali e operativi prima di attivare. La ricerca è limitata al Canada e a un’area di Montréal: aggiungere un poligono estero non abilita la ricerca di indirizzi internazionali.

La regione attiva dell’isola di Montréal è solo per prototipazione e test. Prima del lancio commerciale configura confini, lingua, tariffe, minimo, età legale, gestione della valuta, geocodifica, prodotti, informative e operazioni locali.

## Catalogo

La schermata admin crea prodotti con nome, descrizione, prezzo USD, scorte, regioni e indicatore di test. L’interfaccia consente di sospendere o riattivare una scheda; modifiche dettagliate e archiviazione sono disponibili anche tramite API. Prima dell’attivazione verifica legalità, fornitura, diritti d’immagine/etichetta, scorte, imposte e prezzo finale. La confezione Heineken iniziale è un articolo di test, non un’offerta commerciale.

## Corrieri, utenti e pagamenti

In Corrieri → Candidature, controlla i dettagli e il documento d’identità tramite l’accesso riservato agli admin. Approva, rifiuta o sospendi con una nota appropriata. L’approvazione genera una password temporanea visualizzata una sola volta; trasmettila privatamente al candidato verificato. Proteggi i documenti scaricati ed eliminali secondo la policy di conservazione.

Utenti consente di bloccare o sbloccare i profili cliente. I pagamenti ai corrieri sono registri manuali: seleziona il corriere, inserisci importo e nota, e segna pagato solo dopo aver verificato un trasferimento reale. Guadagni e registri non trasferiscono automaticamente fondi bancari o crypto.

## Impostazioni e audit

Impostazioni mostra la percentuale di commissione e lo stato mascherato della configurazione BTCPay. Puoi modificare la percentuale qui. ID negozio, chiave API e segreto webhook BTCPay, credenziali database e chiavi di firma devono restare nella configurazione server protetta, mai nel browser, nel repository o in questa guida. Il pannello non mostra i valori segreti.

Controlla ogni giorno Dashboard e Audit. Riconcilia ordini pagati, fatture non riuscite, disponibilità dei corrieri, note di rimborso e pagamenti. Consulta la [guida al lancio e alle operazioni](05-launch-and-operations.md) per pagamenti, backup, incidenti e approvazione dei mercati.
