---
id: lesson-11
title:  Samba et nfs 
---


# Samba et NFS — Partage de Fichiers Réseau

> **Objectif :** Configurer le partage de fichiers entre Linux et Windows avec Samba, et entre systèmes Linux avec NFS.

---

## Partie 1 — Samba (Partage Windows/Linux)

### 1.1 Démons et Installation

| Démon | Ubuntu | Fedora | Rôle |
|-------|--------|--------|------|
| Partage fichiers | `smbd` | `smb` | Partage fichiers et imprimantes |
| NetBIOS | `nmbd` | `nmb` | Résolution de noms NetBIOS |

| Distribution | Commande |
|-------------|----------|
| **Ubuntu Server** | `sudo apt install samba samba-common-bin -y` |
| **Fedora** | `sudo dnf install samba samba-client samba-common -y` |

### 1.2 Fichiers principaux

| Fichier | Rôle |
|---------|------|
| `/etc/samba/smb.conf` | Fichier de configuration principal |
| `/var/lib/samba/private/` | Fichiers privés Samba (TDB, secrets) |
| `/var/log/samba/` | Logs Samba |
| `/etc/samba/smbpasswd` | Base de données des mots de passe Samba |

---

### 1.3 Configuration — `/etc/samba/smb.conf`

```bash
sudo nano /etc/samba/smb.conf
```

```ini title="/etc/samba/smb.conf"
# Section globale
[global]
    workgroup = WORKGROUP
    server string = Serveur Samba
    security = user
    map to guest = bad user

# Partage public (accessible à tous)
[public]
    comment = Partage Public
    path = /srv/samba/public
    browseable = yes
    public = yes
    read only = no
    create mask = 0777

# Partage privé (utilisateurs spécifiques)
[prive]
    comment = Partage Privé
    path = /srv/samba/prive
    browseable = yes
    valid users = said, samira
    read only = no
    create mask = 0660
```

**Paramètres importants :**

| Paramètre | Valeur | Description |
|-----------|--------|-------------|
| `security` | `user` / `share` | `user` = droits par utilisateur, `share` = droits communs |
| `path` | `/chemin` | Chemin du dossier partagé |
| `browseable` | `yes` / `no` | Visible dans le voisinage réseau |
| `public` | `yes` / `no` | Accessible à tous sans mot de passe |
| `valid users` | `said samira` | Utilisateurs autorisés |
| `invalid users` | `root` | Utilisateurs interdits |
| `read only` | `yes` / `no` | Lecture seule |
| `writeable` | `yes` / `no` | Lecture et écriture |
| `create mask` | `0644` | Permissions des fichiers créés |

---

### 1.4 Gestion des Utilisateurs Samba

:::warning Un utilisateur Samba doit exister dans Linux ET dans Samba
Créer d'abord le compte Linux avec `adduser`, puis l'ajouter à Samba avec `smbpasswd -a`.
:::

```bash
# Ajouter un utilisateur Samba
sudo smbpasswd -a said

# Activer un compte
sudo smbpasswd -e said

# Désactiver un compte
sudo smbpasswd -d said

# Supprimer un compte
sudo smbpasswd -x said

# Lister tous les utilisateurs Samba
sudo pdbedit -L
```

---

### 1.5 Démarrer et Tester

| Action | Ubuntu | Fedora |
|--------|--------|--------|
| Démarrer | `sudo systemctl start smbd nmbd` | `sudo systemctl start smb nmb` |
| Activer | `sudo systemctl enable smbd nmbd` | `sudo systemctl enable smb nmb` |
| Statut | `sudo systemctl status smbd` | `sudo systemctl status smb` |

```bash
# Vérifier la syntaxe de smb.conf
sudo testparm
```

**Fedora uniquement — SELinux :**
```bash
sudo setsebool -P samba_export_all_rw on
```

---

### 1.6 Accès Client Linux

```bash
# Lister les partages disponibles sur un serveur
smbclient -L //192.168.1.10 -U said

# Se connecter à un partage interactif
smbclient //192.168.1.10/public -U said

# Monter un partage Samba
sudo mount -t cifs //192.168.1.10/public /mnt/samba -o user=said,password=P@ss
```

**Montage permanent dans `/etc/fstab` :**

```fstab title="/etc/fstab"
//192.168.1.10/public  /mnt/samba  cifs  credentials=/etc/samba/.smbcredentials  0 0
```

```bash title="/etc/samba/.smbcredentials"
username=said
password=P@ss
```

```bash
# Sécuriser le fichier credentials
sudo chmod 600 /etc/samba/.smbcredentials
```

:::tip Fichier credentials
Ne jamais mettre le mot de passe en clair dans `/etc/fstab`. Utiliser un fichier `.smbcredentials` avec les permissions `600`.
:::

---

## Partie 2 — NFS (Network File System)

NFS est le protocole de partage de fichiers natif entre systèmes Linux/Unix.

### 2.1 Démons

| Démon | Port | Rôle |
|-------|------|------|
| `portmap` / `rpcbind` | 111 TCP/UDP | Gère les services RPC |
| `rpc.mountd` | dynamique | Gère les demandes de montage |
| `rpc.nfsd` | 2049 | Exécute les requêtes NFS (lecture/écriture) |

### 2.2 Installation

| Distribution | Serveur | Client |
|-------------|---------|--------|
| **Ubuntu** | `sudo apt install nfs-kernel-server -y` | `sudo apt install nfs-common -y` |
| **Fedora** | `sudo dnf install nfs-utils -y` | (inclus dans nfs-utils) |

### 2.3 Fichiers principaux

| Fichier | Rôle |
|---------|------|
| `/etc/exports` | Config serveur — répertoires partagés, clients et droits |
| `/etc/fstab` | Montages automatiques côté client |
| `/etc/rpc` | Correspondance numéro RPC ↔ application (NFS=100003) |
| `/var/lib/nfs/etab` | Table des exports actifs (auto-générée) |
| `/var/lib/nfs/rmtab` | Table des clients actuellement montés |

---

### 2.4 Configuration Serveur — `/etc/exports`

```bash
# Créer le répertoire partagé
sudo mkdir -p /srv/nfs/public
sudo chmod 777 /srv/nfs/public

sudo nano /etc/exports
```

```bash title="/etc/exports"
# Syntaxe : /chemin  client(options)

# Accès par hôtes spécifiques avec droits différents
/home/coursLinux   client1(rw)  client2(ro)

# Accès en lecture seule pour tout le monde
/doc               *(ro)

# Accès réseau complet avec options recommandées
/srv/nfs/public    192.168.1.0/24(rw,sync,no_subtree_check)

# Avec protection root
/home              192.168.1.0/24(rw,sync,no_subtree_check,root_squash)
```

**Options d'exports :**

| Option | Description |
|--------|-------------|
| `rw` | Lecture + écriture |
| `ro` | Lecture seule |
| `sync` | Ecriture disque avant acquittement — recommandé en production |
| `no_subtree_check` | Désactiver la vérification de sous-arborescence — meilleures performances |
| `root_squash` | root client → `nobody` (défaut — sécurisé) |
| `no_root_squash` | root client garde ses droits root sur le serveur |

:::warning root_squash vs no_root_squash
Par défaut, `root_squash` est actif — le root du client est mappé sur `nobody`. Ne jamais utiliser `no_root_squash` en production sauf cas très spécifique, cela donne un accès root complet au serveur depuis le client.
:::

---

### 2.5 Démarrer le Service Serveur

| Action | Ubuntu | Fedora |
|--------|--------|--------|
| Démarrer | `sudo systemctl start nfs-kernel-server` | `sudo systemctl start rpcbind && sudo systemctl start nfs-server` |
| Activer | `sudo systemctl enable nfs-kernel-server` | `sudo systemctl enable nfs-server` |

```bash
# Recharger les exports sans coupure
sudo exportfs -ra

# Voir les exports actifs
sudo exportfs -v
```

**Fedora uniquement — SELinux :**
```bash
sudo setsebool -P nfs_export_all_rw on
```

---

### 2.6 Configuration Client

```bash
# Voir les partages disponibles sur un serveur
showmount -e 192.168.1.10

# Créer le point de montage
sudo mkdir -p /mnt/nfs

# Monter le partage
sudo mount -t nfs 192.168.1.10:/srv/nfs/public /mnt/nfs

# Montage avec options de performance
sudo mount -t nfs -o rsize=1024,wsize=1024 server1:/Formation /Trainning

# Démonter
sudo umount /mnt/nfs
```

**Montage permanent dans `/etc/fstab` :**

```fstab title="/etc/fstab"
192.168.1.10:/srv/nfs/public  /mnt/nfs   nfs  defaults,_netdev  0 0
Server1:/formation             /Trainning  nfs  rsize=1024,wsize=1024  0 0
```

```bash
# Monter depuis fstab sans redémarrer
sudo mount /mnt/nfs
```

:::danger `_netdev` obligatoire dans fstab pour NFS
Sans `_netdev`, le système peut **bloquer au démarrage** si le réseau n'est pas encore disponible quand fstab est traité. C'est une erreur courante qui rend le système non démarrable.
:::

---

## 3. Samba vs NFS — Comparaison

| Critère | Samba | NFS |
|---------|-------|-----|
| **Compatibilité** | Linux + Windows + macOS | Linux / Unix uniquement |
| **Protocole** | SMB/CIFS | NFS (RPC) |
| **Authentification** | Par utilisateur (smbpasswd) | Par adresse IP / réseau |
| **Usage typique** | Environnements mixtes Windows/Linux | Serveurs Linux uniquement |
| **Performance** | Bonne | Excellente (moins d'overhead) |

---

## 4. Commandes de Référence

```bash
# --- Samba ---
sudo testparm                          # vérifier smb.conf
sudo smbpasswd -a <user>               # ajouter utilisateur
sudo pdbedit -L                        # lister utilisateurs
smbclient -L //<ip> -U <user>         # lister partages
sudo systemctl restart smbd nmbd       # Ubuntu
sudo systemctl restart smb nmb        # Fedora

# --- NFS Serveur ---
sudo exportfs -ra                      # recharger exports
sudo exportfs -v                       # voir exports actifs
showmount -e <ip>                      # voir partages d'un serveur

# --- NFS Client ---
sudo mount -t nfs <ip>:/chemin /mnt   # monter
sudo umount /mnt                       # démonter
sudo mount -a                          # monter tout fstab
```