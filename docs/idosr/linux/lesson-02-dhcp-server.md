---
id: lesson-02
title: Serveur DHCP
sidebar_label: Serveur DHCP
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Lecon 02 : Serveur DHCP

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

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
sudo apt update
sudo apt install isc-dhcp-server -y
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
sudo dnf install dhcp-server -y
```

</TabItem>
</Tabs>

---

## 3. Fichiers importants

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

| Chemin | Utilite / Role |
|--------|---------------|
| `/etc/dhcp/dhcpd.conf` | Fichier principal de configuration DHCP |
| `/etc/default/isc-dhcp-server` | Definit l interface d ecoute (`INTERFACESv4="ens33"`) |
| `/var/lib/dhcp/dhcpd.leases` | Base de donnees des baux actifs |
| `/var/log/syslog` | Journal des evenements DHCP |

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

| Chemin | Utilite / Role |
|--------|---------------|
| `/etc/dhcp/dhcpd.conf` | Fichier principal de configuration DHCP |
| `/etc/sysconfig/dhcpd` | Definit l interface d ecoute (`DHCPDARGS=enp0s3`) |
| `/var/lib/dhcpd/dhcpd.leases` | Base de donnees des baux actifs |
| `/var/log/messages` | Journal des evenements DHCP |

</TabItem>
</Tabs>

### Commandes associees

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

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

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
# Redemarrer le service DHCP
sudo systemctl restart dhcpd

# Tester la syntaxe du fichier de configuration
sudo dhcpd -t

# Surveiller les logs DHCP en temps reel
tail -f /var/log/messages | grep dhcpd

# Verifier que le serveur ecoute sur le port 67
sudo netstat -uap | grep dhcpd
```

</TabItem>
</Tabs>

---

## 4. Configuration du Scope (Plage DHCP)

### Editer le fichier principal

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
sudo nano /etc/dhcp/dhcpd.conf
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
sudo nano /etc/dhcp/dhcpd.conf
```

</TabItem>
</Tabs>

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

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
sudo nano /etc/default/isc-dhcp-server
```

Modifier la ligne :

```
INTERFACESv4="ens33"
```

Remplacer `ens33` par le nom de votre interface (verifier avec `ip a`).

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
sudo nano /etc/sysconfig/dhcpd
```

Modifier la ligne :

```
DHCPDARGS=enp0s3
```

Remplacer `enp0s3` par le nom de votre interface (verifier avec `ip a`).

</TabItem>
</Tabs>

---

## 6. Demarrage et Verification du Service

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
# Demarrer le service
sudo systemctl restart isc-dhcp-server

# Activer au demarrage
sudo systemctl enable isc-dhcp-server

# Verifier l etat
systemctl status isc-dhcp-server
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
# Demarrer le service
sudo systemctl restart dhcpd

# Activer au demarrage
sudo systemctl enable dhcpd

# Verifier l etat
systemctl status dhcpd
```

</TabItem>
</Tabs>

### Voir les baux actifs

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
cat /var/lib/dhcp/dhcpd.leases
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
cat /var/lib/dhcpd/dhcpd.leases
```

</TabItem>
</Tabs>

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

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
journalctl -u isc-dhcp-server
tail -f /var/log/syslog
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
journalctl -u dhcpd
tail -f /var/log/messages
```

</TabItem>
</Tabs>

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
- Modifier l interface dans le fichier d options
- Redemarrer le service apres modification
- Verifier les leases apres connexion d un client

---

## 8. Diagnostic — Le client ne reçoit pas d IP

### Etape 1 — Verifier que le service fonctionne

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
systemctl status isc-dhcp-server
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
systemctl status dhcpd
```

</TabItem>
</Tabs>

Si `inactive` → probleme de configuration.

### Etape 2 — Verifier l interface configuree

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
cat /etc/default/isc-dhcp-server
ip a
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
cat /etc/sysconfig/dhcpd
ip a
```

</TabItem>
</Tabs>

Comparer l interface dans le fichier avec celle affichee par `ip a`. Une mauvaise interface signifie que DHCP n ecoute pas.

### Etape 3 — Verifier la configuration subnet

- Meme reseau que l interface ?
- Masque correct ?
- Range valide (dans le subnet) ?
- Pas de faute de syntaxe (point-virgule manquant) ?

```bash
# Tester la syntaxe
sudo dhcpd -t
```

### Etape 4 — Verifier le pare-feu

DHCP utilise :
- **UDP 67** — serveur
- **UDP 68** — client

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
ufw status

# Autoriser si UFW est actif
sudo ufw allow 67/udp
sudo ufw allow 68/udp
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
firewall-cmd --state

# Autoriser DHCP
sudo firewall-cmd --add-service=dhcp --permanent
sudo firewall-cmd --reload
```

</TabItem>
</Tabs>

### Etape 5 — Verifier que le pool n est pas epuise

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
cat /var/lib/dhcp/dhcpd.leases
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
cat /var/lib/dhcpd/dhcpd.leases
```

</TabItem>
</Tabs>

Si toutes les IPs de la plage sont attribuees, le client ne recevra pas d IP.

### Etape 6 — Verifier la connectivite L2

- Meme switch ?
- Meme VLAN ?
- DHCP relay bien configure si les reseaux sont differents ?

---

## 9. Erreurs frequentes en examen

| Probleme | Cause probable |
|----------|----------------|
| Service ne demarre pas | Mauvaise interface dans le fichier d options |
| Client ne reçoit pas d IP | Pare-feu actif bloquant UDP 67/68 |
| Erreur de syntaxe | Point-virgule oublie dans `dhcpd.conf` |
| Pas de logs visibles | Utiliser `journalctl -u isc-dhcp-server` (Ubuntu) ou `journalctl -u dhcpd` (Fedora) |

---

## Resume des fichiers et commandes

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
# Fichiers cles
/etc/dhcp/dhcpd.conf              # Configuration principale
/etc/default/isc-dhcp-server      # Interface d ecoute
/var/lib/dhcp/dhcpd.leases        # Baux actifs
/var/log/syslog                   # Logs

# Commandes essentielles
systemctl restart isc-dhcp-server  # Redemarrer
systemctl status isc-dhcp-server   # Verifier l etat
sudo dhcpd -t                      # Tester la syntaxe
cat /var/lib/dhcp/dhcpd.leases     # Voir les baux
journalctl -u isc-dhcp-server      # Voir les logs
tail -f /var/log/syslog            # Surveiller les logs en direct
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
# Fichiers cles
/etc/dhcp/dhcpd.conf              # Configuration principale
/etc/sysconfig/dhcpd              # Interface d ecoute
/var/lib/dhcpd/dhcpd.leases       # Baux actifs
/var/log/messages                 # Logs

# Commandes essentielles
systemctl restart dhcpd            # Redemarrer
systemctl status dhcpd             # Verifier l etat
sudo dhcpd -t                      # Tester la syntaxe
cat /var/lib/dhcpd/dhcpd.leases    # Voir les baux
journalctl -u dhcpd                # Voir les logs
tail -f /var/log/messages          # Surveiller les logs en direct
```

</TabItem>
</Tabs>

---

:::tip Quiz disponible

Testez vos connaissances sur cette lecon :
[Faire le quiz →](/quizzes/linux/quizzDhcp)

:::