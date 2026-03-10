---
id: lesson-01
title: Configuration de Base (Ubuntu Server)
---



# Lecon 01 : Configuration de Base (Ubuntu Server)

---

## 1. Hostname

Le hostname identifie ton serveur dans le reseau. Il doit correspondre au DNS si utilise.

**Fichiers concernes :**
- `/etc/hostname`
- `/etc/hosts`

### Configurer le hostname

```bash
hostnamectl set-hostname srv1.ofppt.local
```

Modifier aussi `/etc/hosts` :

```
127.0.0.1   localhost
127.0.1.1   srv1.ofppt.local srv1
```

### Verification

```bash
hostname
hostname -f
```

---

## 2. Configuration IP Statique (Netplan)

Ubuntu Server utilise **Netplan** pour la configuration reseau.

**Fichier :** `/etc/netplan/*.yaml`

### Exemple de configuration

```yaml
network:
  version: 2
  ethernets:
    ens33:
      addresses:
        - 192.168.1.10/24
      gateway4: 192.168.1.1
      nameservers:
        addresses:
          - 8.8.8.8
```

### Commandes essentielles

```bash
ip a
ip route
nano /etc/netplan/00-installer-config.yaml
netplan apply
netplan generate
```

### Verification

```bash
ip a
ping 8.8.8.8
ping google.com
```

### Erreurs frequentes

| Erreur | Cause |
|--------|-------|
| Config non appliquee | Mauvaise indentation YAML |
| Interface non reconnue | Mauvais nom d interface (ens33 vs enp0s3) |
| Pas d effet | Oublier `netplan apply` |

---

## 3. Configuration IP via Shell

### METHODE 1 — IP Statique (temporaire)

```bash
# Ajouter une IP
sudo ip addr add 192.168.1.10/24 dev ens33

# Ajouter une deuxieme IP sur la meme interface
sudo ip addr add 192.168.1.20/24 dev ens33

# Activer l interface
sudo ip link set ens33 up

# Desactiver l interface
sudo ip link set ens33 down

# Verifier
ip a

# Configurer la passerelle par defaut
sudo ip route add default via 192.168.1.1

# Verifier
ip route

# Supprimer une passerelle
sudo ip route del default

# Flush (supprimer) une configuration IP
sudo ip addr flush dev ens33

# Supprimer toutes les routes
sudo ip route flush table main
```

### Configurer DNS (temporaire)

Le DNS se trouve dans : `/etc/resolv.conf`

```bash
# Ajouter un DNS
echo "nameserver 8.8.8.8" | sudo tee /etc/resolv.conf

# Ou editer manuellement
sudo nano /etc/resolv.conf
```

Exemple de contenu :

```
nameserver 8.8.8.8
nameserver 1.1.1.1
```

### Gestion DHCP

```bash
# Demander une IP via DHCP
sudo dhclient ens33

# Liberer une IP DHCP
sudo dhclient -r ens33

# Renouveler une IP DHCP
sudo dhclient ens33
```

### Redemarrer le service reseau

```bash
sudo systemctl restart networking
# ou
sudo netplan apply
```

> **Important :** Les commandes `ip` sont **temporaires**. Apres redemarrage, la configuration est perdue.
> Pour une configuration permanente :
> - Ubuntu → `/etc/netplan/`
> - Rocky/CentOS → `/etc/sysconfig/network-scripts/`

---

### METHODE 2 — Ubuntu avec NetworkManager (nmcli)

```bash
# Installer NetworkManager (si absent)
sudo apt update
sudo apt install network-manager -y

# Activer
sudo systemctl enable NetworkManager
sudo systemctl start NetworkManager
```

**IP Statique + Gateway + DNS :**

```bash
nmcli connection modify ens3 ipv4.method manual
nmcli connection modify ens3 ipv4.addresses 172.16.1.50/24
nmcli connection modify ens3 ipv4.gateway 172.16.1.1
nmcli connection modify ens3 ipv4.dns 172.16.1.50
nmcli connection up ens3
```

**Configurer en DHCP :**

```bash
nmcli connection modify ens3 ipv4.method auto
nmcli connection up ens3
```

**Renouveler DHCP :**

```bash
nmcli device reapply ens3
# ou
dhclient -r ens3
dhclient ens3
```

**Verification :**

```bash
ip a
ip route
cat /etc/resolv.conf
```

---

### METHODE 3 — Netplan (Recommandee)

**IP Statique + Gateway + DNS :**

```bash
sudo nano /etc/netplan/01-netcfg.yaml
```

```yaml
network:
  version: 2
  ethernets:
    ens3:
      dhcp4: no
      addresses:
        - 172.16.1.50/24
      gateway4: 172.16.1.1
      nameservers:
        addresses:
          - 172.16.1.50
```

---

## 4. SSH — Secure Shell

**Prerequis :**
- Adresse IP du serveur : `192.168.7.10`
- Acces reseau fonctionnel (ping OK)

```bash
# Verifier le service SSH
systemctl status ssh

# Installer SSH
sudo apt install ssh

# Activer SSH au demarrage
sudo systemctl enable ssh
sudo systemctl start ssh

# Connexion SSH depuis un client
ssh omar@192.168.7.10
```

### Securisation SSH (base)

Fichier de configuration : `/etc/ssh/sshd_config`

```
PermitRootLogin no
PasswordAuthentication yes
```

```bash
# Redemarrage du service apres modification
sudo systemctl restart ssh

# Verification
systemctl status ssh
```

---

## 5. Gestion Utilisateurs et Groupes

```bash
# Creer un utilisateur
adduser user1

# Ajouter au groupe sudo
usermod -aG sudo user1

# Supprimer un utilisateur
deluser user1

# Creer un groupe
groupadd admins

# Ajouter utilisateur a un groupe
usermod -aG admins user1

# Verification
id user1
groups user1
```

---

## 6. Gestion des Services (systemctl)

Tous les services passent par **systemd**.

```bash
systemctl start apache2
systemctl stop apache2
systemctl restart apache2
systemctl status apache2
systemctl enable apache2
systemctl disable apache2
```

**Diagnostic :**

```bash
journalctl -xe
journalctl -u apache2
```

> Si un service est active mais ne demarre pas, lire les logs.

---

## 7. Verification Reseau et Ports

| Commande | Description |
|----------|-------------|
| `ss -tulnp` | Affiche les sockets en ecoute (TCP/UDP) avec les processus associes |
| `ping` | Teste la connectivite reseau vers une IP ou nom d hote |
| `ip a` | Affiche les adresses IP de toutes les interfaces reseau |
| `ip route` | Affiche la table de routage du systeme |
| `netstat -tulnp` | Affiche les connexions reseau et ports ouverts (legacy) |
| `lsof -i :80` | Liste les processus utilisant le port 80 |
| `curl -I http://localhost` | Teste une connexion HTTP et affiche les en-tetes |
| `traceroute google.com` | Affiche le chemin vers une destination |
| `mtr google.com` | Combinaison de ping et traceroute |
| `iptables -L -v -n` | Liste les regles du pare-feu |
| `ufw status verbose` | Etat du pare-feu UFW |
| `hostname -I` | Affiche toutes les adresses IP de la machine |
| `dig google.com` | Interroge les serveurs DNS |
| `nslookup google.com` | Resolution DNS (legacy) |
| `ip neigh` | Affiche la table ARP |
| `ethtool eth0` | Informations de l interface reseau |
| `systemctl restart networking` | Redemarrage du service reseau |

---

## 8. Structure Systeme Importante

| Dossier | Role | Contenu typique |
|---------|------|-----------------|
| `/etc` | Fichiers de configuration | nginx/, ssh/, hosts, fstab, passwd |
| `/var/log` | Logs systeme et applications | syslog, auth.log, nginx/access.log |
| `/home` | Repertoires personnels utilisateurs | /home/username/ |
| `/srv` | Donnees des services heberges | Sites web, fichiers partages, FTP |
| `/mnt` | Montage temporaire de systemes de fichiers | Disques externes, partages reseau |
| `/bin` | Binaires essentiels | ls, cp, mv, cat, chmod |
| `/sbin` | Binaires systeme (admin) | fdisk, mkfs, ifconfig, reboot |
| `/usr` | Programmes et bibliotheques utilisateurs | /usr/bin/, /usr/lib/ |
| `/usr/local` | Logiciels installes manuellement | /usr/local/bin/, /usr/local/etc/ |
| `/opt` | Logiciels tiers optionnels | /opt/google/, /opt/lampp/ |
| `/tmp` | Fichiers temporaires (effaces au redemarrage) | Fichiers de session, caches |
| `/var` | Donnees variables (logs, spools) | /var/mail/, /var/spool/, /var/cache/ |
| `/var/www` | Racine web par defaut (Apache/Nginx) | html/, sites web |
| `/boot` | Fichiers de demarrage du systeme | Kernel (vmlinuz), GRUB, initramfs |
| `/dev` | Fichiers de peripheriques | sda, tty, null, random |
| `/root` | Repertoire du superutilisateur root | Configurations de root |

### Hierarchie FHS (Filesystem Hierarchy Standard)

- **Statique** (`/bin`, `/sbin`, `/lib`, `/usr`, `/opt`) — Lecture seule, partageable
- **Variable** (`/var`, `/tmp`, `/run`) — Ecriture frequente, locale
- **Configuration** (`/etc`) — Locale, admin uniquement
- **Home** (`/home`, `/root`) — Donnees utilisateurs

---

## Resume des commandes cles

```bash
# Hostname
hostnamectl set-hostname nom.domaine.local

# Reseau temporaire
sudo ip addr add IP/MASQUE dev INTERFACE
sudo ip route add default via PASSERELLE

# Reseau permanent
sudo nano /etc/netplan/01-netcfg.yaml
sudo netplan apply

# SSH
sudo systemctl enable ssh && sudo systemctl start ssh
ssh utilisateur@IP

# Utilisateurs
adduser NOM
usermod -aG GROUPE NOM

# Services
systemctl start|stop|restart|status|enable|disable NOM_SERVICE
```