const INTERNAL_KEYS = new Set([
  "__builtins__",
  "__name__",
  "__main__",
  "__doc__",
  "__package__",
  "__loader__",
  "__spec__",
  "__annotations__",
  "__cached__",
  "__file__",
  "math",
  "random",
  "threading",
  "time",
  "abc",
]);

export const filterVariables = (variables = {}) => {
  return Object.fromEntries(
    Object.entries(variables).filter(([key, value]) => {
      if (INTERNAL_KEYS.has(key)) return false;
      if (typeof value === 'object' && value?.type === 'module') return false;
      return true;
    })
  );
};