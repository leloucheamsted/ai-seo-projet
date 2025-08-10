-- Utilisateurs
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Historique des recherches de mots-clés
CREATE TABLE keyword_searches (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    keyword VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Mots-clés associés et leurs métriques (de Keywords Data API et DataForSEO Labs)
CREATE TABLE keywords (
    id SERIAL PRIMARY KEY,
    keyword_search_id INT REFERENCES keyword_searches(id) ON DELETE CASCADE,
    keyword_text VARCHAR(255) NOT NULL,
    search_volume INT,
    cpc NUMERIC(10, 2),
    keyword_difficulty NUMERIC(5, 2),
    search_intent VARCHAR(50),
    opportunity_score NUMERIC(5, 2),
    serp_snapshot JSONB, -- snapshot SERP JSON (résultats et features)
    created_at TIMESTAMP DEFAULT NOW()
);

-- Audit URL Requests (URL Analyzer)
CREATE TABLE url_audits (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- pending, completed, failed
    requested_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP
);

-- Résultats de l'audit technique (OnPage API)
CREATE TABLE url_audit_technical (
    id SERIAL PRIMARY KEY,
    url_audit_id INT REFERENCES url_audits(id) ON DELETE CASCADE,
    core_web_vitals JSONB,
    technical_errors JSONB,
    score NUMERIC(5, 2),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Résultats analyse contenu (Content Analysis API)
CREATE TABLE url_audit_content (
    id SERIAL PRIMARY KEY,
    url_audit_id INT REFERENCES url_audits(id) ON DELETE CASCADE,
    semantic_score NUMERIC(5, 2),
    missing_entities JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Visibilité globale du domaine (Domain Analytics API)
CREATE TABLE domain_visibility (
    id SERIAL PRIMARY KEY,
    domain VARCHAR(255) NOT NULL,
    traffic_estimate BIGINT,
    visibility_score NUMERIC(5, 2),
    last_updated TIMESTAMP DEFAULT NOW()
);

-- Suivi des positions des mots-clés pour Rank Monitor
CREATE TABLE rank_monitor (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    domain VARCHAR(255) NOT NULL,
    keyword VARCHAR(255) NOT NULL,
    competitor_domain VARCHAR(255),
    current_position INT,
    serp_features JSONB, -- features de la SERP associées
    tracked_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Alertes email sur variations (gain/perte de position)
CREATE TABLE rank_alerts (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    rank_monitor_id INT REFERENCES rank_monitor(id) ON DELETE CASCADE,
    alert_type VARCHAR(50), -- gain, perte, autre
    message TEXT,
    alert_date TIMESTAMP DEFAULT NOW(),
    is_sent BOOLEAN DEFAULT FALSE
);

-- Table pour gérer quotas, rate limits, et relances
CREATE TABLE api_usage (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    api_name VARCHAR(50),
    usage_count INT DEFAULT 0,
    quota_limit INT,
    reset_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE dataforseo_credentials (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    login VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);