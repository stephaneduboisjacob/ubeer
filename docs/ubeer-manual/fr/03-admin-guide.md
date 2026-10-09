# Guide administrateur

## Accès et sécurité

Ouvrez https://ubeer.example.com/admin. Connectez-vous avec l’adresse et le mot de passe administrateur provisionnés pour cette installation, puis saisissez le code actuel à six chiffres de l’application d’authentification. L’authentification TOTP est obligatoire. Les identifiants initiaux sont conservés séparément sur le serveur : ne les copiez ni dans ce guide, ni dans un ticket, ni dans une conversation. En l’absence d’inscription de l’authentificateur, suivez les instructions de démarrage protégées. L’application ne possède pas de procédure autonome de récupération du mot de passe ou du TOTP; confiez la récupération serveur à un opérateur de confiance et remplacez tout secret exposé.

Pour cette installation, le fichier initial à usage unique est the protected path configured with `ADMIN_CREDENTIALS_PATH`; seul l’administrateur du serveur peut le lire. Demandez à l’opérateur autorisé de vous transmettre l’accès de façon sécurisée, inscrivez l’authentificateur, puis faites supprimer le fichier. Ne placez jamais le mot de passe ou la clé TOTP dans un courriel, un ticket ou cette documentation.

Utilisez un mot de passe unique, verrouillez vos appareils et déconnectez-vous des ordinateurs partagés. Les modifications admin créent des entrées d’audit; vérifiez le journal après les changements sensibles.

## Tableau de bord et commandes

La vue d’ensemble affiche les commandes du jour, les revenus payés en USD, les livreurs approuvés en ligne et les paiements échoués. Dans Commandes, examinez les commandes récentes et filtrez par état : pending_payment, paid, accepted, preparing, out_for_delivery, delivered, cancelled, refunded ou failed.

Utilisez « Changer l’état » uniquement pour corriger une situation opérationnelle exceptionnelle et inscrivez le motif et les preuves dans la note d’audit. Une modification forcée ne rembourse pas une facture BTCPay, ne renverse pas un paiement, ne notifie pas nécessairement toutes les parties et ne garantit pas la mise à jour du stock. « Note de remboursement » consigne la décision et passe la commande à l’état remboursé dans uBeer, mais n’envoie aucun remboursement BTCPay ou sur chaîne. Traitez le retour de fonds séparément selon le fournisseur et la politique locale, puis consignez le résultat.

## Régions et marchés

Une région définit la limite de livraison contrôlée par le serveur, la langue initiale, l’état actif, la commande minimale, les frais de livraison et l’âge affiché. Le contrôle du point et celui du paiement sont effectués par l’API. Désactiver une région bloque les nouvelles commandes dans cette zone. L’application actuelle n’accepte que les seuils de 19 ou 21 ans et la devise de paiement est fixée au dollar américain.

**Limite actuelle de l’interface :** la page des régions affiche les géométries existantes, mais l’outil de dessin n’est pas connecté. Ne supposez pas qu’un clic sur la carte crée un polygone. L’API des régions accepte du GeoJSON, mais la création ou la modification de limites exige actuellement une procédure d’ingénierie/exploitation vérifiée. Testez les coordonnées par rapport à la zone légale et opérationnelle avant activation. La recherche d’adresses est limitée au Canada et à une vue autour de Montréal : ajouter une région étrangère ne permettra pas à lui seul la recherche d’adresses étrangères.

La région active de l’île de Montréal est une région de prototype. Gardez-la pour les essais uniquement. Avant un lancement commercial, configurez la limite de la zone, la langue, les frais, le minimum, l’âge légal, le traitement de la devise, le géocodeur, les produits, les avis juridiques et les opérations locales.

## Catalogue

L’écran admin permet de créer un produit avec son nom, sa description, son prix en USD, le stock, une ou plusieurs régions et un indicateur de test. L’interface permet de suspendre ou réactiver une fiche; la modification détaillée et l’archivage existent également dans l’API. Avant activation, vérifiez la légalité du produit, l’approvisionnement, les droits d’étiquetage et d’image, le stock, les taxes et le prix final. Le paquet Heineken initial est un article de test, pas une offre commerciale.

## Livreurs, clients et versements

Dans Conducteurs → Demandes, examinez les détails et le document d’identité par l’accès admin protégé. Approuvez, refusez ou suspendez avec une note appropriée. L’approbation génère un mot de passe temporaire affiché une seule fois; transmettez-le de façon privée à la personne vérifiée. Protégez les fichiers d’identité téléchargés et supprimez-les selon la politique de conservation.

La section Utilisateurs permet de bloquer ou débloquer un compte client. Les versements sont manuels : sélectionnez un conducteur, saisissez le montant et une note, puis marquez le versement comme payé uniquement après vérification d’un transfert réel. Les gains et versements enregistrés ne sont pas des paiements bancaires ou crypto automatisés.

## Paramètres et audit

Paramètres affiche le pourcentage de frais de plateforme et l’état masqué de la configuration BTCPay. Le pourcentage peut être modifié ici. L’identifiant de magasin BTCPay, la clé API, le secret webhook, les identifiants de base de données et les clés de signature doivent rester dans la configuration serveur protégée, jamais dans le navigateur, le dépôt ou ce guide. L’interface admin ne révèle pas leurs valeurs.

Consultez quotidiennement le tableau de bord et le journal d’audit. Rapprochez les commandes payées, les factures échouées, les livreurs, les remboursements manuels et les versements. Consultez le [guide de lancement et d’exploitation](05-launch-and-operations.md) pour les paiements, les sauvegardes, les incidents et l’approbation des marchés.

---

Contact: Stephane Jacob <jacobstephane@outlook.com>
