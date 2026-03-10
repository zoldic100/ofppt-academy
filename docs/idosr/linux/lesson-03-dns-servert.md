---
id: lesson-03
title:  DNS SERVER
---



# DNS — BIND9 et DNS Dynamique (DDNS)

> **Objectif :** Installer et configurer un serveur DNS autoritaire avec BIND9, créer des zones directes et inverses, puis mettre en place le DNS dynamique (DDNS) avec DHCP.

---

## 1. Démons et Installation

### 1.1 Démons

| Distribution | Démon | Service |
|-------------|-------|---------|
| **Ubuntu Server** | `named` | `bind9` |
| **Fedora** | `named` | `named` |

### 1.2 Installation

**Ubuntu Server :**
```bash
sudo apt install bind9 bind9utils bind9-doc -y
```

**Fedora :**
```bash
sudo dnf install bind bind-utils -y
```

---

## 2. Fichiers Principaux

| Fichier | Ubuntu | Fedora |
|---------|--------|--------|
| Config principale | `/etc/bind/named.conf` | `/etc/named.conf` |
| Options | `/etc/bind/named.conf.options` | intégré dans `named.conf` |
| Zones locales | `/etc/bind/named.conf.local` | intégré dans `named.conf` |
| Zones (directe + inverse) | `/etc/bind/` ou `/var/cache/bind/` | `/var/named/` |
| Logs | `/var/log/syslog` | `journalctl -u named` |

---

## 3. Configuration

### 3.1 Fichier des options — `named.conf.options`

```bash title="/etc/bind/named.conf.options"
options {
    directory "/var/cache/bind";     // Ubuntu
    // directory "/var/named";       // Fedora

    recursion yes;
    allow-query { any; };
    forwarders { 8.8.8.8; 1.1.1.1; };
    listen-on { any; };
    dnssec-validation auto;
};
```

| Option | Rôle |
|--------|------|
| `directory` | Dossier de cache de BIND |
| `recursion` | Permet de chercher les réponses sur Internet |
| `allow-query` | Qui peut utiliser ce serveur DNS |
| `forwarders` | DNS utilisés si la réponse n'est pas locale |
| `listen-on` | Interfaces réseau utilisées par le DNS |
| `dnssec-validation` | Vérification de sécurité DNS |

---

### 3.2 Déclarer une zone — `named.conf.local`

```bash title="/etc/bind/named.conf.local"
# Zone directe
zone "ofppt.local" {
    type master;
    file "/etc/bind/db.ofppt.local";       // Ubuntu
    // file "/var/named/db.ofppt.local";   // Fedora
};

# Zone inverse
zone "10.168.192.in-addr.arpa" {
    type master;
    file "/etc/bind/db.192.168.10";
};
```

---

### 3.3 Types de zones

| Type | Description |
|------|-------------|
| `master` | Zone complète originale (serveur autoritaire) |
| `slave` | Copie complète synchronisée depuis le master |
| `stub` | Contient seulement NS + SOA pour localiser les serveurs |
| `forward` | Redirige les requêtes DNS vers d'autres serveurs |

**Zone secondaire (slave) :**
```bash
zone "ofppt.local" {
    type slave;
    masters { 192.168.1.10; };
    file "/var/cache/bind/db.ofppt.local";
};
```
Le serveur récupère la zone depuis `192.168.1.10`.

**Zone forward :**
```bash
zone "example.com" {
    type forward;
    forwarders { 8.8.8.8; 1.1.1.1; };
};
```

**Zone stub :**
```bash
zone "example.com" {
    type stub;
    masters { 192.168.1.10; };
    file "/var/cache/bind/example.com.stub";
};
```

:::info Zone Stub
Une zone stub contient seulement les informations nécessaires pour connaitre les **serveurs DNS autoritaires** d'une zone (NS + SOA uniquement). Elle ne stocke pas les enregistrements complets.
:::

---

## 4. Fichiers de Zone

### 4.1 Zone directe

```dns title="/etc/bind/db.ofppt.local"
$TTL 86400
@  IN  SOA  ns1.ofppt.local. admin.ofppt.local. (
              2024010101 ; Serial
              3600       ; Refresh
              1800       ; Retry
              604800     ; Expire
              86400 )    ; Minimum TTL

@    IN  NS   ns1.ofppt.local.
ns1  IN  A    192.168.10.1
web  IN  A    192.168.10.2
www  IN  CNAME web.ofppt.local.
ftp  IN  A    192.168.10.3
pc1  IN  A    192.168.10.10
@    IN  MX   10 mail.ofppt.local.
mail IN  A    192.168.10.5
```

:::tip Signification du MX 10
Dans `@ IN MX 10 mail.ofppt.local.`, le chiffre **10** est la priorité du serveur mail. Plus le nombre est **petit**, plus la priorité est **élevée**.
:::

---

### 4.2 Paramètres SOA

| Paramètre | Signification | Utilité |
|-----------|--------------|---------|
| **Serial** | Numéro de version de la zone | Permet aux serveurs secondaires de savoir si la zone a changé |
| **Refresh** | Temps avant que le slave vérifie les mises à jour | Synchronisation master → slave |
| **Retry** | Délai avant de réessayer si le master ne répond pas | Éviter les erreurs temporaires |
| **Expire** | Durée max pendant laquelle le slave garde la zone sans le master | Sécurité |
| **Minimum TTL** | Durée minimale de cache des réponses négatives | Gestion du cache DNS |

:::info Comprendre le TTL
`$TTL 86400` = durée (en secondes) pendant laquelle une réponse DNS peut être mise en cache par d'autres serveurs. Pendant ce temps, les autres DNS peuvent garder la réponse **sans redemander au serveur**.
:::

---

### 4.3 Symboles importants

:::note Le symbole `@`
`@` représente le **nom de domaine principal** de la zone.

Exemple : `@ IN NS ns1.ofppt.local.` signifie `ofppt.local IN NS ns1.ofppt.local.`

Donc `@` = domaine racine de la zone.
:::

:::warning Le point final dans les FQDN
Dans les fichiers de zone, terminer un FQDN par un point `.` indique que le nom est **absolu et complet**.

Sans ce point, BIND considère le nom comme **relatif** et ajoute automatiquement le domaine de la zone :
- `mail.ofppt.local.` → correct
- `mail.ofppt.local` → BIND ajoute le domaine → `mail.ofppt.local.ofppt.local` (incorrect)
:::

---

### 4.4 Zone inverse

```dns title="/etc/bind/db.192.168.10"
$TTL 86400
@  IN  SOA  ns1.ofppt.local. admin.ofppt.local. (
              2024010101 3600 1800 604800 86400 )

@   IN  NS   ns1.ofppt.local.
1   IN  PTR  ns1.ofppt.local.
2   IN  PTR  www.ofppt.local.
10  IN  PTR  pc1.ofppt.local.
```

---

### 4.5 Zone stub — exemple de fichier

```dns title="/etc/bind/ofppt.local.stub"
$TTL 86400
@ IN SOA ns1.ofppt.local. admin.ofppt.local. (
    2024010101
    3600
    1800
    604800
    86400 )

@ IN NS ns1.ofppt.local.
ns1 IN A 192.168.10.1
```

---

## 5. Démarrer et Tester

### 5.1 Démarrer le service

| Commande | Ubuntu | Fedora |
|---------|--------|--------|
| Redémarrer | `sudo systemctl restart bind9` | `sudo systemctl restart named` |
| Activer | `sudo systemctl enable bind9` | `sudo systemctl enable named` |

**Fedora uniquement — SELinux :**
```bash
sudo setsebool -P named_write_master_zones on
```

### 5.2 Vérifier la configuration

```bash
# Vérifier la syntaxe de named.conf
sudo named-checkconf /etc/bind/named.conf

# Vérifier un fichier de zone
sudo named-checkzone ofppt.local /etc/bind/db.ofppt.local
```

### 5.3 Tester la résolution

```bash
# Résolution directe avec nslookup
nslookup www.ofppt.local 127.0.0.1

# Résolution directe avec dig
dig @127.0.0.1 www.ofppt.local

# Résolution inverse avec dig
dig @127.0.0.1 -x 192.168.10.2
```

:::info Comprendre la commande dig
- `dig` : outil de diagnostic DNS (Domain Information Groper)
- `@127.0.0.1` : envoie la requête au serveur DNS **local**
- `www.ofppt.local` : le nom de domaine à résoudre
- `-x 192.168.10.2` : résolution **inverse** (IP → nom)
:::

---

## 6. DDNS — DNS Dynamique

Le **DDNS** permet au serveur DHCP de mettre à jour automatiquement les enregistrements DNS quand un client reçoit une adresse IP.

**Prérequis :** BIND9 (DNS) + ISC-DHCP-Server (DHCP) — les deux doivent être configurés ensemble.

### 6.1 Fichiers principaux DDNS

| Fichier | Rôle |
|---------|------|
| `/etc/bind/named.conf.local` | Zone avec `allow-update` pour autoriser les mises à jour dynamiques |
| `/etc/dhcp/dhcpd.conf` | DHCP configuré pour envoyer les mises à jour DNS |
| `/etc/bind/ddns.key` | Clé TSIG partagée entre DHCP et DNS (version sécurisée) |

---

### 6.2 Configuration DDNS sans clé TSIG (simple)

**Zone DNS — autoriser toutes les mises à jour :**

```bash title="/etc/bind/named.conf.local"
zone "ofppt.local" {
    type master;
    file "/etc/bind/db.ofppt.local";
    allow-update { any; };
};
```

**DHCP — activer les mises à jour DNS :**

```bash title="/etc/dhcp/dhcpd.conf"
ddns-updates on;
ddns-update-style interim;
ignore client-updates;

zone ofppt.local. {
    primary 127.0.0.1;
}

subnet 192.168.7.0 netmask 255.255.255.0 {
    range 192.168.7.100 192.168.7.200;
    option routers 192.168.7.1;
    ddns-domainname "ofppt.local.";
    ddns-rev-domainname "in-addr.arpa.";
}
```

:::warning Sécurité
`allow-update { any; }` est pratique en lab mais **dangereux en production**. N'importe qui pourrait modifier vos enregistrements DNS. Utilisez la version avec clé TSIG en production.
:::

---

### 6.3 Configuration DDNS avec clé TSIG (sécurisée)

```bash
# 1. Générer la clé TSIG
tsig-keygen -a HMAC-SHA256 dhcp-key > /etc/bind/ddns.key
chown bind:bind /etc/bind/ddns.key
chmod 640 /etc/bind/ddns.key
```

```bash title="/etc/bind/named.conf — inclure la clé"
# 2. Inclure la clé dans named.conf
include "/etc/bind/ddns.key";

# 3. Zone avec allow-update restreint par clé
zone "ofppt.local" {
    type master;
    file "/etc/bind/db.ofppt.local";
    allow-update { key dhcp-key; };
};
```

```bash title="/etc/dhcp/dhcpd.conf — avec clé TSIG"
# 4. DHCP avec la clé
include "/etc/bind/ddns.key";

zone ofppt.local. {
    primary 127.0.0.1;
    key dhcp-key;
}
```

### 6.4 Redémarrer les services DDNS

| Commande | Ubuntu | Fedora |
|---------|--------|--------|
| DNS | `sudo systemctl restart bind9` | `sudo systemctl restart named` |
| DHCP | `sudo systemctl restart isc-dhcp-server` | `sudo systemctl restart dhcpd` |

---

## 7. Commandes de Référence

```bash
# Verifier la configuration BIND
sudo named-checkconf
sudo named-checkzone <zone> <fichier>

# Tester la resolution DNS
dig @<serveur> <nom>
dig @<serveur> -x <ip>         # resolution inverse
nslookup <nom> <serveur>

# Logs DNS en temps reel
sudo tail -f /var/log/syslog | grep named

# Recharger les zones sans redemarrer
sudo rndc reload
sudo rndc reload ofppt.local   # recharger une zone specifique

# Vider le cache DNS
sudo rndc flush
```