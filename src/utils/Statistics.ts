type StatisticProp = {
  value: number;
  description: string;
};

export class Statistics {
  constructor(private statistics: Record<string, StatisticProp>) {}
}
