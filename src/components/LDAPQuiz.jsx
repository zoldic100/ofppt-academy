import React, { useState } from "react";

const questions = [
  {
    id: 1,
    question: "Que signifie LDAP ?",
    options: [
      "Linux Directory Access Protocol",
      "Lightweight Directory Access Protocol",
      "Local Data Access Protocol",
      "Lightweight Data Application Protocol",
    ],
    correct: 1,
    explanation:
      "LDAP = Lightweight Directory Access Protocol. C'est un protocole réseau standardisé pour l'interrogation et la modification des services d'annuaire.",
  },
  {
    id: 2,
    question: "Quel démon est utilisé par le serveur LDAP principal sur OpenLDAP ?",
    options: ["ldapd", "slurpd", "slapd", "openldapd"],
    correct: 2,
    explanation:
      "slapd = Standalone LDAP Daemon. C'est le démon principal du serveur OpenLDAP. slurpd est l'ancien démon de réplication (secondaire).",
  },
  {
    id: 3,
    question: "Qu'est-ce que le DIT dans LDAP ?",
    options: [
      "Directory Information Table",
      "Data Index Tree",
      "Directory Information Tree",
      "Domain Identity Token",
    ],
    correct: 2,
    explanation:
      "DIT = Directory Information Tree. C'est l'arbre complet de l'annuaire LDAP. Chaque élément s'appelle une entrée (DSE).",
  },
  {
    id: 4,
    question: "Quel est le fichier de configuration du client LDAP ?",
    options: [
      "/etc/openldap/slapd.conf",
      "/etc/ldap/ldap.conf",
      "/etc/openldap/ldapd.conf",
      "/etc/ldap/client.conf",
    ],
    correct: 1,
    explanation:
      "/etc/ldap/ldap.conf contient la configuration du client LDAP (URI du serveur et BASE DN).",
  },
  {
    id: 5,
    question: "Quelle commande permet d'ajouter une entrée dans l'annuaire LDAP ?",
    options: ["ldapmodify", "ldapinsert", "ldapadd", "slapadd"],
    correct: 2,
    explanation:
      "ldapadd ajoute une nouvelle entrée à partir d'un fichier LDIF.\nNote : ldapadd = ldapmodify -a",
  },
  {
    id: 6,
    question:
      "Quel objectClass faut-il utiliser pour créer un compte Linux avec UID, GID et homeDirectory ?",
    options: [
      "inetOrgPerson",
      "posixAccount",
      "organizationalPerson",
      "groupOfNames",
    ],
    correct: 1,
    explanation:
      "posixAccount est l'objectClass pour les comptes Linux. Attributs obligatoires : cn, uid, uidNumber, gidNumber, homeDirectory.",
  },
  {
    id: 7,
    question: "Que représente le DN : uid=ali,ou=stagiaire,dc=istahh,dc=ma ?",
    options: [
      "L'utilisateur ali dans le groupe istahh",
      "L'utilisateur ali dans l'unité stagiaire du domaine istahh.ma",
      "L'administrateur ali du domaine ma",
      "Le groupe stagiaire du serveur ali",
    ],
    correct: 1,
    explanation:
      "uid=ali → l'utilisateur ali (RDN)\nou=stagiaire → dans l'unité organisationnelle\ndc=istahh,dc=ma → dans le domaine istahh.ma",
  },
  {
    id: 8,
    question: "Quelle commande exporte toute la base LDAP en format LDIF côté serveur ?",
    options: [
      "ldapsearch -x -b dc=example,dc=com",
      "ldapexport",
      "slapcat",
      "ldapcat",
    ],
    correct: 2,
    explanation:
      "slapcat affiche toute la base LDAP au format LDIF. C'est une commande exécutée côté serveur uniquement.",
  },
  {
    id: 9,
    question:
      "Quel fichier modifier pour que Linux cherche les utilisateurs dans LDAP en plus des fichiers locaux ?",
    options: [
      "/etc/pam.d/common-auth",
      "/etc/ldap/ldap.conf",
      "/etc/nsswitch.conf",
      "/etc/openldap/slapd.conf",
    ],
    correct: 2,
    explanation:
      "/etc/nsswitch.conf (NSS) définit où chercher les infos utilisateurs.\nExemple : passwd: files ldap",
  },
  {
    id: 10,
    question: "Quelle commande génère un mot de passe chiffré pour userPassword dans LDAP ?",
    options: ["ldappasswd", "slappasswd", "openssl passwd", "passwd --ldap"],
    correct: 1,
    explanation:
      "slappasswd génère un hash sécurisé {SSHA} pour l'attribut userPassword. En production, on ne met jamais un mot de passe en clair.",
  },
  {
    id: 11,
    question: "Que fait NSS dans le contexte de l'authentification LDAP ?",
    options: [
      "Il chiffre les mots de passe LDAP",
      "Il permet à Linux de reconnaître les utilisateurs LDAP comme locaux",
      "Il configure le serveur LDAP principal",
      "Il gère la réplication entre serveurs LDAP",
    ],
    correct: 1,
    explanation:
      "NSS (Name Service Switch) indique au système où chercher les informations utilisateurs. Avec ldap dans nsswitch.conf, Linux reconnaît les utilisateurs LDAP.",
  },
  {
    id: 12,
    question:
      "Quel est le changetype correct pour modifier un attribut existant dans un fichier LDIF ?",
    options: [
      "changetype: add",
      "changetype: modify",
      "changetype: replace",
      "changetype: update",
    ],
    correct: 1,
    explanation:
      "changetype: modify est utilisé pour modifier une entrée existante, combiné avec replace:, add: ou delete: selon l'action souhaitée.",
  },
];

const LETTERS = ["A", "B", "C", "D"];

// Inject global CSS once for dark mode support
const styleId = "ldap-quiz-styles";
if (typeof document !== "undefined" && !document.getElementById(styleId)) {
  const style = document.createElement("style");
  style.id = styleId;
  style.textContent = `
    .lq-wrap { padding-bottom: 40px; position: relative; }

    /* ── STICKY BAR ── */
    .lq-sticky {
      position: sticky;
      top: 60px;
      z-index: 50;
      background: var(--ifm-background-color);
      border-bottom: 2px solid var(--lq-accent, #1a3c8f);
      padding: 10px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 2px 8px rgba(0,0,0,0.10);
      margin-bottom: 24px;
      transition: border-color 0.4s;
    }
    .lq-sticky-title { font-weight: 700; font-size: 14px; color: var(--ifm-font-color-base); }
    .lq-badge {
      border-radius: 20px;
      padding: 2px 10px;
      font-size: 12px;
      font-weight: 600;
      background: color-mix(in srgb, var(--lq-accent, #1a3c8f) 12%, transparent);
      color: var(--lq-accent, #1a3c8f);
      border: 1px solid color-mix(in srgb, var(--lq-accent, #1a3c8f) 30%, transparent);
    }
    .lq-progress-track {
      width: 100px; height: 6px;
      background: var(--ifm-color-emphasis-200);
      border-radius: 99px; overflow: hidden;
    }
    .lq-progress-bar {
      height: 100%; border-radius: 99px;
      background: var(--lq-accent, #1a3c8f);
      transition: width 0.4s ease, background 0.4s;
    }
    .lq-score-num {
      font-weight: 800; font-size: 18px;
      color: var(--lq-accent, #1a3c8f);
      min-width: 48px; text-align: right;
      transition: color 0.4s;
    }
    .lq-btn-validate {
      border: none; border-radius: 6px;
      padding: 4px 14px; font-size: 12px; font-weight: 600;
      cursor: pointer; transition: all 0.2s;
    }
    .lq-btn-validate:disabled {
      background: var(--ifm-color-emphasis-200) !important;
      color: var(--ifm-color-emphasis-500) !important;
      cursor: not-allowed;
    }
    .lq-btn-outline {
      background: transparent;
      border: 1px solid var(--ifm-color-primary);
      color: var(--ifm-color-primary);
      border-radius: 6px; padding: 4px 14px;
      font-size: 12px; font-weight: 600; cursor: pointer;
    }

    /* ── QUESTION CARD ── */
    .lq-card {
      border: 1px solid var(--ifm-color-emphasis-300);
      border-radius: 10px;
      padding: 18px 20px 14px;
      margin-bottom: 14px;
      background: var(--ifm-background-surface-color);
      transition: border-color 0.3s, background 0.3s;
    }
    .lq-card.correct {
      border-color: #16a34a55;
      background: color-mix(in srgb, #16a34a 6%, var(--ifm-background-surface-color));
    }
    .lq-card.wrong {
      border-color: #dc262655;
      background: color-mix(in srgb, #dc2626 6%, var(--ifm-background-surface-color));
    }

    /* Q badge */
    .lq-qnum {
      border-radius: 6px; padding: 1px 8px;
      font-size: 12px; font-weight: 700; flex-shrink: 0; line-height: 22px;
      background: color-mix(in srgb, #1a3c8f 15%, transparent);
      color: var(--ifm-color-primary);
    }
    .lq-qnum.correct { background: color-mix(in srgb, #16a34a 15%, transparent); color: #16a34a; }
    .lq-qnum.wrong   { background: color-mix(in srgb, #dc2626 15%, transparent); color: #dc2626; }
    .lq-qtext { font-weight: 600; font-size: 14px; line-height: 1.6; color: var(--ifm-font-color-base); }

    /* ── RADIO OPTION ── */
    .lq-option {
      display: flex; align-items: center; gap: 10px;
      padding: 7px 10px; border-radius: 6px;
      cursor: pointer; transition: background 0.15s;
      background: transparent;
    }
    .lq-option:hover { background: var(--ifm-color-emphasis-100); }
    .lq-option.selected { background: color-mix(in srgb, var(--ifm-color-primary) 10%, transparent); }
    .lq-option.opt-correct { background: color-mix(in srgb, #16a34a 10%, transparent); cursor: default; }
    .lq-option.opt-wrong   { background: color-mix(in srgb, #dc2626 10%, transparent); cursor: default; }
    .lq-option.submitted   { cursor: default; }
    .lq-option.submitted:hover { background: transparent; }
    .lq-option.opt-correct:hover { background: color-mix(in srgb, #16a34a 10%, transparent); }
    .lq-option.opt-wrong:hover   { background: color-mix(in srgb, #dc2626 10%, transparent); }

    /* Radio circle */
    .lq-radio {
      width: 18px; height: 18px; border-radius: 50%;
      border: 2px solid var(--ifm-color-emphasis-400);
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; transition: border-color 0.2s;
    }
    .lq-radio-dot {
      width: 18px; height: 18px; border-radius: 50%;
      background: transparent; transition: background 0.2s;
    }
    .lq-option.selected  .lq-radio     { border-color: var(--ifm-color-primary); }
    .lq-option.selected  .lq-radio-dot { background: var(--ifm-color-primary); }
    .lq-option.opt-correct .lq-radio     { border-color: #16a34a; }
    .lq-option.opt-correct .lq-radio-dot { background: #16a34a; }
    .lq-option.opt-wrong   .lq-radio     { border-color: #dc2626; }
    .lq-option.opt-wrong   .lq-radio-dot { background: #dc2626; }

    /* Letter */
    .lq-letter { font-size: 12px; font-weight: 700; min-width: 16px; color: var(--ifm-color-emphasis-500); transition: color 0.2s; }
    .lq-option.selected    .lq-letter { color: var(--ifm-color-primary); }
    .lq-option.opt-correct .lq-letter { color: #16a34a; }
    .lq-option.opt-wrong   .lq-letter { color: #dc2626; }

    /* Option text */
    .lq-opttext { font-size: 14px; flex: 1; color: var(--ifm-font-color-base); transition: color 0.2s; }
    .lq-option.opt-correct .lq-opttext { color: #16a34a; }
    .lq-option.opt-wrong   .lq-opttext { color: #dc2626; }

    /* Explication */
    .lq-btn-hint {
      background: transparent;
      border: 1px solid var(--ifm-color-emphasis-300);
      color: var(--ifm-color-emphasis-600);
      border-radius: 6px; padding: 3px 12px;
      cursor: pointer; font-size: 12px; margin-top: 10px;
    }
    .lq-explain {
      margin-top: 8px;
      background: var(--ifm-color-emphasis-100);
      border: 1px solid var(--ifm-color-emphasis-300);
      border-left: 3px solid var(--ifm-color-primary);
      border-radius: 6px;
      padding: 10px 14px;
      font-size: 13px;
      color: var(--ifm-font-color-base);
      line-height: 1.7;
    }
    .lq-explain-label { color: var(--ifm-color-primary); font-weight: 700; }
    .lq-explain-ans   { color: #16a34a; font-weight: 700; }

    /* Submit bottom */
    .lq-btn-submit {
      border: none; border-radius: 8px;
      padding: 11px 36px; font-size: 14px; font-weight: 700;
      transition: all 0.3s; cursor: pointer;
      display: block; margin: 8px auto 16px;
    }

    /* Final score */
    .lq-final {
      text-align: center; padding: 28px 20px;
      background: var(--ifm-color-emphasis-100);
      border-radius: 12px; margin-top: 8px;
      border: 1px solid var(--ifm-color-emphasis-300);
    }
    .lq-final-score { font-size: 44px; font-weight: 800; margin-bottom: 6px; }
    .lq-final-label { font-size: 16px; font-weight: 600; color: var(--ifm-font-color-base); margin-bottom: 4px; }
    .lq-final-msg   { font-size: 13px; color: var(--ifm-color-emphasis-600); margin-bottom: 20px; }
    .lq-btn-reset {
      background: var(--ifm-color-primary);
      border: none; color: #fff;
      border-radius: 8px; padding: 10px 32px;
      cursor: pointer; font-size: 14px; font-weight: 600;
    }
  `;
  document.head.appendChild(style);
}

export default function LDAPQuiz() {
  const [answers, setAnswers] = useState({});
  const [revealed, setRevealed] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const total = questions.length;
  const answered = Object.keys(answers).length;
  const score = Object.entries(answers).filter(
    ([id, ans]) => questions.find((q) => q.id === parseInt(id))?.correct === ans
  ).length;

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
    ? answered + "/" + total + " répondues"
    : score / total >= 0.8
    ? "Excellent !"
    : score / total >= 0.5
    ? "Bien !"
    : "À réviser";

  const handleSelect = (qId, idx) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qId]: idx }));
  };

  const handleReveal = (qId) => {
    setRevealed((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

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

  return (
    <div className="lq-wrap" style={{ "--lq-accent": accentColor }}>

      {/* ── STICKY BAR ── */}
      <div className="lq-sticky">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span className="lq-sticky-title">Quiz OpenLDAP</span>
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
            <button className="lq-btn-outline" onClick={handleReset}>
              Recommencer
            </button>
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

      {/* ── QUESTIONS ── */}
      {questions.map((q, qi) => {
        const userAnswer = answers[q.id];
        const isCorrect = userAnswer === q.correct;
        const isRevealed = revealed[q.id];
        const cardClass = "lq-card" + (submitted ? (isCorrect ? " correct" : " wrong") : "");
        const qnumClass = "lq-qnum" + (submitted ? (isCorrect ? " correct" : " wrong") : "");

        return (
          <div key={q.id} className={cardClass}>
            {/* Question header */}
            <div style={{ display: "flex", gap: 10, marginBottom: 14, alignItems: "flex-start" }}>
              <span className={qnumClass}>Q{qi + 1}</span>
              <span className="lq-qtext">{q.question}</span>
            </div>

            {/* Options */}
            <div style={{ display: "flex", flexDirection: "column", gap: 4, paddingLeft: 4 }}>
              {q.options.map((opt, idx) => {
                const isSelected = userAnswer === idx;
                const isRight = idx === q.correct;

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
                    <div className="lq-radio">
                      <div className="lq-radio-dot" />
                    </div>
                    <span className="lq-letter">{LETTERS[idx]}.</span>
                    <span className="lq-opttext">{opt}</span>
                    {submitted && isRight && (
                      <span style={{ marginLeft: "auto", color: "#16a34a", fontWeight: 700 }}>✓</span>
                    )}
                    {submitted && isSelected && !isRight && (
                      <span style={{ marginLeft: "auto", color: "#dc2626", fontWeight: 700 }}>✗</span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Explication */}
            <div>
              {!submitted && (
                <button className="lq-btn-hint" onClick={() => handleReveal(q.id)}>
                  {isRevealed ? "Masquer" : "Voir l'explication"}
                </button>
              )}
              {isRevealed && (
                <div className="lq-explain">
                  <span className="lq-explain-label">Réponse : </span>
                  <span className="lq-explain-ans">{LETTERS[q.correct]}</span>
                  <br />
                  <span style={{ whiteSpace: "pre-line" }}>{q.explanation}</span>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* ── VALIDER BAS ── */}
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
            ? "Répondre à toutes les questions (" + answered + "/" + total + ")"
            : "Valider le quiz"}
        </button>
      )}

      {/* ── SCORE FINAL ── */}
      {submitted && (
        <div className="lq-final">
          <div className="lq-final-score" style={{ color: accentColor }}>
            {score}/{total}
          </div>
          <div className="lq-final-label">{scoreLabel}</div>
          <div className="lq-final-msg">
            {score / total >= 0.8
              ? "Vous maîtrisez OpenLDAP !"
              : score / total >= 0.5
              ? "Relisez les sections manquées."
              : "Recommencez après révision du cours."}
          </div>
          <button className="lq-btn-reset" onClick={handleReset}>
            Recommencer
          </button>
        </div>
      )}
    </div>
  );
}