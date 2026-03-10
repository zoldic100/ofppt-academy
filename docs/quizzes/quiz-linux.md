---
id: quiz-linux
title: Quiz OpenLDAP
sidebar_label: Quiz OpenLDAP
---

# Quiz OpenLDAP

Testez vos connaissances sur OpenLDAP.

---

## Question 1

**Que signifie LDAP ?**

- [ ] A. Linux Directory Access Protocol
- [ ] B. Lightweight Directory Access Protocol
- [ ] C. Local Data Access Protocol
- [ ] D. Lightweight Data Application Protocol

<details>
<summary>Voir la reponse</summary>

**Reponse : B**

LDAP = **Lightweight Directory Access Protocol**. C est un protocole reseau standardise pour l interrogation et la modification des services d annuaire.

</details>

---

## Question 2

**Quel demon est utilise par le serveur LDAP principal sur OpenLDAP ?**

- [ ] A. `ldapd`
- [ ] B. `slurpd`
- [ ] C. `slapd`
- [ ] D. `openldapd`

<details>
<summary>Voir la reponse</summary>

**Reponse : C**

`slapd` = **Standalone LDAP Daemon**. C est le demon principal du serveur OpenLDAP.
`slurpd` est l ancien demon de replication (secondaire).

</details>

---

## Question 3

**Qu est-ce que le DIT dans LDAP ?**

- [ ] A. Directory Information Table
- [ ] B. Data Index Tree
- [ ] C. Directory Information Tree
- [ ] D. Domain Identity Token

<details>
<summary>Voir la reponse</summary>

**Reponse : C**

DIT = **Directory Information Tree**. C est l arbre complet de l annuaire LDAP.

</details>

---

## Question 4

**Quel est le fichier de configuration du client LDAP ?**

- [ ] A. `/etc/openldap/slapd.conf`
- [ ] B. `/etc/ldap/ldap.conf`
- [ ] C. `/etc/openldap/ldapd.conf`
- [ ] D. `/etc/ldap/client.conf`

<details>
<summary>Voir la reponse</summary>

**Reponse : B**

`/etc/ldap/ldap.conf` contient la configuration du client LDAP, notamment l URI du serveur et la base DN.

Exemple :
```
URI ldap://192.168.1.10
BASE dc=istahh,dc=ma
```

</details>

---

## Question 5

**Quelle commande permet d ajouter une entree dans l annuaire LDAP ?**

- [ ] A. `ldapmodify`
- [ ] B. `ldapinsert`
- [ ] C. `ldapadd`
- [ ] D. `slapadd`

<details>
<summary>Voir la reponse</summary>

**Reponse : C**

`ldapadd` ajoute une nouvelle entree dans l annuaire a partir d un fichier LDIF.

```bash
ldapadd -x -D "cn=admin,dc=istahh,dc=ma" -W -f user.ldif
```

Note : `ldapadd` = `ldapmodify -a`

</details>

---

## Question 6

**Quel objectClass faut-il utiliser pour creer un compte Linux avec UID, GID et homeDirectory ?**

- [ ] A. `inetOrgPerson`
- [ ] B. `posixAccount`
- [ ] C. `organizationalPerson`
- [ ] D. `groupOfNames`

<details>
<summary>Voir la reponse</summary>

**Reponse : B**

`posixAccount` est l objectClass utilise pour les comptes Linux. Il necessite les attributs obligatoires : `cn`, `uid`, `uidNumber`, `gidNumber`, `homeDirectory`.

</details>

---

## Question 7

**Que represente le DN suivant ?**

```
uid=ali,ou=stagiaire,dc=istahh,dc=ma
```

- [ ] A. L utilisateur ali dans le groupe istahh
- [ ] B. L utilisateur ali dans l unite stagiaire du domaine istahh.ma
- [ ] C. L administrateur ali du domaine ma
- [ ] D. Le groupe stagiaire du serveur ali

<details>
<summary>Voir la reponse</summary>

**Reponse : B**

Le DN se lit de gauche a droite (du plus specifique au plus general) :
- `uid=ali` → l utilisateur ali (RDN)
- `ou=stagiaire` → dans l unite organisationnelle stagiaire
- `dc=istahh,dc=ma` → dans le domaine istahh.ma

</details>

---

## Question 8

**Quelle commande permet d exporter toute la base LDAP en format LDIF cote serveur ?**

- [ ] A. `ldapsearch -x -b "dc=example,dc=com"`
- [ ] B. `ldapexport`
- [ ] C. `slapcat`
- [ ] D. `ldapcat`

<details>
<summary>Voir la reponse</summary>

**Reponse : C**

`slapcat` affiche toute la base LDAP au format LDIF. C est une commande executee **cote serveur**.

```bash
slapcat
```

</details>

---

## Question 9

**Quel fichier Linux faut-il modifier pour que le systeme cherche les utilisateurs dans LDAP en plus des fichiers locaux ?**

- [ ] A. `/etc/pam.d/common-auth`
- [ ] B. `/etc/ldap/ldap.conf`
- [ ] C. `/etc/nsswitch.conf`
- [ ] D. `/etc/openldap/slapd.conf`

<details>
<summary>Voir la reponse</summary>

**Reponse : C**

`/etc/nsswitch.conf` (NSS - Name Service Switch) definit ou le systeme cherche les informations utilisateurs.

```
passwd:   files ldap
group:    files ldap
shadow:   files ldap
```

</details>

---

## Question 10

**Quelle commande permet de generer un mot de passe chiffre pour l attribut `userPassword` dans LDAP ?**

- [ ] A. `ldappasswd`
- [ ] B. `slappasswd`
- [ ] C. `openssl passwd`
- [ ] D. `passwd --ldap`

<details>
<summary>Voir la reponse</summary>

**Reponse : B**

`slappasswd` genere un hash securise pour utilisation dans `userPassword`.

```bash
slappasswd
# New password:
# Re-enter new password:
# {SSHA}QWxpTGFkYXBoYXNoZWQxMjM0NTY=
```

</details>

---

## Question 11

**Que fait NSS dans le contexte de l authentification LDAP ?**

- [ ] A. Il chiffre les mots de passe LDAP
- [ ] B. Il permet a Linux de reconnaitre les utilisateurs LDAP comme des utilisateurs locaux
- [ ] C. Il configure le serveur LDAP principal
- [ ] D. Il gere la replication entre serveurs LDAP

<details>
<summary>Voir la reponse</summary>

**Reponse : B**

NSS (Name Service Switch) permet au systeme de savoir **ou chercher** les informations utilisateurs. En ajoutant `ldap` dans `/etc/nsswitch.conf`, Linux peut reconnaitre les utilisateurs LDAP.

Test : `getent passwd nom_utilisateur`

</details>

---

## Question 12

**Quel fichier LDIF permet de modifier l email d un utilisateur existant ?**

- [ ] A.
```ldif
dn: uid=ali,ou=Techniciens,dc=istahh,dc=ma
objectClass: inetOrgPerson
mail: ali.new@istahh.ma
```
- [ ] B.
```ldif
dn: uid=ali,ou=Techniciens,dc=istahh,dc=ma
changetype: modify
replace: mail
mail: ali.new@istahh.ma
```
- [ ] C.
```ldif
dn: uid=ali,ou=Techniciens,dc=istahh,dc=ma
changetype: add
mail: ali.new@istahh.ma
```
- [ ] D.
```ldif
uid=ali
mail: ali.new@istahh.ma
```

<details>
<summary>Voir la reponse</summary>

**Reponse : B**

Pour modifier une entree existante, il faut utiliser `changetype: modify` avec l action `replace`.

La commande associee :
```bash
ldapmodify -x -D "cn=admin,dc=istahh,dc=ma" -W -f modify.ldif
```

</details>

---

## Recapitulatif des commandes essentielles

| Commande | Action |
|----------|--------|
| `ldapadd -x -D "..." -W -f fichier.ldif` | Ajouter une entree |
| `ldapdelete -x -D "..." -W "DN"` | Supprimer une entree |
| `ldapmodify -x -D "..." -W -f modify.ldif` | Modifier une entree |
| `ldapsearch -x -b "dc=..." "(uid=X)"` | Rechercher un utilisateur |
| `ldappasswd -x -D "..." -W "DN"` | Changer le mot de passe |
| `slapcat` | Exporter toute la base (serveur) |
| `slappasswd` | Generer un hash de mot de passe |

---

*Score : /12 — Bon courage !*