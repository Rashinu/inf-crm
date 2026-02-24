"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityType = exports.ReminderStatus = exports.ReminderChannel = exports.ReminderType = exports.ContractStatus = exports.PaymentStatus = exports.DeliverableStatus = exports.DeliverableType = exports.Platform = exports.DealStage = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["OWNER"] = "OWNER";
    UserRole["ASSISTANT"] = "ASSISTANT";
})(UserRole || (exports.UserRole = UserRole = {}));
var DealStage;
(function (DealStage) {
    DealStage["LEAD"] = "LEAD";
    DealStage["CONTACTED"] = "CONTACTED";
    DealStage["NEGOTIATION"] = "NEGOTIATION";
    DealStage["APPROVED"] = "APPROVED";
    DealStage["IN_PRODUCTION"] = "IN_PRODUCTION";
    DealStage["SCHEDULED"] = "SCHEDULED";
    DealStage["POSTED"] = "POSTED";
    DealStage["COMPLETED"] = "COMPLETED";
    DealStage["LOST"] = "LOST";
})(DealStage || (exports.DealStage = DealStage = {}));
var Platform;
(function (Platform) {
    Platform["INSTAGRAM"] = "INSTAGRAM";
    Platform["TIKTOK"] = "TIKTOK";
    Platform["YOUTUBE"] = "YOUTUBE";
    Platform["TWITTER"] = "TWITTER";
    Platform["LINKEDIN"] = "LINKEDIN";
    Platform["OTHER"] = "OTHER";
})(Platform || (exports.Platform = Platform = {}));
var DeliverableType;
(function (DeliverableType) {
    DeliverableType["REELS"] = "REELS";
    DeliverableType["STORY"] = "STORY";
    DeliverableType["POST"] = "POST";
    DeliverableType["YOUTUBE_VIDEO"] = "YOUTUBE_VIDEO";
    DeliverableType["YOUTUBE_SHORT"] = "YOUTUBE_SHORT";
    DeliverableType["TIKTOK_VIDEO"] = "TIKTOK_VIDEO";
    DeliverableType["TWEET"] = "TWEET";
    DeliverableType["OTHER"] = "OTHER";
})(DeliverableType || (exports.DeliverableType = DeliverableType = {}));
var DeliverableStatus;
(function (DeliverableStatus) {
    DeliverableStatus["TODO"] = "TODO";
    DeliverableStatus["IN_PROGRESS"] = "IN_PROGRESS";
    DeliverableStatus["DONE"] = "DONE";
})(DeliverableStatus || (exports.DeliverableStatus = DeliverableStatus = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "PENDING";
    PaymentStatus["PARTIAL"] = "PARTIAL";
    PaymentStatus["PAID"] = "PAID";
    PaymentStatus["OVERDUE"] = "OVERDUE";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
var ContractStatus;
(function (ContractStatus) {
    ContractStatus["NOT_SENT"] = "NOT_SENT";
    ContractStatus["SENT"] = "SENT";
    ContractStatus["SIGNED"] = "SIGNED";
})(ContractStatus || (exports.ContractStatus = ContractStatus = {}));
var ReminderType;
(function (ReminderType) {
    ReminderType["PAYMENT_DUE"] = "PAYMENT_DUE";
    ReminderType["DELIVERABLE_DUE"] = "DELIVERABLE_DUE";
    ReminderType["PUBLISH_DATE"] = "PUBLISH_DATE";
    ReminderType["IN_INVOICE_REMINDER"] = "INVOICE_REMINDER";
})(ReminderType || (exports.ReminderType = ReminderType = {}));
var ReminderChannel;
(function (ReminderChannel) {
    ReminderChannel["EMAIL"] = "EMAIL";
    ReminderChannel["IN_APP"] = "IN_APP";
})(ReminderChannel || (exports.ReminderChannel = ReminderChannel = {}));
var ReminderStatus;
(function (ReminderStatus) {
    ReminderStatus["PENDING"] = "PENDING";
    ReminderStatus["SENT"] = "SENT";
    ReminderStatus["CANCELLED"] = "CANCELLED";
})(ReminderStatus || (exports.ReminderStatus = ReminderStatus = {}));
var ActivityType;
(function (ActivityType) {
    ActivityType["STAGE_CHANGED"] = "STAGE_CHANGED";
    ActivityType["NOTE_ADDED"] = "NOTE_ADDED";
    ActivityType["PAYMENT_UPDATED"] = "PAYMENT_UPDATED";
    ActivityType["FILE_UPLOADED"] = "FILE_UPLOADED";
    ActivityType["DELIVERABLE_ADDED"] = "DELIVERABLE_ADDED";
    ActivityType["CONTRACT_SIGNED"] = "CONTRACT_SIGNED";
})(ActivityType || (exports.ActivityType = ActivityType = {}));
//# sourceMappingURL=index.js.map