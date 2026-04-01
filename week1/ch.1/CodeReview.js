"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// enum
var Status;
(function (Status) {
    Status[Status["READY"] = 0] = "READY";
    Status[Status["DONE"] = 1] = "DONE";
})(Status || (Status = {}));
// unknown
let input = "yoona";
if (typeof input === "string") {
    console.log(input.toUpperCase());
}
// void
function log(msg) {
    console.log(msg);
}
// never
function error() {
    throw new Error("error");
}
const user = {
    name: "yoona",
    status: Status.READY,
};
log(user.name);
//# sourceMappingURL=CodeReview.js.map