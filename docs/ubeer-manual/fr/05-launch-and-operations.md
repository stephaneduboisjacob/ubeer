# Guide de lancement et d’exploitation

## Conditions avant un lancement à l’étranger

L’environnement de production actuel est un prototype montréalais, pas une place de marché prête pour l’étranger. Sa région active est l’île de Montréal; le seul produit initial est un paquet de six marqué TEST LISTING à 30,00 $ US; la recherche d’adresse est limitée au Canada et à une vue autour de Montréal; la devise de facturation est le dollar américain; les seuils d’âge sont limités à 19 ou 21 ans. L’outil de dessin de régions de l’interface admin n’est pas connecté. N’acceptez aucune commande d’un nouveau pays avant de résoudre, mettre en œuvre et vérifier ces limites.

Pour chaque pays et ville ciblés, faites confirmer par des conseillers locaux qualifiés et les autorités les règles concernant les vendeurs, les places de marché, l’alcool, la livraison, la publicité, les travailleurs, les taxes, la consommation, la vie privée, les paiements et le contrôle d’identité. Déterminez quelle partie autorisée vend et livre chaque produit, comment vérifier les pièces d’identité et gérer les remises refusées, les heures autorisées, la conservation des dossiers, les taxes et remboursements, la langue de soutien et les escalades d’urgence. Ces exigences diffèrent selon les marchés; cette liste ne constitue pas un avis juridique.

Configurez et vérifiez ensuite : la recherche d’adresse pour le pays; une limite de région précise et contrôlée par le serveur; l’âge local et son contrôle; les produits, stocks, devise, taxes et frais; les livreurs et horaires; les textes traduits et juridiques; la conservation des données; les actifs BTCPay et le webhook; l’assistance; les procédures de rapprochement et d’incident. Effectuez des commandes d’essai payées avec chaque moyen de paiement et testez chaque état de livraison avant toute annonce.

## Paiements et assistance

uBeer redirige le paiement vers BTCPay Server, vérifie les signatures des webhooks de facture et exécute une tâche de rapprochement. Enregistrez le webhook à l’adresse suivante :

https://ubeer.example.com/api/webhooks/btcpay

Abonnez-vous aux événements InvoiceCreated, InvoiceReceivedPayment, InvoiceProcessing, InvoiceSettled, InvoiceExpired et InvoiceInvalid. Placez BTCPAY_STORE_ID, BTCPAY_API_KEY et BTCPAY_WEBHOOK_SECRET dans le fichier .env protégé du serveur. Ne mettez jamais leurs valeurs dans ce document, le clavardage admin ou le dépôt. Le paiement crée actuellement des factures en USD. Les moyens affichés dépendent de la configuration du magasin BTCPay.

L’assistant IA utilise un service Ollama local. Il répond aux questions générales, mais ne consulte pas les commandes et n’effectue aucune action. Ne demandez pas de secrets aux clients. Le transport de courriels est configuré sur la console par défaut jusqu’à l’ajout d’un adaptateur SMTP; ne promettez pas la livraison de courriels avant vérification complète.

## Vérifications d’exploitation

Avant chaque période, vérifiez l’état de l’API, de la base de données, de Redis, de Nginx et d’Ollama; contrôlez les régions et produits actifs, ainsi que la couverture des livreurs. Ensuite, rapprochez BTCPay et uBeer pour les factures, examinez les paiements échoués ou en attente, puis vérifiez les notes de remboursement, versements et journaux d’audit. Ne modifiez pas l’état d’une commande uniquement pour corriger un tableau de bord; consignez le motif et rapprochez séparément paiement et stock.

Les opérations serveur sont réservées à un opérateur autorisé :

- Redémarrer l’API : sudo systemctl restart ubeer-api
- Journaux API : sudo journalctl -u ubeer-api -f
- Vérifier Nginx : sudo nginx -t
- Services Compose : cd /opt/ubeer && sudo docker compose ps
- Publier une version : dans /opt/ubeer, lancer npm ci, npm run build et npm run db:migrate; copier apps/web/dist dans /var/www/ubeer/web, puis redémarrer ubeer-api.

Sauvegardez régulièrement PostgreSQL avec pg_dump et stockez les copies hors serveur avec des accès restreints. Sauvegardez également /var/lib/ubeer/uploads : ce dossier contient les documents des demandes de conducteurs. Testez les restaurations. Conservez une copie chiffrée de la clé de signature Android; toute mise à jour doit utiliser la même clé. Consultez RUNBOOK.md pour les commandes complètes et la rotation des clés BTCPay.

## Réponses rapides du soutien

**Mon adresse n’est pas desservie.** Le service se limite aux régions actives. Ce déploiement ne dispose que de l’île de Montréal et d’une recherche d’adresse limitée au Canada. La liste d’attente ne réserve pas une livraison.

**Mon paiement est en attente.** Vérifiez la facture BTCPay et conservez le reçu. L’assistance doit rapprocher la facture avant de demander un autre paiement.

**La facture a expiré ou échoué.** Ne supposez pas que les fonds ont été retournés et ne recommencez pas à l’aveugle. Le soutien vérifie l’état BTCPay et applique la politique de remboursement régionale.

**Le soutien peut-il modifier ma commande ou le clavardage IA peut-il la consulter?** Non. Le clavardage IA donne des renseignements généraux. Utilisez le canal d’assistance publié avec la référence de commande, jamais le code de livraison ou des identifiants de paiement.

**Comment fonctionnent remboursements et versements?** L’interface enregistre des notes de remboursement et des versements; elle n’effectue pas automatiquement de remboursement BTCPay ni de transfert au livreur. Un opérateur doit traiter et vérifier séparément la transaction réelle.

## Gestion des incidents

Si un secret est exposé, remplacez-le à sa source, mettez à jour la configuration protégée, redémarrez l’API, vérifiez l’intégration et révoquez l’ancien secret. Si les événements de paiement cessent, contrôlez l’API, Redis, les erreurs de signature du webhook, l’état des factures BTCPay et la tâche de rapprochement. En cas d’exposition de documents personnels, limitez l’accès, conservez les faits, informez le responsable de la confidentialité et suivez les obligations locales de signalement. Ne supprimez pas les journaux ou dossiers nécessaires à l’examen légal d’un incident.

---

Contact: Stephane Jacob <jacobstephane@outlook.com>
