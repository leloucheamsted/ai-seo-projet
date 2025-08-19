import { sequelize } from '../config/db.config';

// Import all models
import { User } from './user.model';
import { KeywordSearch, Keyword } from './keyword.model';
import { UrlAudit, UrlAuditTechnical, UrlAuditContent } from './urlAudit.model';
import { DomainVisibility, RankMonitor, RankAlert } from './rankMonitor.model';
import { ApiUsage } from './apiUsage.model';
import { Alert } from './alert.model';
import { DataForSEOCredentials } from './dataforseoCredentials.model';
import { TaskCost } from './taskCost.model';

// Define associations
const defineAssociations = () => {
    // User associations
    User.hasMany(KeywordSearch, { foreignKey: 'user_id', as: 'keywordSearches' });
    User.hasMany(UrlAudit, { foreignKey: 'user_id', as: 'urlAudits' });
    User.hasMany(RankMonitor, { foreignKey: 'user_id', as: 'rankMonitors' });
    User.hasMany(RankAlert, { foreignKey: 'user_id', as: 'rankAlerts' });
    User.hasMany(ApiUsage, { foreignKey: 'user_id', as: 'apiUsages' });
    User.hasMany(Alert, { foreignKey: 'user_id', as: 'alerts' });
    User.hasOne(DataForSEOCredentials, { foreignKey: 'userId', as: 'dataforseoCredentials' });
    DataForSEOCredentials.belongsTo(User, { foreignKey: 'userId', as: 'user' });

    // KeywordSearch associations
    KeywordSearch.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
    KeywordSearch.hasMany(Keyword, { foreignKey: 'keyword_search_id', as: 'keywords' });

    // Keyword associations
    Keyword.belongsTo(KeywordSearch, { foreignKey: 'keyword_search_id', as: 'keywordSearch' });

    // UrlAudit associations
    UrlAudit.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
    UrlAudit.hasOne(UrlAuditTechnical, { foreignKey: 'url_audit_id', as: 'technicalResults' });
    UrlAudit.hasOne(UrlAuditContent, { foreignKey: 'url_audit_id', as: 'contentResults' });

    // UrlAuditTechnical associations
    UrlAuditTechnical.belongsTo(UrlAudit, { foreignKey: 'url_audit_id', as: 'urlAudit' });

    // UrlAuditContent associations
    UrlAuditContent.belongsTo(UrlAudit, { foreignKey: 'url_audit_id', as: 'urlAudit' });

    // RankMonitor associations
    RankMonitor.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
    RankMonitor.hasMany(RankAlert, { foreignKey: 'rank_monitor_id', as: 'alerts' });

    // RankAlert associations
    RankAlert.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
    RankAlert.belongsTo(RankMonitor, { foreignKey: 'rank_monitor_id', as: 'rankMonitor' });

    // ApiUsage associations
    ApiUsage.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

    // Alert associations
    Alert.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
};

// Initialize associations
defineAssociations();

// Export all models and sequelize instance
export {
    sequelize,
    User,
    KeywordSearch,
    Keyword,
    UrlAudit,
    UrlAuditTechnical,
    UrlAuditContent,
    DomainVisibility,
    RankMonitor,
    RankAlert,
    ApiUsage,
    Alert,
    DataForSEOCredentials,
};

// Export types
export type { UserAttributes, UserCreationAttributes } from './user.model';
export type { KeywordSearchAttributes, KeywordSearchCreationAttributes, KeywordAttributes, KeywordCreationAttributes } from './keyword.model';
export type { UrlAuditAttributes, UrlAuditCreationAttributes, UrlAuditTechnicalAttributes, UrlAuditTechnicalCreationAttributes, UrlAuditContentAttributes, UrlAuditContentCreationAttributes } from './urlAudit.model';
export type { DomainVisibilityAttributes, DomainVisibilityCreationAttributes, RankMonitorAttributes, RankMonitorCreationAttributes, RankAlertAttributes, RankAlertCreationAttributes } from './rankMonitor.model';
export type { ApiUsageAttributes, ApiUsageCreationAttributes } from './apiUsage.model';
export type { AlertAttributes, AlertCreationAttributes } from './alert.model';
