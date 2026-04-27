# Progetto Lavoratori - Piattaforma Multi-Stack

## 1. Panoramica
`Progetto Lavoratori` è una piattaforma dimostrativa che integra più tecnologie applicative in un unico ecosistema:

- Frontend/server `Node.js` (Express + Jade)
- Backend `PHP` con `MySQL`
- Servizi realtime tramite `WebSocket`
- Persistenza NoSQL su `MongoDB`
- Orchestrazione database NoSQL tramite `Docker Compose`

Il progetto simula un contesto di prenotazione interventi professionali (idraulici, elettricisti, muratori), con funzionalita di blog, assistenza chat e pannello operativo amministrativo.

## 2. Architettura Applicativa
La soluzione è composta da tre macro-aree:

- `php_sql/EsercizioLavoratori`: portale utente (login, prenotazione, schedulazione) e backend PHP per logica SQL.
- `nodejs/progettoLavoratoriServer`: microservizi Node.js per gestione prenotazioni realtime, pannello admin e blog.
- `nodejs/chatV2`: microservizi Node.js per chat operatore/utente con broker WebSocket dedicato.

### 2.1 Servizi e porte
| Componente | Path | Porta HTTP | Porta WS | Ruolo |
|---|---|---:|---:|---|
| Node Prenotazioni | `nodejs/progettoLavoratoriServer/server` | `3000` | `8080` | Ricezione prenotazioni e push realtime verso admin |
| Node Admin | `nodejs/progettoLavoratoriServer/admin` | `3010` | - | Dashboard interventi in arrivo e interventi attivi |
| Node Blog | `nodejs/progettoLavoratoriServer/blog` | `3020` | - | Blog pubblico e area amministrazione blog |
| Node Chat Client | `nodejs/chatV2/client` | `3200` | - | Interfaccia chat utente/operatore |
| Node Chat Broker | `nodejs/chatV2/server` | `3100` | `8081` | Gestione associazione operatore-domanda e messaggistica |
| PHP Portal | `php_sql/EsercizioLavoratori` | Apache locale | - | Login, prenotazione, orchestrazione SQL/Node |
| MongoDB Blog | `docker_mongo/progettoLavoratoriRemoto/compose.yaml` | `27019` | - | Collection `postBlog` |
| MongoDB Prenotazioni | `docker_mongo/progettoLavoratoriRemoto/compose.yaml` | `27020` | - | Collection `prenotazioni` |

## 3. Prerequisiti
Per eseguire il progetto in ambiente locale Windows:

- `Node.js` 18+
- `npm`
- `Docker Desktop` con `docker compose`
- `MySQL` (ad esempio via XAMPP/WAMP) con utente `root` e password vuota (coerente con il codice corrente)
- `Apache` con supporto PHP (es. XAMPP)

## 4. Setup Dati

### 4.1 Import SQL (MySQL)
Il dump SQL completo è in:

- `php_sql/db/eserciziolavoratori.extracted.sql`

Importazione (PowerShell):

```powershell
mysql -u root -p < .\php_sql\db\eserciziolavoratori.extracted.sql
```

Se l'utente `root` non ha password, premere solo `Invio` quando richiesto.

Il dump crea e popola:

- Database `eserciziolavoratori`
- Database `eserciziolavoratoriaziende`
- Tabelle principali: `users`, `dbidraulici`, `dbelettricisti`, `dbmuratori`, `aziende`, `dbinterventi`

Credenziali test gia presenti:

- Utente standard: `mario` / `password`
- Utente admin: `admin` / `admin`

### 4.2 Avvio MongoDB con Docker
Dal path del compose:

```powershell
cd .\docker_mongo\progettoLavoratoriRemoto
docker compose up -d
```

Verifica container:

```powershell
docker ps
```

Attesi i container `dbBlog` e `dbPrenotazioni`.

### 4.3 Import dataset MongoDB
I seed JSON sono:

- `docker_mongo/progettoLavoratoriRemoto.postBlog.json`
- `docker_mongo/progettoLavoratoriRemoto.prenotazioni.json`

Importazione in container:

```powershell
docker exec -i dbBlog mongoimport --db progettoLavoratoriRemoto --collection postBlog --jsonArray --drop < .\docker_mongo\progettoLavoratoriRemoto.postBlog.json
docker exec -i dbPrenotazioni mongoimport --db progettoLavoratoriRemoto --collection prenotazioni --jsonArray --drop < .\docker_mongo\progettoLavoratoriRemoto.prenotazioni.json
```

## 5. Setup Applicazioni Node.js
Installare le dipendenze in ogni modulo Node:

```powershell
cd .\nodejs\progettoLavoratoriServer\server; npm install
cd ..\admin; npm install
cd ..\blog; npm install
cd ..\..\chatV2\server; npm install
cd ..\client; npm install
```

## 6. Setup PHP
Le route frontend puntano a URL del tipo:

- `http://localhost/php/EsercizioLavoratori/...`

Per coerenza, pubblicare la cartella PHP sotto la document root Apache mantenendo la struttura:

- `<document_root>/php/EsercizioLavoratori`

Esempio (XAMPP):

- `C:\xampp\htdocs\php\EsercizioLavoratori`

## 7. Avvio Completo del Sistema
Aprire terminali separati e avviare i servizi nel seguente ordine consigliato.

### 7.1 Database
1. Avviare MySQL e Apache.
2. Avviare MongoDB via Docker (se non gia attivo).

### 7.2 Backend Node.js
```powershell
cd .\nodejs\progettoLavoratoriServer\server; npm start
cd .\nodejs\progettoLavoratoriServer\admin; npm start
cd .\nodejs\progettoLavoratoriServer\blog; npm start
cd .\nodejs\chatV2\server; npm start
cd .\nodejs\chatV2\client; npm start
```

## 8. Modalita di Utilizzo

### 8.1 Accesso utente
1. Aprire `http://localhost/php/EsercizioLavoratori/login.php`.
2. Eseguire login con un account valido.
3. Per utente standard si apre il portale di prenotazione.
4. Per admin si apre il pannello operativo su `http://localhost:3010`.

### 8.2 Prenotazione intervento
Nel portale utente (`homepage.php`):

1. Selezionare professione e mansione.
2. Inserire indirizzo e fascia oraria.
3. Confermare con `Prenota`.

Effetti applicativi:

- Aggiornamento disponibilita lavoratore in MySQL.
- Inserimento intervento in `dbinterventi` (MySQL).
- Inserimento prenotazione in MongoDB (`prenotazioni`).
- Notifica realtime al pannello admin via WebSocket `8080`.

### 8.3 Area Blog
- Frontend blog: `http://localhost:3020?username=<utente>`
- Admin blog: `http://localhost:3020/admin`

Funzioni:

- Visualizzazione post e commenti lato utente.
- Pubblicazione post con upload immagine lato admin.
- Gestione risposte ai commenti lato admin.

### 8.4 Chat Assistenza
- Utente: `http://localhost:3200/assistenza?username=<utente>`
- Operatore: `http://localhost:3200/operatore`

La messaggistica è mediata dal broker WebSocket su porta `8081`, che effettua l'associazione tra richieste utenti e operatori disponibili.

### 8.5 Pannello Operativo Admin
- Dashboard principale: `http://localhost:3010`
- Interventi attivi: `http://localhost:3010/interventi`

Il pannello riceve e visualizza prenotazioni in tempo reale, includendo dati di scheduling e mappa posizione intervento.

## 9. Struttura Repository
```text
README.md
docker_mongo/
	progettoLavoratoriRemoto.postBlog.json
	progettoLavoratoriRemoto.prenotazioni.json
	progettoLavoratoriRemoto/
		compose.yaml
nodejs/
	chatV2/
		client/
		server/
	progettoLavoratoriServer/
		admin/
		blog/
		server/
php_sql/
	db/
		eserciziolavoratori.extracted.sql
	EsercizioLavoratori/
```

## 10. Note Tecniche
- Il file `docker_mongo/progettoLavoratoriRemoto/Dockerfile` è un template Docker generico e non è utilizzato dal `compose.yaml` corrente.
- Il progetto è stato impostato per ambiente locale con hostname `localhost` e porte fisse.
- Alcuni riferimenti a route e naming DB nel codice sono sensibili alla configurazione del sistema operativo (case sensitivity su Linux). In ambiente Windows locale il comportamento è generalmente tollerante.

## 11. Licenza
Repository sviluppato a scopo didattico e dimostrativo portfolio.
