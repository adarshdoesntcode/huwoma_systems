import { VEHICLE_ICON_PATHS } from "@/lib/config";

function hashString(value = "") {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
}

export const VEHICLE_ICON_OPTIONS = VEHICLE_ICON_PATHS.map((src) => ({
  key: `vehicle_icon_${hashString(src)}`,
  src,
}));

const keyToSourceMap = new Map(
  VEHICLE_ICON_OPTIONS.map((option) => [option.key, option.src])
);

const sourceToKeyMap = new Map(
  VEHICLE_ICON_OPTIONS.map((option) => [option.src, option.key])
);

export function getVehicleIconKey(value) {
  if (!value) return "";
  if (keyToSourceMap.has(value)) return value;
  return sourceToKeyMap.get(value) ?? value;
}

export function resolveVehicleIcon(value) {
  if (!value) return "";
  return keyToSourceMap.get(value) ?? value;
}
