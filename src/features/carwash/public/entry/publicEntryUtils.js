export const normalizeContact = (value) =>
  String(value || "")
    .replace(/\D/g, "")
    .slice(0, 10);

export const normalizeVehicleNumber = (value) =>
  String(value || "")
    .toUpperCase()
    .replace(/\s+/g, " ")
    .trim();

export const capitalizeName = (value) =>
  String(value || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map(
      (part) => `${part.charAt(0).toUpperCase()}${part.slice(1).toLowerCase()}`,
    )
    .join(" ");

export const normalizeVehicleName = (value) => {
  const trimmedValue = String(value || "").trim();
  if (!trimmedValue) return "";
  return `${trimmedValue.charAt(0).toUpperCase()}${trimmedValue.slice(1)}`;
};

export const createLocalVehicleKey = () =>
  `local-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
