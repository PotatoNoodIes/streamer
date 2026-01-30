export interface F1Location {
  lat: string;
  long: string;
  locality: string;
  country: string;
}

export interface F1Circuit {
  circuitId: string;
  url: string;
  circuitName: string;
  Location: F1Location;
}

export interface F1Race {
  season: string;
  round: string;
  url: string;
  raceName: string;
  Circuit: F1Circuit;
  date: string;
  time: string;
}

export interface F1Season {
  MRData: {
    xmlns: string;
    series: string;
    url: string;
    limit: string;
    offset: string;
    total: string;
    RaceTable: {
      season: string;
      Races: F1Race[];
    };
  };
}
