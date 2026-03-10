export const formatVariable = (value) => {
  if (value === null) return "null";
  if (value === undefined) return "undefined";

  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
};