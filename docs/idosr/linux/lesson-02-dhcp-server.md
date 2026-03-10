---
id: lesson-02
title:  DHCP SERVER
---



# Lecon 02 : Serveur DHCP (isc-dhcp-server)

---


## 1. Logique DHCP

**DHCP = attribution automatique d adresses IP aux clients.**

### Processus DORA

| Etape | Description |
|-------|-------------|
| **D** — Discover | Le client cherche un serveur DHCP (broadcast) |
| **O** — Offer | Le serveur propose une adresse IP disponible |
| **R** — Request | Le client demande officiellement l IP proposee |
| **A** — Acknowledge | Le serveur confirme et attribue l IP |

---

## 2. Installation

```bash
apt update
apt install isc-dhcp-server -y
```

---

## 3. Fichiers importants

| Chemin | Utilite / Role |
|--------|---------------|
| `/etc/dhcp/dhcpd.conf` | Fichier principal de configuration DHCP - Definit les pools d adresses IP, les plages (range), les options reseau |
| `/etc/default/isc-dhcp-server` | Fichier d options par defaut - Permet de lier le service a une interface specifique (ex: `INTERFACESv4="eth0"`), active/desactive IPv4 ou IPv6 |
| `/var/lib/dhcp/dhcpd.leases` | Base de donnees des baux actifs - Contient la liste de toutes les adresses IP attribuees (MAC address, IP assignee, date d attribution, date d expiration, hostname client) |
| `/var/log/syslog` | Journal des evenements systeme - Enregistre les logs DHCP (demarrage/arret, attribution des baux, erreurs, renouvellements, conflits) |

### Commandes associees

```bash
# Redemarrer le service DHCP
sudo systemctl restart isc-dhcp-server

# Tester la syntaxe du fichier de configuration
sudo dhcpd -t

# Surveiller les logs DHCP en temps reel
tail -f /var/log/syslog | grep dhcpd

# Verifier que le serveur ecoute sur le port 67
sudo netstat -uap | grep dhcpd
```

---

## 4. Configuration du Scope (Plage DHCP)

Editer le fichier principal :

```bash
nano /etc/dhcp/dhcpd.conf
```

### Structure typique

```bash
subnet 192.168.10.0 netmask 255.255.255.0 {
    range 192.168.10.100 192.168.10.200;
    option routers 192.168.10.1;
    option domain-name-servers 192.168.10.5;
    option domain-name "ofppt.local";
    default-lease-time 600;
    max-lease-time 7200;
}
```

**Explication des parametres :**

| Parametre | Signification |
|-----------|---------------|
| `subnet` | Adresse reseau |
| `netmask` | Masque de sous-reseau |
| `range` | Plage d IP attribuables aux clients |
| `option routers` | Passerelle par defaut envoyee aux clients |
| `option domain-name-servers` | DNS envoye aux clients |
| `option domain-name` | Nom de domaine envoye aux clients |
| `default-lease-time` | Duree du bail par defaut (en secondes) |
| `max-lease-time` | Duree maximale du bail (en secondes) |

### Reservation par adresse MAC

Pour attribuer toujours la meme IP a un client specifique :

```bash
host pc1 {
    hardware ethernet 00:11:22:33:44:55;
    fixed-address 192.168.10.50;
}
```

---

## 5. Configurer l interface DHCP

```bash
nano /etc/default/isc-dhcp-server
```

Modifier la ligne :

```
INTERFACESv4="ens33"
```

Remplacer `ens33` par le nom de votre interface (verifier avec `ip a`).

---

## 6. Demarrage et Verification du Service

```bash
# Demarrer le service
systemctl restart isc-dhcp-server

# Verifier l etat
systemctl status isc-dhcp-server
```

### Voir les baux actifs

```bash
cat /var/lib/dhcp/dhcpd.leases
```

Exemple de contenu :

```
lease 192.168.10.105 {
  starts 2 2024/01/02 08:00:00;
  ends 2 2024/01/02 08:10:00;
  hardware ethernet 08:00:27:aa:bb:cc;
  client-hostname "pc-etudiant";
}
```

### Voir les logs

```bash
journalctl -u isc-dhcp-server
tail -f /var/log/syslog
```

---

## 7. TP Pratique

**Objectif :** Configurer DHCP pour le reseau `192.168.20.0/24`

| Parametre | Valeur |
|-----------|--------|
| Reseau | 192.168.20.0/24 |
| Plage (Range) | 192.168.20.100 a 192.168.20.150 |
| Passerelle | 192.168.20.1 |
| DNS | 192.168.20.10 |
| Reservation | IP 192.168.20.50 pour MAC `08:00:27:AA:BB:CC` |

**Solution :**

```bash
subnet 192.168.20.0 netmask 255.255.255.0 {
    range 192.168.20.100 192.168.20.150;
    option routers 192.168.20.1;
    option domain-name-servers 192.168.20.10;
    default-lease-time 600;
    max-lease-time 7200;
}

host poste-reserve {
    hardware ethernet 08:00:27:AA:BB:CC;
    fixed-address 192.168.20.50;
}
```

**A savoir :**
- Adapter le `subnet` au reseau cible
- Modifier l interface dans `/etc/default/isc-dhcp-server`
- Redemarrer le service apres modification
- Verifier les leases apres connexion d un client

---

## 8. Diagnostic — Le client ne reçoit pas d IP

### Etape 1 — Verifier que le service fonctionne

```bash
systemctl status isc-dhcp-server
```

Si `inactive` → probleme de configuration.

### Etape 2 — Verifier l interface configuree

```bash
cat /etc/default/isc-dhcp-server
ip a
```

Comparer l interface dans le fichier avec celle affichee par `ip a`. Une mauvaise interface signifie que DHCP n ecoute pas.

### Etape 3 — Verifier la configuration subnet

- Meme reseau que l interface ?
- Masque correct ?
- Range valide (dans le subnet) ?
- Pas de faute de syntaxe (point-virgule manquant) ?

```bash
# Tester la syntaxe
systemctl restart isc-dhcp-server
journalctl -xe
```

### Etape 4 — Verifier le pare-feu

```bash
ufw status
```

DHCP utilise :
- **UDP 67** — serveur
- **UDP 68** — client

Autoriser si UFW est actif :

```bash
sudo ufw allow 67/udp
sudo ufw allow 68/udp
```

### Etape 5 — Verifier que le pool n est pas epuise

```bash
cat /var/lib/dhcp/dhcpd.leases
```

Si toutes les IPs de la plage sont attribuees, le client ne recevra pas d IP.

### Etape 6 — Verifier la connectivite L2

- Meme switch ?
- Meme VLAN ?
- DHCP relay bien configure si les reseaux sont differents ?

---

## 9. Erreurs frequentes en examen

| Probleme | Cause probable |
|----------|----------------|
| Service ne demarre pas | Mauvaise interface dans `/etc/default/isc-dhcp-server` |
| Client ne reçoit pas d IP | Pare-feu actif bloquant UDP 67/68 |
| Erreur de syntaxe | Point-virgule oublie dans `dhcpd.conf` |
| Pas de logs visibles | Utiliser `journalctl -u isc-dhcp-server` |

---

## Resume des fichiers et commandes

```bash
# Fichiers cles
/etc/dhcp/dhcpd.conf              # Configuration principale
/etc/default/isc-dhcp-server      # Interface d ecoute
/var/lib/dhcp/dhcpd.leases        # Baux actifs

# Commandes essentielles
systemctl restart isc-dhcp-server  # Redemarrer
systemctl status isc-dhcp-server   # Verifier l etat
sudo dhcpd -t                      # Tester la syntaxe
cat /var/lib/dhcp/dhcpd.leases     # Voir les baux
journalctl -u isc-dhcp-server      # Voir les logs
tail -f /var/log/syslog            # Surveiller les logs en direct
```