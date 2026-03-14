---
id: lesson-01
title: Configuration de Base Linux Server
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Lecon 01 : Configuration de Base Linux

---

## 1. Hostname

Le hostname identifie ton serveur dans le reseau. Il doit correspondre au DNS si utilise.

**Fichiers concernes :**
- `/etc/hostname`
- `/etc/hosts`

### Configurer le hostname

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
hostnamectl set-hostname srv1.ofppt.local
```

Modifier aussi `/etc/hosts` :

```
127.0.0.1   localhost
127.0.1.1   srv1.ofppt.local srv1
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
hostnamectl set-hostname srv1.ofppt.local
```

Modifier aussi `/etc/hosts` :

```
127.0.0.1   localhost
127.0.1.1   srv1.ofppt.local srv1
```

</TabItem>
</Tabs>

### Verification

```bash
hostname
hostname -f
```

---

## 2. Configuration IP via nmcli (NetworkManager)

`nmcli` est l'outil en ligne de commande de NetworkManager pour gerer les connexions reseau.

### Installer NetworkManager

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
sudo apt update
sudo apt install network-manager -y

sudo systemctl enable NetworkManager
sudo systemctl start NetworkManager
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
sudo dnf install NetworkManager -y

sudo systemctl enable NetworkManager
sudo systemctl start NetworkManager
```

</TabItem>
</Tabs>

### IP Statique + Gateway + DNS

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
nmcli connection modify ens3 ipv4.method manual
nmcli connection modify ens3 ipv4.addresses 172.16.1.50/24
nmcli connection modify ens3 ipv4.gateway 172.16.1.1
nmcli connection modify ens3 ipv4.dns 8.8.8.8
nmcli connection up ens3
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
nmcli connection modify enp0s3 ipv4.method manual
nmcli connection modify enp0s3 ipv4.addresses 172.16.1.50/24
nmcli connection modify enp0s3 ipv4.gateway 172.16.1.1
nmcli connection modify enp0s3 ipv4.dns 8.8.8.8
nmcli connection up enp0s3
```
### Permissions (important)

Si les permissions sont trop ouvertes, Netplan affiche un avertissement et refuse d'appliquer la configuration :
```bash
sudo chmod 600 /etc/netplan/01-netcfg.yaml
sudo netplan apply
```
</TabItem>
</Tabs>

### Configurer en DHCP

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
nmcli connection modify ens3 ipv4.method auto
nmcli connection up ens3
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
nmcli connection modify enp0s3 ipv4.method auto
nmcli connection up enp0s3
```

</TabItem>
</Tabs>

### Renouveler DHCP

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
nmcli device reapply ens3
# ou
dhclient -r ens3
dhclient ens3
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
nmcli device reapply enp0s3
# ou
dhclient -r enp0s3
dhclient enp0s3
```

</TabItem>
</Tabs>

### Verification

> Bonne pratique : apres chaque configuration reseau, toujours configurer puis verifier.

| Commande | Verification |
|----------|-------------|
| `ip a` | Verifie que l'adresse IP est bien assignee a l'interface |
| `ip route` | Verifie que la passerelle par defaut est correcte |
| `cat /etc/resolv.conf` | Verifie que le DNS est bien configure |

## 3. Configuration IP Statique (Fichiers)

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

Ubuntu Server utilise **Netplan** pour la configuration reseau permanente.

**Fichier :** `/etc/netplan/*.yaml`

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
          - 8.8.8.8
```
### Permissions (important)

Si les permissions sont trop ouvertes, Netplan affiche un avertissement et refuse d'appliquer la configuration ondoit faire:
```bash
sudo chmod 600 /etc/netplan/01-netcfg.yaml
sudo netplan apply
```

```
Puis: 
```bash
sudo netplan generate
sudo netplan apply
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

Red Hat / Fedora utilise les fichiers dans `/etc/sysconfig/network-scripts/`.

**Fichier :** `/etc/sysconfig/network-scripts/ifcfg-enp0s3`

```bash
more /etc/sysconfig/network-scripts/ifcfg-enp0s3
```

Exemple de contenu :

```
DEVICE=enp0s3
BOOTPROTO=static
IPADDR=192.168.1.10
NETMASK=255.255.255.0
GATEWAY=192.168.1.1
DNS1=8.8.8.8
ONBOOT=yes
```

```bash
sudo chmod 600 /etc/sysconfig/network-scripts/ifcfg-eth0
sudo systemctl restart NetworkManager
```

### Permissions (important)


```bash
sudo systemctl restart network
```

</TabItem>
</Tabs>

---

## 4. Configuration IP via Shell (Temporaire)

> **Important :** Ces commandes sont temporaires. Apres redemarrage, la configuration est perdue.



<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
# Ajouter une IP
sudo ip addr add 192.168.1.10/24 dev ens3

# Activer / desactiver une interface
sudo ip link set ens3 up
sudo ip link set ens3 down

# Configurer la passerelle par defaut
sudo ip route add default via 192.168.1.1

# Supprimer une passerelle
sudo ip route del default

# Supprimer la configuration IP
sudo ip addr flush dev ens3

# Verification
ip a
ip route
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
# Ajouter une IP
sudo ip addr add 192.168.1.10/24 dev enp0s3

# Activer / desactiver une interface
sudo ip link set enp0s3 up
sudo ip link set enp0s3 down

# Configurer la passerelle par defaut
sudo ip route add default via 192.168.1.1

# Supprimer une passerelle
sudo ip route del default

# Supprimer la configuration IP
sudo ip addr flush dev enp0s3

# Verification
ip a
ip route
```

</TabItem>
</Tabs>

---

## 5. Demarrer, Arreter ou Redemarrer un Service

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

Ubuntu utilise **systemd** pour la gestion des services.

```bash
# Syntaxe generale
sudo systemctl start   nomservice
sudo systemctl stop    nomservice
sudo systemctl restart nomservice
sudo systemctl status  nomservice
sudo systemctl enable  nomservice
sudo systemctl disable nomservice

# Exemples
sudo systemctl start  apache2
sudo systemctl start  ssh
sudo systemctl restart networking
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

Red Hat / Fedora utilise aussi **systemd**, mais l'ancienne syntaxe `service` est egalement supportee.

```bash
# Ancienne syntaxe (toujours valide)
service nomservice start
service nomservice restart
service nomservice stop

# Exemples ancienne syntaxe
service network start
service named start

# Syntaxe moderne (recommandee)
sudo systemctl start   nomservice
sudo systemctl stop    nomservice
sudo systemctl restart nomservice
sudo systemctl status  nomservice
sudo systemctl enable  nomservice

# Exemples modernes
sudo systemctl start  httpd
sudo systemctl start  named
sudo systemctl restart NetworkManager
```

</TabItem>
</Tabs>

---

## 6. Gestion des Packages

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

Ubuntu utilise **apt** comme gestionnaire de packages.

```bash
# Mettre a jour la liste des packages
sudo apt update

# Installer un package
sudo apt install nompackage -y

# Desinstaller un package
sudo apt remove nompackage

# Mettre a jour un package
sudo apt upgrade nompackage

# Lister les packages installes
dpkg -l

# Verifier l existence d un package
dpkg -l | grep dhcp
# ou
apt list --installed | grep dhcp
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

Red Hat / Fedora utilise **rpm** et **dnf** comme gestionnaires de packages.

```bash
# Installer un fichier .rpm
rpm -ivh fichier.rpm

# Desinstaller un package
rpm -e nompackage

# Mettre a jour un package
rpm -uvh fichier.rpm

# Lister tous les packages installes
rpm -qa

# Verifier l existence d un package (ex: dhcp)
rpm -q dhcp

# Avec dnf (recommande)
sudo dnf install nompackage -y
sudo dnf remove nompackage
sudo dnf update nompackage
sudo dnf list installed
sudo dnf list installed | grep dhcp
```

</TabItem>
</Tabs>

---

## 7. Verification Reseau et Ports

### netstat — Statistiques reseau

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
# Installer net-tools si absent
sudo apt install net-tools -y

# Afficher la table de routage
netstat -nr

# Afficher les statistiques des interfaces
netstat -i

# Afficher les sockets actifs
netstat -an

# Afficher les applications qui ouvrent un port
netstat -anp

# Afficher ports TCP/UDP en ecoute avec processus
netstat -tulnp
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
# Installer net-tools si absent
sudo dnf install net-tools -y

# Afficher la table de routage
netstat -nr

# Afficher les statistiques des interfaces
netstat -i

# Afficher les sockets actifs
netstat -an

# Afficher les applications qui ouvrent un port
netstat -anp

# Afficher ports TCP/UDP en ecoute avec processus
netstat -tulnp
```

</TabItem>
</Tabs>

### ARP — Table de correspondance IP/MAC

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
# Afficher la table ARP
arp -a

# Equivalent moderne
ip neigh
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
# Afficher la table ARP
arp -a

# Equivalent moderne
ip neigh
```

</TabItem>
</Tabs>

### nmap — Scanner de ports

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
# Installer nmap
sudo apt install nmap -y

# Scanner les ports TCP actifs
nmap -sT 192.168.1.1

# Tester un port specifique (ex: port 22)
nmap -p 22 192.168.1.1

# Scanner tous les ports
nmap -p- 192.168.1.1

# Scanner le reseau local
nmap 192.168.1.0/24
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
# Installer nmap
sudo dnf install nmap -y

# Scanner les ports TCP actifs
nmap -sT 192.168.1.1

# Tester un port specifique (ex: port 22)
nmap -p 22 192.168.1.1

# Scanner tous les ports
nmap -p- 192.168.1.1

# Scanner le reseau local
nmap 192.168.1.0/24
```

</TabItem>
</Tabs>
---
## 8. SSH — Secure Shell

**SSH (Secure Shell)** est un protocole de communication securise qui remplace les anciens protocoles non chiffres.

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">
```bash
# Installer SSH
sudo apt install openssh-server -y

# Activer et demarrer SSH
sudo systemctl enable ssh
sudo systemctl start ssh

# Verifier le statut
systemctl status ssh

# Connexion depuis un client
ssh omar@192.168.7.10
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">
```bash
# Installer SSH
sudo dnf install openssh-server -y

# Activer et demarrer SSH
sudo systemctl enable sshd
sudo systemctl start sshd

# Verifier le statut
systemctl status sshd

# Connexion depuis un client
ssh omar@192.168.7.10
```
</TabItem>
</Tabs>

### Commandes SSH et leurs rôles
| Commande | Role | Remplace |
|----------|------|---------|
| `sshd` | Demon SSH — logiciel serveur actif sur le port TCP 22 | — |
| `ssh` | Connexion et execution de commandes a distance | `rlogin`, `rsh` |
| `scp` | Copier un fichier a distance de maniere securisee | `rcp` |
| `ssh-keygen` | Generer un couple de cles publique/privee (RSA ou DSA) | — |

### Exemples scp
```bash
# Copier un fichier local vers un serveur distant
scp fichier.txt omar@192.168.7.10:/home/omar/

# Copier un fichier distant vers la machine locale
scp omar@192.168.7.10:/home/omar/fichier.txt /tmp/

# Copier un dossier entier (recursif)
scp -r dossier/ omar@192.168.7.10:/home/omar/
```

### Authentification par cles (cryptage asymetrique RSA/DSA)

SSH supporte deux methodes d authentification :
- **Mot de passe** — simple mais moins securise
- **Cle publique/privee** — plus securise, sans mot de passe

**Principe du cryptage asymetrique :**
```
Etape 1 : Le client SSH genere un couple de cles publique/privee
          ssh-keygen -t rsa

Etape 2 : Le client transfert sa cle publique vers le serveur SSH
          ssh-copy-id omar@192.168.7.10

Etape 3 : Le client se connecte — le serveur verifie la cle publique
          ssh omar@192.168.7.10
          (connexion sans mot de passe)
```
```bash
# Generer un couple de cles RSA
ssh-keygen -t rsa -b 4096

# Les cles sont stockees dans
# ~/.ssh/id_rsa        <- cle privee (ne jamais partager)
# ~/.ssh/id_rsa.pub    <- cle publique (a copier sur le serveur)

# Copier la cle publique sur le serveur
ssh-copy-id omar@192.168.7.10

# Se connecter sans mot de passe
ssh omar@192.168.7.10
```

> **Important :** La cle privee ne doit jamais quitter la machine cliente. Seule la cle publique est copiee sur le serveur dans `~/.ssh/authorized_keys`.





### Securisation SSH (base)

Fichier de configuration : `/etc/ssh/sshd_config`
```
PermitRootLogin no
PasswordAuthentication yes
```

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">
```bash
sudo systemctl restart ssh
systemctl status ssh
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">
```bash
sudo systemctl restart sshd
systemctl status sshd
```

</TabItem>
</Tabs>

---



## 9. Gestion Utilisateurs et Groupes

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

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

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
# Creer un utilisateur
useradd user1
passwd user1

# Ajouter au groupe wheel (equivalent sudo)
usermod -aG wheel user1

# Supprimer un utilisateur
userdel user1

# Creer un groupe
groupadd admins

# Ajouter utilisateur a un groupe
usermod -aG admins user1

# Verification
id user1
groups user1
```

</TabItem>
</Tabs>

---

## 10. Tableau de Reference — Commandes Reseau

| Commande | Description | Equivalent Windows |
|----------|-------------|-------------------|
| `ifconfig` | Parametres reseau des interfaces | `ipconfig` |
| `route` / `route -n` | Table de routage | `route print` |
| `netstat -nr` | Table de routage via netstat | `route print` |
| `netstat -i` | Statistiques des interfaces | - |
| `netstat -an` | Sockets actifs | `netstat -an` |
| `netstat -anp` | Applications qui ouvrent un port | `netstat -b` |
| `arp -a` | Table ARP | `arp -a` |
| `nmap -sT IP` | Ports TCP actifs | - |
| `nmap -p 22 IP` | Tester un port specifique | - |
| `ip a` | Adresses IP (moderne) | `ipconfig` |
| `ip route` | Table de routage (moderne) | `route print` |
| `ip neigh` | Table ARP (moderne) | `arp -a` |
| `ss -tulnp` | Ports en ecoute (moderne) | `netstat -an` |
| `ping` | Test connectivite | `ping` |
| `traceroute` | Chemin vers destination | `tracert` |

---


## Resume des commandes cles

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
# Hostname
hostnamectl set-hostname nom.domaine.local

# Reseau temporaire
sudo ip addr add IP/MASQUE dev INTERFACE
sudo ip route add default via PASSERELLE

# Reseau permanent (Netplan)
sudo nano /etc/netplan/01-netcfg.yaml
sudo netplan apply

# nmcli
nmcli connection modify ens3 ipv4.method manual
nmcli connection modify ens3 ipv4.addresses IP/MASQUE
nmcli connection up ens3

# SSH
sudo systemctl enable ssh && sudo systemctl start ssh
ssh utilisateur@IP

# Packages
sudo apt install nompackage -y
sudo apt remove nompackage

# Services
sudo systemctl start|stop|restart|status|enable|disable NOM_SERVICE

# Diagnostic reseau
ifconfig
route -n
netstat -an
netstat -anp
arp -a
nmap -sT IP
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
# Hostname
hostnamectl set-hostname nom.domaine.local

# Reseau temporaire
sudo ip addr add IP/MASQUE dev INTERFACE
sudo ip route add default via PASSERELLE

# Reseau permanent
more /etc/sysconfig/network-scripts/ifcfg-enp0s3
sudo nano /etc/sysconfig/network-scripts/ifcfg-enp0s3
sudo systemctl restart network

# nmcli
nmcli connection modify enp0s3 ipv4.method manual
nmcli connection modify enp0s3 ipv4.addresses IP/MASQUE
nmcli connection up enp0s3

# SSH
sudo systemctl enable sshd && sudo systemctl start sshd
ssh utilisateur@IP

# Packages
rpm -ivh fichier.rpm
rpm -e nompackage
rpm -uvh fichier.rpm
rpm -qa
rpm -q dhcp
sudo dnf install nompackage -y

# Services
service nomservice start|restart|stop
sudo systemctl start|stop|restart|status|enable|disable NOM_SERVICE

# Diagnostic reseau
ifconfig
route -n
netstat -an
netstat -anp
arp -a
nmap -sT IP
```

</TabItem>
</Tabs>

:::tip Quiz disponible

Testez vos connaissances sur cette lecon :
[Faire le quiz →](/quizzes/linux/ConfigurationDeBaseLinuxServer)

:::