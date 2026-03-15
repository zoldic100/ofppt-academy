import React, { useState } from "react";

const questions = [
  // --- QCM ---
  {
    id: 1,
    type: "qcm",
    question: "Que signifie l acronyme DNS ?",
    options: [
      "Domain Name System",
      "Dynamic Name Server",
      "Domain Network Service",
      "Distributed Name System",
    ],
    correct: 0,
    explanation: "DNS = Domain Name System. Il traduit les noms de domaine (www.ofppt.local) en adresses IP et vice-versa.",
  },
  {
    id: 2,
    type: "qcm",
    question: "Quel package installe le serveur DNS sur Ubuntu ?",
    options: [
      "sudo apt install dns-server -y",
      "sudo apt install named -y",
      "sudo apt install bind9 bind9utils bind9-doc -y",
      "sudo apt install bind -y",
    ],
    correct: 2,
    explanation: "Sur Ubuntu/Debian, le package s appelle bind9. Sur Fedora/Red Hat, c est bind bind-utils.",
  },
  {
    id: 3,
    type: "qcm",
    question: "Quel package installe le serveur DNS sur Fedora ?",
    options: [
      "sudo dnf install bind9 -y",
      "sudo dnf install bind bind-utils -y",
      "sudo dnf install named -y",
      "sudo dnf install dns-server -y",
    ],
    correct: 1,
    explanation: "Sur Fedora/Red Hat, le package s appelle bind et bind-utils. Sur Ubuntu c est bind9.",
  },
  {
    id: 4,
    type: "qcm",
    question: "Quel est le fichier de configuration principal DNS sur Ubuntu ?",
    options: [
      "/etc/named.conf",
      "/etc/bind/named.conf",
      "/etc/dns/named.conf",
      "/etc/bind9/named.conf",
    ],
    correct: 1,
    explanation: "Sur Ubuntu, le fichier principal est /etc/bind/named.conf. Sur Fedora/Red Hat, c est /etc/named.conf a la racine de /etc.",
  },
  {
    id: 5,
    type: "qcm",
    question: "Quel est le fichier de configuration principal DNS sur Fedora ?",
    options: [
      "/etc/bind/named.conf",
      "/etc/dns/named.conf",
      "/etc/named.conf",
      "/etc/named/named.conf",
    ],
    correct: 2,
    explanation: "Sur Fedora/Red Hat, le fichier principal est /etc/named.conf. Il integre les options ET les zones dans un seul fichier.",
  },
  {
    id: 6,
    type: "qcm",
    question: "Quel enregistrement DNS associe un nom d hote a une adresse IPv4 ?",
    options: ["CNAME", "PTR", "MX", "A"],
    correct: 3,
    explanation: "L enregistrement A (Address) associe un nom d hote a une adresse IPv4. Exemple : ns1.ofppt.local. IN A 192.168.10.1",
  },
  {
    id: 7,
    type: "qcm",
    question: "Quel enregistrement DNS permet de donner un alias a un nom d hote ?",
    options: ["A", "PTR", "CNAME", "NS"],
    correct: 2,
    explanation: "CNAME (Canonical Name) est un enregistrement alias. Exemple : www IN CNAME web.ofppt.local. permet d acceder au serveur via www.",
  },
  {
    id: 8,
    type: "qcm",
    question: "Quel enregistrement DNS se trouve dans la zone inverse et resout une IP en nom d hote ?",
    options: ["A", "PTR", "MX", "SOA"],
    correct: 1,
    explanation: "PTR (Pointer) est utilise dans la zone inverse. Il resout une adresse IP en nom d hote. Exemple : 1 IN PTR ns1.ofppt.local.",
  },
  {
    id: 9,
    type: "qcm",
    question: "Quel enregistrement DNS specifie le serveur de messagerie d un domaine ?",
    options: ["NS", "SOA", "SRV", "MX"],
    correct: 3,
    explanation: "MX (Mail eXchanger) designe le serveur de messagerie. Le nombre indique la priorite — plus il est petit, plus le serveur est prioritaire.",
  },
  {
    id: 10,
    type: "qcm",
    question: "Que represente @ dans un fichier de zone DNS ?",
    options: [
      "L adresse IP du serveur",
      "Le nom de domaine principal de la zone",
      "Le serveur de messagerie",
      "La passerelle par defaut",
    ],
    correct: 1,
    explanation: "@ represente le nom de domaine principal de la zone. @ IN NS ns1.ofppt.local. est equivalent a ofppt.local IN NS ns1.ofppt.local.",
  },
  {
    id: 11,
    type: "qcm",
    question: "Pourquoi faut-il terminer les FQDN par un point dans les fichiers de zone ?",
    options: [
      "C est une convention optionnelle",
      "Pour separer les enregistrements",
      "Pour indiquer que le nom est absolu — sans point BIND ajoute le domaine de la zone",
      "Pour activer la resolution inverse",
    ],
    correct: 2,
    explanation: "Le point final indique que le nom est absolu et complet. Sans point, BIND ajoute le domaine de la zone, ce qui donne mail.ofppt.local.ofppt.local.",
  },
  {
    id: 12,
    type: "qcm",
    question: "Que signifie $TTL dans un fichier de zone ?",
    options: [
      "La duree de validite du serveur DNS",
      "La duree pendant laquelle une reponse DNS peut etre mise en cache",
      "Le temps de transfert de zone",
      "La duree du bail DHCP",
    ],
    correct: 1,
    explanation: "$TTL (Time To Live) definit combien de temps les autres serveurs DNS ou clients peuvent garder une reponse en cache sans redemander au serveur.",
  },
  {
    id: 13,
    type: "qcm",
    question: "Quel parametre SOA permet aux serveurs secondaires de savoir si la zone a change ?",
    options: ["Refresh", "Retry", "Serial", "Expire"],
    correct: 2,
    explanation: "Serial est le numero de version de la zone. Quand il augmente, les serveurs secondaires savent qu ils doivent synchroniser leur copie.",
  },
  {
    id: 14,
    type: "qcm",
    question: "Quelle commande verifie la syntaxe du fichier named.conf ?",
    options: [
      "named-checkzone named.conf",
      "bind9 --test",
      "named-checkconf",
      "named --verify",
    ],
    correct: 2,
    explanation: "named-checkconf verifie la syntaxe du fichier de configuration principal. named-checkzone verifie un fichier de zone specifique.",
  },
  {
    id: 15,
    type: "qcm",
    question: "Quelle commande verifie la syntaxe du fichier de zone directe sur Ubuntu ?",
    options: [
      "named-checkconf /etc/bind/db.ofppt.local",
      "named-checkzone ofppt.local /etc/bind/db.ofppt.local",
      "bind9-check /etc/bind/db.ofppt.local",
      "named-verify ofppt.local",
    ],
    correct: 1,
    explanation: "named-checkzone prend deux arguments : le nom de la zone et le chemin du fichier. Elle detecte les erreurs de syntaxe avant le redemarrage.",
  },
  {
    id: 16,
    type: "qcm",
    question: "Quel est le nom du service DNS sur Ubuntu ?",
    options: ["named", "dns", "bind", "bind9"],
    correct: 3,
    explanation: "Sur Ubuntu/Debian, le service s appelle bind9. Sur Fedora/Red Hat, il s appelle named.",
  },
  {
    id: 17,
    type: "qcm",
    question: "Quel est le nom du service DNS sur Fedora ?",
    options: ["bind9", "dns", "bind", "named"],
    correct: 3,
    explanation: "Sur Fedora/Red Hat, le service s appelle named. Sur Ubuntu/Debian, il s appelle bind9.",
  },
  {
    id: 18,
    type: "qcm",
    question: "Quelle commande interroge un serveur DNS precis pour resoudre un nom ?",
    options: [
      "nslookup www.ofppt.local",
      "dig @127.0.0.1 www.ofppt.local",
      "ping www.ofppt.local",
      "host www.ofppt.local",
    ],
    correct: 1,
    explanation: "dig @127.0.0.1 www.ofppt.local interroge specificament le serveur DNS local. @127.0.0.1 indique l adresse du serveur a interroger.",
  },
  {
    id: 19,
    type: "qcm",
    question: "Dans une zone DNS, quelle directive autorise un serveur DHCP a mettre a jour les enregistrements dynamiquement ?",
    options: ["allow-transfer", "allow-query", "allow-update", "allow-recursion"],
    correct: 2,
    explanation: "allow-update autorise une adresse IP (ex: serveur DHCP) a modifier les enregistrements DNS dynamiquement. C est la base du DDNS.",
  },
  {
    id: 20,
    type: "qcm",
    question: "Dans dhcpd.conf, quelle directive active les mises a jour DNS dynamiques ?",
    options: [
      "dns-updates on",
      "ddns-updates on",
      "dynamic-dns on",
      "update-dns on",
    ],
    correct: 1,
    explanation: "ddns-updates on active le DDNS dans la configuration DHCP. Il faut aussi ajouter ddns-update-style interim et configurer la zone cible.",
  },
  // --- VRAI / FAUX ---
  {
    id: 21,
    type: "vf",
    question: "Sur Ubuntu, le fichier de configuration principal DNS est /etc/named.conf.",
    options: ["Vrai", "Faux"],
    correct: 1,
    explanation: "FAUX. Sur Ubuntu, c est /etc/bind/named.conf. /etc/named.conf est le fichier de Fedora/Red Hat.",
  },
  {
    id: 22,
    type: "vf",
    question: "L enregistrement A permet de resoudre une adresse IP en nom d hote.",
    options: ["Vrai", "Faux"],
    correct: 1,
    explanation: "FAUX. L enregistrement A fait l inverse : il associe un nom d hote a une adresse IP. La resolution inverse (IP vers nom) est faite par l enregistrement PTR.",
  },
  {
    id: 23,
    type: "vf",
    question: "Le point final dans un FQDN est obligatoire pour indiquer que le nom est absolu.",
    options: ["Vrai", "Faux"],
    correct: 0,
    explanation: "VRAI. Sans le point final, BIND considere le nom comme relatif et ajoute le domaine de la zone, ce qui cree des erreurs comme mail.ofppt.local.ofppt.local.",
  },
  {
    id: 24,
    type: "vf",
    question: "Un serveur DNS de type slave peut modifier les enregistrements de la zone.",
    options: ["Vrai", "Faux"],
    correct: 1,
    explanation: "FAUX. Un slave est en lecture seule. Seul le master peut modifier les enregistrements. Le slave copie la zone depuis le master.",
  },
  {
    id: 25,
    type: "vf",
    question: "Le parametre Serial dans le SOA doit etre incremente a chaque modification de zone.",
    options: ["Vrai", "Faux"],
    correct: 0,
    explanation: "VRAI. Si le Serial n est pas incremente, les serveurs secondaires ne detectent pas le changement et ne synchronisent pas leur copie.",
  },
  {
    id: 26,
    type: "vf",
    question: "named-checkzone verifie la syntaxe du fichier named.conf.",
    options: ["Vrai", "Faux"],
    correct: 1,
    explanation: "FAUX. named-checkzone verifie les fichiers de zone. C est named-checkconf qui verifie la syntaxe du fichier named.conf.",
  },
  {
    id: 27,
    type: "vf",
    question: "Sur Fedora, il faut configurer SELinux pour autoriser BIND a ecrire les zones.",
    options: ["Vrai", "Faux"],
    correct: 0,
    explanation: "VRAI. Sur Fedora, SELinux est actif par defaut. Il faut executer setsebool -P named_write_master_zones on pour autoriser BIND a modifier les fichiers de zone.",
  },
  {
    id: 28,
    type: "vf",
    question: "Le DDNS necessite uniquement la configuration du serveur DNS.",
    options: ["Vrai", "Faux"],
    correct: 1,
    explanation: "FAUX. Le DDNS necessite la configuration des deux services : le serveur DNS (BIND) avec allow-update ET le serveur DHCP avec ddns-updates on.",
  },
  {
    id: 29,
    type: "vf",
    question: "La cle TSIG dans le DDNS securise la communication entre DHCP et DNS.",
    options: ["Vrai", "Faux"],
    correct: 0,
    explanation: "VRAI. La cle TSIG (Transaction SIGnature) est partagee entre le serveur DHCP et le serveur DNS. Elle garantit que seul le DHCP autorise peut mettre a jour les enregistrements DNS.",
  },
  {
    id: 30,
    type: "vf",
    question: "allow-transfer dans une zone DNS autorise les mises a jour DDNS.",
    options: ["Vrai", "Faux"],
    correct: 1,
    explanation: "FAUX. allow-transfer autorise le transfert de zone vers un serveur secondaire (slave). C est allow-update qui autorise les mises a jour dynamiques DDNS.",
  },
  // --- QCM AVANCES ---
  {
    id: 31,
    type: "qcm",
    question: "Ou sont stockes les fichiers de zone sur Fedora/Red Hat ?",
    options: ["/etc/bind/", "/var/cache/bind/", "/var/named/", "/etc/named/zones/"],
    correct: 2,
    explanation: "Sur Fedora/Red Hat, les fichiers de zone sont dans /var/named/. Sur Ubuntu, ils sont dans /etc/bind/ ou /var/cache/bind/.",
  },
  {
    id: 32,
    type: "qcm",
    question: "Quelle commande effectue une resolution inverse sur l IP 192.168.10.2 ?",
    options: [
      "dig @127.0.0.1 192.168.10.2",
      "dig @127.0.0.1 -x 192.168.10.2",
      "nslookup -r 192.168.10.2",
      "dig @127.0.0.1 PTR 192.168.10.2",
    ],
    correct: 1,
    explanation: "dig -x effectue une resolution inverse. dig @127.0.0.1 -x 192.168.10.2 interroge le serveur local pour resoudre l IP en nom d hote.",
  },
  {
    id: 33,
    type: "qcm",
    question: "Dans le SOA, que definit le parametre Refresh ?",
    options: [
      "La duree de cache des reponses",
      "Le delai avant que le slave verifie les mises a jour du master",
      "Le delai avant de reessayer si le master ne repond pas",
      "La duree maximale sans contact avec le master",
    ],
    correct: 1,
    explanation: "Refresh definit a quelle frequence le serveur secondaire (slave) contacte le master pour verifier si la zone a ete modifiee.",
  },
  {
    id: 34,
    type: "qcm",
    question: "Quel type de zone DNS redirige toutes les requetes vers des serveurs DNS externes ?",
    options: ["master", "slave", "stub", "forward"],
    correct: 3,
    explanation: "Une zone de type forward redirige toutes les requetes vers les serveurs DNS specifies dans forwarders. Elle ne contient pas les enregistrements elle-meme.",
  },
  {
    id: 35,
    type: "qcm",
    question: "Que contient une zone de type stub ?",
    options: [
      "Tous les enregistrements de la zone",
      "Uniquement les enregistrements NS et SOA",
      "Uniquement les enregistrements A",
      "Une copie complete du master",
    ],
    correct: 1,
    explanation: "Une zone stub contient seulement NS + SOA — juste assez pour savoir quels serveurs sont autoritaires pour la zone, sans copier tous les enregistrements.",
  },
  {
    id: 36,
    type: "qcm",
    question: "Dans une zone DNS, que fait la directive notify yes ?",
    options: [
      "Notifie les clients quand leur IP change",
      "Active les logs de notification",
      "Notifie automatiquement les serveurs secondaires quand la zone est modifiee",
      "Envoie un email a l administrateur",
    ],
    correct: 2,
    explanation: "notify yes demande au master de notifier automatiquement les slaves quand la zone est mise a jour, declenchant une synchronisation immediate.",
  },
  {
    id: 37,
    type: "qcm",
    question: "Quel fichier Ubuntu contient la declaration des zones DNS ?",
    options: [
      "/etc/bind/named.conf",
      "/etc/bind/named.conf.options",
      "/etc/bind/named.conf.local",
      "/etc/bind/zones.conf",
    ],
    correct: 2,
    explanation: "Sur Ubuntu, /etc/bind/named.conf.local contient la declaration des zones. /etc/bind/named.conf.options contient les options globales.",
  },
  {
    id: 38,
    type: "qcm",
    question: "Dans dhcpd.conf pour le DDNS, que fait ddns-update-style interim ?",
    options: [
      "Active la mise a jour DNS toutes les heures",
      "Definit le style de mise a jour DNS utilise par le serveur DHCP",
      "Desactive les mises a jour DNS",
      "Configure le serveur DNS cible",
    ],
    correct: 1,
    explanation: "ddns-update-style interim definit le protocole de mise a jour utilise. interim est le style moderne compatible avec BIND9.",
  },
  {
    id: 39,
    type: "qcm",
    question: "Quelle commande genere une cle TSIG pour securiser le DDNS ?",
    options: [
      "openssl genkey -t HMAC-SHA256 dhcp-key",
      "tsig-keygen -a HMAC-SHA256 dhcp-key",
      "ssh-keygen -t HMAC-SHA256",
      "bind-keygen dhcp-key",
    ],
    correct: 1,
    explanation: "tsig-keygen -a HMAC-SHA256 dhcp-key genere une cle TSIG en HMAC-SHA256. Le resultat est redirige vers /etc/bind/ddns.key.",
  },
  {
    id: 40,
    type: "qcm",
    question: "Sur Fedora, quelle commande autorise BIND a ecrire dans les fichiers de zone ?",
    options: [
      "chmod 777 /var/named/",
      "setenforce 0",
      "setsebool -P named_write_master_zones on",
      "chown named:named /var/named/",
    ],
    correct: 2,
    explanation: "setsebool -P named_write_master_zones on configure SELinux pour autoriser BIND a ecrire dans les fichiers de zone. -P rend le changement permanent.",
  },
];

const LETTERS = ["A", "B", "C", "D"];

const styleId = "l03-quiz-styles";
if (typeof document !== "undefined" && !document.getElementById(styleId)) {
  const style = document.createElement("style");
  style.id = styleId;
  style.textContent = `
    .lq-wrap { padding-bottom: 40px; position: relative; }
    .lq-sticky {
      position: sticky; top: 60px; z-index: 50;
      background: var(--ifm-background-color);
      border-bottom: 2px solid var(--lq-accent, #1a3c8f);
      padding: 10px 20px;
      display: flex; align-items: center; justify-content: space-between;
      box-shadow: 0 2px 8px rgba(0,0,0,0.10);
      margin-bottom: 24px; transition: border-color 0.4s;
    }
    .lq-sticky-title { font-weight: 700; font-size: 14px; color: var(--ifm-font-color-base); }
    .lq-badge {
      border-radius: 20px; padding: 2px 10px; font-size: 12px; font-weight: 600;
      background: color-mix(in srgb, var(--lq-accent, #1a3c8f) 12%, transparent);
      color: var(--lq-accent, #1a3c8f);
      border: 1px solid color-mix(in srgb, var(--lq-accent, #1a3c8f) 30%, transparent);
    }
    .lq-progress-track { width: 100px; height: 6px; background: var(--ifm-color-emphasis-200); border-radius: 99px; overflow: hidden; }
    .lq-progress-bar { height: 100%; border-radius: 99px; background: var(--lq-accent, #1a3c8f); transition: width 0.4s ease, background 0.4s; }
    .lq-score-num { font-weight: 800; font-size: 18px; color: var(--lq-accent, #1a3c8f); min-width: 48px; text-align: right; transition: color 0.4s; }
    .lq-btn-validate { border: none; border-radius: 6px; padding: 4px 14px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
    .lq-btn-validate:disabled { background: var(--ifm-color-emphasis-200) !important; color: var(--ifm-color-emphasis-500) !important; cursor: not-allowed; }
    .lq-btn-outline { background: transparent; border: 1px solid var(--ifm-color-primary); color: var(--ifm-color-primary); border-radius: 6px; padding: 4px 14px; font-size: 12px; font-weight: 600; cursor: pointer; }
    .lq-type-badge { font-size: 10px; font-weight: 700; padding: 1px 7px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.05em; }
    .lq-type-qcm { background: color-mix(in srgb, #1a3c8f 12%, transparent); color: #1a3c8f; }
    .lq-type-vf  { background: color-mix(in srgb, #d97706 12%, transparent); color: #d97706; }
    .lq-card { border: 1px solid var(--ifm-color-emphasis-300); border-radius: 10px; padding: 18px 20px 14px; margin-bottom: 14px; background: var(--ifm-background-surface-color); transition: border-color 0.3s, background 0.3s; }
    .lq-card.correct { border-color: #16a34a55; background: color-mix(in srgb, #16a34a 6%, var(--ifm-background-surface-color)); }
    .lq-card.wrong   { border-color: #dc262655; background: color-mix(in srgb, #dc2626 6%, var(--ifm-background-surface-color)); }
    .lq-qnum { border-radius: 6px; padding: 1px 8px; font-size: 12px; font-weight: 700; flex-shrink: 0; line-height: 22px; background: color-mix(in srgb, #1a3c8f 15%, transparent); color: var(--ifm-color-primary); }
    .lq-qnum.correct { background: color-mix(in srgb, #16a34a 15%, transparent); color: #16a34a; }
    .lq-qnum.wrong   { background: color-mix(in srgb, #dc2626 15%, transparent); color: #dc2626; }
    .lq-qtext { font-weight: 600; font-size: 14px; line-height: 1.6; color: var(--ifm-font-color-base); }
    .lq-option { display: flex; align-items: center; gap: 10px; padding: 7px 10px; border-radius: 6px; cursor: pointer; transition: background 0.15s; background: transparent; }
    .lq-option:hover { background: var(--ifm-color-emphasis-100); }
    .lq-option.selected    { background: color-mix(in srgb, var(--ifm-color-primary) 10%, transparent); }
    .lq-option.opt-correct { background: color-mix(in srgb, #16a34a 10%, transparent); cursor: default; }
    .lq-option.opt-wrong   { background: color-mix(in srgb, #dc2626 10%, transparent); cursor: default; }
    .lq-option.submitted   { cursor: default; }
    .lq-option.submitted:hover { background: transparent; }
    .lq-option.opt-correct:hover { background: color-mix(in srgb, #16a34a 10%, transparent); }
    .lq-option.opt-wrong:hover   { background: color-mix(in srgb, #dc2626 10%, transparent); }
    .lq-radio { width: 18px; height: 18px; border-radius: 50%; border: 2px solid var(--ifm-color-emphasis-400); display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: border-color 0.2s; }
    .lq-radio-dot { width: 10px; height: 10px; border-radius: 50%; background: transparent; transition: background 0.2s; }
    .lq-option.selected    .lq-radio     { border-color: var(--ifm-color-primary); }
    .lq-option.selected    .lq-radio-dot { background: var(--ifm-color-primary); }
    .lq-option.opt-correct .lq-radio     { border-color: #16a34a; }
    .lq-option.opt-correct .lq-radio-dot { background: #16a34a; }
    .lq-option.opt-wrong   .lq-radio     { border-color: #dc2626; }
    .lq-option.opt-wrong   .lq-radio-dot { background: #dc2626; }
    .lq-letter { font-size: 12px; font-weight: 700; min-width: 16px; color: var(--ifm-color-emphasis-500); transition: color 0.2s; }
    .lq-option.selected    .lq-letter { color: var(--ifm-color-primary); }
    .lq-option.opt-correct .lq-letter { color: #16a34a; }
    .lq-option.opt-wrong   .lq-letter { color: #dc2626; }
    .lq-opttext { font-size: 14px; flex: 1; color: var(--ifm-font-color-base); transition: color 0.2s; }
    .lq-option.opt-correct .lq-opttext { color: #16a34a; }
    .lq-option.opt-wrong   .lq-opttext { color: #dc2626; }
    .lq-btn-hint { background: transparent; border: 1px solid var(--ifm-color-emphasis-300); color: var(--ifm-color-emphasis-600); border-radius: 6px; padding: 3px 12px; cursor: pointer; font-size: 12px; margin-top: 10px; }
    .lq-explain { margin-top: 8px; background: var(--ifm-color-emphasis-100); border: 1px solid var(--ifm-color-emphasis-300); border-left: 3px solid var(--ifm-color-primary); border-radius: 6px; padding: 10px 14px; font-size: 13px; color: var(--ifm-font-color-base); line-height: 1.7; }
    .lq-explain-label { color: var(--ifm-color-primary); font-weight: 700; }
    .lq-explain-ans   { color: #16a34a; font-weight: 700; }
    .lq-btn-submit { border: none; border-radius: 8px; padding: 11px 36px; font-size: 14px; font-weight: 700; transition: all 0.3s; cursor: pointer; display: block; margin: 8px auto 16px; }
    .lq-section-title { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--ifm-color-emphasis-500); margin: 28px 0 12px; padding-bottom: 6px; border-bottom: 1px solid var(--ifm-color-emphasis-200); }
    .lq-final { text-align: center; padding: 28px 20px; background: var(--ifm-color-emphasis-100); border-radius: 12px; margin-top: 8px; border: 1px solid var(--ifm-color-emphasis-300); }
    .lq-final-score { font-size: 44px; font-weight: 800; margin-bottom: 6px; }
    .lq-final-label { font-size: 16px; font-weight: 600; color: var(--ifm-font-color-base); margin-bottom: 4px; }
    .lq-final-msg   { font-size: 13px; color: var(--ifm-color-emphasis-600); margin-bottom: 20px; }
    .lq-btn-reset { background: var(--ifm-color-primary); border: none; color: #fff; border-radius: 8px; padding: 10px 32px; cursor: pointer; font-size: 14px; font-weight: 600; }
    .lq-score-grid { display: flex; gap: 16px; justify-content: center; margin-bottom: 16px; flex-wrap: wrap; }
    .lq-score-item { background: var(--ifm-background-surface-color); border: 1px solid var(--ifm-color-emphasis-300); border-radius: 8px; padding: 10px 20px; font-size: 13px; }
    .lq-score-item span { font-weight: 800; font-size: 20px; display: block; }
  `;
  document.head.appendChild(style);
}

const qcmQuestions = questions.filter((q) => q.type === "qcm");
const vfQuestions  = questions.filter((q) => q.type === "vf");

export default function QuizzDNS() {
  const [answers, setAnswers]     = useState({});
  const [revealed, setRevealed]   = useState({});
  const [submitted, setSubmitted] = useState(false);

  const total    = questions.length;
  const answered = Object.keys(answers).length;
  const score    = Object.entries(answers).filter(
    ([id, ans]) => questions.find((q) => q.id === parseInt(id))?.correct === ans
  ).length;

  const scoreQcm = submitted
    ? Object.entries(answers).filter(([id, ans]) => {
        const q = questions.find((q) => q.id === parseInt(id));
        return q?.type === "qcm" && q.correct === ans;
      }).length
    : 0;

  const scoreVf = submitted
    ? Object.entries(answers).filter(([id, ans]) => {
        const q = questions.find((q) => q.id === parseInt(id));
        return q?.type === "vf" && q.correct === ans;
      }).length
    : 0;

  const pct = submitted
    ? Math.round((score / total) * 100)
    : Math.round((answered / total) * 100);

  const accentColor = !submitted
    ? "#1a3c8f"
    : score / total >= 0.8
    ? "#16a34a"
    : score / total >= 0.5
    ? "#d97706"
    : "#dc2626";

  const scoreLabel = !submitted
    ? answered + "/" + total + " repondues"
    : score / total >= 0.8
    ? "Excellent !"
    : score / total >= 0.5
    ? "Bien !"
    : "A reviser";

  const handleSelect = (qId, idx) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qId]: idx }));
  };

  const handleReveal = (qId) =>
    setRevealed((prev) => ({ ...prev, [qId]: !prev[qId] }));

  const handleSubmit = () => {
    if (answered < total) return;
    setSubmitted(true);
    const all = {};
    questions.forEach((q) => { all[q.id] = true; });
    setRevealed(all);
  };

  const handleReset = () => {
    setAnswers({});
    setRevealed({});
    setSubmitted(false);
  };

  const renderQuestion = (q, qi) => {
    const userAnswer = answers[q.id];
    const isCorrect  = userAnswer === q.correct;
    const isRevealed = revealed[q.id];
    const cardClass  = "lq-card" + (submitted ? (isCorrect ? " correct" : " wrong") : "");
    const qnumClass  = "lq-qnum"  + (submitted ? (isCorrect ? " correct" : " wrong") : "");

    return (
      <div key={q.id} className={cardClass}>
        <div style={{ display: "flex", gap: 8, marginBottom: 14, alignItems: "flex-start" }}>
          <span className={qnumClass}>Q{qi + 1}</span>
          <span className={"lq-type-badge " + (q.type === "vf" ? "lq-type-vf" : "lq-type-qcm")}>
            {q.type === "vf" ? "Vrai / Faux" : "QCM"}
          </span>
          <span className="lq-qtext">{q.question}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, paddingLeft: 4 }}>
          {q.options.map((opt, idx) => {
            const isSelected = userAnswer === idx;
            const isRight    = idx === q.correct;
            let optClass = "lq-option";
            if (submitted) {
              optClass += " submitted";
              if (isRight) optClass += " opt-correct";
              else if (isSelected) optClass += " opt-wrong";
            } else if (isSelected) {
              optClass += " selected";
            }
            return (
              <div key={idx} className={optClass} onClick={() => handleSelect(q.id, idx)}>
                <div className="lq-radio"><div className="lq-radio-dot" /></div>
                <span className="lq-letter">{LETTERS[idx]}.</span>
                <span className="lq-opttext">{opt}</span>
                {submitted && isRight     && <span style={{ marginLeft: "auto", color: "#16a34a", fontWeight: 700 }}>✓</span>}
                {submitted && isSelected && !isRight && <span style={{ marginLeft: "auto", color: "#dc2626", fontWeight: 700 }}>✗</span>}
              </div>
            );
          })}
        </div>
        <div>
          {!submitted && (
            <button className="lq-btn-hint" onClick={() => handleReveal(q.id)}>
              {isRevealed ? "Masquer" : "Voir l'explication"}
            </button>
          )}
          {isRevealed && (
            <div className="lq-explain">
              <span className="lq-explain-label">Reponse : </span>
              <span className="lq-explain-ans">{LETTERS[q.correct]}</span>
              <br />
              <span>{q.explanation}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="lq-wrap" style={{ "--lq-accent": accentColor }}>
      <div className="lq-sticky">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span className="lq-sticky-title">Quiz — Serveur DNS et DDNS</span>
          <span className="lq-badge">{scoreLabel}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div className="lq-progress-track">
            <div className="lq-progress-bar" style={{ width: pct + "%" }} />
          </div>
          <span className="lq-score-num">
            {submitted ? score + "/" + total : answered + "/" + total}
          </span>
          {submitted ? (
            <button className="lq-btn-outline" onClick={handleReset}>Recommencer</button>
          ) : (
            <button
              className="lq-btn-validate"
              onClick={handleSubmit}
              disabled={answered < total}
              style={{
                background: answered === total ? accentColor : undefined,
                color: answered === total ? "#fff" : undefined,
              }}
            >
              Valider
            </button>
          )}
        </div>
      </div>

      <div className="lq-section-title">Section 1 — QCM (Questions a Choix Multiple)</div>
      {qcmQuestions.map((q, i) => renderQuestion(q, i))}

      <div className="lq-section-title">Section 2 — Vrai / Faux</div>
      {vfQuestions.map((q, i) => renderQuestion(q, qcmQuestions.length + i))}

      {!submitted && (
        <button
          className="lq-btn-submit"
          onClick={handleSubmit}
          disabled={answered < total}
          style={{
            background: answered === total ? accentColor : undefined,
            color: answered === total ? "#fff" : undefined,
          }}
        >
          {answered < total
            ? "Repondre a toutes les questions (" + answered + "/" + total + ")"
            : "Valider le quiz"}
        </button>
      )}

      {submitted && (
        <div className="lq-final">
          <div className="lq-final-score" style={{ color: accentColor }}>{score}/{total}</div>
          <div className="lq-final-label">{scoreLabel}</div>
          <div className="lq-score-grid">
            <div className="lq-score-item">
              <span style={{ color: "#1a3c8f" }}>{scoreQcm}/{qcmQuestions.length}</span>
              QCM
            </div>
            <div className="lq-score-item">
              <span style={{ color: "#d97706" }}>{scoreVf}/{vfQuestions.length}</span>
              Vrai / Faux
            </div>
          </div>
          <div className="lq-final-msg">
            {score / total >= 0.8
              ? "Vous maitrisez le serveur DNS et DDNS !"
              : score / total >= 0.5
              ? "Relisez les sections ou vous avez fait des erreurs."
              : "Recommencez apres avoir relu le cours lesson-03."}
          </div>
          <button className="lq-btn-reset" onClick={handleReset}>Recommencer</button>
        </div>
      )}
    </div>
  );
}