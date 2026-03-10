---
id: lesson-05
title:  OpenLDAP
sidebar_label: OpenLDAP
---

# Lecon 05 : OpenLDAP

---

## 1. Definition de LDAP

**LDAP (Lightweight Directory Access Protocol)** est un protocole reseau standardise qui permet l interrogation et la modification des services d annuaire dans un environnement informatique.

Il est principalement utilise sur les serveurs Linux pour la gestion centralisee des :
- Utilisateurs
- Groupes
- Droits d acces
- Informations d authentification

LDAP fonctionne sur le protocole **TCP/IP**.

---

## 2. Nature et Role de LDAP

LDAP represente une norme complete pour les systemes d annuaire. Il ne s agit pas uniquement d un protocole, mais d un ensemble de modeles structures permettant l organisation et la gestion des donnees.

| Modele | Description |
|--------|-------------|
| **Modele de donnees** | Definit la structure des informations stockees dans l annuaire |
| **Modele de nommage** | Definit la maniere d identifier chaque entree dans l arbre (Distinguished Name - DN) |
| **Modele fonctionnel** | Definit les operations possibles : Recherche, Ajout, Modification, Suppression |
| **Modele de securite** | Gere l authentification et le controle d acces (ACL) |
| **Modele de replication** | Permet la synchronisation des donnees entre plusieurs serveurs LDAP |

> LDAP est une version plus simple du protocole DAP utilise dans le modele X.500.

---

## 3. Structure des donnees LDAP

Un annuaire LDAP est organise sous forme **arborescente** (structure en arbre).

- Chaque element de l arbre s appelle une **entree** (aussi appelee DSE - Directory Service Entry)
- L arbre complet s appelle **DIT** (Directory Information Tree)

### Exemple d arbre LDAP

```
DC=ofppt,DC=local
├── OU=Distribution Groups
│   ├── CN=QA-Romania
│   └── CN=Dev-India
├── OU=People
│   └── CN=Diana Anton
└── OU=Groups
```

### Definition d une entree LDAP

Une entree LDAP est l **unite de base** d un annuaire LDAP. Elle est composee de :
- Un **DN (Distinguished Name)** unique
- Un ensemble d **attributs**
- Des **valeurs** associees a ces attributs

---

## 4. RootDSE

Chaque serveur LDAP possede une entree speciale appelee **rootDSE**.

Le RootDSE est une entree systeme en lecture seule situee a la racine du serveur LDAP. Il fournit des informations techniques sur les capacites et la configuration du serveur.

### Interroger le RootDSE

```bash
ldapsearch -x -s base -b "" "(objectClass=*)" +
```

Exemple de resultat :

```
dn:
namingContexts: dc=example,dc=com
supportedLDAPVersion: 3
supportedExtension: 1.3.6.1.4.1.1466.20037
supportedControl: 2.16.840.1.113730.3.4.2
```

**Explication :**

| Champ | Signification |
|-------|---------------|
| `dn:` vide | Le RootDSE n a pas de DN |
| `namingContexts` | Indique la base DN disponible |
| `supportedLDAPVersion` | Version LDAP supportee |
| `supportedExtension` | Extensions activees |
| `supportedControl` | Controles disponibles |

### Decouvrir le Base DN

```bash
ldapsearch -x -s base -b "" namingContexts
```

---

## 5. Types des entrees LDAP

### 1. RootDSE
- Entree systeme speciale
- Pas de DN
- Lecture seule
- Donne les informations sur le serveur

### 2. Entree Racine (Base DN)

```ldif
dn: dc=example,dc=com
objectClass: top
objectClass: domain
dc: example
```

Elle represente le domaine principal de l organisation.

### 3. Entrees Organisationnelles (OU)

```ldif
dn: ou=users,dc=example,dc=com
objectClass: organizationalUnit
ou: users
```

Permettent de structurer l annuaire en departements.

### 4. Entrees Utilisateurs

```ldif
dn: uid=omar,ou=users,dc=example,dc=com
objectClass: inetOrgPerson
uid: omar
cn: Omar
sn: El Idrissi
mail: omar@example.com
```

### 5. Entrees Groupes

```ldif
dn: cn=admins,ou=groups,dc=example,dc=com
objectClass: groupOfNames
cn: admins
member: uid=omar,ou=users,dc=example,dc=com
```

### 6. Entrees Systeme (Configuration)

```ldif
dn: cn=config
```

Contient la configuration interne du serveur OpenLDAP.

---

## 6. DN et RDN

### DN (Distinguished Name)

Le DN est l **identifiant complet** d une entree. Il indique la position exacte dans l arbre.

```
uid=Ali,ou=stagiaire,dc=istahh,dc=ma
```

Signification :
- Utilisateur **Ali**
- Dans l unite **stagiaire**
- Dans le domaine **istahh.ma**

### RDN (Relative Distinguished Name)

Le RDN est la **partie locale** du DN.

Dans l exemple : `uid=Ali` est le RDN.

```
DN complet = RDN + DN du parent
uid=Ali  +  ou=stagiaire,dc=istahh,dc=ma  =  DN complet
```

> Deux entrees peuvent avoir le meme RDN si elles sont dans des branches differentes.
> Mais le **DN doit toujours etre unique**.

---

## 7. Attributs LDAP

| Attribut | Nom complet | Utilisation |
|----------|-------------|-------------|
| `uid` | User ID | Identifiant unique de l utilisateur, utilise pour le login |
| `cn` | Common Name | Nom affiche, peut etre utilise comme RDN |
| `sn` | Surname | Nom de famille |
| `givenName` | Prenom | Prenom de l utilisateur |
| `mail` | Email | Adresse email |
| `ou` | Organizational Unit | Departement ou service |
| `dc` | Domain Component | Partie du nom de domaine |
| `c` | Country | Pays |

### Table des objectClass

| objectClass | Usage | Attributs MUST | Attributs MAY |
|-------------|-------|----------------|---------------|
| `person` | Personne simple | sn, cn | telephone, description |
| `organizationalPerson` | Personne en organisation | sn, cn | title, ou |
| `inetOrgPerson` | Utilisateur standard | sn, cn | uid, mail |
| `posixAccount` | Login Linux | cn, uid, uidNumber, gidNumber, homeDirectory | autres attributs Unix |
| `groupOfNames` | Groupe | cn, member | description |

---

## 8. Les Demons LDAP

Un **demon (daemon)** est un programme qui :
- S execute en arriere-plan
- Demarre automatiquement au demarrage du systeme
- Fournit un service (reseau, impression, web, etc.)

Les demons sont geres avec :

```bash
systemctl start|stop|status nom_service
```

---

## 9. Architecture LDAP

### Serveur LDAP principal

- Contient l annuaire principal
- Gere les requetes des clients
- Applique les regles de securite
- Stocke les donnees LDAP

**Demon :** `slapd` (Standalone LDAP Daemon)
**Fichier de configuration :** `/etc/openldap/slapd.conf`

Le fichier `slapd.conf` permet de configurer : les schemas, le domaine LDAP (suffix), l administrateur, la base de donnees, les regles de securite, et la replication.

**Installation (Ubuntu/Debian) :**

```bash
sudo apt update
sudo apt install slapd ldap-utils
```

### Serveur LDAP replique (secondaire)

- Contient une copie de l annuaire principal
- Assure la haute disponibilite
- Synchronise les donnees depuis le serveur principal

**Demon de replication (ancien modele) :** `slurpd`

Dans le fichier de configuration du serveur secondaire (`slapd.conf`), on configure :
- Le meme suffixe (`dc=example,dc=com`)
- Les parametres de replication (`replica` / `updatedn`)
- Les informations du serveur maitre

### Client LDAP

**Fichier de configuration client :** `/etc/openldap/ldap.conf`

```
URI ldap://192.168.1.10
BASE dc=example,dc=com
```

### Resume architecture

| Element | Demon | Fichier de configuration |
|---------|-------|--------------------------|
| Serveur principal | slapd | /etc/openldap/slapd.conf |
| Serveur replique | slurpd | /etc/openldap/slapd.conf |
| Client LDAP | — | /etc/openldap/ldap.conf |

| Element | Role |
|---------|------|
| `slapd` | Serveur LDAP principal |
| `slurpd` | Ancien service de replication |
| `slapd.conf` | Fichier de configuration serveur |
| `ldap.conf` | Fichier de configuration client |

---

## 10. Commandes principales LDAP

Ces commandes permettent d interagir avec un serveur LDAP depuis un terminal Linux.

### Options frequemment utilisees

| Option | Signification |
|--------|---------------|
| `-x` | Authentification simple |
| `-D` | DN administrateur |
| `-W` | Demander le mot de passe |
| `-w` | Mot de passe en ligne de commande |
| `-b` | Base de recherche |
| `-f` | Lire un fichier LDIF |

### Procedure generale

1. Creer un fichier **LDIF**
2. Executer la commande LDAP correspondante

---

### 1. ldapadd — Ajouter une entree

Ajouter une nouvelle entree dans l annuaire.

> Note : `ldapadd` = `ldapmodify -a`

Creer le fichier `user.ldif` :

```ldif
dn: uid=ali,ou=Techniciens,dc=istahh,dc=ma
objectClass: inetOrgPerson
sn: HAMITI
cn: Ali HAMITI
uid: ali
mail: ali@istahh.ma
```

Executer :

```bash
ldapadd -x -D "cn=admin,dc=istahh,dc=ma" -W -f user.ldif
```

---

### 2. ldapdelete — Supprimer une entree

```bash
ldapdelete -x -D "cn=admin,dc=istahh,dc=ma" -W \
  "uid=ali,ou=Techniciens,dc=istahh,dc=ma"
```

Avec un fichier `delete.ldif` :

```ldif
uid=ali,ou=Techniciens,dc=istahh,dc=ma
```

```bash
ldapdelete -x -D "cn=admin,dc=istahh,dc=ma" -W -f delete.ldif
```

---

### 3. ldapmodify — Modifier une entree

Creer `modify.ldif` pour modifier l email :

```ldif
dn: uid=ali,ou=Techniciens,dc=istahh,dc=ma
changetype: modify
replace: mail
mail: ali.new@istahh.ma
```

```bash
ldapmodify -x -D "cn=admin,dc=istahh,dc=ma" -W -f modify.ldif
```

---

### 4. ldapmodrdn — Modifier le RDN

Changer le nom principal (RDN) :

```bash
ldapmodrdn -x -D "cn=admin,dc=istahh,dc=ma" -W \
  "uid=ali,ou=Techniciens,dc=istahh,dc=ma" uid=ali2
```

---

### 5. ldappasswd — Changer le mot de passe

```bash
ldappasswd -x -D "cn=admin,dc=istahh,dc=ma" -W \
  "uid=ali,ou=Techniciens,dc=istahh,dc=ma"
```

---

### 6. ldapsearch — Rechercher

```bash
# Afficher toutes les entrees
ldapsearch -x -b "dc=istahh,dc=ma"

# Rechercher un utilisateur specifique
ldapsearch -x -b "dc=istahh,dc=ma" "(uid=ali)"

# Afficher seulement cn et mail
ldapsearch -x -b "dc=istahh,dc=ma" "(uid=ali)" cn mail
```

---

### 7. slapcat — Export complet

```bash
slapcat
```

Affiche toute la base LDAP au format LDIF. Commande utilisee cote **serveur**.

---

## 11. Organisation des comptes utilisateurs

Les utilisateurs sont souvent regroupes dans une OU :

```
ou=comptes,dc=istahh,dc=ma
```

**Avantages :**
- Organisation claire
- Gestion simplifiee
- Application de regles communes

### Exemple : Compte Linux LDAP (`posixAccount`)

Creer `comptes.ldif` :

```ldif
dn: uid=samir,ou=comptes,dc=istahh,dc=ma
objectClass: top
objectClass: account
objectClass: posixAccount
objectClass: shadowAccount

uid: samir
cn: samir Aittaleb

uidNumber: 2001
gidNumber: 2000
homeDirectory: /home/samir
loginShell: /bin/bash
userPassword: {crypt}P@ssword

shadowLastChange: 19700
shadowMax: 99999
shadowWarning: 7
```

### Explication des attributs importants

| Attribut | Description |
|----------|-------------|
| `shadowAccount` | Permet la gestion du mot de passe comme `/etc/shadow` sous Linux |
| `userPassword: {crypt}` | Mot de passe chiffre — ne jamais mettre un mot de passe en clair en production |
| `shadowLastChange` | Nombre de jours depuis le 01/01/1970 (epoch Unix) - date du dernier changement de mot de passe |
| `shadowMax` | Nombre maximal de jours avant expiration du mot de passe |
| `shadowWarning` | Nombre de jours avant expiration pour afficher un avertissement |
| `homeDirectory` | Obligatoire pour un compte Linux - sans lui, la connexion peut echouer |

### Generer un mot de passe chiffre

```bash
slappasswd
```

Le systeme demande :

```
New password:
Re-enter new password:
{SSHA}QWxpTGFkYXBoYXNoZWQxMjM0NTY=
```

Utiliser le hash genere dans `userPassword`.

### Commande d ajout

```bash
ldapadd -x -D "cn=admin,dc=istahh,dc=ma" -W -f comptes.ldif
```

> **Important :** Les attributs `uidNumber`, `gidNumber`, `homeDirectory` sont **obligatoires** pour l authentification Linux.

---

## 12. Configuration du systeme pour l authentification avec OpenLDAP

### Etapes : installation → serveur → client → NSS → PAM → migration

---

### Etape 1 — Installation

**Cote serveur LDAP :**

```bash
sudo apt update
sudo apt install slapd ldap-utils
```

**Cote client Linux :**

```bash
sudo apt install libnss-ldap libpam-ldap ldap-utils
# ou selon la version :
# sudo apt install libnss-ldapd libpam-ldapd ldap-utils
```

---

### Etape 2 — Configuration du serveur LDAP

Le serveur LDAP :
- Contient les utilisateurs
- Gere l authentification
- Gere la base de donnees
- Fournit les informations UID, GID, homeDirectory

---

### Etape 3 — Configuration du client LDAP

Fichier : `/etc/ldap/ldap.conf`

```
URI ldap://192.168.1.10
BASE dc=istahh,dc=ma
```

---

### Etape 4 — NSS (Name Service Switch)

**NSS** est un mecanisme Linux qui permet au systeme de savoir ou chercher les informations utilisateurs (utilisateurs, groupes, mots de passe).

**Fichier NSS :** `/etc/nsswitch.conf`

```
passwd:   files ldap
group:    files ldap
shadow:   files ldap
```

**Signification :**
- `files` → chercher dans `/etc/passwd`
- `ldap` → chercher aussi dans LDAP

NSS permet a Linux de **reconnaitre les utilisateurs LDAP comme des utilisateurs locaux**.

**Test :**

```bash
getent passwd samir
```

Si NSS est correct, l utilisateur LDAP apparait dans le resultat.

---

### Etape 5 — PAM (Pluggable Authentication Modules)

**PAM** est le systeme Linux qui gere :
- L authentification
- La verification du mot de passe
- Les regles de connexion

**Processus d authentification LDAP via PAM :**

1. NSS recupere les informations du compte
2. PAM verifie le mot de passe via LDAP
3. Si valide → connexion autorisee

**Fichiers PAM :**

```
/etc/pam.d/common-auth
/etc/pam.d/common-account
/etc/pam.d/common-password
/etc/pam.d/common-session
```

Ces fichiers contiennent les modules LDAP.

---

### Etape 6 — Migration

La migration consiste a transferer les comptes locaux (`/etc/passwd`) vers le serveur LDAP.

**Etapes :**
1. Exporter les comptes locaux
2. Les convertir en format LDIF
3. Les importer dans LDAP avec `ldapadd`

**Outils de migration :**

```bash
sudo apt install migrationtools
```

Les scripts se trouvent dans `/usr/share/openldap/migration/`.

**Configurer le domaine :** Modifier `migrate_common.ph`

```
$DEFAULT_BASE = "dc=istahh,dc=ma";
```

**Scripts utiles :**

| Script | Conversion |
|--------|-----------|
| `migrate_passwd.pl` | `/etc/passwd` → format LDIF |
| `migrate_group.pl` | `/etc/group` → format LDIF |
| `migrate_shadow.pl` | `/etc/shadow` → format LDIF |

---

## 13. Lab Complet — Creer, Modifier, Rechercher, Supprimer

```bash
# 1. CREER un utilisateur
cat > user.ldif << EOF
dn: uid=test,ou=Techniciens,dc=istahh,dc=ma
objectClass: inetOrgPerson
sn: Test
cn: User Test
uid: test
mail: test@istahh.ma
EOF

ldapadd -x -D "cn=admin,dc=istahh,dc=ma" -W -f user.ldif

# 2. RECHERCHER l utilisateur
ldapsearch -x -b "dc=istahh,dc=ma" "(uid=test)"

# 3. MODIFIER l email
cat > modify.ldif << EOF
dn: uid=test,ou=Techniciens,dc=istahh,dc=ma
changetype: modify
replace: mail
mail: test.nouveau@istahh.ma
EOF

ldapmodify -x -D "cn=admin,dc=istahh,dc=ma" -W -f modify.ldif

# 4. SUPPRIMER l utilisateur
ldapdelete -x -D "cn=admin,dc=istahh,dc=ma" -W \
  "uid=test,ou=Techniciens,dc=istahh,dc=ma"
```

---

## Resume general LDAP

```bash
# Installation serveur
sudo apt install slapd ldap-utils

# Ajouter
ldapadd -x -D "cn=admin,dc=DOMAINE,dc=ma" -W -f fichier.ldif

# Rechercher
ldapsearch -x -b "dc=DOMAINE,dc=ma" "(uid=NOM)"

# Modifier
ldapmodify -x -D "cn=admin,dc=DOMAINE,dc=ma" -W -f modify.ldif

# Supprimer
ldapdelete -x -D "cn=admin,dc=DOMAINE,dc=ma" -W "DN_COMPLET"

# Changer mot de passe
ldappasswd -x -D "cn=admin,dc=DOMAINE,dc=ma" -W "DN_COMPLET"

# Export complet (cote serveur)
slapcat

# Generer un mot de passe chiffre
slappasswd
```