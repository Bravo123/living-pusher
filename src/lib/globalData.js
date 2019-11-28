const globalData = {}

export function globalDataSet (key, val) {
  globalData[key] = val
}

export function globalDataGet (key) {
  return globalData[key]
}

export function globalDataDelete (key) {
  key && delete globalData[key]
}