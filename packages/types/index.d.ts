export declare enum UserRole {
    OWNER = "OWNER",
    ASSISTANT = "ASSISTANT"
}
export declare enum DealStage {
    LEAD = "LEAD",
    CONTACTED = "CONTACTED",
    NEGOTIATION = "NEGOTIATION",
    APPROVED = "APPROVED",
    IN_PRODUCTION = "IN_PRODUCTION",
    SCHEDULED = "SCHEDULED",
    POSTED = "POSTED",
    COMPLETED = "COMPLETED",
    LOST = "LOST"
}
export declare enum Platform {
    INSTAGRAM = "INSTAGRAM",
    TIKTOK = "TIKTOK",
    YOUTUBE = "YOUTUBE",
    TWITTER = "TWITTER",
    LINKEDIN = "LINKEDIN",
    OTHER = "OTHER"
}
export declare enum DeliverableType {
    REELS = "REELS",
    STORY = "STORY",
    POST = "POST",
    YOUTUBE_VIDEO = "YOUTUBE_VIDEO",
    YOUTUBE_SHORT = "YOUTUBE_SHORT",
    TIKTOK_VIDEO = "TIKTOK_VIDEO",
    TWEET = "TWEET",
    OTHER = "OTHER"
}
export declare enum DeliverableStatus {
    TODO = "TODO",
    IN_PROGRESS = "IN_PROGRESS",
    DONE = "DONE"
}
export declare enum PaymentStatus {
    PENDING = "PENDING",
    PARTIAL = "PARTIAL",
    PAID = "PAID",
    OVERDUE = "OVERDUE"
}
export declare enum ContractStatus {
    NOT_SENT = "NOT_SENT",
    SENT = "SENT",
    SIGNED = "SIGNED"
}
export declare enum ReminderType {
    PAYMENT_DUE = "PAYMENT_DUE",
    DELIVERABLE_DUE = "DELIVERABLE_DUE",
    PUBLISH_DATE = "PUBLISH_DATE",
    IN_INVOICE_REMINDER = "INVOICE_REMINDER"
}
export declare enum ReminderChannel {
    EMAIL = "EMAIL",
    IN_APP = "IN_APP"
}
export declare enum ReminderStatus {
    PENDING = "PENDING",
    SENT = "SENT",
    CANCELLED = "CANCELLED"
}
export declare enum ActivityType {
    STAGE_CHANGED = "STAGE_CHANGED",
    NOTE_ADDED = "NOTE_ADDED",
    PAYMENT_UPDATED = "PAYMENT_UPDATED",
    FILE_UPLOADED = "FILE_UPLOADED",
    DELIVERABLE_ADDED = "DELIVERABLE_ADDED",
    CONTRACT_SIGNED = "CONTRACT_SIGNED"
}
