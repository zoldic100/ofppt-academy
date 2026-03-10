---
id: lesson-07
title: Serveur web Appache2
---

# Apache — Serveur Web

> **Objectif :** Installer et configurer Apache comme serveur web, créer des VirtualHosts pour héberger plusieurs sites, et gérer les modules et permissions.

---

## 1. Démons et Installation

### 1.1 Démons

| Distribution | Démon |
|-------------|-------|
| **Ubuntu Server** | `apache2` |
| **Fedora** | `httpd` |

### 1.2 Installation

| Distribution | Commande |
|-------------|----------|
| **Ubuntu Server** | `sudo apt install apache2 -y` |
| **Fedora** | `sudo dnf install httpd -y` |

---

## 2. Fichiers Principaux

| Fichier / Chemin | Ubuntu | Fedora |
|-----------------|--------|--------|
| Config principale | `/etc/apache2/apache2.conf` | `/etc/httpd/conf/httpd.conf` |
| Sites disponibles | `/etc/apache2/sites-available/` | `/etc/httpd/conf.d/` |
| Sites actifs | `/etc/apache2/sites-enabled/` | `/etc/httpd/conf.d/` (même dossier) |
| Modules disponibles | `/etc/apache2/mods-available/` | `/etc/httpd/conf.modules.d/` |
| Racine web | `/var/www/html/` | `/var/www/html/` |
| Logs accès | `/var/log/apache2/access.log` | `/var/log/httpd/access_log` |
| Logs erreurs | `/var/log/apache2/error.log` | `/var/log/httpd/error_log` |

---

## 3. Créer un VirtualHost

Un **VirtualHost** permet d'héberger plusieurs sites web sur le même serveur avec des noms de domaines différents.

### 3.1 Ubuntu Server

```bash
# Créer le fichier de configuration du site
sudo nano /etc/apache2/sites-available/monsite.conf
```

```apache title="/etc/apache2/sites-available/monsite.conf"
<VirtualHost *:80>
    ServerName monsite.local
    ServerAlias www.monsite.local
    DocumentRoot /var/www/monsite
    ErrorLog ${APACHE_LOG_DIR}/monsite-error.log
    CustomLog ${APACHE_LOG_DIR}/monsite-access.log combined
</VirtualHost>
```

```bash
# Activer le site
sudo a2ensite monsite.conf
sudo systemctl reload apache2

# Désactiver un site
sudo a2dissite 000-default.conf
```

### 3.2 Fedora

```bash
sudo nano /etc/httpd/conf.d/monsite.conf
```

```apache title="/etc/httpd/conf.d/monsite.conf"
<VirtualHost *:80>
    ServerName monsite.local
    DocumentRoot /var/www/monsite
    ErrorLog /var/log/httpd/monsite-error.log
    CustomLog /var/log/httpd/monsite-access.log combined
</VirtualHost>
```

:::info Différence Ubuntu / Fedora pour les VirtualHosts
Sur **Ubuntu**, les sites sont séparés en `sites-available/` (tous les sites) et `sites-enabled/` (sites actifs via `a2ensite`).

Sur **Fedora**, tous les fichiers `.conf` dans `conf.d/` sont chargés automatiquement — pas besoin de commande d'activation.
:::

---

## 4. Créer le Répertoire Web

```bash
# Créer le dossier du site
sudo mkdir -p /var/www/monsite

# Créer une page d'accueil
echo '<h1>Bienvenue</h1>' | sudo tee /var/www/monsite/index.html

# Définir le propriétaire
sudo chown -R www-data:www-data /var/www/monsite   # Ubuntu
sudo chown -R apache:apache /var/www/monsite        # Fedora

# Définir les permissions
sudo chmod -R 755 /var/www/monsite
```

:::warning Permissions incorrectes = erreur 403
Si Apache retourne une erreur **403 Forbidden**, c'est presque toujours un problème de permissions ou de propriétaire sur le dossier web. Vérifier avec `ls -la /var/www/monsite`.
:::

---

## 5. Gérer les Modules (Ubuntu)

```bash
# Activer un module
sudo a2enmod rewrite
sudo a2enmod ssl
sudo a2enmod headers

# Désactiver un module
sudo a2dismod rewrite

# Recharger après changement de module
sudo systemctl reload apache2
```

:::tip Modules les plus utilisés
- `rewrite` : réécriture d'URL (indispensable pour WordPress, Laravel...)
- `ssl` : support HTTPS
- `headers` : manipulation des en-têtes HTTP
- `proxy` : proxy vers d'autres serveurs
:::

---

## 6. Démarrer et Tester

### 6.1 Gestion du service

| Action | Ubuntu | Fedora |
|--------|--------|--------|
| Démarrer | `sudo systemctl start apache2` | `sudo systemctl start httpd` |
| Activer | `sudo systemctl enable apache2` | `sudo systemctl enable httpd` |
| Statut | `sudo systemctl status apache2` | `sudo systemctl status httpd` |
| Recharger | `sudo systemctl reload apache2` | `sudo systemctl reload httpd` |

### 6.2 Vérifier la configuration

```bash
# Ubuntu — tester la syntaxe
sudo apache2ctl configtest

# Fedora — tester la syntaxe
sudo httpd -t
```

Résultat attendu : `Syntax OK`

### 6.3 Tester depuis le serveur

```bash
curl http://localhost
wget http://localhost -O -
```

### 6.4 SELinux (Fedora uniquement)

```bash
# Autoriser Apache à faire des connexions réseau
sudo setsebool -P httpd_can_network_connect on

# Autoriser l'accès aux fichiers dans un dossier custom
sudo chcon -R -t httpd_sys_content_t /var/www/monsite
```

:::info SELinux et Apache
Sur Fedora, **SELinux** peut bloquer Apache même si les permissions Linux sont correctes. Si le site ne s'affiche pas malgré une config correcte, vérifier les logs SELinux :
```bash
sudo ausearch -c httpd --raw | audit2why
```
:::

---

## 7. Commandes de Référence

```bash
# --- Service ---
sudo systemctl start|stop|restart|reload|status apache2   # Ubuntu
sudo systemctl start|stop|restart|reload|status httpd     # Fedora

# --- Sites (Ubuntu uniquement) ---
sudo a2ensite monsite.conf      # activer un site
sudo a2dissite monsite.conf     # désactiver un site

# --- Modules (Ubuntu uniquement) ---
sudo a2enmod rewrite            # activer un module
sudo a2dismod rewrite           # désactiver un module

# --- Tests et diagnostic ---
sudo apache2ctl configtest      # vérifier la config (Ubuntu)
sudo httpd -t                   # vérifier la config (Fedora)
curl http://localhost            # tester localement
sudo tail -f /var/log/apache2/error.log    # logs erreurs Ubuntu
sudo tail -f /var/log/httpd/error_log      # logs erreurs Fedora
```