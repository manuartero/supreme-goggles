declare namespace HeroGenerator {
  interface KeyCompatibility {
    key: string;
    compatibilities?: Array<{ [hKey: string]: number }>; // no compatibilities means weight 1
    constraints?: Array<string>; // hard restriction
  }
}
