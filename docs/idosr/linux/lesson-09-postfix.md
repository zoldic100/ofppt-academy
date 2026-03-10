---
id: lesson-09
title:  Serveur Mail Postfix
sidebar_label: Serveur Mail Postfix


---

# Serveur Mail — Postfix + Dovecot

> **Objectif :** Installer, configurer et tester un serveur de messagerie complet avec Postfix (MTA) et Dovecot (SASL/IMAP), puis valider le tout via Telnet.

---

## 1. Concepts Fondamentaux

### 1.1 Architecture d'un système de messagerie

Un système de messagerie repose sur trois composants distincts :

| Composant | Rôle | Exemples |
|-----------|------|---------|
| **MTA** — Mail Transfer Agent | Transporte les emails entre serveurs | Postfix, Sendmail |
| **MDA** — Mail Delivery Agent | Livre l'email dans la boîte du destinataire | Courier, Procmail |
| **MUA** — Mail User Agent | Application utilisée pour lire/envoyer | Outlook, Thunderbird |

### 1.2 Flux d'un email

```
[MUA] → SMTP → [MTA Postfix] → SMTP → [MTA distant]
                                              ↓
                                        [MDA Procmail]
                                              ↓
                                        [Boîte mail]
                                              ↓
                                    IMAP/POP3 ← [MUA]
```

**Etapes détaillées :**

1. L'utilisateur rédige un email dans son **MUA** (ex : Outlook)
2. Le MUA envoie le message au **MTA** (Postfix) via **SMTP**
3. Postfix transfère l'email vers le serveur du destinataire
4. Le **MDA** dépose le message dans la boîte mail
5. Le destinataire lit l'email via **IMAP ou POP3**

---

### 1.3 Protocoles essentiels

| Protocole | Port | Rôle |
|-----------|------|------|
| **SMTP** | 25 | Transfert d'emails entre serveurs |
| **Submission** | 587 | Envoi client → serveur (avec auth) |
| **SMTPS** | 465 | SMTP chiffré SSL |
| **IMAP** | 143 | Accès aux messages (synchronisé) |
| **IMAPS** | 993 | IMAP chiffré SSL |
| **POP3** | 110 | Téléchargement des messages |

:::info Différence IMAP vs POP3
- **IMAP** : les messages restent sur le serveur, synchronisés sur tous vos appareils
- **POP3** : les messages sont téléchargés et supprimés du serveur
- En production, on préfère toujours **IMAP**
:::

---

## 2. Installation de Postfix

### 2.1 Mise à jour du système

Avant toute installation, mettre à jour les paquets :

```bash
sudo apt update && sudo apt upgrade -y
```

### 2.2 Installation

```bash
sudo apt install postfix -y
```

Lors de l'assistant interactif, choisir :

| Paramètre | Valeur |
|-----------|--------|
| **Type de configuration** | `Internet Site` |
| **Nom du système mail** | `ofppt.lan` |

:::tip Mode Internet Site
Le mode **Internet Site** signifie que Postfix enverra et recevra des emails directement via SMTP, sans relais intermédiaire. C'est la configuration adaptée à un environnement de lab autonome.
:::

### 2.3 Vérification du service

```bash
# Vérifier l'état du service
sudo systemctl status postfix

# Activer au démarrage
sudo systemctl enable postfix
```

---

## 3. Fichiers de Configuration Postfix

Tous les fichiers de configuration se trouvent dans `/etc/postfix/` :

| Fichier | Rôle |
|---------|------|
| `/etc/postfix/main.cf` | Configuration globale principale |
| `/etc/postfix/master.cf` | Services et processus Postfix |
| `/etc/postfix/access` | Contrôle d'accès (autoriser/bloquer IP) |
| `/etc/postfix/transport` | Routage des emails par domaine |
| `/etc/aliases` | Alias d'emails (ex : root → admin) |

---

### 3.1 Fichier principal — `main.cf`

C'est le fichier le plus important. Voici les paramètres clés à configurer :

```ini title="/etc/postfix/main.cf"
# Identité du serveur
myhostname = mail.ofppt.lan
mydomain = ofppt.lan
myorigin = $mydomain

# Interfaces d'écoute
inet_interfaces = all

# Domaines locaux acceptés
mydestination = $myhostname, $mydomain, localhost.$mydomain, localhost

# Réseaux autorisés à relayer
mynetworks = 127.0.0.0/8

# Format de stockage des emails
home_mailbox = Maildir/
```

:::info Format Maildir
`Maildir/` stocke chaque email dans un **fichier séparé** sous `~/Maildir/`. C'est plus robuste que le format `mbox` classique (un seul fichier pour tous les emails).
:::

---

### 3.2 Fichier des services — `master.cf`

Ce fichier contrôle les processus internes de Postfix. Voici les lignes essentielles :

```ini title="/etc/postfix/master.cf"
# Service    Type  Priv  Unpriv  Delay  MaxProc  Command
smtp         inet  n     -       y      -        -        smtpd
submission   inet  n     -       y      -        -        smtpd
pickup       unix  n     -       y      60       1        pickup
cleanup      unix  n     -       y      -        0        cleanup
qmgr         unix  n     -       n      300      1        qmgr
```

**Explication des services :**

| Service | Description |
|---------|-------------|
| **smtp** | Reçoit les emails entrants via SMTP (port 25) |
| **submission** | Permet aux clients mail d'envoyer (port 587) |
| **pickup** | Récupère les emails envoyés localement |
| **cleanup** | Prépare et normalise les messages |
| **qmgr** | Gestionnaire de file d'attente des emails |

:::tip Idée clé
- `main.cf` → **configuration globale** du serveur
- `master.cf` → **services et processus** Postfix
:::

---

## 4. Installation de Dovecot (SASL)

Postfix ne gère pas nativement l'authentification des utilisateurs. **Dovecot** est installé pour fournir ce service via **SASL** (Simple Authentication and Security Layer).

### 4.1 Installation

```bash
sudo apt install dovecot-core dovecot-imapd -y
```

### 4.2 Configuration Dovecot

```ini title="/etc/dovecot/dovecot.conf"
# Activer IMAP et POP3
protocols = imap pop3
```

```bash
# Redémarrer et activer Dovecot
sudo systemctl restart dovecot
sudo systemctl enable dovecot

# Vérifier l'état
sudo systemctl status dovecot
```

### 4.3 Intégration SASL dans Postfix

Ajouter dans `/etc/postfix/main.cf` pour déléguer l'authentification à Dovecot via un socket Unix :

```ini title="/etc/postfix/main.cf — section SASL"
smtpd_sasl_type = dovecot
smtpd_sasl_path = private/auth
smtpd_sasl_auth_enable = yes
```

---

## 5. Configuration DNS

Les enregistrements DNS suivants doivent être ajoutés dans le serveur **BIND** pour le domaine `ofppt.lan` :

| Type | Enregistrement | Valeur |
|------|---------------|--------|
| **A** | `mail.ofppt.lan` | `192.168.7.124` |
| **MX** | `@ IN MX 10` | `mail.ofppt.lan.` |
| **SPF** | `@ IN TXT` | `"v=spf1 mx ~all"` |

```bash
# Après modification de la zone DNS, recharger BIND
sudo systemctl reload bind9

# Vérifier l'enregistrement MX
dig MX ofppt.lan
```

:::warning N'oubliez pas
Incrémenter le **serial** de la zone DNS après chaque modification, sinon les changements ne seront pas propagés.
:::

---

## 6. Création de l'Utilisateur de Test

Postfix utilise les **comptes système Linux** comme boîtes mail.

```bash
# Créer l'utilisateur
sudo adduser testuser
```

Cette commande crée automatiquement :
- Un compte Linux : `testuser`
- Un répertoire home : `/home/testuser/`
- La boîte mail sera créée à `/home/testuser/Maildir/` à la première réception

### Structure du Maildir

```
~/Maildir/
├── new/    ← Emails reçus non lus
├── cur/    ← Emails lus/consultés
└── tmp/    ← Emails en cours de livraison (temporaire)
```

---

## 7. Test SMTP via Telnet

Telnet permet de **simuler manuellement** ce qu'un client mail fait automatiquement. C'est l'outil de diagnostic SMTP par excellence.

### 7.1 Vérification DNS préalable

```bash
dig MX ofppt.lan
```

### 7.2 Connexion au serveur SMTP

```bash
telnet 192.168.7.124 25
```

Réponse attendue :

```
Trying 192.168.7.124...
Connected to 192.168.7.124.
220 mail.ofppt.lan ESMTP Postfix (Ubuntu)
```

Le code **220** confirme que le serveur est prêt. La bannière affiche l'identité du serveur.

### 7.3 Dialogue SMTP complet

```smtp
EHLO ofppt.lan
# → Identification du client, le serveur répond avec ses capacités
# (STARTTLS, AUTH PLAIN, PIPELINING...)

MAIL FROM:<omar@ofppt.lan>
# → 250 2.1.0 Ok

RCPT TO:<testuser@ofppt.lan>
# → 250 2.1.5 Ok

DATA
# → 354 End data with <CR><LF>.<CR><LF>

Subject: Test Telnet Postfix

Bonjour, ceci est un test SMTP via Telnet !

.
# → 250 2.0.0 Ok: queued as C3D8A602AC

QUIT
# → 221 2.0.0 Bye
```

| Commande | Rôle | Code réponse |
|----------|------|-------------|
| `EHLO` | Identification du client | `250` |
| `MAIL FROM` | Déclaration expéditeur | `250 2.1.0 Ok` |
| `RCPT TO` | Déclaration destinataire | `250 2.1.5 Ok` |
| `DATA` | Début du message | `354` |
| `.` | Fin du message | `250 2.0.0 Ok: queued` |
| `QUIT` | Fermeture connexion | `221 2.0.0 Bye` |

---

## 8. Vérification de la Réception

### 8.1 Vérifier la livraison

```bash
# Se connecter en tant que testuser
su - testuser

# Vérifier le dossier new/
ls ~/Maildir/new/
# → 1773167887.Vfc00I8001dM894580.mail.ofppt.lan
```

La présence d'un fichier dans `new/` confirme la livraison.

### 8.2 Lire le message

```bash
cat ~/Maildir/new/*
```

Exemple de sortie :

```
Return-Path: <omar@ofppt.lan>
X-Original-To: testuser@ofppt.lan
Delivered-To: testuser@ofppt.lan
Received: from ofppt.lan (unknown [192.168.7.124])
         by mail.ofppt.lan (Postfix) with ESMTP id C3D8A602AC
From: omar@ofppt.lan
Subject: Test Telnet Postfix

Bonjour, ceci est un test SMTP via Telnet !
```

### 8.3 Vérifier les logs Postfix

```bash
sudo grep "C3D8A602AC" /var/log/mail.log
```

---

## 9. Sécurité — SSL/TLS

| Concept | Description |
|---------|-------------|
| **SSL/TLS** | Protocoles de chiffrement pour sécuriser la communication client ↔ serveur |
| **TLS** | Version moderne et sécurisée de SSL, utilisé avec SMTP sécurisé (ports 465/587) |
| **CA** | Autorité de certification qui signe les certificats numériques |
| **Certificat** | Permet de vérifier l'authenticité du serveur et chiffrer la connexion |

Configuration TLS dans `/etc/postfix/main.cf` :

```ini
smtpd_tls_cert_file = /etc/ssl/certs/mail.crt
smtpd_tls_key_file = /etc/ssl/private/mail.key
smtpd_tls_security_level = may
smtp_tls_security_level = may
```

---

## 10. Bilan — Récapitulatif

| Composant / Test | Statut | Détail |
|-----------------|--------|--------|
| Installation Postfix | ✅ OK | Service actif |
| Configuration `main.cf` | ✅ OK | Maildir configuré |
| Dovecot SASL | ✅ OK | Auth fonctionnelle |
| DNS MX + SPF | ✅ OK | Zone `ofppt.lan` |
| Création testuser | ✅ OK | `/home/testuser` |
| Connexion Telnet port 25 | ✅ OK | `220 ESMTP Postfix` |
| Envoi SMTP manuel | ✅ OK | `queued as C3D8A602AC` |
| Réception dans Maildir | ✅ OK | `Maildir/new/` non vide |

### Conclusion

Le serveur de messagerie **Postfix** a été installé, configuré et testé avec succès dans un environnement Ubuntu. L'ensemble de la chaîne de livraison email a été validée :

```
Connexion SMTP port 25
    → Dialogue EHLO / MAIL FROM / RCPT TO / DATA
        → File d'attente Postfix (qmgr)
            → Livraison Maildir (MDA)
                → Lecture IMAP/POP3 (Dovecot)
```

Ce déploiement couvre les compétences essentielles en **administration système Linux**, **protocoles de messagerie**, et **configuration DNS**.

---

## Commandes de Référence

```bash
# Service Postfix
sudo systemctl start|stop|restart|status postfix

# Tester la configuration
sudo postfix check

# File d'attente
sudo postqueue -p       # afficher
sudo postqueue -f       # forcer l'envoi
sudo postsuper -d ALL   # vider la file

# Logs en temps réel
sudo tail -f /var/log/mail.log

# Recharger la config sans redémarrer
sudo systemctl reload postfix
```