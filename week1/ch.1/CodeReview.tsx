// enum
enum Status {
  READY,
  DONE,
}

// interface
interface User {
  name: string;
  status: Status;
}

// type
type Item = string | number;

// unknown
let input: unknown = "yoona";

if (typeof input === "string") {
  console.log(input.toUpperCase());
}

// void
function log(msg: string): void {
  console.log(msg);
}

// never
function error(): never {
  throw new Error("error");
}


const user: User = {
  name: "yoona",
  status: Status.READY,
};

log(user.name);