CREATE DATABASE IF NOT EXISTS `eserciziolavoratori` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `eserciziolavoratori`;

CREATE TABLE `dbelettricisti` (
  `id` int(11) NOT NULL,
  `nome` varchar(255) NOT NULL,
  `cognome` varchar(255) NOT NULL,
  `mansione` varchar(255) NOT NULL,
  `disponibilita` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `dbelettricisti` (`id`, `nome`, `cognome`, `mansione`, `disponibilita`) VALUES
(11, 'Elettricista1', 'Bianchi', 'installazione di impianti elettrici', 1),
(12, 'Elettricista2', 'Rossi', 'riparazione di impianti elettrici', 1),
(13, 'Elettricista3', 'Verdi', 'installazione di impianti di allarme', 1),
(14, 'Elettricista4', 'Neri', 'installazione di impianti di videosorveglianza', 1),
(15, 'Elettricista5', 'Vasi', 'installazione di impianti di condizionamento', 0);

CREATE TABLE `dbidraulici` (
  `id` int(11) NOT NULL,
  `nome` varchar(255) NOT NULL,
  `cognome` varchar(255) NOT NULL,
  `mansione` varchar(255) NOT NULL,
  `disponibilita` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `dbidraulici` (`id`, `nome`, `cognome`, `mansione`, `disponibilita`) VALUES
(6, 'Idraulico1', 'Vasi', 'blocco delle perdite d\'acqua', 1),
(7, 'Idraulico2', 'Bianchi', 'disostruzione degli scarichi intasati', 1),
(8, 'Idraulico3', 'Rossi', 'installazione di tubi per l\'acqua e impianti idraulici', 1),
(9, 'Idraulico4', 'Verdi', 'riparazione di tubature otturate, guaste o rovinate', 1),
(10, 'Idraulico5', 'Neri', 'controllo della pressione dell\'acqua', 1);

CREATE TABLE `dbmuratori` (
  `id` int(11) NOT NULL,
  `nome` varchar(255) NOT NULL,
  `cognome` varchar(255) NOT NULL,
  `mansione` varchar(255) NOT NULL,
  `disponibilita` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `dbmuratori` (`id`, `nome`, `cognome`, `mansione`, `disponibilita`) VALUES
(1, 'Muratore1', 'Rossi', 'Riparazioni e manutenzione', 1),
(2, 'Muratore2', 'Bianchi', 'Lavori di finitura', 1),
(3, 'Muratore3', 'Verdi', 'Applicazione di rivestimenti', 1),
(4, 'Muratore4', 'Neri', 'Alzare le pareti', 1),
(5, 'Muratore5', 'Gialli', 'Installazione di sistemi strutturali', 1);

ALTER TABLE `dbelettricisti`
  ADD PRIMARY KEY (`id`);
ALTER TABLE `dbidraulici`
  ADD PRIMARY KEY (`id`);
ALTER TABLE `dbmuratori`
  ADD PRIMARY KEY (`id`);

CREATE DATABASE IF NOT EXISTS `eserciziolavoratoriaziende` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `eserciziolavoratoriaziende`;

CREATE TABLE `aziende` (
  `id_Azienda` int(11) NOT NULL,
  `nome` varchar(255) NOT NULL,
  `specializzazione` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `aziende` (`id_Azienda`, `nome`, `specializzazione`) VALUES
(1, 'tubi&tubi', 'idraulici'),
(2, 'muri&muri', 'muratori'),
(3, 'elettricistia', 'elettricisti');

CREATE TABLE `dbinterventi` (
  `id_Prenotazione` int(11) NOT NULL,
  `id_Azienda` int(11) NOT NULL,
  `id_Lavoratore` int(11) NOT NULL,
  `mansioneRichiesta` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `dbinterventi` (`id_Prenotazione`, `id_Azienda`, `id_Lavoratore`, `mansioneRichiesta`) VALUES
(1, 3, 11, 'installazione di impianti elettrici'),
(42, 3, 11, 'installazione di impianti elettrici'),
(43, 1, 6, 'blocco delle perdite d\'acqua'),
(44, 2, 4, 'Alzare le pareti'),
(45, 3, 14, 'installazione di impianti di videosorveglianza'),
(46, 2, 1, 'Riparazioni e manutenzione'),
(47, 3, 12, 'riparazione di impianti elettrici'),
(48, 2, 2, 'Lavori di finitura'),
(49, 3, 15, 'installazione di impianti di condizionamento'),
(50, 3, 13, 'installazione di impianti di allarme'),
(51, 1, 7, 'disostruzione degli scarichi intasati'),
(52, 2, 3, 'Applicazione di rivestimenti'),
(53, 2, 5, 'Installazione di sistemi strutturali'),
(54, 1, 8, 'installazione di tubi per l\'acqua e impianti idraulici'),
(55, 3, 15, 'installazione di impianti di condizionamento');

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `pwd` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `users` (`id`, `username`, `pwd`) VALUES
(1, 'mario', 'password'),
(2, 'admin', 'admin'),
(3, 'andrea', 'muna');

ALTER TABLE `aziende`
  ADD PRIMARY KEY (`id_Azienda`);
ALTER TABLE `dbinterventi`
  ADD PRIMARY KEY (`id_Prenotazione`);
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `aziende`
  MODIFY `id_Azienda` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
ALTER TABLE `dbinterventi`
  MODIFY `id_Prenotazione` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
