/**
 * @author Jack Tony
 *
 * @date 2023/6/17
 */
export interface IConfigEntry {
  label: string
  url: string
}

export interface IGlobalConfig {
  gadgets: IConfigEntry[],
  settings: IConfigEntry,
  website: {
    home: IConfigEntry,
    discuss: IConfigEntry,
    github: IConfigEntry
  }
  download: IConfigEntry,
  donate: IConfigEntry
}
