import { RawActivityAssets } from "../network/event_handling/RawStructures.ts";

export class ActivityAssets {
  /** the id for a large asset of the activity, usually a snowflake */
  public largeImage?: string;
  /** text displayed when hovering over the large image of the activity */
  public largeText?: string;
  /** the id for a small asset of the activity, usually a snowflake */
  public smallImage?: string;
  /** text displayed when hovering over the small image of the activity */
  public smallText?: string;

  constructor(structure: RawActivityAssets) {}
}
