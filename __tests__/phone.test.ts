import {
  isPlausiblePhone,
  normalisePhone,
  PHONE_ERROR_MESSAGE,
} from "@/lib/phone";

describe("isPlausiblePhone", () => {
  it.each([
    "9313026530",
    "+91 93130 26530",
    "+91-93130-26530",
    "091 3102 6530",
    "(913) 026-5300",
    "+1 415 555 0132",
    "  +919313026530  ",
  ])("accepts %p", (input) => {
    expect(isPlausiblePhone(input)).toBe(true);
  });

  it.each([
    "12345", // too short — the e2e's malformed sample
    "123456789", // 9 digits
    "1234567890123456", // 16 digits
    "93130 26530 ext 4", // letters
    "+91 93130 26530+", // stray plus
    "call me", // not a number
    "", // empty is the form's decision, not this function's
  ])("rejects %p", (input) => {
    expect(isPlausiblePhone(input)).toBe(false);
  });
});

describe("normalisePhone", () => {
  it("keeps a leading + and strips everything but digits", () => {
    expect(normalisePhone("+91 93130-26530")).toBe("+919313026530");
    expect(normalisePhone("(913) 026 5300")).toBe("9130265300");
    expect(normalisePhone("  9313026530 ")).toBe("9313026530");
  });
});

describe("PHONE_ERROR_MESSAGE", () => {
  it("says what is accepted, and is what the e2e asserts on", () => {
    expect(PHONE_ERROR_MESSAGE).toMatch(/valid phone number/);
    expect(PHONE_ERROR_MESSAGE).toMatch(/\+91/);
  });
});
