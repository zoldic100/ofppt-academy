---
id: lesson-03
title: Serveur DNS et DDNS
sidebar_label: Serveur DNS et DDNS
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Lecon 03 : Serveur DNS et DDNS (BIND9)

---

## 1. Systeme DNS

**DNS = Domain Name System** — traduit les noms de domaine en adresses IP et vice-versa.

### Espace de noms et Zones

L espace de noms DNS est divise en **zones**. Chaque zone represente une base de donnees placee sous une autorite qui contient tout ou partie des noms et adresses des ordinateurs du reseau. Il est possible de diviser la base de donnees en plusieurs zones stockees sur un ou plusieurs serveurs DNS.

Chaque zone doit avoir :
- Un **nom** entre guillemets
- Un **type** : `hint`, `master` ou `slave`
- Un **fichier de zone** contenant les enregistrements de ressources DNS

```bash
zone "ofppt.local" IN {
    type master;
    file "ofppt.local.db";
};
```

### Types de zones

| Type | Nom | Description |
|------|-----|-------------|
| `hint` | Caching only | Memorise uniquement les adresses des serveurs DNS. Repond aux requetes en indiquant les adresses mises en cache |
| `master` | Primary master | Serveur DNS principal — base de donnees DNS en lecture et ecriture |
| `slave` | Secondary master | Serveur DNS secondaire — base de donnees DNS en lecture seule, copiee depuis le master |

---

## 2. Enregistrements DNS

Le fichier de zone contient les differents **enregistrements de ressources DNS**. Il indique a `named` comment resoudre un nom, une adresse ou un alias.

### Enregistrement A

Associe un nom d hote a une adresse IPv4.

```dns
srvunix.ofppt.local.    IN   A     192.168.10.1
ns1.ofppt.local.        IN   A     192.168.10.1
web.ofppt.local.        IN   A     192.168.10.2
```

### Enregistrement CNAME (Alias)

Donne un surnom a un nom d hote existant. Un internaute peut acceder au meme serveur via plusieurs noms.

```dns
www    IN  CNAME  web.ofppt.local.
ftp    IN  CNAME  web.ofppt.local.
```

### Enregistrement PTR

Se trouve dans la **zone inverse**. Resout une adresse IP en nom d hote.

```dns
1.10.168.192.in-addr.arpa.   IN  PTR  ns1.ofppt.local.
2.10.168.192.in-addr.arpa.   IN  PTR  web.ofppt.local.
10.10.168.192.in-addr.arpa.  IN  PTR  pc1.ofppt.local.
```

### Enregistrement NS

Specifie le nom de domaine d un serveur DNS autoritaire pour la zone.

```dns
@   IN  NS  ns1.ofppt.local.
```

> **Pourquoi NS + A ensemble ?** Le NS indique quel serveur est autoritaire pour la zone, mais les autres serveurs DNS ont besoin de l adresse IP de ce serveur pour l interroger. Sans l enregistrement A associe, le NS est inutilisable.

```dns
@    IN  NS   ns1.ofppt.local.
ns1  IN  A    192.168.10.1
```

### Enregistrement MX

Specifie le serveur de messagerie du domaine. Le nombre indique la **priorite** — plus il est petit, plus le serveur est prioritaire.

```dns
@    IN  MX  10  mail.ofppt.local.
mail IN  A       192.168.10.5
```

> **Pourquoi MX + A ensemble ?** Le MX indique quel serveur gere les emails, mais pour lui envoyer les messages il faut connaitre son adresse IP. L enregistrement A associe fournit cette adresse.

### Enregistrement SRV

Indique un service reseau offert par un hote.

```dns
_ldap._tcp.ofppt.local.  IN  SRV  0 0 389 dc1.ofppt.local.
```

### Enregistrement SOA

Start of Authority — specifie le serveur DNS ayant priorite pour repondre aux requetes. Il est obligatoire dans chaque fichier de zone.

```dns
@  IN  SOA  ns1.ofppt.local. admin.ofppt.local. (
              2024010101 ; Serial
              3600       ; Refresh
              1800       ; Retry
              604800     ; Expire
              86400 )    ; Minimum TTL
```

| Parametre | Signification | Utilite |
|-----------|--------------|---------|
| `Serial` | Numero de version de la zone | Permet aux serveurs secondaires de savoir si la zone a change |
| `Refresh` | Temps avant que le slave verifie les mises a jour | Synchronisation master vers slave |
| `Retry` | Delai avant de reessayer si le master ne repond pas | Eviter les erreurs temporaires |
| `Expire` | Duree max pendant laquelle le slave garde la zone sans contact | Securite |
| `Minimum TTL` | Duree minimale de cache des reponses negatives | Gestion du cache DNS |

---

## 3. Installation

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
sudo apt update
sudo apt install bind9 bind9utils bind9-doc -y
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
sudo dnf install bind bind-utils -y
```

</TabItem>
</Tabs>

---

## 4. Fichiers principaux

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

| Fichier | Role |
|---------|------|
| `/etc/bind/named.conf` | Configuration principale |
| `/etc/bind/named.conf.options` | Options globales (recursion, forwarders, etc.) |
| `/etc/bind/named.conf.local` | Declaration des zones |
| `/etc/bind/` ou `/var/cache/bind/` | Fichiers de zones |
| `/var/log/syslog` | Logs du service DNS |

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

| Fichier | Role |
|---------|------|
| `/etc/named.conf` | Configuration principale (options + zones integres) |
| `/var/named/` | Fichiers de zones |
| `journalctl -u named` | Logs du service DNS |

</TabItem>
</Tabs>

---

## 5. Configuration des options globales

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

Editer `/etc/bind/named.conf.options` :

```bash
sudo nano /etc/bind/named.conf.options
```

```bash
options {
    directory "/var/cache/bind";
    recursion yes;
    allow-query { any; };
    forwarders { 8.8.8.8; 1.1.1.1; };
    listen-on { any; };
    dnssec-validation auto;
};
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

Editer `/etc/named.conf` :

```bash
sudo nano /etc/named.conf
```

```bash
options {
    directory "/var/named";
    recursion yes;
    allow-query { any; };
    forwarders { 8.8.8.8; 1.1.1.1; };
    listen-on { any; };
    dnssec-validation auto;
};
```

</TabItem>
</Tabs>

| Option | Role |
|--------|------|
| `directory` | Dossier de cache de BIND |
| `recursion` | Permet de chercher les reponses sur Internet |
| `allow-query` | Definit qui peut utiliser ce serveur DNS |
| `forwarders` | DNS utilises si la reponse n est pas locale |
| `listen-on` | Interfaces reseau utilisees par le DNS |
| `dnssec-validation` | Verification de securite DNS |

---

## 6. Declaration des zones

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

Editer `/etc/bind/named.conf.local` :

```bash
sudo nano /etc/bind/named.conf.local
```

```bash
# Zone directe
zone "ofppt.local" {
    type master;
    file "/etc/bind/db.ofppt.local";
};

# Zone inverse
zone "10.168.192.in-addr.arpa" {
    type master;
    file "/etc/bind/db.192.168.10";
};
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

Editer `/etc/named.conf` (zones ajoutees a la fin) :

```bash
sudo nano /etc/named.conf
```

```bash
# Zone directe
zone "ofppt.local" {
    type master;
    file "/var/named/db.ofppt.local";
};

# Zone inverse
zone "10.168.192.in-addr.arpa" {
    type master;
    file "/var/named/db.192.168.10";
};
```

</TabItem>
</Tabs>

### Explication d une declaration de zone complete

```bash
zone "ofppt.local" IN {
    type master;
    file "ofppt.local.db";
    allow-update { 10.10.0.30; };
    allow-transfer { 10.10.0.30; };
    notify yes;
};
```

| Directive | Role |
|-----------|------|
| `type master` | Ce serveur est le DNS principal et autoritaire pour cette zone |
| `file` | Chemin du fichier contenant les enregistrements de la zone |
| `allow-update` | Autorise l adresse IP indiquee (ex: serveur DHCP) a mettre a jour la zone dynamiquement |
| `allow-transfer` | Autorise le transfert de la zone vers un serveur secondaire (slave) |
| `notify yes` | Notifie automatiquement les serveurs secondaires quand la zone est modifiee |

### Types de zones avances

**Zone slave (secondaire)**
```bash
zone "ofppt.local" {
    type slave;
    masters { 192.168.1.10; };
    file "/var/cache/bind/db.ofppt.local";
};
```
Le serveur recupere la zone depuis le master `192.168.1.10`.

**Zone forward**
```bash
zone "ofppt.local" {
    type forward;
    forwarders { 8.8.8.8; 1.1.1.1; };
};
```
Redirige toutes les requetes vers des serveurs DNS externes.

**Zone stub**
```bash
zone "ofppt.local" {
    type stub;
    masters { 192.168.1.10; };
    file "/var/cache/bind/ofppt.local.stub";
};
```
Contient uniquement NS + SOA pour localiser les serveurs autoritaires.

| Type | Contenu |
|------|---------|
| `master` | Zone complete originale (lecture/ecriture) |
| `slave` | Copie complete du master (lecture seule) |
| `stub` | Seulement NS + SOA pour localiser les serveurs |
| `forward` | Redirige les requetes DNS vers d autres serveurs |

---

## 7. Fichier de zone directe

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
sudo nano /etc/bind/db.ofppt.local
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
sudo nano /var/named/db.ofppt.local
```

</TabItem>
</Tabs>

```dns
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

> **$TTL** : duree pendant laquelle une reponse DNS peut etre mise en cache par d autres serveurs ou par les clients. Pendant ce temps, les autres DNS gardent la reponse sans redemander au serveur.

> **@** represente le nom de domaine principal de la zone. `@ IN NS ns1.ofppt.local.` signifie `ofppt.local IN NS ns1.ofppt.local.`

> **Pourquoi terminer les FQDN par un point ?** Dans les fichiers de zone, le point final indique que le nom est absolu et complet. Sans ce point, BIND ajoute automatiquement le domaine de la zone a la fin, ce qui donne des erreurs comme `mail.ofppt.local.ofppt.local`.

---

## 8. Fichier de zone inverse

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
sudo nano /etc/bind/db.192.168.10
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
sudo nano /var/named/db.192.168.10
```

</TabItem>
</Tabs>

```dns
$TTL 86400
@  IN  SOA  ns1.ofppt.local. admin.ofppt.local. (
              2024010101 3600 1800 604800 86400 )

@    IN  NS   ns1.ofppt.local.
1    IN  PTR  ns1.ofppt.local.
2    IN  PTR  web.ofppt.local.
10   IN  PTR  pc1.ofppt.local.
```

---

## 9. Demarrage et Verification

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
# Demarrer et activer le service
sudo systemctl restart bind9
sudo systemctl enable bind9

# Verifier la configuration principale
sudo named-checkconf /etc/bind/named.conf

# Verifier le fichier de zone directe
sudo named-checkzone ofppt.local /etc/bind/db.ofppt.local

# Verifier le fichier de zone inverse
sudo named-checkzone 10.168.192.in-addr.arpa /etc/bind/db.192.168.10
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
# Demarrer et activer le service
sudo systemctl restart named
sudo systemctl enable named

# SELinux — autoriser BIND a ecrire les zones
sudo setsebool -P named_write_master_zones on

# Verifier la configuration principale
sudo named-checkconf

# Verifier le fichier de zone directe
sudo named-checkzone ofppt.local /var/named/db.ofppt.local

# Verifier le fichier de zone inverse
sudo named-checkzone 10.168.192.in-addr.arpa /var/named/db.192.168.10
```

</TabItem>
</Tabs>

### Tester la resolution DNS

```bash
# Resolution directe (nom vers IP)
nslookup www.ofppt.local 127.0.0.1
dig @127.0.0.1 www.ofppt.local

# Resolution inverse (IP vers nom)
dig @127.0.0.1 -x 192.168.10.2

# Tester le serveur mail
dig @127.0.0.1 ofppt.local MX
```

> `dig @127.0.0.1 www.ofppt.local` interroge le serveur DNS local (127.0.0.1) pour resoudre `www.ofppt.local`. C est l outil de diagnostic DNS recommande.

### Pare-feu — autoriser DNS

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
sudo ufw allow 53/tcp
sudo ufw allow 53/udp
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
sudo firewall-cmd --add-service=dns --permanent
sudo firewall-cmd --reload
```

</TabItem>
</Tabs>

---

## 10. DDNS — DNS Dynamique

Le DDNS permet au serveur DHCP de mettre a jour automatiquement les enregistrements DNS quand une adresse IP est attribuee a un client.

**Prerequis :** BIND9 (named) et isc-dhcp-server (dhcpd) doivent etre installes et configures.

| Fichier | Role |
|---------|------|
| `/etc/bind/named.conf.local` | Zone avec `allow-update` pour autoriser les mises a jour dynamiques |
| `/etc/dhcp/dhcpd.conf` | DHCP configure pour envoyer les mises a jour DNS |
| `/etc/bind/ddns.key` | Cle TSIG partagee entre DHCP et DNS (version securisee) |

### Configuration DDNS sans cle TSIG (simple)

**Etape 1 — Zone DNS avec allow-update**

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
sudo nano /etc/bind/named.conf.local
```

```bash
zone "ofppt.local" {
    type master;
    file "/etc/bind/db.ofppt.local";
    allow-update { any; };
};
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
sudo nano /etc/named.conf
```

```bash
zone "ofppt.local" {
    type master;
    file "/var/named/db.ofppt.local";
    allow-update { any; };
};
```

</TabItem>
</Tabs>

**Etape 2 — DHCP configure pour envoyer les mises a jour DNS**

```bash
sudo nano /etc/dhcp/dhcpd.conf
```

```bash
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

### Configuration DDNS avec cle TSIG (securise)

```bash
# 1. Generer la cle TSIG
tsig-keygen -a HMAC-SHA256 dhcp-key > /etc/bind/ddns.key
chown bind:bind /etc/bind/ddns.key
chmod 640 /etc/bind/ddns.key

# 2. Inclure la cle dans named.conf
# Ajouter au debut de named.conf.local (Ubuntu) ou named.conf (Fedora)
include "/etc/bind/ddns.key";

# 3. Zone avec allow-update par cle
zone "ofppt.local" {
    type master;
    file "/etc/bind/db.ofppt.local";
    allow-update { key dhcp-key; };
};

# 4. DHCP avec la cle
# Dans dhcpd.conf
include "/etc/bind/ddns.key";
zone ofppt.local. {
    primary 127.0.0.1;
    key dhcp-key;
}
```

### Redemarrer les deux services apres configuration DDNS

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
sudo systemctl restart bind9
sudo systemctl restart isc-dhcp-server
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
sudo systemctl restart named
sudo systemctl restart dhcpd
```

</TabItem>
</Tabs>

---

## 11. Tableau de Reference — Commandes DNS

| Commande | Description |
|----------|-------------|
| `named-checkconf` | Verifie la syntaxe du fichier named.conf |
| `named-checkzone zone fichier` | Verifie la syntaxe d un fichier de zone |
| `dig @IP nom` | Interroge un serveur DNS precis pour resoudre un nom |
| `dig @IP -x IP` | Resolution inverse (IP vers nom) |
| `nslookup nom IP` | Resolution DNS (outil legacy) |
| `systemctl status bind9` | Etat du service DNS (Ubuntu) |
| `systemctl status named` | Etat du service DNS (Fedora) |
| `journalctl -u bind9` | Logs DNS (Ubuntu) |
| `journalctl -u named` | Logs DNS (Fedora) |

---

## Resume des fichiers et commandes

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
# Fichiers cles
/etc/bind/named.conf             # Config principale
/etc/bind/named.conf.options     # Options globales
/etc/bind/named.conf.local       # Declaration des zones
/etc/bind/db.ofppt.local         # Zone directe
/etc/bind/db.192.168.10          # Zone inverse

# Commandes essentielles
sudo systemctl restart bind9
sudo named-checkconf /etc/bind/named.conf
sudo named-checkzone ofppt.local /etc/bind/db.ofppt.local
dig @127.0.0.1 www.ofppt.local
dig @127.0.0.1 -x 192.168.10.2
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
# Fichiers cles
/etc/named.conf                  # Config principale (options + zones)
/var/named/db.ofppt.local        # Zone directe
/var/named/db.192.168.10         # Zone inverse

# Commandes essentielles
sudo systemctl restart named
sudo setsebool -P named_write_master_zones on
sudo named-checkconf
sudo named-checkzone ofppt.local /var/named/db.ofppt.local
dig @127.0.0.1 www.ofppt.local
dig @127.0.0.1 -x 192.168.10.2
```

</TabItem>
</Tabs>

---

:::tip Quiz disponible

Testez vos connaissances sur cette lecon :
[Faire le quiz →](/quizzes/linux/quizzDNS)

:::